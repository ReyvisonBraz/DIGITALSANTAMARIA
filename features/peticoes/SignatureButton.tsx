'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { signPetition, hasUserSigned } from '@/services/petitions.service';
import { useToast } from '@/lib/toast-context';

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
      await login();
      return;
    }
    setLoading(true);
    try {
      const alreadySigned = await hasUserSigned(petitionId, user.uid);
      if (alreadySigned) {
        toast('Você já assinou esta petição!', 'error');
        return;
      }
      await signPetition(petitionId, user.uid, user.displayName || 'Cidadão');
      toast(`Assinatura registrada em "${petitionTitle}"!`, 'success');
      onSign();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao assinar';
      toast(message, 'error');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleSign}
      disabled={loading}
      className={`px-10 py-4 bg-tertiary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-tertiary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${className || ''}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CheckCircle2 className="w-4 h-4" />
      )}
      {loading ? 'Assinando...' : 'Assinar Agora'}
    </button>
  );
}
