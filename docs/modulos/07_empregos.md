# Empregos — `/empregos`

Banco de talentos municipal. Vagas de emprego e candidaturas.

**Dados:** Firestore real (`jobs`, `job_applications`)
**Features:** `ApplicationModal`
**Service:** `jobs.service.ts`

## Funcionalidades

- **Listagem de vagas** — `getActiveJobs()` filtra `status == 'published'`
- **Filtros** — por tipo (CLT, PJ, temporario, estagio, voluntario)
- **Candidatura** — `ApplicationModal` com carta de apresentacao opcional
- **Anti-duplicata** — `hasUserApplied()` verifica se ja candidatou
- **Login prompt** — se nao autenticado, sugere login antes de candidatar
- **Admin** — `JobsAdmin` gerencia vagas; `ApplicationsAdmin` gerencia candidaturas

## Colecoes

| Colecao | Proposito |
|---|---|
| `jobs` | Vagas (employerId, title, description, type, requirements, benefits, salary) |
| `job_applications` | Candidaturas (jobId, applicantId, coverLetter, status) |
