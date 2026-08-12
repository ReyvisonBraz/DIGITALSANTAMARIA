// Protege a decisão de escopo do lançamento: nenhuma superfície de navegação
// pode expor uma rota suspensa para a fase 2, e as rotas do núcleo devem
// permanecer visíveis. Se alguém reativar uma área, basta tirá-la de
// SUSPENDED_ROUTES e estes testes acompanham a mudança.

// lucide-react é importado pelos arquivos de navegação; substituímos por dummies
// para o teste rodar no ambiente node sem carregar os ícones reais.
jest.mock('lucide-react', () => new Proxy({}, { get: () => () => null }));

import {
  SUSPENDED_ROUTES,
  isRouteSuspended,
} from '@/lib/constants/feature-status';
import { NAV_LINKS, DASHBOARD_MODULES, FOOTER_LINKS } from '@/lib/constants';

describe('isRouteSuspended', () => {
  it('marks suspended routes (and their subpaths) as suspended', () => {
    expect(isRouteSuspended('/saude')).toBe(true);
    expect(isRouteSuspended('/saude/agendamento')).toBe(true);
    expect(isRouteSuspended('/educacao/matricula')).toBe(true);
    expect(isRouteSuspended('/tributos')).toBe(true);
  });

  it('keeps launch-set routes available', () => {
    expect(isRouteSuspended('/ouvidoria')).toBe(false);
    expect(isRouteSuspended('/relatar')).toBe(false);
    expect(isRouteSuspended('/peticoes')).toBe(true);
    expect(isRouteSuspended('/perfil')).toBe(false);
    expect(isRouteSuspended('/gestao')).toBe(false);
    expect(isRouteSuspended('/')).toBe(false);
  });

  it('does not suspend a route that merely shares a prefix string', () => {
    // '/social' é suspensa, mas uma rota hipotética '/socialmente' não deve casar.
    expect(SUSPENDED_ROUTES).toContain('/social');
    expect(isRouteSuspended('/socialmente')).toBe(false);
  });
});

describe('navigation surfaces exclude suspended routes', () => {
  it('NAV_LINKS contains no suspended route', () => {
    const leaked = NAV_LINKS.filter((link) => isRouteSuspended(link.href));
    expect(leaked).toEqual([]);
  });

  it('DASHBOARD_MODULES contains no suspended route', () => {
    const leaked = DASHBOARD_MODULES.filter((mod) => isRouteSuspended(mod.href));
    expect(leaked).toEqual([]);
  });

  it('FOOTER_LINKS contains no suspended route', () => {
    const leaked = FOOTER_LINKS.filter((link) => isRouteSuspended(link.href));
    expect(leaked).toEqual([]);
  });

  it('still exposes the core attendance routes in the main menu', () => {
    const hrefs = NAV_LINKS.map((link) => link.href);
    expect(hrefs).toEqual(expect.arrayContaining(['/ouvidoria', '/relatar', '/avisos', '/eventos', '/obras']));
  });
});
