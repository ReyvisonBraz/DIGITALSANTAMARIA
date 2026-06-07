# 📝 Petições e Democracia: Detalhamento de UI/UX

## 1. Vitrine de Petições (`/peticoes`)

### Cards de Petição (`PetitionCard`)
- **Visual**: Foto de fundo (blur/overlay), barra de progresso no rodapé.
- **Badge de Categoria**: Canto superior esquerdo.
- **Info de Urgência**: Se faltam menos de 10% para atingir a meta, o card brilha.

### Botão: Criar Minha Causa
- **Local**: Topo da página ou Menu Flutuante.
- **Ação**: Abre o `CreatePetitionModal`.

---

## 2. CreatePetitionModal (O Fluxo de Criação)

### Etapa 1: Definição
- **Campo: Título**: Máximo 80 caracteres.
- **Campo: Categoria**: Infraestrutura, Saúde, Segurança, etc.
- **Campo: Meta**: Slider ou Input numérico (500 a 100.000 assinaturas).

### Etapa 2: Argumentação
- **Campo: Texto do Manifesto**: Área ampla para texto.
- **Componente de Dicas AI**: Sugere palavras para tornar a causa mais persuasiva.

---

## 3. Página Detalhada (`/peticoes/[id]`)

### Componente: Lista de Apoiadores
- **Lógica**: Scroll infinito mostrando `Nome do usuário + Há quanto tempo assinou`.
- **Privacidade**: Se o usuário não marcou "Mostrar nome em listas públicas", aparece como "Cidadão Identificado".

### Botão: Assinar Manifesto
- **Ação**: Verifica se usuário está logado.
- **Validação**: Verifica se já assinou (bloqueia botão e mostra "Você já apoia esta causa").
- **Botão: Compartilhar no WhatsApp/Redes**: Gera link parametrizado para atrair mais assinaturas.

---

## 4. Votações Municipais (`/votos`)

### O Voto Seguro
- **Janela de Confirmação**: Antes de registrar o voto, abre modal com "Você tem certeza?".
- **Animação**: Medalha de "Participação Cidadã" após o voto.
- **Gráfico de Resultados**: Troca a opção de votar pelo gráfico de barras em tempo real.
