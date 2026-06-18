import type { Verdict } from "@/models/message.model";

type VerdictMeta = {
  label: string;
  /** Classes Tailwind para o badge (texto, fundo, borda). */
  className: string;
};

/** Metadados de exibição de cada nível de veredito. */
export const VERDICT_META: Record<Verdict, VerdictMeta> = {
  SAFE: {
    label: "Seguro",
    className: "bg-green-100 text-green-800 border-green-300",
  },
  LOW_CONCERN: {
    label: "Atenção leve",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  MODERATE_RISK: {
    label: "Risco moderado",
    className: "bg-orange-100 text-orange-800 border-orange-300",
  },
  HIGH_RISK: {
    label: "Alto risco",
    className: "bg-red-100 text-red-800 border-red-300",
  },
  INSUFFICIENT_DATA: {
    label: "Dados insuficientes",
    className: "bg-slate-100 text-slate-700 border-slate-300",
  },
};
