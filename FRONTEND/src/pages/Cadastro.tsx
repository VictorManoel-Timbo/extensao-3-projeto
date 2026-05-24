import { useState } from "react";
import AuthLayout from "@/components/authLayout/AuthLayout";
import CadastroForm from "@/components/cadastro/CadastroForm";
import AnamneseStep from "@/components/cadastro/Anamnese";
import TransicaoStep from "@/components/cadastro/Transicao";

type Step = "cadastro" | "anamnese" | "transicao";

const Cadastro = () => {
    const [step, setStep] = useState<Step>("cadastro");

    return (
        <AuthLayout wide>
            {step === "cadastro" && <CadastroForm onNext={() => setStep("anamnese")} />}
            {step === "anamnese" && <AnamneseStep onNext={() => setStep("transicao")} onBack={() => setStep("cadastro")} />}
            {step === "transicao" && <TransicaoStep />}
        </AuthLayout>
    );
};

export default Cadastro;

