# Firestore Rules

Data: 2026-05-23

## Decisao aplicada

Para o MVP:

- Toda solicitacao exige login tecnico.
- Solicitacao anonima tambem exige login, mas salva `authorId` vazio.
- Peticoes sao publicas para leitura.
- Criar peticao exige login.
- Assinar peticao exige login.
- Gestao exige role `admin` ou `clerk`.

## Arquivos alterados

- `firestore.rules`
- `features/ouvidoria/DemandForm.tsx`

## Ajustes principais

### Demands

`demands` agora permite:

- criar se autenticado;
- criar anonima se `isAnonymous == true` e `authorId == ''`;
- criar identificada se `authorId == request.auth.uid`;
- ler se:
  - staff;
  - dono;
  - demanda anonima.

Observacao:

- Consulta publica por protocolo fica viavel para demandas anonimas.
- Demandas identificadas precisam ser consultadas pelo proprio usuario logado ou pela gestao.

### Petitions

`petitions` agora permite:

- leitura publica;
- criacao por usuario logado;
- update por criador/staff;
- incremento de `signaturesCount` por usuario logado durante assinatura.

Isso corrige o fluxo de assinatura, que usa transacao no client e precisa atualizar o contador da peticao.

### Admins

`admins/{uid}` define quem acessa `/gestao`.

Roles aceitas:

- `admin`
- `clerk`

`admin` pode criar/editar/remover outros admins.

## Primeiro admin

O primeiro admin precisa ser criado manualmente no Firebase Console, porque as regras impedem que um usuario comum se promova.

Documento:

```text
admins/{UID_DO_USUARIO}
```

Campos sugeridos:

```json
{
  "role": "admin",
  "displayName": "Nome do admin",
  "email": "email@exemplo.com",
  "grantedAt": "<server timestamp>"
}
```

Depois disso, esse usuario podera acessar `/gestao`.

## Validacao

`npm.cmd run build` passou com sucesso.

Ainda pendente:

- Testar login, criacao de solicitacao, consulta, gestao e assinatura de peticao no Firebase real.
