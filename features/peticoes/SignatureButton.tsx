'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { hasUserSigned, signPetition } from '@/services/petitions.service';

interface SignatureButtonProps {
  petitionId: string;
  petitionTitle: string;
  onSign: () => void;
  className?: string;
}

export default function SignatureButton({ petitionId, petitionTitle, onSign, className }: SignatureButtonProps) {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    if (!user) {
      try {
        await login();
      } catch (error) {
        toast(error instanceof Error ? error.message : 'Nao foi possivel iniciar o login.', 'error');
      }
      return;
    }

    setLoading(true);
    try {
      const alreadySigned = await hasUserSigned(petitionId, user.uid);
      if (alreadySigned) {
        toast('Voce ja assinou esta peticao!', 'error');
        return;
      }

      await signPetition(petitionId, user.uid, user.displayName || 'Cidadao');
      toast(`Assinatura registrada em "${petitionTitle}"!`, 'success');
      onSign();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao assinar';
      toast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSign}
      disabled={loading}
      className={`flex items-center justify-center gap-2 rounded-xl bg-tertiary px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-tertiary/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 ${className || ''}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      {loading ? 'Assinando...' : 'Assinar Agora'}
    </button>
  );
}
