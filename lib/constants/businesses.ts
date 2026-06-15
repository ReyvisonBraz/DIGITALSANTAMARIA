import type { Business } from '@/types';

export const BUSINESS_CATEGORIES: { value: Business['category']; label: string; plural: string }[] = [
  { value: 'restaurante', label: 'Restaurante', plural: 'Restaurantes' },
  { value: 'farmacia', label: 'Farmácia', plural: 'Farmácias' },
  { value: 'mercado', label: 'Mercado', plural: 'Mercados' },
  { value: 'servico', label: 'Serviço', plural: 'Serviços' },
  { value: 'loja', label: 'Loja', plural: 'Lojas' },
  { value: 'beleza', label: 'Beleza', plural: 'Beleza' },
  { value: 'saude', label: 'Saúde', plural: 'Saúde' },
  { value: 'educacao', label: 'Educação', plural: 'Educação' },
  { value: 'construcao', label: 'Construção', plural: 'Construção' },
  { value: 'transporte', label: 'Transporte', plural: 'Transporte' },
  { value: 'tecnologia', label: 'Tecnologia', plural: 'Tecnologia' },
  { value: 'alimentacao', label: 'Alimentação', plural: 'Alimentação' },
  { value: 'hospedagem', label: 'Hospedagem', plural: 'Hospedagem' },
  { value: 'oficina', label: 'Oficina', plural: 'Oficinas' },
  { value: 'agro', label: 'Agro', plural: 'Agro' },
  { value: 'outros', label: 'Outros', plural: 'Outros' },
];

export const BUSINESS_CATEGORY_LABEL: Record<Business['category'], string> = Object.fromEntries(
  BUSINESS_CATEGORIES.map((category) => [category.value, category.label]),
) as Record<Business['category'], string>;

export const BUSINESS_CATEGORY_ACCENT: Record<Business['category'], string> = {
  restaurante: 'bg-accent/15 text-primary-dark border-accent/30',
  farmacia: 'bg-accent-success/12 text-accent-success border-accent-success/30',
  mercado: 'bg-secondary/15 text-secondary border-secondary/30',
  servico: 'bg-primary/10 text-primary border-primary/25',
  loja: 'bg-primary-dark/12 text-primary-dark border-primary-dark/25',
  beleza: 'bg-pink-50 text-pink-700 border-pink-200',
  saude: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  educacao: 'bg-sky-50 text-sky-700 border-sky-200',
  construcao: 'bg-amber-50 text-amber-700 border-amber-200',
  transporte: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  tecnologia: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  alimentacao: 'bg-orange-50 text-orange-700 border-orange-200',
  hospedagem: 'bg-violet-50 text-violet-700 border-violet-200',
  oficina: 'bg-slate-100 text-slate-700 border-slate-200',
  agro: 'bg-lime-50 text-lime-700 border-lime-200',
  outros: 'bg-surface text-text-muted border-border',
};

export const GENERIC_BUSINESS_LOGOS = [
  { id: 'storefront', label: 'Fachada', url: '/business-logos/storefront.svg' },
  { id: 'basket', label: 'Mercado', url: '/business-logos/basket.svg' },
  { id: 'service', label: 'Serviço', url: '/business-logos/service.svg' },
  { id: 'health', label: 'Saúde', url: '/business-logos/health.svg' },
  { id: 'food', label: 'Comida', url: '/business-logos/food.svg' },
] as const;

export function getBusinessCategoryLabel(category: Business['category']): string {
  return BUSINESS_CATEGORY_LABEL[category] ?? 'Outros';
}
