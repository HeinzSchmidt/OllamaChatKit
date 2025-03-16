import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-4 py-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex gap-3 max-w-[80%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background">
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : message.role === "assistant" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "error"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
