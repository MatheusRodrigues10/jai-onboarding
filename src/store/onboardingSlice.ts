import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type IntegrationType = "EVO" | "OUTRO" | "NAO" | "";

export interface CompanyInfo {
  nomeEmpresa: string;
  cnpj: string;
  emailContato: string;
  emailNotaFiscal: string;
  telefone: string;
  responsavelGeral: string;
}

export interface PersonInfo {
  nome: string;
  email: string;
  telefone: string;
}

export interface EvoInfo {
  token: string;
  linkSistema: string;
  loginUsuarioJai: string;
  senhaUsuarioJai: string;
}

export interface ContractsConfig {
  contratosEvo: string[]; // length 5
}

export interface WhatsappConfig {
  numero?: string;
  dataPreferida?: string; // ISO date format (YYYY-MM-DD)
  horarioPreferido?: string; // Time format (HH:MM)
  observacoes?: string;
}

export interface RobotConfig {
  nome: string;
  caracteristicas: string[];
  personalidade: string[];
  tons: string[];
}

export interface FaqCard {
  categoria: string;
  perguntaGuia: string;
  resposta: string;
}

// Extended FAQ structure with all the new fields
export interface ExtendedFaqData {
  // Convênios
  conveniosPlanos: string;
  conveniosInclusos: string;

  // Infraestrutura & Serviços
  espacoKids: string;
  menoresIdade: string;
  estacionamento: string;
  objetosPerdidos: string;

  // Cancelamento
  cancelamentoProcesso: string;

  // Planos e Contratação
  planosDiarias: string;
  planosAquaticos: string;

  // Serviços Adicionais
  personalTrainer: string;
  modalidadesExtras: string;

  // Aulas
  gradeDescricao: string;
  politicaAcompanhante: string;

  // Agendamento
  agendamentoApp: string;

  // Equipamentos
  equipamentosLista: string;

  // Cobrança
  formasPagamento: string;
  chavePix: string;
  parcelamento: string;
  confirmacaoPix: string;

  // Perguntas Específicas
  perguntasEspecificas: string;
}

export interface OnboardingState {
  company: CompanyInfo;
  responsavelFinanceiro: PersonInfo;
  responsavelOperacao: PersonInfo;
  contratoAceito: boolean;
  integracaoTipo: IntegrationType;
  outroSistema: string; // Added this field
  evo: EvoInfo;
  contracts: ContractsConfig;
  whatsapp: WhatsappConfig;
  robot: RobotConfig;
  faq: FaqCard[]; // Original FAQ structure
  extendedFaq: ExtendedFaqData; // New extended FAQ structure
  submitting: boolean;
  submitError?: string;
  submitSuccess?: boolean;
}

const initialExtendedFaq: ExtendedFaqData = {
  conveniosPlanos: "",
  conveniosInclusos: "",
  espacoKids: "",
  menoresIdade: "",
  estacionamento: "",
  objetosPerdidos: "",
  cancelamentoProcesso: "",
  planosDiarias: "",
  planosAquaticos: "",
  personalTrainer: "",
  modalidadesExtras: "",
  gradeDescricao: "",
  politicaAcompanhante: "",
  agendamentoApp: "",
  equipamentosLista: "",
  formasPagamento: "",
  chavePix: "",
  parcelamento: "",
  confirmacaoPix: "",
  perguntasEspecificas: "",
};

const initialState: OnboardingState = {
  company: {
    nomeEmpresa: "",
    cnpj: "",
    emailContato: "",
    emailNotaFiscal: "",
    telefone: "",
    responsavelGeral: "",
  },
  responsavelFinanceiro: { nome: "", email: "", telefone: "" },
  responsavelOperacao: { nome: "", email: "", telefone: "" },
  contratoAceito: false,
  integracaoTipo: "",
  outroSistema: "",
  evo: { token: "", linkSistema: "", loginUsuarioJai: "", senhaUsuarioJai: "" },
  contracts: { contratosEvo: ["", "", "", "", ""] },
  whatsapp: {},
  robot: { nome: "", caracteristicas: [], personalidade: [], tons: [] },
  faq: [
    {
      categoria: "Convênios",
      perguntaGuia: "Quais planos aceita?",
      resposta: "",
    },
    {
      categoria: "Infraestrutura",
      perguntaGuia: "Como é o acesso?",
      resposta: "",
    },
    {
      categoria: "Cobrança",
      perguntaGuia: "Como funciona a cobrança?",
      resposta: "",
    },
  ],
  extendedFaq: initialExtendedFaq,
  submitting: false,
};

