'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  TrendingUp,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import ApplicationModal from '@/features/empregos/ApplicationModal';
import { getActiveJobs } from '@/services/jobs.service';
import type { Job } from '@/types';

export default function EmpregosPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    let cancelled = false;
    getActiveJobs()
      .then((data) => { if (!cancelled) setJobs(data); })
      .catch(() => { if (!cancelled) toast('Erro ao carregar vagas', 'error'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [toast]);

  const filteredJobs = jobs.filter((j) =>
    search === '' || j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10 md:gap-14 bg-background">
      <section className="space-y-6">
        <div className="ring-highlight-dark relative overflow-hidden rounded-[2.5rem] md:rounded-[2rem] bg-gradient-to-br from-primary-dark via-primary to-primary-dark animate-drift p-8 md:p-14 text-white shadow-[0_26px_70px_rgba(14,58,140,0.30)]">
          <div aria-hidden className="hero-grid-overlay" />
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent-success/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-secondary/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border border-white/15 backdrop-blur">
              <Briefcase className="w-4 h-4 text-accent-success" />
              Banco de oportunidades
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.98]" style={{ fontFamily: 'var(--font-display)' }}>
              Banco de <span className="text-accent">talentos</span>
            </h1>
            <p className="max-w-2xl border-l-2 border-accent-success/50 pl-5 text-base md:text-xl font-medium text-white/75 leading-relaxed">
              Conectamos os melhores profissionais às vagas reais do município.
            </p>

            <div className="relative max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cargo ou palavra-chave..."
                className="w-full pl-16 pr-6 py-4 rounded-full bg-white text-text-main outline-none font-bold text-sm md:text-base shadow-[0_14px_34px_rgba(14,58,140,0.18)] ring-1 ring-white/40 transition-all focus:ring-2 focus:ring-accent/60"
              />
            </div>
          </div>

          <Briefcase className="animate-floaty pointer-events-none absolute -bottom-10 -right-8 h-56 w-56 opacity-[0.07]" />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          <div className="xl:col-span-2 flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="xl:col-span-2 text-center py-20 text-text-muted">
            <p className="text-xs font-semibold uppercase tracking-widest">Nenhuma vaga encontrada</p>
          </div>
        ) : filteredJobs.map((job, idx) => (
          <motion.article
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="sheen-on-hover bg-white p-8 md:p-10 rounded-[2rem] border-2 border-border shadow-sm hover:border-primary/40 hover:shadow-2xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center border-2 border-border">
                <Briefcase className="w-7 h-7 text-text-muted group-hover:text-primary transition-colors" />
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <h3 className="text-2xl font-semibold text-text-main leading-snug tracking-tight group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-display)' }}>{job.title}</h3>
              <p className="text-[11px] font-bold text-primary uppercase tracking-[0.12em]">{job.employerName}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-surface border border-border rounded-lg text-[11px] font-semibold text-text-muted uppercase">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {job.location}
              </div>
              {job.salary && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase">
                  <DollarSign className="w-3.5 h-3.5 text-primary" />
                  {job.salary}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {job.type}
              </div>
              <button
                onClick={() => setSelectedJob(job)}
                className="ml-auto px-6 py-3 bg-primary text-white rounded-xl font-semibold text-[11px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Candidatar-se
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <ApplicationModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        jobId={selectedJob?.id || ''}
        jobTitle={selectedJob?.title || ''}
      />
    </div>
  );
}
