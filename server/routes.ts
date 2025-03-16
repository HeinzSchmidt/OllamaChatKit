import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.post("/api/settings", async (req, res) => {
    const result = insertSettingsSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid settings" });
      return;
    }
    const settings = await storage.updateSettings(result.data);
    res.json(settings);
  });

  app.get("/api/messages", async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const settings = await storage.getSettings();
        
        // Store user message
        const userMessage = await storage.addMessage({
          role: "user",
          content: message.content,
          timestamp: new Date().toISOString()
        });

        // Broadcast to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(userMessage));
          }
        });

        // Call Ollama API
        try {
          const response = await fetch(`${settings.ollamaUrl}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: settings.model,
              prompt: message.content
            })
          });

          if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
          }

          const data = await response.json();
          
          // Store assistant message
          const assistantMessage = await storage.addMessage({
            role: "assistant",
            content: data.response,
            timestamp: new Date().toISOString()
          });

          // Broadcast assistant response
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(assistantMessage));
            }
          });

        } catch (error) {
          const errorMessage = await storage.addMessage({
            role: "error",
            content: `Failed to get response from Ollama: ${error.message}`,
            timestamp: new Date().toISOString()
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(errorMessage));
            }
          });
        }

      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
  });

  return httpServer;
}
