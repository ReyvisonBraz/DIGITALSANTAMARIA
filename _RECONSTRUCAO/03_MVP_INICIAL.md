# MVP Inicial

Decisao registrada: 2026-05-22

## Modulos que entram na primeira versao

### 1. Home

Finalidade inicial:

- Ser um portal publico da cidade.
- Receber qualquer visitante, mesmo sem login.
- Mostrar os caminhos principais do site.
- Dar acesso rapido a ouvidoria/relatar, consulta de protocolo, peticoes e servicos essenciais.
- Ter um botao forte para o Painel do Cidadao.

Decisao:

- A Home sera principalmente um portal publico.
- O Painel do Cidadao sera uma area separada/logada, acessada por um botao de destaque.

Perguntas pendentes:

- Qual texto principal deve abrir a Home?
- Quais acoes aparecem primeiro?
- O visitante sem login pode abrir solicitacao ou apenas consultar/navegar?

### Painel do Cidadao

Finalidade inicial:

- Ser a area logada do usuario.
- Mostrar perfil, protocolos, historico e atalhos personalizados.
- Concentrar a experiencia pessoal do cidadao.

Entrada:

- Botao em destaque na Home.
- Link no menu superior.

Perguntas pendentes:

- O painel sera a rota `/perfil` ou uma nova rota `/painel`?
- Quais dados aparecem no primeiro MVP?

### 2. Login Google

Finalidade inicial:

- Identificar o cidadao.
- Criar/sincronizar perfil no Firestore.
- Permitir acesso a perfil, protocolos e acoes autenticadas.

Perguntas pendentes:

- O login sera obrigatorio para abrir solicitacao?
- Sera permitido protocolo anonimo?
- Admin/atendente tambem entra por Google?

### 3. Perfil do cidadao

Finalidade inicial:

- Mostrar dados basicos do usuario.
- Mostrar historico de solicitacoes/protocolos.
- Mostrar peticoes assinadas ou criadas, se viavel.

Perguntas pendentes:

- Quais campos o usuario pode editar?
- CPF/telefone/bairro entram agora ou depois?
- Perfil precisa ter upload de avatar ou usa foto do Google?

### 4. Ouvidoria/Relatar com protocolo

Finalidade inicial:

- Ser o fluxo principal para o cidadao enviar uma solicitacao.
- Gerar protocolo.
- Permitir consulta de andamento.

Decisao pendente importante:

- `ouvidoria` e `relatar` serao dois fluxos separados ou um unico fluxo?

Hipotese inicial:

- `relatar` pode ser focado em problema urbano com foto/localizacao.
- `ouvidoria` pode ser focada em manifestacao, pedido, denuncia, elogio ou reclamacao.
- Para o MVP, podemos unificar por baixo em uma mesma colecao ou escolher apenas um fluxo principal.

Perguntas pendentes:

- O cidadao precisa estar logado para enviar?
- A solicitacao pode ser anonima?
- Quais categorias entram primeiro?
- Foto e localizacao sao obrigatorias ou opcionais?

### 5. Gestao/admin

Finalidade inicial:

- Permitir que atendente/admin veja solicitacoes reais.
- Alterar status.
- Enviar resposta oficial.

Perguntas pendentes:

- Quem pode acessar?
- Quais status existem?
- Precisa separar admin de atendente?
- Resposta oficial aparece para o cidadao no perfil/consulta?

### 6. Peticoes

Finalidade inicial:

- Listar peticoes ativas.
- Criar peticao, se permitido.
- Assinar uma vez por usuario.
- Mostrar progresso.

Perguntas pendentes:

- Todo cidadao pode criar peticao?
- Precisa aprovacao da prefeitura antes de publicar?
- Assinatura exige login?
- Qual meta padrao de assinaturas?

## Modulos fora do MVP inicial

Estes modulos continuam no projeto, mas nao serao prioridade ate a base funcionar:

- Saude.
- Educacao.
- Empregos.
- Tributos.
- Obras.
- Eventos.
- Comercio.
- Comunidade.
- Social.
- Meio ambiente.
- Seguranca.
- Transito.
- Votos.
- Avisos.
- Servicos.

## Ordem pratica de trabalho

1. Validar que o projeto compila/roda.
2. Corrigir base de configuracao se necessario.
3. Revisar menu para destacar apenas o MVP.
4. Revisar Home para apontar para os fluxos essenciais.
5. Validar Auth e criacao de usuario.
6. Definir modelo unico de solicitacao/protocolo.
7. Implementar consulta/historico.
8. Implementar gestao/admin.
9. Fechar peticoes.

## Proxima conversa

Comecar pela finalidade da Home.

Pergunta:

A Home deve ser principalmente um portal publico da cidade ou um painel personalizado do cidadao logado?
