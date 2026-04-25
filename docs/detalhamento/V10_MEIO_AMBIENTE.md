# Planejamento Detalhado: 10. Meio Ambiente (Zeladoria Sustentável)

Este documento detalha o funcionamento, UX e arquitetura técnica do pilar de Meio Ambiente do Civic Guardian.

## 1. Calendário de Coleta Inteligente

### 1.1. Componente: "Quando passa o caminhão?"
- **Descrição**: Localizador de dias de coleta (Orgânica, Reciclável, Cata-Treco) baseado no logradouro.
- **Visual**: Mini-cards semanais com ícones coloridos.
- **Lembrete**: Opção de ativar notificação "O caminhão está chegando" via GPS do veículo.
- **Funcionamento**: 
    - Database `/waste_collection_schedule` indexado por bairro/rua.

---

## 2. Canal de EcoDenúncia

### 2.1. Componente: Reporte de Crimes Ambientais
- **Fluxo**:
    1. Escolha de tipo: "Fogo em terreno", "Descarte irregular de entulho", "Poluição de rio".
    2. Exige Foto + Localização GPS.
    3. Notificação automática para a Secretaria de Meio Ambiente e GCM.
- **Destaque**: Anonimato garantido se o usuário desejar.

---

## 3. Adoção de Verde (Urbanismo Colaborativo)

### 3.1. Componente: Adote uma Árvore / Praça
- **Descrição**: Possibilidade de solicitar o plantio de uma árvore na calçada ou adotar o cuidado de um canteiro.
- **Gamificação**: Placa física (digital e real) com o nome do adotante.
- **Funcionamento**: 
    - Dashboard de "Minhas Adoções".

---

## 4. Monitor de Qualidade Ambiental

### 4.1. Componente: Estação Meteorológica & Qualidade do Ar
- **Descrição**: Dados em tempo real sobre PM2.5, Umidade e Temperatura.
- **Alertas**: "Baixa umidade: evite exercícios ao ar livre entre 11h e 16h".

---

## 5. Regras de Segurança (Firestore)
- **Caminho**: `/eco_reports/{id}`
- **Regra**: `create`: Se autenticado. `read`: User ou Órgão fiscalizador.
- **Caminho**: `/adoptions/{id}` (Leitura pública para transparência).
