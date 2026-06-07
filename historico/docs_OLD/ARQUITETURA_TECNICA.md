# 🏗️ Arquitetura Técnica e Modelo de Dados

Para garantir que o sistema não perca o contexto e seja "à prova de erros", o banco de dados deve seguir este modelo estrutural.

## 1. Entidades Principais (Firestore)

### Collection: `users`
```json
{
  "uid": "string",
  "displayName": "string",
  "email": "string",
  "role": "citizen | admin | clerk",
  "department": "null | obras | saude | etc",
  "metadata": {
    "cpf_verified": "boolean",
    "neighborhood": "string",
    "points": "number (gamification)"
  }
}
```

### Collection: `demands` (Unifica Ouvidoria e Obras)
```json
{
  "id": "string (OUV-XXX)",
  "authorId": "string (ref: users)",
  "type": "reclamacao | sugestao | denuncia",
  "category": "string",
  "status": "pending | analyzing | solved | rejected",
  "content": {
    "text": "string",
    "mediaUrls": ["string"],
    "location": { "lat": "number", "lng": "number", "address": "string" }
  },
  "adminAction": {
    "clerkId": "string",
    "response": "string",
    "updatedAt": "timestamp"
  }
}
```

### Collection: `petitions`
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "signatures_count": "number",
  "goal": "number",
  "signatures": ["uid1", "uid2"],
  "status": "active | goal_reached | official_reply"
}
```

## 2. Lógica de Validação
- **Petições**: Antes de `signatures.push(uid)`, o sistema verifica se `uid` já existe no array (O(1) com ID de documento caso seja sub-coleção).
- **Gestão**: O middleware de rota verifica se `user.role === 'admin'` ou `clerk`.

## 3. Estratégia de Performance
- **Snaps**: Uso de `onSnapshot` apenas em telas críticas (Ouvidoria ativa).
- **Busca**: Integração com índices compostos para filtrar por Bairro + Status.
