import { exemploRest } from "./rest/algo.rest"

export const exemploService = {
  listar: async () => {
    return await exemploRest.getExemplo()
  },

  criar: async (nome: string) => {
    return await exemploRest.postExemplo({ titulo: nome })
  }
}