import { settings, messages, type Settings, type InsertSettings, type Message } from "@shared/schema";

export interface IStorage {
  getSettings(): Promise<Settings>;
  updateSettings(settings: InsertSettings): Promise<Settings>;
  getMessages(): Promise<Message[]>;
  addMessage(message: Omit<Message, "id">): Promise<Message>;
}

export class MemStorage implements IStorage {
  private settings: Settings;
  private messages: Message[];
  private messageId: number;

  constructor() {
    this.settings = {
      id: 1,
      ollamaUrl: "http://localhost:11434",
      model: "llama2"
    };
    this.messages = [];
    this.messageId = 1;
  }

  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(newSettings: InsertSettings): Promise<Settings> {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async addMessage(message: Omit<Message, "id">): Promise<Message> {
    const newMessage = { ...message, id: this.messageId++ };
    this.messages.push(newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
