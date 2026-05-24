import { useState } from "react";
import { HelpCircle } from "lucide-react";

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

interface Props {
    onNext: () => void;
    onBack: () => void;
}

const AnamneseStep = ({ onNext, onBack }: Props) => {
    const [consulta, setConsulta] = useState("sim");
    const [intolerancia, setIntolerancia] = useState("");
    const [doencas, setDoencas] = useState("");
    const [alergia, setAlergia] = useState("");
    const [pref, setPref] = useState("");
    const [naoGosta, setNaoGosta] = useState("");
    const [sentimento, setSentimento] = useState("indiferente");
    const [veg, setVeg] = useState("outro");
    const [vegOutro, setVegOutro] = useState("");
    const [alcool, setAlcool] = useState("nao");
    const [fumo, setFumo] = useState("nao");

    return (
        <>
            <div className="flex items-center gap-3">
                <h2 className="font-sansita text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                    FORMULÁRIO DE PERFIL ALIMENTAR
                </h2>
                <HelpCircle className="h-8 w-8 text-foodguard-600" />
            </div>

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

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Tem intolerância a algum alimento? Se sim, qual?
                    </label>
                    <textarea
                        value={intolerancia}
                        onChange={(e) => setIntolerancia(e.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-md border border-zinc-500 bg-slate-50 px-3 py-2 text-black focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Você possui histórico de doenças? Se sim, quais?
                    </label>
                    <textarea
                        value={doencas}
                        onChange={(e) => setDoencas(e.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-md border border-zinc-500 bg-slate-50 px-3 py-2 text-black focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Possui alergia a algum alimento? Se sim, qual?
                    </label>
                    <textarea
                        value={alergia}
                        onChange={(e) => setAlergia(e.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-md border border-zinc-500 bg-slate-50 px-3 py-2 text-black focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Alimentos que você tem preferência?
                    </label>
                    <textarea
                        value={pref}
                        onChange={(e) => setPref(e.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-md border border-zinc-500 bg-slate-50 px-3 py-2 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-semibold text-black">
                        Alimentos que você não gosta?
                    </label>
                    <textarea
                        value={naoGosta}
                        onChange={(e) => setNaoGosta(e.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-md border border-zinc-500 bg-slate-50 px-3 py-2 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                    />
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
                    <p className="font-semibold text-black">Vegetariano?</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Radio name="veg" value="nao" checked={veg === "nao"} onChange={setVeg} label="Não" />
                        <Radio name="veg" value="vegano" checked={veg === "vegano"} onChange={setVeg} label="Vegano(a)" />
                        <Radio name="veg" value="vegetariano" checked={veg === "vegetariano"} onChange={setVeg} label="Vegetariano(a)" />
                        <Radio name="veg" value="outro" checked={veg === "outro"} onChange={setVeg} label="Outro" />
                    </div>
                    {veg === "outro" && (
                        <input
                            type="text"
                            value={vegOutro}
                            onChange={(e) => setVegOutro(e.target.value)}
                            className="mt-2 h-10 w-full rounded-md border border-zinc-500 bg-slate-50 px-3 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                        />
                    )}
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
                <button
                    onClick={onBack}
                    className="h-12 rounded-lg border-2 border-foodguard-500 px-10 font-bold uppercase tracking-wide text-foodguard-600 transition-colors hover:bg-foodguard-600/10"
                >
                    Voltar
                </button>
                <button
                    onClick={onNext}
                    className="h-12 rounded-lg bg-foodguard-600 px-10 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-600/90"
                >
                    Continuar
                </button>
            </div>
        </>
    );
};

export default AnamneseStep;
