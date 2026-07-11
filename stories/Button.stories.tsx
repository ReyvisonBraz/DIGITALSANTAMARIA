import type { Meta, StoryObj } from '@storybook/react';
import Button from '@/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Botão Primário',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Botão Secundário',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Botão Ghost',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    children: 'Botão Perigo',
    variant: 'danger',
  },
};

export const Loading: Story = {
  args: {
    children: 'Carregando...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Desabilitado',
    disabled: true,
  },
};
