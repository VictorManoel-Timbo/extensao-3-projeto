/**
 * Eventos globais de UI desacoplados (window CustomEvent).
 *
 * Usados para comunicar entre componentes que não compartilham árvore de props
 * (ex.: o modal de perfil vive na Navbar, a lista de chats vive na página).
 */

/**
 * Disparado após a anamnese ser atualizada com sucesso.
 *
 * RN004: atualizar a anamnese invalida os chats antigos no backend; a lista de
 * conversas escuta este evento para recarregar e refletir a invalidação.
 */
export const ANAMNESE_UPDATED_EVENT = "foodguard:anamnese-updated";
