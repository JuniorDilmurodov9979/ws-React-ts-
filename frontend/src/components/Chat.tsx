"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBar from "./StatusBar";
import TypingIndicator from "./TypingIndicator";
import Message from "./Message";

type MessageType = {
  user: string;
  text: string;
  self: boolean;
};

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [status, setStatus] = useState("Connecting...");
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [username] = useState("Junior");

  const [isTyping, setIsTyping] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("Connected!");
    };

    ws.onclose = () => {
      setStatus("Disconnected");
    };

    ws.onerror = () => {
      setStatus("Error");
    };

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          { user: data.user, text: data.text, self: data.user === username },
        ]);
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.user);
          return newSet;
        });
      }

      if (data.type === "typing" && data.user !== username) {
        setTypingUsers((prev) => new Set(prev).add(data.user));
      }

      if (data.type === "stopTyping" && data.user !== username) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.user);
          return newSet;
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [username]);

  const sendMessage = () => {
    const msg = inputRef.current?.value.trim();
    if (!msg || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
      return;

    setMessages((prev) => [...prev, { user: username, text: msg, self: true }]);

    wsRef.current.send(
      JSON.stringify({ type: "message", user: username, text: msg })
    );

    if (inputRef.current) inputRef.current.value = "";
    stopTyping(true);
  };

  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      wsRef.current?.send(JSON.stringify({ type: "typing", user: username }));
    }
  };

  const stopTyping = (sendSignal = false) => {
    if (isTyping) {
      setIsTyping(false);
      if (sendSignal) {
        wsRef.current?.send(
          JSON.stringify({ type: "stopTyping", user: username })
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 flex flex-col">
        <h1 className="text-xl font-bold text-center mb-2">WebSocket Chat</h1>
        <StatusBar status={status} />
        <div className="flex-1 overflow-y-auto space-y-2 mb-2">
          {messages.map((m, i) => (
            <Message key={i} {...m} />
          ))}
        </div>
        <TypingIndicator typingUsers={typingUsers} />
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            onFocus={startTyping}
            onChange={startTyping}
            onBlur={() => stopTyping(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button className="cursor-pointer" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
