import { useEffect, useState } from "react";
import type { Chat } from "@/models/chat.model";
import type { Message as BackendMessage } from "@/models/message.model";
import type { IOpenFoodProduct } from "@/models/open-food.model";
import { listChats, deleteChat } from "@/services/chat.service";
import { listMessages, sendMessage } from "@/services/message.service";

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  image?: File;
  imageUrl?: string;
  pending?: boolean;
}

function mapRole(role: string): "user" | "assistant" {
  return role === "U" ? "user" : "assistant";
}

function mapBackendMessages(messages: BackendMessage[]): Message[] {
  return messages.map((m, i) => ({
    id: `${m.created_at}-${i}`,
    role: mapRole(m.role),
    text: m.content,
  }));
}

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messagesByChat, setMessagesByChat] = useState<
    Record<string, Message[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messages = activeId ? (messagesByChat[activeId] ?? []) : [];
  const isChatPending = messages.some((m) => m.pending);

  // Fetch chats on mount
  useEffect(() => {
    setLoading(true);
    listChats()
      .then((data) => setChats(data))
      .catch(() => setError("Erro ao carregar conversas."))
      .finally(() => setLoading(false));
  }, []);

  // Fetch messages when activeId changes
  useEffect(() => {
    if (!activeId) return;
    // Skip if messages are already loaded for this chat
    if (messagesByChat[activeId]) return;

    setLoading(true);
    listMessages(activeId)
      .then((data) => {
        setMessagesByChat((prev) => ({
          ...prev,
          [activeId]: mapBackendMessages(data),
        }));
      })
      .catch(() => setError("Erro ao carregar mensagens."))
      .finally(() => setLoading(false));
  }, [activeId, messagesByChat]);

  const handleNewChat = () => setActiveId(null);

  const handleSelect = (id: string) => {
    setError(null);
    setActiveId(id);
  };

  const handleDelete = (chatId: string) => {
    deleteChat(chatId)
      .then(() => {
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        setMessagesByChat((prev) => {
          const copy = { ...prev };
          delete copy[chatId];
          return copy;
        });
        if (activeId === chatId) setActiveId(null);
      })
      .catch(() => setError("Erro ao deletar conversa."));
  };

  const handleSend = (
    text: string,
    image?: File,
    product?: IOpenFoodProduct,
  ) => {
    const productName = product?.product.product_name;

    let finalMessage = text;
    if (productName) {
      if (!text.trim()) {
        finalMessage = `Acabei de escanear o produto: ${productName}. O que você pode me dizer sobre ele?`;
      } else {
        finalMessage = `${text}\n\n[Produto escaneado: ${productName}]`;
      }
    }

    // Optimistic user message
    const userMsg: Message = {
      id: `u${Date.now()}`,
      role: "user",
      text: finalMessage,
      image,
      imageUrl: image ? URL.createObjectURL(image) : undefined,
    };

    const pendingMsg: Message = {
      id: `p${Date.now()}`,
      role: "assistant",
      text: "",
      pending: true,
    };

    const currentChatId = activeId;

    setMessagesByChat((prev) => ({
      ...prev,
      [currentChatId ?? "__new__"]: [
        ...(prev[currentChatId ?? "__new__"] ?? []),
        userMsg,
        pendingMsg,
      ],
    }));

    if (!currentChatId) {
      setActiveId("__new__");
    }

    sendMessage({
      role: "U",
      content: finalMessage,
      chat_id: currentChatId ?? undefined,
    })
      .then((res) => {
        const resolvedChatId = res.chat_id;

        // If it was a new chat, update state with real chat id
        if (!currentChatId) {
          const title = (finalMessage || productName || "Nova conversa").slice(
            0,
            28,
          );
          setChats((prev) => [
            {
              id: resolvedChatId,
              title,
              created_at: new Date().toISOString(),
              is_active: true,
              messages: "",
            },
            ...prev,
          ]);
          setActiveId(resolvedChatId);

          setMessagesByChat((prev) => {
            const tempMessages = prev["__new__"] ?? [];
            const { __new__, ...rest } = prev;
            return {
              ...rest,
              [resolvedChatId]: tempMessages.map((m) =>
                m.id === pendingMsg.id
                  ? { ...m, text: res.response, pending: false }
                  : m,
              ),
            };
          });
        } else {
          setMessagesByChat((prev) => ({
            ...prev,
            [resolvedChatId]: (prev[resolvedChatId] ?? []).map((m) =>
              m.id === pendingMsg.id
                ? { ...m, text: res.response, pending: false }
                : m,
            ),
          }));
        }
      })
      .catch(() => {
        const chatKey = currentChatId ?? "__new__";
        setMessagesByChat((prev) => ({
          ...prev,
          [chatKey]: (prev[chatKey] ?? []).map((m) =>
            m.id === pendingMsg.id
              ? {
                  ...m,
                  text: "Erro ao processar sua mensagem. Tente novamente.",
                  pending: false,
                }
              : m,
          ),
        }));
      });
  };

  return {
    chats,
    activeId,
    messages,
    loading,
    error,
    isChatPending,
    handleNewChat,
    handleSelect,
    handleDelete,
    handleSend,
  };
};
