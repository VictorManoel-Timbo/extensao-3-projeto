import { useState } from "react";
import { HelpCircle } from "lucide-react";
import type { AnamneseRequest, BodyFeeling, EatingStyle } from "@/models/anamnese.model";

const Radio = ({
    name,
    value,
    checked,
    onChange,
    label,
}: {
    name: string;
    value: string;
    checked: boolean;
    onChange: (v: string) => void;
    label: string;
}) => (
    <label className="flex cursor-pointer items-center gap-2 text-black">
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={() => onChange(value)}
            className="peer sr-only"
        />
        <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${checked ? "border-foodguard-700" : "border-zinc-500"
                }`}
        >
            {checked && <span className="h-2.5 w-2.5 rounded-full bg-foodguard-500" />}
        </span>
        <span className="text-sm">{label}</span>
    </label>
);

const FEELING_MAP: Record<string, BodyFeeling> = {
    "muito-satisfeito": "very_satisfied",
    satisfeito: "satisfied",
    indiferente: "indifferent",
    insatisfeito: "dissatisfied",
    "muito-insatisfeito": "very_dissatisfied",
};

const textareaClass =
    "w-full resize-none rounded-md border border-zinc-500 bg-slate-50 px-3 py-2 text-black focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30";

interface Props {
    onSubmit: (data: AnamneseRequest) => Promise<void>;
    onBack?: () => void;
    submitting?: boolean;
    error?: string | null;
}

const AnamneseStep = ({ onSubmit, onBack, submitting = false, error }: Props) => {
    const [consulta, setConsulta] = useState("nao");
    const [objetivo, setObjetivo] = useState("");
    const [resultado, setResultado] = useState("");
    const [intolerancia, setIntolerancia] = useState("");
    const [doencas, setDoencas] = useState("");
    const [medicamentos, setMedicamentos] = useState("");
    const [alergia, setAlergia] = useState("");
    const [pref, setPref] = useState("");
    const [naoGosta, setNaoGosta] = useState("");
    const [sentimento, setSentimento] = useState("indiferente");
    const [veg, setVeg] = useState<EatingStyle>("not");
    const [alcool, setAlcool] = useState("nao");
    const [fumo, setFumo] = useState("nao");
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError(null);

        const isPrevious = consulta === "sim";
        if (isPrevious && !objetivo.trim()) {
            setLocalError("Informe o objetivo da consulta prévia com nutricionista.");
            return;
        }
        if (!pref.trim()) {
            setLocalError("Informe ao menos um alimento de preferência.");
            return;
        }

        const payload: AnamneseRequest = {
            previous_consultation: isPrevious,
            previous_consultation_objective: isPrevious ? objetivo.trim() : null,
            previous_consultation_result: isPrevious ? resultado.trim() || null : null,
            disease_history: doencas.trim() || null,
            medications: medicamentos.trim() || null,
            food_allergies: alergia.trim() || null,
            food_intolerances: intolerancia.trim() || null,
            favorite_foods: pref.trim(),
            food_aversions: naoGosta.trim() || null,
            body_feeling: FEELING_MAP[sentimento] ?? null,
            eating_style: veg,
            alcohol_intake: alcool === "sim",
            smoking: fumo === "sim",
        };

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
                <h2 className="font-sansita text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                    FORMULÁRIO DE PERFIL ALIMENTAR
                </h2>
                <HelpCircle className="h-8 w-8 text-foodguard-600" />
            </div>

            {(localError || error) && (
                <div className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                    {localError || error}
                </div>
            )}

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div className="space-y-3">
                    <p className="font-semibold text-black">
                        Já fez consulta prévia com nutricionista?
                    </p>
                    <div className="space-y-2">
                        <Radio name="consulta" value="sim" checked={consulta === "sim"} onChange={setConsulta} label="Sim" />
                        <Radio name="consulta" value="nao" checked={consulta === "nao"} onChange={setConsulta} label="Não" />
                    </div>
                </div>

                {consulta === "sim" ? (
                    <>
                        <div className="space-y-2">
                            <label className="block font-semibold text-black">
                                Qual era o objetivo na época?
                            </label>
                            <textarea value={objetivo} onChange={(e) => setObjetivo(e.target.value)} rows={4} className={textareaClass} />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-semibold text-black">
                                Obteve resultado? Se sim, qual?
                            </label>
                            <textarea value={resultado} onChange={(e) => setResultado(e.target.value)} rows={4} className={textareaClass} />
                        </div>
                    </>
                ) : null}

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Tem intolerância a algum alimento? Se sim, qual?
                    </label>
                    <textarea value={intolerancia} onChange={(e) => setIntolerancia(e.target.value)} rows={4} className={textareaClass} />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Possui alergia a algum alimento? Se sim, qual?
                    </label>
                    <textarea value={alergia} onChange={(e) => setAlergia(e.target.value)} rows={4} className={textareaClass} />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Você possui histórico de doenças? Se sim, quais?
                    </label>
                    <textarea value={doencas} onChange={(e) => setDoencas(e.target.value)} rows={4} className={textareaClass} />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Faz uso de algum medicamento? Se sim, qual?
                    </label>
                    <textarea value={medicamentos} onChange={(e) => setMedicamentos(e.target.value)} rows={4} className={textareaClass} />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Alimentos que você tem preferência?
                    </label>
                    <textarea value={pref} onChange={(e) => setPref(e.target.value)} rows={4} className={textareaClass} />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Alimentos que você não gosta?
                    </label>
                    <textarea value={naoGosta} onChange={(e) => setNaoGosta(e.target.value)} rows={4} className={textareaClass} />
                </div>

                <div className="space-y-3">
                    <p className="font-semibold text-black">
                        Sentimento sobre o seu corpo e alimentação?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <Radio name="sent" value="muito-satisfeito" checked={sentimento === "muito-satisfeito"} onChange={setSentimento} label="Muito Satisfeito" />
                        <Radio name="sent" value="satisfeito" checked={sentimento === "satisfeito"} onChange={setSentimento} label="Satisfeito" />
                        <Radio name="sent" value="indiferente" checked={sentimento === "indiferente"} onChange={setSentimento} label="Indiferente" />
                        <Radio name="sent" value="insatisfeito" checked={sentimento === "insatisfeito"} onChange={setSentimento} label="Insatisfeito" />
                        <Radio name="sent" value="muito-insatisfeito" checked={sentimento === "muito-insatisfeito"} onChange={setSentimento} label="Muito Insatisfeito" />
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="font-semibold text-black">Estilo de alimentação</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Radio name="veg" value="not" checked={veg === "not"} onChange={(v) => setVeg(v as EatingStyle)} label="Não" />
                        <Radio name="veg" value="vegan" checked={veg === "vegan"} onChange={(v) => setVeg(v as EatingStyle)} label="Vegano(a)" />
                        <Radio name="veg" value="vegetarian" checked={veg === "vegetarian"} onChange={(v) => setVeg(v as EatingStyle)} label="Vegetariano(a)" />
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="font-semibold text-black">Ingestão de álcool?</p>
                    <div className="space-y-2">
                        <Radio name="alcool" value="sim" checked={alcool === "sim"} onChange={setAlcool} label="Sim" />
                        <Radio name="alcool" value="nao" checked={alcool === "nao"} onChange={setAlcool} label="Não" />
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="font-semibold text-black">Fumo?</p>
                    <div className="space-y-2">
                        <Radio name="fumo" value="sim" checked={fumo === "sim"} onChange={setFumo} label="Sim" />
                        <Radio name="fumo" value="nao" checked={fumo === "nao"} onChange={setFumo} label="Não" />
                    </div>
                </div>
            </div>

            <div className="mt-10 flex items-center justify-between">
                {onBack ? (
                    <button
                        type="button"
                        onClick={onBack}
                        className="h-12 rounded-lg border-2 border-foodguard-500 px-10 font-bold uppercase tracking-wide text-foodguard-600 transition-colors hover:bg-foodguard-600/10"
                    >
                        Voltar
                    </button>
                ) : (
                    <span />
                )}
                <button
                    type="submit"
                    disabled={submitting}
                    className="h-12 rounded-lg bg-foodguard-600 px-10 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-600/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Enviando..." : "Continuar"}
                </button>
            </div>
        </form>
    );
};

export default AnamneseStep;
