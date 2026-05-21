import api from "@/config/api"
import type { Chat, PaginatedResponse } from "@/models/chat.model"

const baseUrl: string = "/chats"

export const chatRest = {

    getChats: (): Promise<PaginatedResponse<Chat>> => {
        return api.get(`${baseUrl}/`)
    },

    deleteChat: (id: string): Promise<void> => {
        return api.delete(`${baseUrl}/${id}/`)
    }
}
