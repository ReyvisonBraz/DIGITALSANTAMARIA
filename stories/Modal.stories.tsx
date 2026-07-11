import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalWithState = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Título do Modal"
      >
        <div className="space-y-4">
          <p className="text-text-muted">
            Este é um exemplo de modal com conteúdo customizado.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirmar</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <ModalWithState />,
};

export const WithTitle: Story = {
  args: {
    isOpen: true,
    title: 'Modal com Título',
    children: <p>Conteúdo do modal com título.</p>,
  },
};

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    children: <p>Modal sem título.</p>,
  },
};
