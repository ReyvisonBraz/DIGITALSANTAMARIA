# 💰 Tributos e Finanças: Detalhamento de UI/UX

Privacidade e facilidade de pagamento.

---

## 1. Centro Tributário (`/tributos`)

### Card: Resumo de Débitos
- Valor total pendente consolidado (IPTU + Taxas).
- Botão: `Plano de Parcelamento (REFIS)`.

### Tabela de Histórico
- Lista de guias pagas com link para `Download de Comprovante`.

---

## 2. IPTU Digital

### Componente: Cota Única vs Parcelado
- Toggle para alternar entre as formas de pagamento.
- Visual: Destaque no desconto da cota única.

### Botão: Pagar com Pix
- **Ação**: Abre modal com QR Code e botão `Copiar Código`.
- **Feedback**: "Aguardando confirmação bancária..." que muda para "Pago com Sucesso!" automaticamente após processamento simulado.

---

## 3. Certidão Negativa de Débitos (CND)

### Botão: Emitir CND
- **Processamento**: Sistema verifica se há débitos vinculados ao CPF.
- **Resultado na hora**: PDF formatado com assinatura digital válida.
