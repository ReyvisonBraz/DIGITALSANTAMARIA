# Inventario de Dados - Auditoria de Mocks

Atualizado em 2026-06-16.

| Tela | Dado | Origem atual | Tratamento |
|---|---|---|---|
| `/saude` | Unidades de saude e tempos de espera | `useHealthUnits()` | Dado real via service/hook. Quando vazio, a tela mostra estado vazio sem inventar unidade. |
| `/saude` | Estoque da farmacia popular | `useContent<PharmacyItem>('pharmacy_items')` ou `fallbackMedicines` | Fallback mantido apenas como demonstracao com `DevBanner` visivel acima da lista. |
| `/saude` | Carteira de vacinacao digital, certificado e QR | Bloco demonstrativo local | Mantido com `DevBanner`; QR externo removido e substituido por visual local sem validacao oficial. |
| `/saude` | Mapa e marcadores georreferenciados | Visual demonstrativo local | Imagem externa `picsum` removida; marcadores neutralizados e cobertos por `DevBanner` de mapa demonstrativo. |
| `/educacao` | Escolas, IDEB, avaliacao e vagas | `useContent<EducationSchool>('education_schools')` ou fallback local | Fallback mantido apenas como demonstracao com `DevBanner` visivel acima da listagem. Imagens `picsum` removidas. |
| `/educacao` | Dashboard do aluno, media, frequencia, cardapio, transporte e mentoria | Hardcoded demonstrativo | Mantido com `DevBanner` visivel no topo do dashboard ate haver integracao oficial. |
| `/empregos` | Vagas e candidaturas | `getActiveJobs()` e `ApplicationModal` | Dado real via service; sem fallback mockado identificado nesta rodada. |
| `/perfil` | Avatar sem foto | Inicial/icone local | Fallback remoto DiceBear removido para evitar host externo e aparencia de dado gerado. |

Regra operacional: dado numerico institucional sem fonte real deve ser removido ou exibido somente abaixo de `DevBanner`/`DevBadge` visivel.
