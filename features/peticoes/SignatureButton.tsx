'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, PenLine } from 'lucide-react';
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
  const [signed, setSigned] = useState(false);
  const [checkingSignature, setCheckingSignature] = useState(false);

  useEffect(() => {
    if (!user) {
      setSigned(false);
      return;
    }
    setCheckingSignature(true);
    hasUserSigned(petitionId, user.uid)
      .then(setSigned)
      .catch(() => setSigned(false))
      .finally(() => setCheckingSignature(false));
  }, [petitionId, user]);

  const handleSign = async () => {
    if (!user) {
      try {
        await login();
      } catch (error) {
        toast(error instanceof Error ? error.message : 'Não foi possível iniciar o login.', 'error');
      }
      return;
    }

    setLoading(true);
    try {
      await signPetition(petitionId, user.displayName || user.email || 'Cidadão');
      setSigned(true);
      toast(`Assinatura registrada em "${petitionTitle}"!`, 'success');
      onSign();
    } catch {
      toast('Não foi possível registrar a assinatura.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (signed) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 rounded-xl bg-green-600 px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white opacity-90 cursor-default ${className || ''}`}
      >
        <CheckCircle2 className="h-4 w-4" />
        Assinado
      </button>
    );
  }

  return (
    <button
      onClick={handleSign}
      disabled={loading || checkingSignature}
      className={`flex items-center justify-center gap-2 rounded-xl bg-tertiary px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-tertiary/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 ${className || ''}`}
    >
      {loading || checkingSignature ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <PenLine className="h-4 w-4" />
      )}
      {loading ? 'Assinando...' : checkingSignature ? 'Verificando...' : 'Assinar Agora'}
    </button>
  );
}
