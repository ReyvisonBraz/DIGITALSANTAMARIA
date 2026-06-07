# Planejamento Detalhado: 12. Democracia Digital (Zeladoria Participativa)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Democracia do Civic Guardian.

## 1. Orçamento Participativo (OP)

### 1.1. Componente: Arena de Votação
- **Descrição**: O cidadão decide onde parte do orçamento municipal será aplicado no seu bairro.
- **Funcionamento**: 
    - Exibe "Projetos em Disputa" (ex: Reforma da Praça X vs Nova Creche Y).
    - Votação autenticada com bloqueio de duplicidade (1 voto por CPF).
- **Visual**: Gráfico de barras em tempo real mostrando a apuração parcial para aumentar o engajamento.

---

## 2. Petições e Iniciativa Popular

### 2.1. Componente: Assinatura Digital de Petições
- **Fluxo**:
    1. Cidadão cria a petição (Título, Meta de Assinaturas, Exposição de Motivos).
    2. Outros cidadãos "assinam" via clique (autenticado).
    3. Ao atingir a meta, o gestor público é notificado obrigatoriamente para responder em 15 dias.
- **Funcionamento**: 
    - Coleção `/petitions`. Lista de UIDs em `signatures`.

---

## 3. Consultas e Audiências Públicas

### 3.1. Componente: Mural de Opinião
- **Descrição**: Espaço para comentar e votar a favor/contra novos projetos de lei municipal antes da votação na câmara.
- **Filtro**: "Residentes Impactados" (ex: se o projeto é sobre um bairro específico, o voto de quem mora lá tem peso 2).

---

## 4. Verificação de Integridade

### 4.1. Componente: Selo de Cidadão Verificado
- **Descrição**: Para votar, o usuário deve ter o perfil validado (Título de Eleitor ou Biometria).

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/petitions/{id}` (Leitura pública).
- **Caminho**: `/votes/{id}` 
- **Regra**: `write`: Apenas uma vez por `request.auth.uid`.
- **Caminho**: `/public_consultations/{id}`
- **Regra**: `allow create`: Se profile possui `isVerified: true`.
