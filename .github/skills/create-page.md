# Skill: Create a Next.js Page / Route

## App Router page template
```tsx
// app/<route>/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '<Page Title>',
  description: '<description>',
};

interface PageProps {
  params: { /* route params */ };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function <Name>Page({ params, searchParams }: PageProps) {
  // fetch data server-side here

  return (
    <main className="container mx-auto px-4 md:px-6">
      {/* page content */}
    </main>
  );
}
```

## Checklist
- [ ] Metadata exported for SEO.
- [ ] Data fetching in Server Component (not client-side useEffect).
- [ ] Loading state: `loading.tsx` sibling file.
- [ ] Error state: `error.tsx` sibling file.
- [ ] Route params typed via `PageProps`.
- [ ] Page container uses `container mx-auto px-4 md:px-6`.
- [ ] Performance: Heavy client components are dynamically imported (`next/dynamic`).
