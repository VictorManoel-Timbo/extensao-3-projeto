import api from "@/config/api"

const baseUrl: string = "/exemplo"

export const exemploRest = {

    getExemplo: (): Promise<void | any> => {
        return api.get(baseUrl)
    },

    postExemplo: (body: any): Promise<void | any> => {
        return api.post(baseUrl, body)
    },

    putExemplo: (body: any, id: string): Promise<void | any> => {
        return api.put(`${baseUrl}/${id}`, body)
    },

    patchExemplo: (body: any, id: string): Promise<void | any> => {
        return api.patch(`${baseUrl}/${id}`, body)
    },

    deleteExemplo: (id: string): Promise<void | any> => {
        return api.delete(`${baseUrl}/${id}`)
    }
}