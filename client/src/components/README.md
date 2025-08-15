# Estrutura de Componentes

Este diretório contém todos os componentes React organizados por funcionalidade e reutilização.

## 📁 Estrutura de Pastas

### `/admin/` - Componentes específicos do painel administrativo

- **LoginForm.tsx** - Formulário de login do admin
- **Header.tsx** - Cabeçalho do painel administrativo
- **Dashboard.tsx** - Dashboard principal do admin
- **CompanyCard.tsx** - Card de empresa na listagem
- **CompanyDetailsModal.tsx** - Modal de detalhes da empresa
- **DeleteConfirmationModal.tsx** - Modal de confirmação de exclusão
- **FileItem.tsx** - Item de arquivo na listagem

### `/index/` - Componentes específicos da página de onboarding

- **CompanyInfoSection.tsx** - Seção de informações da empresa
- **ContractSection.tsx** - Seção do contrato
- **SideNavigation.tsx** - Navegação lateral fixa
- **IntegrationSection.tsx** - Seção de integração com sistema de gestão
- **WhatsAppSection.tsx** - Seção de configuração do WhatsApp
- **RobotSection.tsx** - Seção de personalização do robô
- **FaqSection.tsx** - Seção do FAQ inteligente
- **FinalSection.tsx** - Seção final de envio

### `/shared/` - Componentes universais reutilizáveis

- **CustomInput.tsx** - Input customizado com estilização
- **InputDisplay.tsx** - Componente para exibir informações

### `/ui/` - Componentes de interface do shadcn/ui

- Componentes base do design system (button, input, etc.)

## 🔄 Como usar

### Importação de componentes específicos:

```tsx
import { LoginForm, Dashboard } from "@/components/admin";
import {
  CompanyInfoSection,
  ContractSection,
  IntegrationSection,
  WhatsAppSection,
  RobotSection,
  FaqSection,
  FinalSection,
  SideNavigation,
} from "@/components/index";
import { CustomInput, InputDisplay } from "@/components/shared";
```

### Importação direta:

```tsx
import LoginForm from "@/components/admin/LoginForm";
import CompanyInfoSection from "@/components/index/CompanyInfoSection";
import CustomInput from "@/components/shared/CustomInput";
```

## 📋 Convenções

1. **Nomenclatura**: PascalCase para componentes, camelCase para arquivos
2. **Tipagem**: Todos os componentes devem ter interfaces TypeScript
3. **Props**: Usar interfaces para definir props dos componentes
4. **Exportação**: Usar export default para componentes principais
5. **Organização**: Agrupar por funcionalidade e reutilização

## 🎯 Componentes Universais vs Específicos

### Universais (`/shared/`)

- Podem ser usados em qualquer parte da aplicação
- Não dependem de contexto específico
- Recebem todas as props necessárias via props

### Específicos (`/admin/`, `/index/`)

- Usados apenas em contextos específicos
- Podem ter dependências de estado global (Redux)
- Podem ter lógica de negócio específica

## 🔧 Manutenção

- Manter componentes pequenos e focados
- Reutilizar componentes universais quando possível
- Documentar props complexas com JSDoc
- Testar componentes isoladamente

## 📊 Estatísticas da Componentização

### Antes da Componentização:

- **Index.tsx**: ~1290 linhas
- **Admin.tsx**: ~1500 linhas

### Após a Componentização:

- **Index.tsx**: ~239 linhas (redução de 81%)
- **Admin.tsx**: ~50 linhas (redução de 97%)
- **Total de componentes criados**: 15 componentes organizados

### Benefícios Alcançados:

- ✅ Código mais modular e reutilizável
- ✅ Manutenibilidade significativamente melhorada
- ✅ Separação clara de responsabilidades
- ✅ Facilidade para testes unitários
- ✅ Melhor organização do código
- ✅ Redução da complexidade dos arquivos principais
