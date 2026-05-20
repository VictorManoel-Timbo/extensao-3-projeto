import api from "@/config/api";
import type {
  Message,
  MessageCreateRequest,
  MessageCreateResponse,
} from "@/models/message.model";
import type { PaginatedResponse } from "@/models/chat.model";

const BASE_URL = "/chats/";

export async function sendMessage(
  data: MessageCreateRequest,
): Promise<MessageCreateResponse> {
  return api.post<MessageCreateResponse>(`${BASE_URL}message/send/`, data);
}

export async function listMessages(chatId: string): Promise<Message[]> {
  const response = await api.get<PaginatedResponse<Message>>(
    `${BASE_URL}${chatId}/messages/`,
  );
  return response.results;
}
