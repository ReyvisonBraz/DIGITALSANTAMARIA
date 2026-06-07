# Painel do Cidadao — `/perfil`

Central de acompanhamento do cidadao. Historico, notificacoes, perfil.

**Dados:** Firestore real (multiplas colecoes)
**Features:** `ActivityHistory`, `AvatarUpload`, `EditProfileForm`, `MyBusinessesSection`
**Services:** `users.service`, `reports.service`, `demands.service`, `appointments.service`, `jobs.service`, `educacao.service`, `emergency.service`

---

## Secoes

### Resumo / Metricas
- Pontos de cidadania (do perfil `users/{uid}`)
- Contadores: relatos, demandas, agendamentos, matriculas, candidaturas
- Dados em tempo real via listeners

### Historico de Atividades (`ActivityHistory`)
Feed unificado em tempo real com todas as atividades do cidadao:
- Demandas (com status)
- Relatos (com status)
- Agendamentos
- Alertas de emergencia
- Candidaturas a empregos
- Matriculas escolares

### Meus Negocios (`MyBusinessesSection`)
- Lista negocios cadastrados (listener em tempo real)
- Status visivel: pendente, aprovado, rejeitado
- Botao para cadastrar novo negocio
- Edicao de dados do negocio

### Editar Perfil (`EditProfileForm`)
- Nome de exibicao
- Telefone
- Bairro
- Salva via `updateUserProfile()`

### Avatar (`AvatarUpload`)
- Upload de foto de perfil (max 2MB, JPEG/PNG/WebP)
- Armazenado em `avatars/{uid}/{filename}` no Firebase Storage
- Atualiza `photoURL` no perfil

### Configuracoes (`ProfileSettingsPanel`)
- Acessibilidade: tamanho da fonte, escala, alto contraste
- Links para Sobre, Legal

---

## Listeners em tempo real

| Listener | Escopo |
|---|---|
| `listenToUserDemands` | Demandas do usuario |
| `listenToUserReports` | Relatos do usuario |
| `listenToOwnedBusinesses` | Negocios do usuario |
| `listenToUserNotifications` | Notificacoes (via NotificationsContext) |

---

## Colecoes acessadas

`users`, `demands`, `reports`, `appointments`, `job_applications`, `enrollments`, `emergency_alerts`, `businesses`, `notifications`
