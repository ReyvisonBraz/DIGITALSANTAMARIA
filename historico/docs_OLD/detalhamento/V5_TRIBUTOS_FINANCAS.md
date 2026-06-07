# Planejamento Detalhado: 05. Tributos e Finanças (Zeladoria Fiscal)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Tributos do Civic Guardian.

## 1. Central do Contribuinte (Dashboard)

### 1.1. Componente: Status de Regularidade (KPIs)
- **Descrição**: Exibe se o cidadão possui débitos ativos ou se está "Em Dia".
- **Visual**: Badge grande centralizado. Verde (Regular), Vermelho (Débitos Pendentes).
- **Funcionamento**: 
    - Query na coleção `/user_taxes` buscando documentos com `status: "pending"`.

### 1.2. Componente: Lista de Impostos (Cards de Pagamento)
- **Sub-Componente: `TaxCard`**:
    - **Visual**: Estilo de boleto bancário simplificado.
    - **Botão "PIX QR Code"**: Gera cobrança imediata via integração de pagamento.
    - **Botão "PDF"**: Link para a guia oficial.
- **Funcionamento**: 
    - Integração com o sistema arrecadador municipal.

---

## 2. Emissão de Certidões (Auto-Serviço)

### 2.1. Componente: Emissor de CND (Certidão Negativa de Débitos)
- **Descrição**: Botão de um clique para gerar a CND.
- **Validação**: O sistema verifica em tempo real se há pendências. Se não, gera PDF assinado digitalmente com QR Code de autenticação.
- **Funcionamento**: 
    - Gera um registro em `/public_documents` com hash de integridade.

---

## 3. Gestão de Alvarás (Para Empresas)

### 3.1. Componente: Portal do Empreendedor
- **Fluxo**:
    1. Upload de documentos (Bombeiros, Sanitário).
    2. Acompanhamento de status da análise técnica (Timeline).
- **Notificação**: Alerta quando o alvará for emitido ou se houver pendência documental.

---

## 4. Transparência: "Para onde vai meu imposto?"

### 4.1. Componente: Gráfico de Destinação
- **Descrição**: Gráfico de pizza simples mostrando a porcentagem do IPTU que vai para Saúde, Educação, Obras, etc.
- **Visual**: Interativo (D3.js ou Recharts).

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/user_taxes/{id}`
- **Regra**: `read`: apenas se `resource.data.userId == request.auth.uid`.
- **Regra**: `write`: Apenas sistema (admin) pode atualizar status de pagamento.
- **Caminho**: `/public_documents/{id}` (Consulta pública via ID de autenticação).
