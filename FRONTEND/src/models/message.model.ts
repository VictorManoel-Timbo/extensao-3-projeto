export type MessageRole = "U" | "A";

export interface Message {
  chat_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface MessageCreateRequest {
  role: MessageRole;
  content: string;
  chat_id?: string;
}

export interface MessageCreateResponse {
  chat_id: string;
  response: string;
}
