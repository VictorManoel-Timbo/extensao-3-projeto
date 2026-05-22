import { chatService } from "@/services/chat.service";
import { useChatList } from "./use-chat-list";
import { useMessages } from "./use-messages";

export type { Message } from "./use-messages";

export const useChat = () => {
  const chatList = useChatList();
  const { messages, isChatPending, handleSend, clearMessages, loading: msgLoading, error: msgError } =
    useMessages(chatList.activeId, chatList.setActiveId, chatList.addChat);

  const loading = chatList.loading || msgLoading;
  const error = chatList.error || msgError;

  const handleDelete = (chatId: string) => {
    chatService
      .deletar(chatId)
      .then(() => {
        chatList.removeChat(chatId);
        clearMessages(chatId);
      })
      .catch(() => chatList.setError("Erro ao deletar conversa."));
  };

  return {
    chats: chatList.chats,
    activeId: chatList.activeId,
    messages,
    loading,
    error,
    isChatPending,
    handleNewChat: chatList.handleNewChat,
    handleSelect: chatList.handleSelect,
    handleDelete,
    handleSend,
  };
};
