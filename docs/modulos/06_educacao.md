# Educacao — `/educacao` e `/educacao/matricula`

Escolas municipais e matricula escolar.

**Dados:** Firestore real (`education_schools`, `enrollments`)
**Service:** `educacao.service.ts`

## Paginas

### Listagem de escolas (`/educacao`)
- Lista escolas (`education_schools`)
- Fallback: 3 escolas hardcoded se colecao vazia
- Dashboard com dados do aluno (mock: notas, frequencia)

### Matricula (`/educacao/matricula`)
Formulario multi-etapa (5 passos):
1. Dados do responsavel (nome, CPF)
2. Dados do aluno (nome, data nascimento)
3. Endereco (CEP, logradouro)
4. Preferencia de escola
5. Revisao e confirmacao

## Funcionalidades

- **Matricula** — `createEnrollment()` grava em `enrollments` com protocolo MAT-...
- **Validacao** — CPF validado via `validateCPF()`
- **Admin** — `EnrollmentsAdmin` gerencia fila de matriculas (aprovar/rejeitar/lista de espera)
- **Notificacao** — cidadao recebe notificacao ao ter matricula aprovada/rejeitada

## Colecoes

| Colecao | Proposito |
|---|---|
| `education_schools` | Escolas (name, type, address, phone, grades) |
| `enrollments` | Matriculas (userId, parentName, studentName, schoolPreference, status, protocol) |

## Pontos de melhoria

- Dashboard do aluno (notas, frequencia) ainda e mock
- Lista de escolas no form de matricula e hardcoded (5 escolas)
