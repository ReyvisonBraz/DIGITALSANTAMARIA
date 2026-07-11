import type { Meta, StoryObj } from '@storybook/nextjs';
import ContentCard from '@/components/ui/ContentCard';

const meta: Meta<typeof ContentCard> = {
  title: 'UI/ContentCard',
  component: ContentCard,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    status: { control: 'text' },
    date: { control: 'text' },
    time: { control: 'text' },
    address: { control: 'text' },
    phone: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

export const Default: Story = {
  args: {
    title: 'Evento Cultural',
    description: 'Festival de música no centro da cidade com apresentações de artistas locais.',
    date: '15/07/2026',
    time: '19:00',
    address: 'Praça Central, Centro',
  },
};

export const WithStatus: Story = {
  args: {
    title: 'Obra Pública',
    description: 'Reforma da Av. Brasil com pavimentação asfáltica.',
    status: 'Em andamento',
    statusColor: 'bg-amber-100 text-amber-700',
    date: '01/06/2026',
  },
};

export const WithBadge: Story = {
  args: {
    title: 'Aviso Importante',
    description: 'Suspensão do fornecimento de água no bairro Vila Nova.',
    badge: { text: 'Urgente', color: 'bg-red-100 text-red-700' },
    date: '10/07/2026',
  },
};

export const WithStats: Story = {
  args: {
    title: 'Relatório Mensal',
    description: 'Resumo das demandas atendidas no mês de junho.',
    stats: [
      { label: 'Resolvidas', value: 45 },
      { label: 'Pendentes', value: 12 },
    ],
  },
};

export const WithAction: Story = {
  args: {
    title: 'Petição Popular',
    description: 'Solicitação de iluminação pública no Bairro Novo.',
    status: 'Ativa',
    date: '05/07/2026',
    action: (
      <button className="text-primary text-sm font-semibold hover:underline">
        Assinar petição
      </button>
    ),
  },
};
