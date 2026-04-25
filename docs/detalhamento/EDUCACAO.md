# 🎓 Educação: Detalhamento de UI/UX

Focado na jornada dos pais e responsáveis.

---

## 1. Portal do Responsável (`/educacao`)

### Card: Aluno em Destaque
- Foto do dependente.
- Badge: `Frequência: 98%`.
- Botão: `Acessar Boletim`.

### Botão: Matrícula e Transferência
- **Ação**: Abre o `EnrollmentWizard`.

---

## 2. EnrollmentWizard (Fluxo de Matrícula)

### Passo 1: Cadastro do Aluno
- Campos de Certidão de Nascimento, CPF e Nome completo.

### Passo 2: Localização e Preferência
- Mostra mapa com escolas num raio de 2km do endereço cadastrado.
- O usuário seleciona 3 opções de preferência.

### Passo 3: Upload de Documentos
- Comprovante de residência, Carteira de vacinação e Histórico.

---

## 3. Acompanhamento Diário

### Componente: Cardápio do Dia
- Visual: Ícones de alimentos.
- Informação Nutricional: Calorias e alérgenos (ex: "Contém Glúten").

### Componente: Rota do Escolar
- Botão: `Localizar Ônibus`.
- Visual: Mini mapa mostrando a posição GPS do veículo em tempo real (simulado).
