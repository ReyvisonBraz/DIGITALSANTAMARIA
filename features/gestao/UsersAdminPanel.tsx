'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Loader2, Save, Search, UserRound } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { getAllUsers, updateUserProfileByAdmin } from '@/services/users.service';
import type { UserProfile } from '@/types';

function UserAdminCard({ user, onSaved }: { user: UserProfile; onSaved: () => void }) {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [neighborhood, setNeighborhood] = useState(user.neighborhood || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(user.displayName || '');
    setPhone(user.phone || '');
    setNeighborhood(user.neighborhood || '');
  }, [user.displayName, user.phone, user.neighborhood]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfileByAdmin(user.uid, {
        displayName: displayName.trim(),
        phone: phone.trim() || null,
        neighborhood: neighborhood.trim() || null,
      });
      toast('Usuario atualizado.', 'success');
      onSaved();
    } catch {
      toast('Erro ao atualizar usuario.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="civic-card p-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border bg-surface">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'Usuario'}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary">
                  <UserRound className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-black text-text-main">{user.displayName || 'Sem nome'}</h2>
              <p className="truncate text-xs font-bold text-text-muted">{user.email}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs font-medium text-text-muted">
            <p><span className="font-black text-text-main">UID:</span> <span className="break-all font-mono">{user.uid}</span></p>
            <p><span className="font-black text-text-main">Perfil:</span> {user.role || 'citizen'}</p>
            <p><span className="font-black text-text-main">Pontos:</span> {user.points ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Nome</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-bold outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Telefone</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Não informado"
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-bold outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Bairro</span>
            <input
              value={neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
              placeholder="Não informado"
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-bold outline-none transition focus:border-primary"
            />
          </label>

          <div className="md:col-span-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:opacity-60 sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar usuario
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function UsersAdminPanel() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const loadUsers = useCallback(() => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(() => toast('Não foi possível carregar usuários.', 'error'))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return users;
    return users.filter((user) =>
      `${user.displayName} ${user.email} ${user.uid} ${user.phone || ''} ${user.neighborhood || ''}`
        .toLowerCase()
        .includes(search)
    );
  }, [query, users]);

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, email, UID, telefone ou bairro"
            className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm font-medium outline-none transition focus:border-primary"
          />
        </label>
        <p className="mt-3 text-xs font-bold text-text-muted">
          Mostrando {filteredUsers.length} de {users.length} usuarios.
        </p>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
          <UserRound className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-black text-text-main">Nenhum usuario encontrado</h2>
          <p className="mt-2 text-sm font-medium text-text-muted">Tente buscar outro termo.</p>
        </div>
      ) : (
        filteredUsers.map((user) => (
          <UserAdminCard key={user.uid} user={user} onSaved={loadUsers} />
        ))
      )}
    </div>
  );
}
