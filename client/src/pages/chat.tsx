import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "@shared/schema";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import SettingsDialog from "@/components/chat/settings-dialog";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"]
  });

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    ws.onerror = () => {
      setMessages((prev) => [...prev, {
        role: "error",
        content: "WebSocket connection error",
        timestamp: new Date().toISOString()
      }]);
    };

    setSocket(ws);
    return () => ws.close();
  }, []);

  const handleSendMessage = (content: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ content }));
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-2xl font-bold">Ollama Chat</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </main>

      <footer className="border-t p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </footer>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
      />
    </div>
  );
}
