# Planejamento Detalhado: 03. Infraestrutura e Obras (Zeladoria Urbana)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Obras do Civic Guardian.

## 1. Painel de Transparência de Obras

### 1.1. Componente: Resumo de Investimento (Header)
- **Descrição**: Faixa de alto impacto com o montante total investido e número de obras ativas.
- **KPIs**:
    - **Total Investido**: Soma do campo `investment` de todas as obras na coleção `/public_works`.
    - **Metas de Entrega**: "3 obras entregues este mês".
- **Funcionamento**: 
    - Agregação (via Cloud Functions ou query simples dependendo do volume) dos valores financeiros.

### 1.2. Componente: Lista de Obras (Cards de Impacto)
- **Sub-Componente: `WorkCard`**:
    - **Visual**: Imagem real da obra (Importante para transparência).
    - **Barra de Progresso**: `progress` (%) sincronizado com o diário de obras do engenheiro.
    - **Timeline**: Datas de Início, Previsão e Entrega Real.
- **Funcionamento**:
    - Cada obra tem um ID único que serve para o rastreio.

---

## 2. Fiscalização Cidadã (O Relato Direto)

### 2.1. Componente: Botão "Fiscalizar esta Obra"
- **Descrição**: Botão de ação rápida dentro do card da obra.
- **Fluxo**:
    1. Abre modal de câmera.
    2. Usuário tira foto da situação.
    3. Seleciona tag: "Atraso", "Irregularidade", "Elogio".
    4. Envia comentário.
- **Funcionamento**: 
    - Cria um documento em `/work_inspections` vinculado ao `workId`.
    - Gera notificação imediata para a secretaria responsável.

---

## 3. Memorial Descritivo Digital

### 3.1. Componente: Drawer de Detalhes
- **Conteúdo**:
    - **Ficha Técnica**: Empresa contratada, CNPJ, valor exato da licitação.
    - **Descrição Técnica**: Linguagem simples explicando o que está sendo feito (ex: "Troca de tubulação de 400mm por 800mm").
    - **Arquivos**: Link para o PDF oficial do contrato no Portal da Transparência.

---

## 4. Integração com Zeladoria de Rua

### 4.1. Componente: Mapa de Buracos e Iluminação
- **Descrição**: Mapa interativo (Google Maps) mostrando pontos reportados via "Relatar".
- **Interação**: Usuário pode "votar" em um problema existente para aumentar a prioridade.

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/public_works/{id}` (Somente leitura para cidadão).
- **Caminho**: `/work_inspections/{id}` (Criação permitida para usuários logados).
- **Validação**: `incoming().photoUrl != null` (Exige evidência visual para fiscalização).
