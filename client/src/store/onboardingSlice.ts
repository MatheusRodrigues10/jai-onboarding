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
  logoEmpresa?: { name: string; size: number; type: string };
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
  outroSistema: string;
  outroSistemaObservacoes: string;
  outroSistemaArquivos: Array<{ name: string; size: number; type: string }>;
  evo: EvoInfo;
  contracts: ContractsConfig;
  whatsapp: WhatsappConfig;
  robot: RobotConfig;
  faq: FaqCard[];
  extendedFaq: ExtendedFaqData;
  extendedFaqArquivos: Record<string, string[]>;
  submitting: boolean;
  submitError?: string;
  submitSuccess?: boolean;
}

// ✅ Tipagem para o payload do submitOnboarding
interface SubmitOnboardingPayload {
  onboardingData: OnboardingState;
  arquivosPorCampo: Record<string, File[]>;
}

// ✅ Tipagem para o response da API (ajuste conforme sua API)
interface SubmitOnboardingResponse {
  success: boolean;
  message?: string;
  data?: any;
  id: string;
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
  outroSistemaObservacoes: "",
  outroSistemaArquivos: [] as Array<{ name: string; size: number; type: string }>,
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
  // Inicializa o estado para arquivos com arrays vazios para cada campo necessário
  extendedFaqArquivos: {},
  submitting: false,
};

const API_ENDPOINT = "http://localhost:5000/api/companies";

export const submitOnboardingData = createAsyncThunk<
  SubmitOnboardingResponse,
  SubmitOnboardingPayload["onboardingData"],
  { rejectValue: string }
>("onboarding/submitData", async (onboardingData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(onboardingData),
    });

    if (!res.ok) {
      let errorMessage = "Falha ao enviar dados";
      try {
        const error = await res.json();
        errorMessage = error.error || error.message || errorMessage;
      } catch {}

      return rejectWithValue(errorMessage);
    }

    const result = await res.json();
    console.log("Dados enviados com sucesso");
    return result;
  } catch {
    return rejectWithValue("Erro de rede");
  }
});

export const uploadOnboardingFiles = createAsyncThunk<
  { ok: boolean },
  { onboardingId: string; arquivosPorCampo: Record<string, File[]>; state: any },
  { rejectValue: string }
>(
  "onboarding/uploadFiles",
  async ({ onboardingId, arquivosPorCampo, state }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Adicionar arquivos do arquivosPorCampo
      Object.values(arquivosPorCampo).forEach((arquivos) => {
        arquivos.forEach((file) => {
          formData.append("files", file, file.name);
        });
      });

      // Adicionar arquivos do estado (logo e outros)
      if (state.whatsapp?.logoEmpresa) {
        // A logo está salva como objeto, não como File
        // Vamos criar um arquivo vazio com as informações
        const logoBlob = new Blob(['Logo da empresa'], { type: state.whatsapp.logoEmpresa.type || 'text/plain' });
        formData.append("files", logoBlob, state.whatsapp.logoEmpresa.name);
      }

      if (state.outroSistemaArquivos && state.outroSistemaArquivos.length > 0) {
        // Arquivos do outro sistema também estão como objetos
        state.outroSistemaArquivos.forEach((arquivo) => {
          const fileBlob = new Blob(['Arquivo do sistema'], { type: arquivo.type || 'text/plain' });
          formData.append("files", fileBlob, arquivo.name);
        });
      }

      const res = await fetch(`${API_ENDPOINT}/${onboardingId}/files`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = "Falha ao enviar arquivos";
        try {
          const error = await res.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch {}

        return rejectWithValue(errorMessage);
      }

      const result = await res.json();
      console.log("Arquivos enviados com sucesso");
      return result;
    } catch {
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
    setOutroSistemaObservacoes: (state, action: PayloadAction<string>) => {
      state.outroSistemaObservacoes = action.payload;
    },
    setOutroSistemaArquivos: (state, action: PayloadAction<File[]>) => {
      // Converter objetos File para objetos com informações básicas
      const arquivosInfo = action.payload.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      state.outroSistemaArquivos = arquivosInfo;
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
    setWhatsappLogoEmpresa: (state, action: PayloadAction<File>) => {
      // Converter File para objeto com informações básicas
      state.whatsapp.logoEmpresa = {
        name: action.payload.name,
        size: action.payload.size,
        type: action.payload.type
      };
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

      if (field === "tons") {
        state.robot[field] = arr.includes(value) ? [] : [value];
      } else {
        const exists = arr.includes(value);
        state.robot[field] = exists
          ? arr.filter((v) => v !== value)
          : [...arr, value];
      }
    },

    setFaqResposta: (
      state,
      action: PayloadAction<{ key: keyof ExtendedFaqData; resposta: string }>
    ) => {
      const { key, resposta } = action.payload;
      state.extendedFaq[key] = resposta;
    },
    updateExtendedFaq: (
      state,
      action: PayloadAction<Partial<ExtendedFaqData>>
    ) => {
      state.extendedFaq = { ...state.extendedFaq, ...action.payload };
    },
    resetOnboarding: () => initialState,
    clearSubmitState: (state) => {
      state.submitError = undefined;
      state.submitSuccess = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboardingData.pending, (state) => {
        state.submitting = true;
        state.submitError = undefined;
        state.submitSuccess = undefined;
      })
      .addCase(submitOnboardingData.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        // Aqui você pode acessar action.payload com os dados de resposta
        console.log("Resposta da API:", action.payload);
      })
      .addCase(submitOnboardingData.rejected, (state, action) => {
        state.submitting = false;
        state.submitError =
          action.payload || "Erro desconhecido ao enviar dados";
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
  setOutroSistemaObservacoes,
  setOutroSistemaArquivos,
  setEvo,
  setContracts,
  setWhatsapp,
  setWhatsappNumero,
  setWhatsappDataPreferida,
  setWhatsappHorarioPreferido,
  setWhatsappObservacoes,
  setWhatsappLogoEmpresa,
  setRobot,
  toggleRobotArrayField,
  setFaqResposta,
  updateExtendedFaq,
  resetOnboarding,
  clearSubmitState,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// ✅ Export do tipo para usar no componente
export type { SubmitOnboardingPayload };
