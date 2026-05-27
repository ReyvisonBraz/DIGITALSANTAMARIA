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
    getActiveJobs()
      .then(setJobs)
      .catch(() => toast('Erro ao carregar vagas', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter((j) =>
    search === '' || j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10 md:gap-14 bg-background">
      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] md:text-[10px] font-semibold uppercase tracking-widest border border-primary/20">
              <Briefcase className="w-4 h-4" />
              Banco de Oportunidades
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-text-main tracking-tighter uppercase leading-[0.9]">
              Banco de <br /> <span className="text-primary">Talentos.</span>
            </h1>
            <p className="text-base md:text-xl font-medium text-text-muted font-ui leading-relaxed">
              Conectamos os melhores profissionais às vagas reais do município.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-[2rem] md:rounded-full border-2 border-border shadow-2xl transition-all focus-within:border-primary/30">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cargo ou palavra-chave..."
              className="w-full pl-16 pr-6 py-4 bg-transparent outline-none font-bold text-sm md:text-base"
            />
          </div>
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
            className="bg-white p-8 md:p-10 rounded-[3rem] border-2 border-border shadow-sm hover:border-primary/40 hover:shadow-2xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center border-2 border-border">
                <Briefcase className="w-7 h-7 text-text-muted group-hover:text-primary transition-colors" />
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <h3 className="text-2xl font-semibold text-text-main uppercase leading-none">{job.title}</h3>
              <p className="text-[10px] font-semibold text-primary uppercase">{job.employerName}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-surface border border-border rounded-lg text-[8px] font-semibold text-text-muted uppercase">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-text-muted uppercase">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {job.location}
              </div>
              {job.salary && (
                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-text-muted uppercase">
                  <DollarSign className="w-3.5 h-3.5 text-primary" />
                  {job.salary}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-text-muted uppercase">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {job.type}
              </div>
              <button
                onClick={() => setSelectedJob(job)}
                className="ml-auto px-6 py-3 bg-primary text-white rounded-xl font-semibold text-[9px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all"
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
