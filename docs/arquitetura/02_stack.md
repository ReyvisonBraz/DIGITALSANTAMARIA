# Stack Tecnologico

## Frontend

| Camada | Tecnologia | Versao |
|---|---|---|
| Framework | Next.js (App Router) | 16+ |
| UI Library | React | 19 |
| Linguagem | TypeScript | 5.x (strict mode) |
| Estilizacao | Tailwind CSS | 4.x |
| Animações | Motion (Framer Motion) | 11.x |
| Icones | Lucide React | — |
| Graficos | Recharts + D3 | — |

## Backend / Dados

| Camada | Tecnologia | Versao |
|---|---|---|
| Autenticacao | Firebase Auth (Google OAuth) | 12.x |
| Banco de Dados | Firestore (Web SDK) | 12.x |
| Armazenamento | Firebase Storage | 12.x |
| Cloud Functions | Firebase Functions (httpsCallable) | — |
| AI | Google Gemini AI | — |

## Infraestrutura

| Camada | Tecnologia |
|---|---|
| Hospedagem | Vercel |
| Deploy | `output: 'standalone'` |
| PWA | Service Worker + manifest |
| Build | Turbopack (dev) |

## Dependencias principais

```json
{
  "next": "^16",
  "react": "^19",
  "firebase": "^12",
  "@google/generative-ai": "latest",
  "tailwindcss": "^4",
  "motion": "^11",
  "lucide-react": "latest",
  "recharts": "^2",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```
