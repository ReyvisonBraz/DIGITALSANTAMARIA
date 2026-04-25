# Planejamento Detalhado: 07. Comércio e Apoio ao MEI (Zeladoria Econômica Local)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Comércio do Civic Guardian.

## 1. Vitrine de Negócios Locais

### 1.1. Componente: Feed de Promoções (Vouchers Digitais)
- **Descrição**: Espaço para lojistas cadastrados oferecerem descontos exclusivos para usuários do app (quem mora na cidade).
- **Funcionamento**: 
    - Lojista cria uma campanha na `/commercial_campaigns`.
    - Usuário gera o voucher (QR Code) e apresenta na loja física.
    - O lojista "valida" o QR Code para ganhar créditos de visibilidade no app.

### 1.2. Componente: Guia de Serviços (Marketplace sem transação)
- **Descrição**: Catálogo de prestadores (Pedreiros, Eletricistas, Manicures).
- **Destaque**: Filtro por "Verificados pela Prefeitura" (que possuem alvará ativo).

---

## 2. Aceleração MEI & Empresas

### 2.1. Componente: Solicitação de Alvará Digital
- **Fluxo**:
    1. Usuário preenche CNAE e endereço.
    2. Envia fotos da fachada.
    3. Recebe o "Alvará Provisório" na hora se a atividade for de baixo risco.
- **Funcionamento**: 
    - Integração com a Receita Municipal e Vigilância Sanitária.

### 2.2. Componente: Painel do Emprendedor (KPIs do Negócio)
- **Descrição**: Para o dono da loja, um dashboard mostrando quantas pessoas viram sua vitrine no Civic Guardian.

---

## 3. Gestão de Feiras e Ambulantes

### 3.1. Componente: Agendamento de Espaço em Feiras
- **Fluxo**:
    1. Mapa das feiras livres da semana.
    2. Seleção de banca/espaço disponível.
    3. Pagamento da taxa diária via PIX.
- **Visual**: Grid de slots (A1, A2, B1...).

---

## 4. Regras de Segurança (Firestore)
- **Caminho**: `/business_profiles/{id}`
- **Regra**: `read`: Pública. `write`: Apenas o `ownerId` ou Admin.
- **Validação**: `incoming().cnpj != null` para perfis empresariais verificados.
