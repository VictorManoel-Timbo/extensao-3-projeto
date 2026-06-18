import { AxiosError } from "axios";
import type { AnamneseRequest, BodyFeeling, EatingStyle } from "@/models/anamnese.model";

/** Mapeamento sentimento (form) → enum do backend. */
export const FEELING_MAP: Record<string, BodyFeeling> = {
    "muito-satisfeito": "very_satisfied",
    satisfeito: "satisfied",
    indiferente: "indifferent",
    insatisfeito: "dissatisfied",
    "muito-insatisfeito": "very_dissatisfied",
};

/** Mapeamento inverso: enum do backend → chave do form. */
export const FEELING_TO_FORM: Record<BodyFeeling, string> = {
    very_satisfied: "muito-satisfeito",
    satisfied: "satisfeito",
    indifferent: "indiferente",
    dissatisfied: "insatisfeito",
    very_dissatisfied: "muito-insatisfeito",
};

/** Senha: mínimo 8 caracteres, com maiúscula, minúscula e número. */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const inputClass =
    "h-12 w-full rounded-md border border-zinc-500 bg-slate-50 px-4 pr-10 placeholder:text-gray-700 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30";

export const textareaClass =
    "w-full resize-none rounded-md border border-zinc-500 bg-slate-50 px-3 py-2 text-black focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30";

/** Extrai a primeira mensagem de erro de uma resposta DRF (AxiosError). */
export const extractError = (
    err: unknown,
    fallback = "Não foi possível concluir a operação. Tente novamente.",
): string => {
    if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as Record<string, unknown>;
        if (typeof data.detail === "string") return data.detail;
        const first = Object.values(data)[0];
        if (Array.isArray(first)) return String(first[0]);
        if (typeof first === "string") return first;
    }
    return fallback;
};

type AnamneseFormValues = {
    consulta: string;
    objetivo: string;
    resultado: string;
    doencas: string;
    medicamentos: string;
    alergia: string;
    intolerancia: string;
    pref: string;
    naoGosta: string;
    sentimento: string;
    veg: EatingStyle;
    alcool: string;
    fumo: string;
};

/** Constrói o payload AnamneseRequest a partir dos valores do formulário. */
export const buildAnamnesePayload = (v: AnamneseFormValues): AnamneseRequest => {
    const isPrevious = v.consulta === "sim";
    return {
        previous_consultation: isPrevious,
        previous_consultation_objective: isPrevious ? v.objetivo.trim() : null,
        previous_consultation_result: isPrevious ? v.resultado.trim() || null : null,
        disease_history: v.doencas.trim() || null,
        medications: v.medicamentos.trim() || null,
        food_allergies: v.alergia.trim() || null,
        food_intolerances: v.intolerancia.trim() || null,
        favorite_foods: v.pref.trim(),
        food_aversions: v.naoGosta.trim() || null,
        body_feeling: FEELING_MAP[v.sentimento] ?? null,
        eating_style: v.veg,
        alcohol_intake: v.alcool === "sim",
        smoking: v.fumo === "sim",
    };
};
