import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  setIntegracaoTipo,
  setEvo,
  setContracts,
  setOutroSistema,
  setOutroSistemaObservacoes,
  setOutroSistemaArquivos,
  IntegrationType,
} from "@/store/onboardingSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon } from "lucide-react";
import CustomInput from "@/components/shared/CustomInput";
import FileAttachment from "@/components/shared/FileAttachment";
import { Textarea } from "@/components/ui/textarea";

const IntegrationSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.onboarding);
  
  // Estado local para os arquivos da seção "outro sistema"
  const [outroSistemaFiles, setOutroSistemaFiles] = useState<File[]>([]);

  const selectIntegration = (t: IntegrationType) =>
    dispatch(setIntegracaoTipo(t));

  // Função para lidar com mudanças nos arquivos
  const handleOutroSistemaFilesChange = (files: File[]) => {
    setOutroSistemaFiles(files);
    dispatch(setOutroSistemaArquivos(files));
  };
  return (
    <section className="container py-6">
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
                <li>Acesse o painel do EVO com um usuário administrador.</li>
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
                onChange={(e) => dispatch(setEvo({ token: e.target.value }))}
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

          <section className="mt-10 py-10">
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
          <div className="p-4 bg-gray-800 rounded-md shadow-inner">
            <CustomInput
              label="Qual sistema você utiliza?"
              value={state.outroSistema || ""}
              onChange={(e) => dispatch(setOutroSistema(e.target.value))}
              placeholder="Ex: Tecnofit, Nexur, GymPass, Excel, Google Sheets, Trello, etc."
              id="outroSistema"
              className="bg-gray-700 border-gray-600"
            />
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
              <span>💡</span> Informe o nome do sistema para avaliarmos a
              possibilidade de integração
            </p>
          </div>

          <div className="p-4 bg-gray-800 rounded-md shadow-inner">
            <Label
              htmlFor="outroSistemaObservacoes"
              className="mb-1 block text-sm font-medium text-gray-200"
            >
              Observações Adicionais
            </Label>
            <Textarea
              id="outroSistemaObservacoes"
              placeholder="Descreva detalhes sobre o sistema, funcionalidades específicas, ou qualquer informação adicional que possa ajudar na avaliação da integração..."
              value={state.outroSistemaObservacoes || ""}
              onChange={(e) => dispatch(setOutroSistemaObservacoes(e.target.value))}
              className="mb-2 bg-gray-700  border border-gray-600 "
              rows={4}
            />
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span>💡</span> Quanto mais detalhes você fornecer, melhor poderemos avaliar a viabilidade da integração
            </p>
          </div>

          <div className="p-4 bg-gray-800 rounded-md shadow-inner">
            <FileAttachment
              label="Anexar Arquivos"
              files={outroSistemaFiles}
              onChange={handleOutroSistemaFilesChange}
            />
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
              <span>💡</span> Anexe manuais, documentações, prints de tela ou qualquer arquivo que possa ajudar na análise do sistema
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-md text-center shadow-sm border border-gray-700">
            <h3 className="text-lg font-bold mb-2 text-gray-100">
              Integração Personalizada
            </h3>
            <p className="text-sm text-gray-300 mb-2 px-4">
              Nossa equipe técnica irá avaliar a possibilidade de integração com
              o sistema. Entraremos em contato para discutir as opções
              disponíveis e os próximos passos.
            </p>
            <div className="p-3 bg-gray-700 rounded-md text-xs text-gray-400 flex items-center gap-2 max-w-xl mx-auto">
              <span>💡</span>
              <p className="m-0">
                Mesmo sem integração direta, o JAI pode funcionar perfeitamente
                utilizando as informações fornecidas no FAQ e configurações
                personalizadas.
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
            <span>💡</span> Esta configuração é ideal para empresas que preferem
            controle total sobre as informações ou que ainda não utilizam
            sistemas de gestão automatizados.
          </p>
        </div>
      )}
    </section>
  );
};

export default IntegrationSection;
