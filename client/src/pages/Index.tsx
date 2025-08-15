import React from "react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  submitOnboardingData,
  uploadOnboardingFiles,
} from "@/store/onboardingSlice";
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from "@/utils/formatEmail";

// Componentes componentizados
import {
  CompanyInfoSection,
  ContractSection,
  SideNavigation,
  IntegrationSection,
  WhatsAppSection,
  RobotSection,
  FaqSection,
  FinalSection,
} from "../components/index";

//Logo Jai
import JAI from "../assets/favicon.ico";

const menu = [
  { id: "empresa", label: "Empresa" },
  { id: "contratos", label: "Contratos" },
  { id: "integracao", label: "Integração" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "robo", label: "Robô" },
  { id: "faq", label: "FAQ" },
];

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.onboarding);
  const { toast } = useToast();

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [active, setActive] = useState<string>(menu[0].id);
  const [emailErrors, setEmailErrors] = useState<Record<string, boolean>>({});

  const [arquivosPorCampo, setArquivosPorCampo] = React.useState<
    Record<string, File[]>
  >({});

  function handleFilesChange(campo: string, files: File[]) {
    setArquivosPorCampo((prev) => ({
      ...prev,
      [campo]: files,
    }));
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive((entry.target as HTMLElement).id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    // Aguardar um pouco para garantir que as refs estejam prontas
    const timeoutId = setTimeout(() => {
      menu.forEach((m) => {
        const el = sectionRefs.current[m.id];
        if (el) {
          observer.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Mapa de key do emailErrors -> id do input
  const keyToIdMap: Record<string, string> = {
    company_contato: "emailContato",
    company_fiscal: "emailNotaFiscal",
    financeiro_email: "emailFinanceiro",
    operacao_email: "emailOperacao",
  };

  const submit = async () => {
    try {
      // 1. Validar emails antes de enviar
      const emailsToValidate = [
        { value: state.company.emailContato, key: "company_contato" },
        { value: state.company.emailNotaFiscal, key: "company_fiscal" },
        { value: state.responsavelFinanceiro.email, key: "financeiro_email" },
        { value: state.responsavelOperacao.email, key: "operacao_email" },
      ];

      const newEmailErrors: Record<string, boolean> = {};
      let firstErrorKey: string | null = null;

      emailsToValidate.forEach(({ value, key }) => {
        if (value && !validateEmail(value)) {
          newEmailErrors[key] = true;
          if (!firstErrorKey) firstErrorKey = key; // guarda o primeiro erro
        }
      });

      setEmailErrors(newEmailErrors);

      if (firstErrorKey) {
        // Mostra toast
        toast({
          title: "Erro de validação",
          description: "Por favor, corrija os emails com formato inválido.",
          variant: "destructive",
        });

        // Foca no input correspondente
        const element = document.getElementById(keyToIdMap[firstErrorKey]);
        element?.focus();

        return; // interrompe envio
      }

      // 2. Mostrar arquivos no console (opcional)
      console.log("Arquivos selecionados antes do envio:", arquivosPorCampo);
      
      // Mostrar informações dos arquivos da seção "outro sistema" se existirem
      if (state.outroSistemaArquivos && state.outroSistemaArquivos.length > 0) {
        console.log("Arquivos da seção 'outro sistema':");
        state.outroSistemaArquivos.forEach((arquivo, i) => {
          console.log(
            `  Arquivo ${i + 1}: ${arquivo.name} - ${arquivo.type} - ${arquivo.size} bytes`
          );
        });
      }
      
      Object.entries(arquivosPorCampo).forEach(([campo, arquivos]) => {
        console.log(`Campo: ${campo}`);
        arquivos.forEach((file, i) => {
          console.log(
            `  Arquivo ${i + 1}: ${file.name} - ${file.type} - ${
              file.size
            } bytes`
          );
        });
      });

      // 3. Enviar dados JSON
      const result = await dispatch(submitOnboardingData(state)).unwrap();

      // 4. Se tiver arquivos, enviar depois
      if (result.id && (Object.keys(arquivosPorCampo).length > 0 || state.whatsapp?.logoEmpresa || (state.outroSistemaArquivos && state.outroSistemaArquivos.length > 0))) {
        await dispatch(
          uploadOnboardingFiles({ onboardingId: result.id, arquivosPorCampo, state })
        ).unwrap();
      }

      toast({
        title: "Configuração enviada",
        description: "Recebemos seus dados com sucesso.",
      });

      console.log("Resposta:", result);
    } catch (error) {
      toast({
        title: "Envio não concluído",
        description: (error as string) || "Erro ao enviar dados",
        variant: "destructive",
      });

      console.error("Erro ao enviar:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Onboarding JAI — Integração e Configuração</title>
        <meta
          name="description"
          content="Onboarding JAI: integre seu sistema, configure contratos e WhatsApp, personalize o robô e envie suas informações."
        />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Helmet>

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={JAI}
              alt="Logo JAI"
              className="w-8 h-8 rounded-md bg-hero-gradient"
            />
            <span className="text-sm text-muted-foreground">
              Onboarding JAI
            </span>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Seção de Informações da Empresa */}
        <section id="empresa" ref={(el) => (sectionRefs.current.empresa = el)}>
          <CompanyInfoSection
            emailErrors={emailErrors}
            setEmailErrors={setEmailErrors}
          />
        </section>

        {/* Seção do Contrato */}
        <section
          id="contratos"
          ref={(el) => (sectionRefs.current.contratos = el)}
        >
          <ContractSection />
        </section>

        {/* Integração */}
        <section
          id="integracao"
          ref={(el) => (sectionRefs.current.integracao = el)}
        >
          <IntegrationSection />
        </section>

        {/* WhatsApp */}
        <section
          id="whatsapp"
          ref={(el) => (sectionRefs.current.whatsapp = el)}
        >
          <WhatsAppSection />
        </section>

        {/* Robô */}
        <section id="robo" ref={(el) => (sectionRefs.current.robo = el)}>
          <RobotSection />
        </section>

        {/* FAQ */}
        <section id="faq" ref={(el) => (sectionRefs.current.faq = el)}>
          <FaqSection
            arquivosPorCampo={arquivosPorCampo}
            handleFilesChange={handleFilesChange}
          />
        </section>

        {/* Final */}
        <FinalSection onSubmit={submit} />

        {/* Navegação Lateral */}
        <SideNavigation active={active} sectionRefs={sectionRefs} />
      </main>
    </>
  );
}
