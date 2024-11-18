import { useRef, useState, useEffect } from "react";
import { Card, Input, Button } from "@nextui-org/react";
import { Send, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ChatMessage } from "@/types/api";
import { cn } from "@/utils/cn";
import { useChat } from "@/hooks/useChat";
import { useNavigate } from "react-router-dom";
import { prettyDate } from "@/utils/dates";

const Message = ({
  message,
  isLast,
  renderedMessages,
}: {
  message: ChatMessage;
  isLast: boolean;
  renderedMessages: React.MutableRefObject<Set<string>>;
}) => {
  const isResponse = message.response === 1;
  const isNew = !renderedMessages.current.has(message.name);

  useEffect(() => {
    renderedMessages.current.add(message.name);
  }, [message.name, renderedMessages]);

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, y: 20 } : false}
      animate={isNew ? { opacity: 1, y: 0 } : false}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "flex flex-col max-w-[70%] mb-3",
        isResponse ? "self-start" : "self-end"
      )}
    >
      <div
        className={cn(
          "px-4 py-2.5 rounded-2xl shadow-sm",
          isResponse
            ? "bg-secondary text-white rounded-bl-none"
            : "bg-primary text-white rounded-br-none",
          "border border-content2/10"
        )}
      >
        {message.message}
      </div>
      <span
        className={cn(
          "text-[11px] mt-1 text-foreground/50",
          isResponse ? "ml-2" : "mr-2 self-end"
        )}
      >
        {prettyDate(message.creation, true)}
      </span>
    </motion.div>
  );
};

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, send } = useChat();
  const navigate = useNavigate();
  const renderedMessages = useRef(new Set<string>());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isLoading) return;
    try {
      await send(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.creation).getTime() - new Date(b.creation).getTime()
  );

  useEffect(() => {
    return () => {
      renderedMessages.current.clear();
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="flex items-center gap-3 px-4 h-14 border-b border-divider bg-background/40 backdrop-blur-xl shadow-sm">
        <Button
          isIconOnly
          variant="light"
          onClick={() => navigate(-1)}
          className="text-foreground/80"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Coach Support
          </h1>
          <p className="text-xs text-foreground/60">
            I will try to reply within 4 hours.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <motion.div layout className="flex flex-col">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center text-foreground/60">
                <p className="text-sm mb-2">No messages yet</p>
                <p className="text-xs">Send a message to get started</p>
              </div>
            )}
            {sortedMessages.map((message, idx) => (
              <Message
                key={message.name}
                message={message}
                isLast={idx === sortedMessages.length - 1}
                renderedMessages={renderedMessages}
              />
            ))}
            <div ref={chatEndRef} />
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-xl bg-background/40 border-t border-divider shadow-lg" />
        <div className="relative z-10 p-4">
          <div className="max-w-2xl mx-auto flex gap-3 items-center">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              disabled={isLoading}
              variant="bordered"
              color="primary"
              classNames={{
                base: "h-12",
                input: [
                  "bg-transparent",
                  "text-sm",
                  "placeholder:text-foreground-500",
                ],
                inputWrapper: [
                  "h-full",
                  "bg-content2/40",
                  "hover:bg-content2/40",
                  "group-data-[focused=true]:bg-content2/40",
                  "!cursor-text",
                  "shadow-sm",
                  "backdrop-blur-sm",
                  "border-divider/50",
                  "hover:border-divider",
                  "group-data-[focused=true]:border-primary",
                  "rounded-xl",
                ],
              }}
              fullWidth
            />
            <Button
              isIconOnly
              color="primary"
              onClick={handleSend}
              isLoading={isLoading}
              className={cn(
                "h-12 w-12",
                "shadow-sm",
                "rounded-xl",
                "bg-primary/90",
                "hover:bg-primary",
                "transition-transform",
                "hover:scale-105",
                "active:scale-95"
              )}
            >
              <Send size={18} className="text-primary-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
