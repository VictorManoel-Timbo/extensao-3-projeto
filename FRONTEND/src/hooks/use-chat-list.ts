import { useEffect, useState } from "react";
import type { Chat } from "@/models/chat.model";
import { chatService } from "@/services/chat.service";

export const useChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    chatService
      .listar()
      .then((data) => setChats(data))
      .catch(() => setError("Erro ao carregar conversas."))
      .finally(() => setLoading(false));
  }, []);

  const handleNewChat = () => setActiveId(null);

  const handleSelect = (id: string) => {
    setError(null);
    setActiveId(id);
  };

  const addChat = (chat: Chat) => setChats((prev) => [chat, ...prev]);

  const removeChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeId === chatId) setActiveId(null);
  };

  return {
    chats,
    activeId,
    setActiveId,
    loading,
    error,
    setError,
    handleNewChat,
    handleSelect,
    addChat,
    removeChat,
  };
};
