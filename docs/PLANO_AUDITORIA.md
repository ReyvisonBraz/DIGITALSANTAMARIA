# Plano de Auditoria e Correção — 19 Features

> Iniciado em Junho 2026. Cada feature passa por auditoria completa (code review) + correção dos issues críticos.

---

## Progresso

| # | Feature | Auditoria | Blocker/Correções | Status |
|---|---|---|---|---|
| 1 | Ouvidoria | ✅ | B1(protocolo), B2(timeline), M1-M5, M7 | ✅ Concluída |
| 2 | Relatar Problema | ✅ | B1(transaction), B2(timeline), M2-M4, M6-M7 | ✅ Concluída |
| 3 | Petições | ✅ | B1(rules), M1(listener), M2(botão), M3-M5, M7-M8 | ✅ Concluída |
| 4 | Empregos | ✅ | B1(duplicata), B2(maxLength), M2, M3 | ✅ Concluída |
| 5 | Comércio Local | ✅ | M1-M2(isOpen), M3(whatsapp), m7(search) | ✅ Concluída |
| 6 | Eventos | ✅ | [id] getById, sem carregar coleção inteira | ✅ Concluída |
| 7 | Obras | ✅ | [id] getById, sem carregar coleção inteira | ✅ Concluída |
| 8 | Avisos | ✅ | Padrão ContentPage — sem issues | ✅ Concluída |
| 9 | Votos | ✅ | Padrão ContentPage — sem issues | ✅ Concluída |
| 10 | Segurança | ✅ | maxLength + htmlFor no formulário | ✅ Concluída |
| 11 | Trânsito | ✅ | Padrão ContentPage — sem issues | ✅ Concluída |
| 12 | Tributos | ✅ | Padrão ContentPage — sem issues | ✅ Concluída |
| 13 | Social | ✅ | Padrão ContentPage — sem issues | ✅ Concluída |
| 14 | Meio Ambiente | ✅ | Padrão ContentPage — sem issues | ✅ Concluída |
| 15 | Comunidade | ✅ | Padrão ContentPage — sem issues | ✅ Concluída |
| 16 | Serviços | ✅ | Padrão ContentPage — sem issues | ✅ Concluída |
| 17 | Painel do Cidadão | ✅ | ARIA labels, listeners ok | ✅ Concluída |
| 18 | Painel de Gestão | ✅ | Firestore rules ok, code review | ✅ Concluída |
| 19 | Sobre | ✅ | Transparência link real, imagem, alt text | ✅ Concluída |

**4/19 concluídas (21%)**

---

## Issues corrigidos por feature

### 1. Ouvidoria
- `demands.service.ts`: `createDemand` sem protocolo local + `waitForDemandProtocol` com fallback 12s, `listenToDemandMessages`, `updateDemandStatus` com `runTransaction`
- `DemandForm.tsx`: listener de protocolo + `authorName` + re-submit pós-login + `maxLength`
- `DemandTimeline.tsx`: listener em tempo real + auto-scroll + `aria-live` + bloqueio em fechadas + dedup fix

### 2. Relatar Problema
- `reports.service.ts`: `updateReportStatus` com `runTransaction`, `listenToReportMessages`
- `ReportTimeline.tsx`: listener em tempo real + auto-scroll + `aria-live`
- `PhotoUpload.tsx`: `useEffect` cleanup `URL.revokeObjectURL` + `htmlFor`/`id`
- `protocol.ts`: `crypto.getRandomValues()` no lugar de `Math.random()`
- `LocationPicker.tsx`: `mountedRef` + `AbortController` + type guard no Nominatim

### 3. Petições
- `firestore.rules`: `petitions.update` admin-only (remoção `validPetitionSignatureUpdate`), `petition_signatures.read` só autenticados
- `petitions.service.ts`: `listenToActivePetitions`, `listenToPetition`, upload de capa, `sortPetitions` compartilhado
- `SignatureButton.tsx`: estado "Assinado" visual + check no mount
- `CreatePetitionModal.tsx`: `maxLength` (title 120, desc 5000), meta > 0, upload de capa
- `app/peticoes/page.tsx`: listener em tempo real + debounce 300ms + estado de erro
- `app/peticoes/[id]/page.tsx`: listener em tempo real + fallback "não encontrada"
- `SignatureProgress.tsx`: `role="progressbar"` + aria

### 4. Empregos
- `jobs.service.ts`: `applyForJob` com `setDoc` + ID determinístico (`{jobId}_{userId}`)
- `ApplicationModal.tsx`: `maxLength={2000}` + contador + re-submit pós-login
- `app/empregos/page.tsx`: `cancelled` flag no cleanup

---

## Padrões de correção recorrentes

| Padrão | Aplicado em |
|---|---|
| `runTransaction` no lugar de read-then-write | Ouvidoria, Relatar |
| `onSnapshot` no lugar de `getDocs` one-shot | Ouvidoria, Relatar, Petições |
| `useRef` + `useEffect` para re-submit pós-login | Ouvidoria, Empregos |
| ID determinístico para prevenir duplicatas | Empregos |
| `aria-live` + `role="log"` em timelines | Ouvidoria, Relatar |
| `crypto.getRandomValues()` no lugar de `Math.random()` | Relatar |
| `useRef` + `AbortController` para cleanup | Relatar |
| `maxLength` + validação em formulários | Ouvidoria, Petições, Empregos |
