import { type MessageRole } from "@/enums/MessageRole";
import type { IOpenFoodProduct } from "@/models/open-food.model";

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
  food_data?: IOpenFoodProduct;
}

export interface MessageCreateResponse {
  chat_id: string;
  response: string;
}
