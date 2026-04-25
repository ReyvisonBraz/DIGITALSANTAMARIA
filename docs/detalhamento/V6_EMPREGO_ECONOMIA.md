# Planejamento Detalhado: 06. Emprego e Renda (Zeladoria Econômica)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Desenvolvimento Econômico do Civic Guardian.

## 1. Portal Municipal de Vagas (Sine Digital)

### 1.1. Componente: Busca Inteligente de Oportunidades
- **Descrição**: Filtro dinâmico por bairro, regime (CLT/PJ) e nível de experiência.
- **Funcionamento**: 
    - Sincronização em tempo real com a base do Ministério do Trabalho/SINE através da API nacional.
- **Destaque**: "Vagas da Minha Região" utiliza geolocalização para mostrar empresas num raio de 5km.

### 1.2. Componente: Candidatura Instantânea
- **Fluxo**:
    1. O perfil do Civic Guardian já contém o currículo base.
    2. Botão "Candidate-se": Envia os dados e gera um protocolo no SINE.
    3. Status da Candidatura: "Enviado", "Em análise", "Entrevista Marcada".

---

## 2. Hub do Empreendedor & MEI

### 2.1. Componente: Guia do Microempreendedor
- **Recursos**:
    - Emissão de DAS (Documento de Arrecadação do Simples Nacional).
    - Consultoria Online: Chatbot especializado em legislação municipal para pequenos negócios.
- **Funcionamento**: 
    - Link direto para o Portal do Empreendedor Federal.

### 2.2. Componente: Crédito Popular
- **Descrição**: Exibe linhas de crédito subsidiadas pelo município para pequenos negócios.

---

## 3. Escola de Capacitação (Cursos)

### 3.1. Componente: Lista de Cursos Gratuitos
- **Categorias**: Tecnologia, Gastronomia, Estética, Administrativo.
- **Inscrição**: Realizada diretamente no app via CivicID.
- **Status**: Aluno recebe QR Code de acesso à sala de aula no dia do curso.

---

## 4. Feira Virtual (Apoie o Local)

### 4.1. Componente: Vitrine de Produtores Locais
- **Descrição**: Espaço para artesãos e agricultores locais exporem seus produtos e contatos.

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/job_applications/{id}`
- **Regra**: `create`: Se autenticado. `read`: User ou Empresa contratante (`jobOwnerId`).
- **Caminho**: `/available_jobs/{id}` (Leitura pública).
