# Painel do Cidadao - `/perfil`

Central de acompanhamento do cidadao. Reune historico de protocolos, processos, negocios cadastrados e dados de perfil.

**Dados:** Firestore real em multiplas colecoes
**Features:** `ActivityHistory`, `AvatarUpload`, `EditProfileForm`, `MyBusinessesSection`
**Services:** `users.service`, `reports.service`, `demands.service`, `appointments.service`, `jobs.service`, `educacao.service`, `emergency.service`

## Secoes

### Resumo e metricas
- Contadores de solicitacoes, relatos, processos e pontos
- Dados carregados por listeners ou consultas do usuario logado

### Historico de Atividades (`ActivityHistory`)
Feed unificado das atividades do cidadao:
- Solicitacoes da Ouvidoria
- Relatos urbanos
- Agendamentos
- Alertas de emergencia
- Candidaturas a empregos
- Matriculas escolares
- Badge `Nova resposta` quando `conversation.unreadByCitizen` esta ativo
- Abrir a conversa chama `markDemandReadByCitizen()` ou `markReportReadByCitizen()`

### Meus Negocios (`MyBusinessesSection`)
- Lista negocios cadastrados pelo usuario
- Mostra status: aguardando aprovacao, publicado, nao aprovado ou rascunho
- Permite cadastrar novo negocio
- Permite editar dados do negocio do proprio usuario
- Cadastro reprovado pode ser corrigido e reenviado para a fila de aprovacao

### Editar Perfil (`EditProfileForm`)
- Nome de exibicao
- Telefone
- Bairro
- Salva via `updateUserProfile()`

### Avatar (`AvatarUpload`)
- Upload de foto de perfil
- Limite de 2 MB
- Formatos aceitos: JPEG, PNG e WebP
- Armazena em `avatars/{uid}/{filename}`
- Atualiza `photoURL` no perfil

### Configuracoes (`ProfileSettingsPanel`)
- Preferencias visuais
- Links institucionais e legais

## Listeners em tempo real

| Listener | Escopo |
|---|---|
| `listenToUserDemands` | Solicitacoes do usuario |
| `listenToUserReports` | Relatos do usuario |
| `listenToOwnedBusinesses` | Negocios do usuario |
| `listenToUserNotifications` | Notificacoes via `NotificationsContext` |

## Colecoes acessadas

`users`, `demands`, `demand_messages`, `reports`, `report_messages`, `appointments`, `job_applications`, `enrollments`, `emergency_alerts`, `businesses`, `notifications`