const API_ENDPOINT = "https://17ef66a494f3.ngrok-free.app/";

export const submitOnboarding = createAsyncThunk(
  "onboarding/submit",
  async (payload: OnboardingState, { rejectWithValue }) => {
    try {
      // Log do JSON formatado
      console.log("📋 JSON DO ONBOARDING:");
      console.log(JSON.stringify(payload, null, 2));

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Falha ao enviar dados");
      }

      return await res.json();
    } catch (error) {
      console.error("💥 Erro:", error);
      return rejectWithValue("Erro de rede");
    }
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Partial<CompanyInfo>>) => {
      state.company = { ...state.company, ...action.payload };
    },
    setFinanceiro: (state, action: PayloadAction<Partial<PersonInfo>>) => {
      state.responsavelFinanceiro = {
        ...state.responsavelFinanceiro,
        ...action.payload,
      };
    },
    setOperacao: (state, action: PayloadAction<Partial<PersonInfo>>) => {
      state.responsavelOperacao = {
        ...state.responsavelOperacao,
        ...action.payload,
      };
    },
    setContratoAceito: (state, action: PayloadAction<boolean>) => {
      state.contratoAceito = action.payload;
    },
    setIntegracaoTipo: (state, action: PayloadAction<IntegrationType>) => {
      state.integracaoTipo = action.payload;
    },
    setOutroSistema: (state, action: PayloadAction<string>) => {
      state.outroSistema = action.payload;
    },
    setEvo: (state, action: PayloadAction<Partial<EvoInfo>>) => {
      state.evo = { ...state.evo, ...action.payload };
    },
    setContracts: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      const { index, value } = action.payload;
      if (index >= 0 && index < state.contracts.contratosEvo.length) {
        state.contracts.contratosEvo[index] = value;
      }
    },
    // WhatsApp actions - generic and specific
    setWhatsapp: (state, action: PayloadAction<Partial<WhatsappConfig>>) => {
      state.whatsapp = { ...state.whatsapp, ...action.payload };
    },
    setWhatsappNumero: (state, action: PayloadAction<string>) => {
      state.whatsapp.numero = action.payload;
    },
    setWhatsappDataPreferida: (state, action: PayloadAction<string>) => {
      state.whatsapp.dataPreferida = action.payload;
    },
    setWhatsappHorarioPreferido: (state, action: PayloadAction<string>) => {
      state.whatsapp.horarioPreferido = action.payload;
    },
    setWhatsappObservacoes: (state, action: PayloadAction<string>) => {
      state.whatsapp.observacoes = action.payload;
    },
    setRobot: (state, action: PayloadAction<Partial<RobotConfig>>) => {
      state.robot = { ...state.robot, ...action.payload };
    },
    toggleRobotArrayField: (
      state,
      action: PayloadAction<{
        field: "caracteristicas" | "personalidade" | "tons";
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      const arr = state.robot[field];

      console.log(`Antes da alteração - Campo ${field}:`, [...arr]);

      if (field === "tons") {
        // Para tons - seleção única
        state.robot[field] = arr.includes(value) ? [] : [value];
        console.log(`Tons alterado para:`, [...state.robot.tons]);
      } else {
        // Para características e personalidade - múltipla seleção
        const exists = arr.includes(value);
        state.robot[field] = exists
          ? arr.filter((v) => v !== value)
          : [...arr, value];

        console.log(`${field} alterado para:`, [...state.robot[field]]);
      }

      console.log("Estado completo do robô:", {
        nome: state.robot.nome,
        caracteristicas: [...state.robot.caracteristicas],
        personalidade: [...state.robot.personalidade],
        tons: [...state.robot.tons],
      });
    },

    // New extended FAQ setter - this is what your component is using
    setFaqResposta: (
      state,
      action: PayloadAction<{ key: keyof ExtendedFaqData; resposta: string }>
    ) => {
      const { key, resposta } = action.payload;
      state.extendedFaq[key] = resposta;
    },
    // Individual setters for each FAQ field (for better type safety)
    setConveniosPlanos: (state, action: PayloadAction<string>) => {
      state.extendedFaq.conveniosPlanos = action.payload;
    },
    setConveniosInclusos: (state, action: PayloadAction<string>) => {
      state.extendedFaq.conveniosInclusos = action.payload;
    },
    setEspacoKids: (state, action: PayloadAction<string>) => {
      state.extendedFaq.espacoKids = action.payload;
    },
    setMenoresIdade: (state, action: PayloadAction<string>) => {
      state.extendedFaq.menoresIdade = action.payload;
    },
    setEstacionamento: (state, action: PayloadAction<string>) => {
      state.extendedFaq.estacionamento = action.payload;
    },
    setObjetosPerdidos: (state, action: PayloadAction<string>) => {
      state.extendedFaq.objetosPerdidos = action.payload;
    },
    setCancelamentoProcesso: (state, action: PayloadAction<string>) => {
      state.extendedFaq.cancelamentoProcesso = action.payload;
    },
    setPlanosDiarias: (state, action: PayloadAction<string>) => {
      state.extendedFaq.planosDiarias = action.payload;
    },
    setPlanosAquaticos: (state, action: PayloadAction<string>) => {
      state.extendedFaq.planosAquaticos = action.payload;
    },
    setPersonalTrainer: (state, action: PayloadAction<string>) => {
      state.extendedFaq.personalTrainer = action.payload;
    },
    setModalidadesExtras: (state, action: PayloadAction<string>) => {
      state.extendedFaq.modalidadesExtras = action.payload;
    },
    setGradeDescricao: (state, action: PayloadAction<string>) => {
      state.extendedFaq.gradeDescricao = action.payload;
    },
    setPoliticaAcompanhante: (state, action: PayloadAction<string>) => {
      state.extendedFaq.politicaAcompanhante = action.payload;
    },
    setAgendamentoApp: (state, action: PayloadAction<string>) => {
      state.extendedFaq.agendamentoApp = action.payload;
    },
    setEquipamentosLista: (state, action: PayloadAction<string>) => {
      state.extendedFaq.equipamentosLista = action.payload;
    },
    setFormasPagamento: (state, action: PayloadAction<string>) => {
      state.extendedFaq.formasPagamento = action.payload;
    },
    setChavePix: (state, action: PayloadAction<string>) => {
      state.extendedFaq.chavePix = action.payload;
    },
    setParcelamento: (state, action: PayloadAction<string>) => {
      state.extendedFaq.parcelamento = action.payload;
    },
    setConfirmacaoPix: (state, action: PayloadAction<string>) => {
      state.extendedFaq.confirmacaoPix = action.payload;
    },
    setPerguntasEspecificas: (state, action: PayloadAction<string>) => {
      state.extendedFaq.perguntasEspecificas = action.payload;
    },
    // Bulk update for extended FAQ
    updateExtendedFaq: (
      state,
      action: PayloadAction<Partial<ExtendedFaqData>>
    ) => {
      state.extendedFaq = { ...state.extendedFaq, ...action.payload };
    },
    resetOnboarding: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboarding.pending, (state) => {
        state.submitting = true;
        state.submitError = undefined;
        state.submitSuccess = undefined;
      })
      .addCase(submitOnboarding.fulfilled, (state) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.submitting = false;
        state.submitError =
          typeof action.payload === "string"
            ? action.payload
            : "Erro ao enviar dados";
      });
  },
});

export const {
  setCompany,
  setFinanceiro,
  setOperacao,
  setContratoAceito,
  setIntegracaoTipo,
  setOutroSistema,
  setEvo,
  setContracts,
  setWhatsapp,
  setWhatsappNumero,
  setWhatsappDataPreferida,
  setWhatsappHorarioPreferido,
  setWhatsappObservacoes,
  setRobot,
  toggleRobotArrayField,
  setFaqResposta,
  setConveniosPlanos,
  setConveniosInclusos,
  setEspacoKids,
  setMenoresIdade,
  setEstacionamento,
  setObjetosPerdidos,
  setCancelamentoProcesso,
  setPlanosDiarias,
  setPlanosAquaticos,
  setPersonalTrainer,
  setModalidadesExtras,
  setGradeDescricao,
  setPoliticaAcompanhante,
  setAgendamentoApp,
  setEquipamentosLista,
  setFormasPagamento,
  setChavePix,
  setParcelamento,
  setConfirmacaoPix,
  setPerguntasEspecificas,
  updateExtendedFaq,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
