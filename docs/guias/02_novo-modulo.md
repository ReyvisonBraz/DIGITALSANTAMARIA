# Como Adicionar um Novo Modulo

Guia passo a passo para adicionar uma nova pagina de catalogo (ex: Farmacias, Bibliotecas, etc.).

---

## Passo 1: Definir o tipo

Criar/estender em `types/content.types.ts`:

```typescript
export interface Library extends BaseContent {
  name: string
  address: string
  phone: string
  hours: string
  booksCount: number
}
```

Adicionar ao `index.ts` barrel export.

---

## Passo 2: Criar a pagina

`app/bibliotecas/page.tsx`:

```typescript
'use client'

import { useContent } from '@/lib/hooks/use-content'
import { ContentPage } from '@/components/ui/ContentPage'
import { ContentHero } from '@/components/ui/ContentHero'
import { ContentCard } from '@/components/ui/ContentCard'
import type { Library } from '@/types'

export default function BibliotecasPage() {
  const { data: libraries, loading, error } = useContent<Library>('libraries')

  return (
    <>
      <ContentHero
        category="Cultura"
        title="Bibliotecas"
        subtitle="Encontre bibliotecas publicas em Santa Maria"
      />
      <ContentPage loading={loading} error={error} isEmpty={!libraries?.length}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {libraries?.map((lib) => (
            <ContentCard key={lib.id} item={lib} />
          ))}
        </div>
      </ContentPage>
    </>
  )
}
```

---

## Passo 3: Adicionar layout

`app/bibliotecas/layout.tsx`:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bibliotecas — Conecta Santa Maria',
  description: 'Bibliotecas publicas de Santa Maria do Para',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

---

## Passo 4: Adicionar ao admin

`features/gestao/ContentAdminPanel.tsx` — adicionar nova aba:

```typescript
import { GenericCatalogAdmin } from './content/GenericCatalogAdmin'
import type { Library } from '@/types'

// No array de tabs:
{ id: 'libraries', label: 'Bibliotecas', icon: BookOpen }
```

E criar o componente admin (usar `GenericCatalogAdmin` ou criar um dedicado).

---

## Passo 5: Adicionar a navegacao

`lib/constants/navigation.ts` — adicionar link:

```typescript
{ href: '/bibliotecas', label: 'Bibliotecas', icon: BookOpen, description: 'Bibliotecas publicas' }
```

---

## Passo 6: Seed de dados (opcional)

`scripts/seed.ts` — adicionar seed:

```typescript
const librariesCollection = collection(db, 'libraries')
await addDoc(librariesCollection, {
  name: 'Biblioteca Municipal',
  address: '...',
  status: 'published',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  deletedAt: null,
})
```

---

## Resumo

| O que fazer | Onde |
|---|---|
| Definir tipo | `types/content.types.ts` |
| Criar pagina | `app/<rota>/page.tsx` |
| Criar layout | `app/<rota>/layout.tsx` |
| Adicionar ao admin | `features/gestao/ContentAdminPanel.tsx` |
| Adicionar navegacao | `lib/constants/navigation.ts` |
| Seed de dados | `scripts/seed.ts` |

A pagina automaticamente:
- Busca dados do Firestore via `useContent<T>()`
- Exibe estados de loading, erro, vazio
- Responde ao layout responsivo
- Usa o design system (cores, fontes, animacoes)
