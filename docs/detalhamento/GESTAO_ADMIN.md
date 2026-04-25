# 🛡️ Painel de Gestão (Admin): Detalhamento Técnico

O painel exclusivo para gestores autorizados.

---

## 1. Tela de Controle (`/gestao`)

### Card de Resumo (KPIs)
- **Total Pendente**: Número grande com badge de variação % em relação à semana passada.
- **Tempo Médio de Resposta**: Relógio com cores (Verde < 48h, Amarelo 48-72h, Vermelho > 72h).

### Tabela de Demandas (`IssueTable`)
- **Linha Selecionável**: Clique abre o `DecisionDrawer`.
- **Coluna Prioridade**: Tag colorida baseada em análise de sentimentos do texto.
- **Coluna Ações**: Botão de "Resposta Rápida" e "Encaminhar Secretaria".

---

## 2. Gaveta de Decisão (`DecisionDrawer`)

### Seção: Evidências
- Grid de miniaturas das fotos enviadas pelo cidadão. Clique abre galeria em tela cheia.

### Seção: Resposta do Gestor
- **Dropdown: Resposta Padrão**: Modelos pré-prontos (ex: "Enviado para licitação", "Equipe a caminho").
- **Campo: Resposta Personalizada**: Rich text.
- **Upload de Comprovação**: O gestor deve anexar uma foto (opcional) provando a resolução (ex: foto do asfalto novo).

### Botão: Finalizar Protocolo
- **Ação**:
  1. Muda status para `RESOLVIDO`.
  2. Adiciona log de auditoria (Quem respondeu e quando).
  3. Dispara notificação push para o cidadão.

---

## 3. Gestão de Petições Administrativa
- **Botão: Validar Causa**: Analisa se a petição não é ofensiva ou fora da alçada municipal.
- **Botão: Responder Oficialmente**: Botão Ativado apenas quando a meta é batida. Abre canal direto de resposta da prefeitura para todos os assinantes.
