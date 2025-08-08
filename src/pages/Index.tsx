import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setCompany,
  setFinanceiro,
  setOperacao,
  setContratoAceito,
  setIntegracaoTipo,
  setEvo,
  setContracts,
  setWhatsapp,
  setRobot,
  toggleRobotArrayField,
  setFaqResposta,
  setOutroSistema,
  submitOnboarding,
  IntegrationType,
} from "@/store/onboardingSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  FileText,
  Link as LinkIcon,
  MessageCircle,
  Bot,
  HelpCircle,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const menu = [
  { id: "integracao", label: "Integração", icon: LinkIcon },
  { id: "contratos", label: "Contratos", icon: FileText },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "robo", label: "Robô", icon: Bot },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

const caracteristicas = [
  "Ágil",
  "Educado",
  "Assertivo",
  "Amigável",
  "Técnico",
  "Proativo",
];
const personalidades = ["Profissional", "Empático", "Amigável", "Consultivo"];
const tons = ["Formal", "Semiformal", "Informal"];

export default function Index() {
  const dispatch = useDispatch();
  const state = useSelector((s: RootState) => s.onboarding);
  const { toast } = useToast();

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [active, setActive] = useState<string>(menu[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive((entry.target as HTMLElement).id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    menu.forEach((m) => {
      const el = sectionRefs.current[m.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const contractText = useMemo(() => {
    const nome = state.company?.nomeEmpresa || "[A ser preenchido]";
    const cnpj = state.company?.cnpj || "[A ser preenchido]";

    return `
QUADRO RESUMO

Data Inicial: ${new Date().toLocaleDateString("pt-BR")}

Local de Assinatura: São Paulo - SP

QUADRO I – CONTRATADA:
Razão Social: J QUANT INFORMÁTICA LTDA.

CNPJ/MF: 17.493.469/0001-02

Endereço: Rua Professor Atilio Innocenti, 165, 4° andar, Vila Nova Conceição, na Cidade de São Paulo, Estado de São Paulo, CEP 01406-200

QUADRO II – CONTRATANTE:
Razão Social: ${nome}

CNPJ/MF: ${cnpj}

(sendo a Contratada e a Contratante doravante denominadas em conjunto como "Partes" e, individual e indistintamente, "Parte")

QUADRO III – SERVIÇOS:
Os serviços de automatização de processos e operações, a serem prestados pela Contratante à Contratada, conforme indicado na cláusula 2.1.

QUADRO IV – VIGÊNCIA:
Prazo: 12 (doze) meses contados da assinatura deste Contrato, renovável automaticamente por iguais períodos, exceto se uma Parte notificar a outra Parte, por escrito, com no mínimo 30 (trinta) dias de antecedência da data de renovação automática, sobre a sua decisão de não renovar o Contrato.

QUADRO V - PREÇO E CONDIÇÕES DE PAGAMENTO:
Forma de Pagamento: transferência bancária (via TED ou PIX).

Dados bancários: Banco 341 / Agência 5291 / Conta 03022-1 / Chave Pix 17493469000102

QUADRO VI - ENCARGOS MORATÓRIOS
1. Multa Penal Não Compensatória: 10% (dez por cento) sobre o valor em atraso.

2. Correção Monetária: com base na variação do IGPM/FGV ou outro índice que venha a substituí-lo, apurado no período entre o vencimento da obrigação e o efetivo pagamento.

3. Juros Moratórios: 1% (um por cento) ao mês, calculado pro rata die desde a data do vencimento da obrigação até a data do efetivo pagamento.

QUADRO VII – REAJUSTE
Reajuste anual com base na variação do IGP-M ou outro índice que venha a substituí-lo.

1. OBJETO
A CONTRATADA prestará serviços de BPO com foco em atendimento, vendas e cobrança, por meio de robôs inteligentes com IA, integrados a canais como WhatsApp, e-mail, redes sociais e ou landing pages.

2. CONDIÇÕES DE CONTRATAÇÃO
Início: ${new Date().toLocaleDateString("pt-BR")}

Prazo: 12 meses, renovado automaticamente, salvo notificação com 30 dias de antecedência.

Pagamento:

Mensalidade por unidade: R$ 750,00
Comissão: 18% sobre valores recuperados (cobrança ativa/negociação)
Forma de pagamento: Transferência bancária (TED ou PIX: 17493469000102)
Vencimento: Dia 20 do mês subsequente à prestação dos serviços.
Encargos por atraso: Multa de 10%, correção pelo IGPM/FGV e juros de 1% ao mês.

3. OBRIGAÇÕES DAS PARTES
CONTRATADA:

Prestar os serviços com diligência e qualidade.
Garantir sistema com disponibilidade mínima de 95%.
Fornece relatórios mensais de desempenho.
Cumprir as diretrizes da LGPD.

CONTRATANTE:

Efetuar os pagamentos nos prazos acordados.
Fornecer informações e acessos necessários.
Responsabilizar-se pelos dados fornecidos e pelo backup das comunicações.
Avaliar e aprovar os relatórios em até 7 dias.

4. RESCISÃO
Ambas as partes podem rescindir com aviso prévio de 30 dias.
Se a CONTRATANTE rescindir após 90 dias do início, será devida multa de 3x o maior faturamento mensal dos últimos 12 meses.
A rescisão imediata é permitida em caso de inadimplência, falência ou força maior.

5. LIMITAÇÃO DE RESPONSABILIDADE
A CONTRATADA não é responsável por:

Serviços prestados pela CONTRATANTE a seus clientes;
Dados incorretos fornecidos;
Ações de terceiros, falhas na plataforma WhatsApp ou em sistemas do cliente;
Danos indiretos, lucros cessantes ou falhas oriundas da CONTRATANTE.

6. PROPRIEDADE INTELECTUAL
A CONTRATANTE não adquire qualquer direito sobre os sistemas da CONTRATADA.

É autorizada a divulgação do nome da CONTRATANTE em portfólios e materiais da CONTRATADA.

7. CONFIDENCIALIDADE
Ambas as partes se comprometem a manter sigilo sobre informações trocadas durante e após a vigência deste termo, por até 5 anos (ou indefinidamente, no caso de dados sensíveis e propriedade intelectual).

8. LGPD E IA
A CONTRATANTE é a controladora dos dados, e a CONTRATADA, a operadora, conforme LGPD.

A CONTRATANTE autoriza o uso de IA, inclusive para aprendizado e melhoria contínua.

9. FORO E LEGISLAÇÃO
Este contrato é regido pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo/SP para dirimir eventuais questões.
`;
  }, [state.company?.nomeEmpresa, state.company?.cnpj]);

  const submit = async () => {
    const res = await dispatch<any>(submitOnboarding(state));
    if (res.payload?.ok) {
      toast({
        title: "Configuração enviada",
        description: "Recebemos seus dados com sucesso.",
      });
    } else {
      toast({
        title: "Envio não concluído",
        description: "Endpoint de API ausente. Dados prontos para envio.",
      });
    }
  };

  const selectIntegration = (t: IntegrationType) =>
    dispatch(setIntegracaoTipo(t));

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
            <div
              aria-label="Logo"
              className="w-8 h-8 rounded-md bg-hero-gradient"
            />
            <span className="text-sm text-muted-foreground">
              Onboarding JAI
            </span>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-hero-gradient py-10">
          <div className="container">
            <h1 className="sr-only">Onboarding JAI</h1>
            <article className="glass-panel rounded-3xl p-6 md:p-10">
              <header className="flex items-center gap-3 text-primary-foreground mb-4">
                <Building className="w-6 h-6" />
                <h2 className="text-2xl font-semibold">Dados da Sua Empresa</h2>
              </header>

              {/* Informações Gerais */}
              <section className="mb-8">
                <h3 className="text-base font-medium mb-4 text-primary-foreground/90">
                  Informações Gerais
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="nomeEmpresa"
                      className="text-primary-foreground/80"
                    >
                      Nome da Empresa
                    </Label>
                    <Input
                      id="nomeEmpresa"
                      placeholder="Digite o nome da sua empresa"
                      value={state.company.nomeEmpresa}
                      onChange={(e) =>
                        dispatch(setCompany({ nomeEmpresa: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="cnpj"
                      className="text-primary-foreground/80"
                    >
                      CNPJ
                    </Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={state.company.cnpj}
                      onChange={(e) =>
                        dispatch(setCompany({ cnpj: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="emailContato"
                      className="text-primary-foreground/80"
                    >
                      Email de Contato
                    </Label>
                    <Input
                      id="emailContato"
                      type="email"
                      placeholder="contato@empresa.com"
                      value={state.company.emailContato}
                      onChange={(e) =>
                        dispatch(setCompany({ emailContato: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="emailNf"
                      className="text-primary-foreground/80"
                    >
                      Email para Nota Fiscal
                    </Label>
                    <Input
                      id="emailNf"
                      type="email"
                      placeholder="fiscal@empresa.com"
                      value={state.company.emailNotaFiscal}
                      onChange={(e) =>
                        dispatch(
                          setCompany({ emailNotaFiscal: e.target.value })
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="telefone"
                      className="text-primary-foreground/80"
                    >
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      placeholder="(11) 99999-9999"
                      value={state.company.telefone}
                      onChange={(e) =>
                        dispatch(setCompany({ telefone: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="respGeral"
                      className="text-primary-foreground/80"
                    >
                      Responsável Geral
                    </Label>
                    <Input
                      id="respGeral"
                      placeholder="Nome do responsável"
                      value={state.company.responsavelGeral}
                      onChange={(e) =>
                        dispatch(
                          setCompany({ responsavelGeral: e.target.value })
                        )
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Responsável Financeiro */}
              <section className="mb-8">
                <h3 className="text-base font-medium mb-4 text-primary-foreground/90">
                  Responsável Financeiro
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="finNome">Nome</Label>
                    <Input
                      id="finNome"
                      value={state.responsavelFinanceiro.nome}
                      onChange={(e) =>
                        dispatch(setFinanceiro({ nome: e.target.value }))
                      }
                      placeholder="Nome do responsável financeiro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="finEmail">Email</Label>
                    <Input
                      id="finEmail"
                      type="email"
                      value={state.responsavelFinanceiro.email}
                      onChange={(e) =>
                        dispatch(setFinanceiro({ email: e.target.value }))
                      }
                      placeholder="financeiro@empresa.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="finTel">Telefone</Label>
                    <Input
                      id="finTel"
                      value={state.responsavelFinanceiro.telefone}
                      onChange={(e) =>
                        dispatch(setFinanceiro({ telefone: e.target.value }))
                      }
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </section>

              {/* Responsável Operação */}
              <section className="mb-2">
                <h3 className="text-base font-medium mb-4 text-primary-foreground/90">
                  Responsável pela Operação
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="opNome">Nome</Label>
                    <Input
                      id="opNome"
                      value={state.responsavelOperacao.nome}
                      onChange={(e) =>
                        dispatch(setOperacao({ nome: e.target.value }))
                      }
                      placeholder="Nome do responsável operacional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="opEmail">Email</Label>
                    <Input
                      id="opEmail"
                      type="email"
                      value={state.responsavelOperacao.email}
                      onChange={(e) =>
                        dispatch(setOperacao({ email: e.target.value }))
                      }
                      placeholder="operacao@empresa.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="opTel">Telefone</Label>
                    <Input
                      id="opTel"
                      value={state.responsavelOperacao.telefone}
                      onChange={(e) =>
                        dispatch(setOperacao({ telefone: e.target.value }))
                      }
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Esta pessoa será o ponto de contato para dúvidas sobre
                  processos e operação do sistema JAI
                </p>
              </section>
            </article>
          </div>
        </section>

        {/* Contrato */}
        <section className="container py-12">
          <article className="rounded-3xl border p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">
              Contrato de Prestação de Serviços
            </h2>
            <div className="rounded-xl border p-4 h-64 overflow-y-auto text-sm bg-background/40">
              <pre className="whitespace-pre-wrap font-sans text-foreground/90">
                {contractText}
              </pre>
            </div>
            <div className="flex items-start gap-3 mt-4">
              <Checkbox
                id="aceite"
                checked={state.contratoAceito}
                onCheckedChange={(v) => dispatch(setContratoAceito(Boolean(v)))}
              />
              <Label htmlFor="aceite" className="leading-6">
                Li e concordo com todos os termos do Contrato de Prestação de
                Serviços acima. Declaro estar ciente das condições de pagamento,
                prazo de vigência, obrigações das partes e demais cláusulas
                contratuais. Ao marcar esta opção, confirmo minha concordância
                integral com os termos apresentados.
              </Label>
            </div>
            {!state.contratoAceito && (
              <p className="text-xs text-destructive mt-2">
                É obrigatório aceitar os termos do contrato para prosseguir
              </p>
            )}
          </article>
        </section>

        {/* Integração */}
        <section
          id="integracao"
          ref={(el) => (sectionRefs.current.integracao = el)}
          className="container py-6"
        >
          <header className="mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            <h2 className="text-xl font-semibold">
              Integração com Sistema de Gestão
            </h2>
          </header>
          <p className="text-sm text-muted-foreground mb-4">
            Qual sistema de gestão você utiliza?
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                key: "EVO" as IntegrationType,
                title: "EVO",
                sub: "Sistema EVO de gestão para academias",
              },
              {
                key: "OUTRO" as IntegrationType,
                title: "Outro Sistema",
                sub: "Utilizo outro sistema de gestão",
              },
              {
                key: "NAO" as IntegrationType,
                title: "Não Utilizo",
                sub: "Não possuo sistema de gestão",
              },
            ].map((opt) => {
              const active = state.integracaoTipo === opt.key;
              return (
                <button
                  key={opt.title}
                  onClick={() => selectIntegration(opt.key)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    active ? "ring-2 ring-primary" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="font-medium">{opt.title}</div>
                  <div className="text-sm text-muted-foreground">{opt.sub}</div>
                </button>
              );
            })}
          </div>

          {state.integracaoTipo === "EVO" && (
            <>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">
                    Etapas para Gerar o Token de Integração EVO
                  </h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li>
                      Acesse o painel do EVO com um usuário administrador.
                    </li>
                    <li>Navegue até Integrações &gt; API.</li>
                    <li>Gere um novo Token com permissões de leitura.</li>
                    <li>Copie o Token gerado.</li>
                    <li>Cole o Token no campo abaixo e salve.</li>
                  </ol>
                </div>

                <div>
                  <Label htmlFor="evoToken">Cole seu Token EVO aqui</Label>
                  <Input
                    id="evoToken"
                    value={state.evo.token}
                    onChange={(e) =>
                      dispatch(setEvo({ token: e.target.value }))
                    }
                    placeholder="token_evo_..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="evoLink">Link do Sistema EVO</Label>
                    <Input
                      id="evoLink"
                      value={state.evo.linkSistema}
                      onChange={(e) =>
                        dispatch(setEvo({ linkSistema: e.target.value }))
                      }
                      placeholder="https://minhaacademia.evo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="evoLogin">Login do Usuário JAI</Label>
                    <Input
                      id="evoLogin"
                      value={state.evo.loginUsuarioJai}
                      onChange={(e) =>
                        dispatch(setEvo({ loginUsuarioJai: e.target.value }))
                      }
                      placeholder="usuario.jai"
                    />
                  </div>
                  <div>
                    <Label htmlFor="evoSenha">Senha do Usuário JAI</Label>
                    <Input
                      id="evoSenha"
                      type="password"
                      value={state.evo.senhaUsuarioJai}
                      onChange={(e) =>
                        dispatch(setEvo({ senhaUsuarioJai: e.target.value }))
                      }
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Dados Acessados</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Alunos, planos e status de matrícula</li>
                    <li>Contratos e pagamentos</li>
                    <li>Agendamentos e check-ins</li>
                  </ul>
                </div>
              </div>

              <section
                id="contratos"
                ref={(el) => (sectionRefs.current.contratos = el)}
                className="mt-10 py-10"
              >
                <h2 className="text-xl font-semibold mb-4">
                  Configuração de Contratos
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Insira os nomes exatos dos contratos ativos no EVO.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {state.contracts.contratosEvo.map((v, i) => (
                    <div key={i}>
                      <Label>Contrato {i + 1}</Label>
                      <Input
                        value={v}
                        onChange={(e) =>
                          dispatch(
                            setContracts({ index: i, value: e.target.value })
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {state.integracaoTipo === "OUTRO" && (
            <div className="p-6 bg-gray-900 rounded-lg space-y-8 mt-6 border border-gray-700">
              {/* Espaço superior separado e destacado */}
              <div className="p-4 bg-gray-800 rounded-md shadow-inner">
                <Label
                  htmlFor="outroSistema"
                  className="mb-1 block text-sm font-medium text-gray-200"
                >
                  Qual sistema você utiliza?
                </Label>
                <Input
                  id="outroSistema"
                  placeholder="Ex: Tecnofit, Nexur, GymPass, etc."
                  value={state.outroSistema || ""}
                  onChange={(e) => dispatch(setOutroSistema(e.target.value))}
                  className="mb-2 bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded"
                />
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span>💡</span> Informe o nome do sistema para avaliarmos a
                  possibilidade de integração
                </p>
              </div>

              {/* Container de texto sem SVG, com cores harmônicas */}
              <div className="p-6 bg-gray-800 rounded-md text-center shadow-sm border border-gray-700">
                <h3 className="text-lg font-bold mb-2 text-gray-100">
                  Integração Personalizada
                </h3>
                <p className="text-sm text-gray-300 mb-2 px-4">
                  Nossa equipe técnica irá avaliar a possibilidade de integração
                  com o sistema. Entraremos em contato para discutir as opções
                  disponíveis e os próximos passos.
                </p>
                <div className="p-3 bg-gray-700 rounded-md text-xs text-gray-400 flex items-center gap-2 max-w-xl mx-auto">
                  <span>💡</span>
                  <p className="m-0">
                    Mesmo sem integração direta, o JAI pode funcionar
                    perfeitamente utilizando as informações fornecidas no FAQ e
                    configurações personalizadas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {state.integracaoTipo === "NAO" && (
            <div className="mt-4 p-4 bg-white rounded-md border border-gray-300 max-w-3xl mx-auto">
              <p className="text-black text-sm leading-relaxed">
                Sem problemas! O JAI funcionará perfeitamente utilizando as
                informações que você fornecer nas próximas etapas. Você poderá
                configurar todas as respostas e informações manualmente.
              </p>
              <p className="mt-2 text-black text-xs flex items-center gap-1">
                <span>💡</span> Esta configuração é ideal para empresas que
                preferem controle total sobre as informações ou que ainda não
                utilizam sistemas de gestão automatizados.
              </p>
            </div>
          )}
        </section>

        <section
          id="whatsapp"
          ref={(el) => (sectionRefs.current.whatsapp = el)}
          className="container pb-10"
        >
          <h2 className="text-xl font-semibold mb-4">
            Configuração do WhatsApp Corporativo
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="waNumero">Número WhatsApp (opcional)</Label>
              <Input
                id="waNumero"
                placeholder="(11) 99999-9999"
                value={state.whatsapp.numero || ""}
                onChange={(e) =>
                  dispatch(setWhatsapp({ numero: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="waDataPreferida">Data Preferida</Label>
              <Input
                id="waDataPreferida"
                type="date"
                className="[&::-webkit-calendar-picker-indicator]:invert" // Ícone branco no Chrome/Safari
                value={state.whatsapp.dataPreferida || ""}
                onChange={(e) =>
                  dispatch(setWhatsapp({ dataPreferida: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="waHorarioPreferido">Horário Preferido</Label>
              <Select
                value={state.whatsapp.horarioPreferido || ""}
                onValueChange={(value) =>
                  dispatch(setWhatsapp({ horarioPreferido: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="waObs">Observações Adicionais</Label>
              <Textarea
                id="waObs"
                rows={4}
                value={state.whatsapp.observacoes || ""}
                onChange={(e) =>
                  dispatch(setWhatsapp({ observacoes: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Infográfico 3 etapas */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              {
                icon: MessageCircle,
                title: "Contato da Equipe",
                text: "Falaremos com você para validar o número.",
              },
              {
                icon: CheckCircle2,
                title: "Ativação do Número",
                text: "Preparamos o número corporativo.",
              },
              {
                icon: Calendar,
                title: "Configuração Técnica",
                text: "Integração e testes finais.",
              },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border p-4">
                <s.icon className="w-5 h-5 mb-2" />
                <div className="font-medium">{s.title}</div>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Robô e FAQ */}
        <section
          id="robo"
          ref={(el) => (sectionRefs.current.robo = el)}
          className="container pb-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            Personalização do Robô JAI
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <Label htmlFor="nomeRobo">Nome do Robô</Label>
              <Input
                id="nomeRobo"
                value={state.robot.nome}
                onChange={(e) => dispatch(setRobot({ nome: e.target.value }))}
                placeholder="Ex.: Jota"
              />
            </div>

            {/* Características - Múltipla seleção */}
            <div>
              <div className="font-medium mb-2">Características</div>
              <div className="flex flex-wrap gap-2">
                {caracteristicas.map((c) => {
                  const on = state.robot.caracteristicas.includes(c);
                  return (
                    <Button
                      key={c}
                      variant="outline"
                      size="sm"
                      className={on ? "ring-2 ring-primary" : ""}
                      onClick={() =>
                        dispatch(
                          toggleRobotArrayField({
                            field: "caracteristicas",
                            value: c,
                          })
                        )
                      }
                    >
                      {c}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Personalidade - Múltipla seleção */}
            <div>
              <div className="font-medium mb-2">Personalidade</div>
              <div className="flex flex-wrap gap-2">
                {personalidades.map((c) => {
                  const on = state.robot.personalidade.includes(c);
                  return (
                    <Button
                      key={c}
                      variant="outline"
                      size="sm"
                      className={on ? "ring-2 ring-primary" : ""}
                      onClick={() =>
                        dispatch(
                          toggleRobotArrayField({
                            field: "personalidade",
                            value: c,
                          })
                        )
                      }
                    >
                      {c}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tons de Escrita - Seleção única */}
            <div>
              <div className="font-medium mb-2">Tons de Escrita</div>
              <div className="flex flex-wrap gap-2">
                {tons.map((c) => {
                  const on = state.robot.tons.includes(c);
                  return (
                    <Button
                      key={c}
                      variant="outline"
                      size="sm"
                      className={on ? "ring-2 ring-primary" : ""}
                      onClick={() =>
                        dispatch(
                          toggleRobotArrayField({
                            field: "tons",
                            value: c,
                          })
                        )
                      }
                    >
                      {c}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          ref={(el) => (sectionRefs.current.faq = el)}
          className="container pb-10 max-w-6xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-6">FAQ Inteligente</h2>
          <p className="mb-8 font-semibold">
            Responda as perguntas sobre seu negócio
          </p>

          {/* Convênios */}
          <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Convênios</h3>

            <div className="mb-6">
              <Label
                htmlFor="conveniosPlanos"
                className="block mb-1 font-medium"
              >
                Quais planos aceita (Wellhub, TotalPass, etc.)
              </Label>
              <Textarea
                id="conveniosPlanos"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.conveniosPlanos || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "conveniosPlanos",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div>
              <Label
                htmlFor="conveniosInclusos"
                className="block mb-1 font-medium"
              >
                O que está incluso em cada convênio
              </Label>
              <Textarea
                id="conveniosInclusos"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.conveniosInclusos || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "conveniosInclusos",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>
          </section>

          {/* Infraestrutura & Serviços */}
          <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">
              Infraestrutura & Serviços
            </h3>

            <div className="mb-6">
              <Label htmlFor="espacoKids" className="block mb-1 font-medium">
                Possui Espaço Kids?
              </Label>
              <Textarea
                id="espacoKids"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.espacoKids || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "espacoKids",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="menoresIdade" className="block mb-1 font-medium">
                Aceita menores de idade?
              </Label>
              <Textarea
                id="menoresIdade"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.menoresIdade || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "menoresIdade",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div className="mb-6">
              <Label
                htmlFor="estacionamento"
                className="block mb-1 font-medium"
              >
                Tem estacionamento? Como validar o uso?
              </Label>
              <Textarea
                id="estacionamento"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.estacionamento || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "estacionamento",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div>
              <Label
                htmlFor="objetosPerdidos"
                className="block mb-1 font-medium"
              >
                Objetos perdidos – como proceder?
              </Label>
              <Textarea
                id="objetosPerdidos"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.objetosPerdidos || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "objetosPerdidos",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>
          </section>

          {/* Cancelamento */}
          <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Cancelamento</h3>

            <Label
              htmlFor="cancelamentoProcesso"
              className="block mb-1 font-medium"
            >
              Qual o processo?
            </Label>
            <Textarea
              id="cancelamentoProcesso"
              rows={4}
              placeholder="Digite sua resposta aqui..."
              value={state.extendedFaq.cancelamentoProcesso || ""}
              onChange={(e) =>
                dispatch(
                  setFaqResposta({
                    key: "cancelamentoProcesso",
                    resposta: e.target.value,
                  })
                )
              }
            />
          </section>

          {/* Planos e Contratação */}
          <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Planos e Contratação</h3>

            <div className="mb-6">
              <Label htmlFor="planosDiarias" className="block mb-1 font-medium">
                Diárias disponíveis e valores
              </Label>
              <Textarea
                id="planosDiarias"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.planosDiarias || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "planosDiarias",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div>
              <Label
                htmlFor="planosAquaticos"
                className="block mb-1 font-medium"
              >
                Planos aquáticos: Há troca de touca? Qual o tratamento da água?
                Qual o tamanho da piscina? Materiais obrigatórios
              </Label>
              <Textarea
                id="planosAquaticos"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.planosAquaticos || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "planosAquaticos",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>
          </section>

          {/* Serviços Adicionais */}
          <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Serviços Adicionais</h3>

            <div className="mb-6">
              <Label
                htmlFor="personalTrainer"
                className="block mb-1 font-medium"
              >
                Possui personal trainer? Quais os valores?
              </Label>
              <Textarea
                id="personalTrainer"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.personalTrainer || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "personalTrainer",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div>
              <Label
                htmlFor="modalidadesExtras"
                className="block mb-1 font-medium"
              >
                Modalidades extras disponíveis (Pilates, Spinning, Beach Tênis):
                São inclusas ou pagas à parte? O Pilates é solo ou com
                aparelhos?
              </Label>
              <Textarea
                id="modalidadesExtras"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.modalidadesExtras || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "modalidadesExtras",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>
          </section>

          {/* Aulas */}
          <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Aulas</h3>

            <div className="mb-6">
              <Label
                htmlFor="gradeDescricao"
                className="block mb-1 font-medium"
              >
                Grade com descrição
              </Label>
              <Textarea
                id="gradeDescricao"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.gradeDescricao || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "gradeDescricao",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div>
              <Label
                htmlFor="politicaAcompanhante"
                className="block mb-1 font-medium"
              >
                Política de acompanhante
              </Label>
              <Textarea
                id="politicaAcompanhante"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.politicaAcompanhante || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "politicaAcompanhante",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>
          </section>

          {/* Agendamento */}
          <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Agendamento</h3>

            <div className="mb-6">
              <Label
                htmlFor="agendamentoApp"
                className="block mb-1 font-medium"
              >
                Precisa agendar? Se sim, é pelo app?
              </Label>
              <Textarea
                id="agendamentoApp"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.agendamentoApp || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "agendamentoApp",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>
          </section>

          {/* Equipamentos */}
          <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Equipamentos</h3>

            <Label
              htmlFor="equipamentosLista"
              className="block mb-1 font-medium"
            >
              Lista de equipamentos disponíveis por unidade
            </Label>
            <Textarea
              id="equipamentosLista"
              rows={4}
              placeholder="Digite sua resposta aqui..."
              value={state.extendedFaq.equipamentosLista || ""}
              onChange={(e) =>
                dispatch(
                  setFaqResposta({
                    key: "equipamentosLista",
                    resposta: e.target.value,
                  })
                )
              }
            />
          </section>

          {/* Cobrança */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Cobrança</h3>

            <div className="mb-6">
              <Label
                htmlFor="formasPagamento"
                className="block mb-1 font-medium"
              >
                Quais formas de pagamento são aceitas? (Pix, cartão, boleto)
              </Label>
              <Textarea
                id="formasPagamento"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.formasPagamento || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "formasPagamento",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="chavePix" className="block mb-1 font-medium">
                Qual a chave Pix da unidade?
              </Label>
              <Textarea
                id="chavePix"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.chavePix || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "chavePix",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="parcelamento" className="block mb-1 font-medium">
                Há opção de parcelamento? A partir de qual valor e em quantas
                vezes?
              </Label>
              <Textarea
                id="parcelamento"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.parcelamento || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "parcelamento",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>

            <div>
              <Label
                htmlFor="confirmacaoPix"
                className="block mb-1 font-medium"
              >
                Como confirmar o recebimento do Pix? Quem faz essa verificação?
              </Label>
              <Textarea
                id="confirmacaoPix"
                rows={4}
                placeholder="Digite sua resposta aqui..."
                value={state.extendedFaq.confirmacaoPix || ""}
                onChange={(e) =>
                  dispatch(
                    setFaqResposta({
                      key: "confirmacaoPix",
                      resposta: e.target.value,
                    })
                  )
                }
              />
            </div>
          </section>
        </section>

        {/* Perguntas Específicas */}
        <section className="container pb-10 max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">
            Perguntas Específicas do Seu Negócio
          </h3>

          <div className="mb-6">
            <Label
              htmlFor="perguntasEspecificas"
              className="block mb-1 font-small"
            >
              Liste aqui perguntas específicas do seu negócio que o robô deve
              saber responder
            </Label>
            <Textarea
              id="perguntasEspecificas"
              rows={6}
              placeholder="Ex: Horários especiais, promoções atuais, políticas específicas, etc."
              value={state.extendedFaq.perguntasEspecificas || ""}
              onChange={(e) =>
                dispatch(
                  setFaqResposta({
                    key: "perguntasEspecificas",
                    resposta: e.target.value,
                  })
                )
              }
            />
          </div>
        </section>

        {/* Final */}
        <section className="container pb-20">
          <h2 className="text-xl font-semibold mb-2">Finalizar Configuração</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Revise suas informações e envie para configurarmos sua integração
            JAI.
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={submit}
            disabled={!state.contratoAceito || state.submitting}
          >
            {state.submitting ? "Enviando..." : "Enviar Configuração"}
          </Button>
        </section>

        {/* Right fixed menu */}
        <nav
          aria-label="Navegação de seções"
          className="fixed right-4 top-24 hidden lg:block"
        >
          <ul className="rounded-2xl border bg-background/70 backdrop-blur p-2 w-56">
            {menu.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() =>
                    sectionRefs.current[m.id]?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    active === m.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <m.icon className="w-4 h-4" /> {m.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
