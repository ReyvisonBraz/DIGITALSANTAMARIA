# 🎧 Ouvidoria e Protocolos: Detalhamento de UI/UX

Este módulo é o coração da interação fiscal do cidadão.

---

## 1. Tela Inicial (`/ouvidoria`)

### Botão: Manifestar (CTA Primário)
- **Visual**: Cor Primária (Azul), ícone de `Send`.
- **Ação**: Alterna o `viewMode` para o formulário.

### Botão: Consultar Protocolo (CTA Secundário)
- **Visual**: Fundo branco, borda border, ícone de `Search`.
- **Ação**: Alterna o `viewMode` para o campo de busca.

---

## 2. O Formulário de Manifestação (Multi-step)

### Passo 1: Informações Básicas
- **Campo: Tipo de Manifestação (Select)**: Reclamação, Sugestão, Denúncia, etc.
- **Campo: Assunto (Input)**: Autocomplete baseado nas Secretarias cadastradas.
- **Botão: Continuar**: Valida se campos estão preenchidos.

### Passo 2: O Relato
- **Campo: Mensagem (Textarea)**: Mínimo 20 caracteres. Contador de caracteres visível.
- **Botão: Anexar Mídia (Upload)**:
  - **Ação**: Abre seletor de arquivos.
  - **Limite**: 3 arquivos (Imagens/PDF).

### Passo 3: Identificação e Envio
- **Checkbox: Anônimo**:
  - **Lógica**: Se marcado, oculta `authorId` para o clerk (gestor), mas mantém no banco para auditoria interna.
- **Botão: Protocolar**:
  - **Feedback**: Loading spinner seguido de modal de sucesso com o número gerado.

---

## 3. Modal de Sucesso (Protocolo Gerado)
- **Elemento: Número do Protocolo**: Grande, fonte Mono, botão de "Copiar" ao lado.
- **Botão: Baixar Comprovante**: Gera um PDF simples (simulado).
- **Botão: Ir para Meus Chamados**: Redireciona para o perfil.

---

## 4. Visualização do Protocolo (Rastreio)

### Componente: ProtocolTimeline
- **Círculo 1: Recebido**: Verde se status >= PENDENTE.
- **Círculo 2: Em Análise**: Pulsa se status === ANALISE.
- **Círculo 3: Finalizado**: Ícone de Check se status === RESOLVIDO.
- **Card de Resposta**:
  - Exibe o nome do técnico (ou cargo).
  - Exibe a data/hora da resposta.
  - Botão de "Avaliar Resposta" (Estrelas 1-5).
