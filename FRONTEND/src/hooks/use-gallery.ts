import { useCallback, useEffect, useMemo, useState } from "react";
import type { Chat } from "@/models/chat.model";
import { chatService } from "@/services/chat.service";
import { matchesSeverityFilter, type SeverityFilter } from "@/lib/verdict";

/**
 * Estado da galeria de chats: carrega a lista, mantém o filtro de severidade
 * selecionado, expõe a lista já filtrada e a exclusão de conversas.
 */
export const useGallery = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SeverityFilter>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadChats = useCallback(() => {
    setLoading(true);
    chatService
      .listar()
      .then((data) => setChats(data))
      .catch(() => setError("Erro ao carregar conversas."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Carregamento inicial da galeria (data fetching no mount).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadChats();
  }, [loadChats]);

  const filteredChats = useMemo(
    () => chats.filter((c) => matchesSeverityFilter(c.severity, filter)),
    [chats, filter],
  );

  const handleDelete = (chatId: string) => {
    setDeletingId(chatId);
    chatService
      .deletar(chatId)
      .then(() => setChats((prev) => prev.filter((c) => c.id !== chatId)))
      .catch(() => setError("Erro ao deletar conversa."))
      .finally(() => setDeletingId(null));
  };

  return {
    chats,
    filteredChats,
    loading,
    error,
    filter,
    setFilter,
    deletingId,
    handleDelete,
  };
};
