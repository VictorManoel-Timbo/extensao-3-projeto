import api from "@/config/api";
import type { Chat, PaginatedResponse } from "@/models/chat.model";

const BASE_URL = "/chats/";

export async function listChats(): Promise<Chat[]> {
  const response = await api.get<PaginatedResponse<Chat>>(BASE_URL);
  return response.results;
}

export async function deleteChat(chatId: string): Promise<void> {
  return api.delete<void>(`${BASE_URL}${chatId}/`);
}
