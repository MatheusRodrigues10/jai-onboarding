import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setWhatsapp, setWhatsappLogoEmpresa } from "@/store/onboardingSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, CheckCircle2, Calendar, Image } from "lucide-react";
import { formatPhone } from "@/utils/formatPhone";
import FileAttachment from "@/components/shared/FileAttachment";

const WhatsAppSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.onboarding);
  
  // Estado local para a logo da empresa
  const [logoFile, setLogoFile] = useState<File[]>([]);

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    dispatch(setWhatsapp({ numero: formatted }));
  };

  // Função para lidar com mudanças na logo
  const handleLogoChange = (files: File[]) => {
    setLogoFile(files);
    if (files.length > 0) {
      dispatch(setWhatsappLogoEmpresa(files[0]));
    } else {
      dispatch(setWhatsappLogoEmpresa(undefined as any));
    }
  };

  return (
    <section className="container pb-10">
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
            onChange={(e) => handlePhoneChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="waDataPreferida">Data Preferida</Label>
          <Input
            id="waDataPreferida"
            type="date"
            className="[&::-webkit-calendar-picker-indicator]:invert"
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
        
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-blue-600" />
            <Label htmlFor="logoEmpresa">Logo da Empresa</Label>
          </div>
          <FileAttachment
            label="Anexe a logo da sua empresa (formato: PNG, JPG, SVG - máximo 10MB)"
            files={logoFile}
            onChange={handleLogoChange}
          />
          <p className="text-xs text-muted-foreground mt-2">
            💡 Esta logo será utilizada no WhatsApp corporativo e em outras comunicações da empresa
          </p>
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
  );
};

export default WhatsAppSection;
