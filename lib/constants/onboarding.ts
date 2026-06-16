export interface OnboardingStep {
  title: string;
  body: string;
  tip?: string;
}

export interface OnboardingGuide {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  primaryAction?: string;
  steps: OnboardingStep[];
}

export const ONBOARDING_VERSION = '2026-06-14';

export const ONBOARDING_GUIDES: readonly OnboardingGuide[] = [
  {
    id: 'home',
    title: 'Bem-vindo ao Conecta Santa Maria',
    eyebrow: 'Início',
    summary: 'Aqui você encontra os principais caminhos do portal: solicitar atendimento, acompanhar protocolos, ver serviços e participar das decisões da cidade.',
    primaryAction: 'Comece por "Abrir solicitação" se precisa falar com a prefeitura.',
    steps: [
      {
        title: 'Escolha o que precisa fazer',
        body: 'Os cards de acesso rápido levam direto para as tarefas mais usadas, como abrir solicitação, consultar protocolo, petições e painel do cidadão.',
      },
      {
        title: 'Use o mapa de serviços',
        body: 'O botão "Serviços" no topo mostra todas as áreas do app em uma grade simples. E o melhor caminho quando você não sabe exatamente onde clicar.',
      },
      {
        title: 'Acompanhe tudo pelo painel',
        body: 'Depois de enviar uma solicitação, relato, matrícula, candidatura ou agendamento, o andamento aparece no Painel do Cidadão.',
        tip: 'O símbolo ? fica disponível para rever esta explicação quando quiser.',
      },
    ],
  },
  {
    id: 'ouvidoria',
    title: 'Como funciona a Ouvidoria',
    eyebrow: 'Atendimento',
    summary: 'Use esta área para reclamações, sugestões, denúncias e elogios. Cada envio gera um protocolo para acompanhamento.',
    primaryAction: 'Informe tipo, categoria, detalhes e acompanhe a resposta pelo protocolo.',
    steps: [
      {
        title: 'Registre a manifestação',
        body: 'Escolha se é reclamação, sugestão, denúncia ou elogio. Depois descreva o assunto com o máximo de clareza possível.',
      },
      {
        title: 'Guarde o protocolo',
        body: 'Ao confirmar, o sistema gera um código único. Esse código ajuda a encontrar a solicitação depois.',
      },
      {
        title: 'Continue a conversa',
        body: 'Quando a equipe responder, a conversa fica na linha do tempo. Você pode complementar informações sem abrir outro pedido.',
      },
    ],
  },
  {
    id: 'relatar',
    title: 'Como relatar um problema urbano',
    eyebrow: 'Relatos',
    summary: 'Use esta área para avisar sobre buracos, iluminação, lixo, risco ambiental, segurança e outros problemas da cidade.',
    primaryAction: 'Foto e localização ajudam a equipe a entender e resolver mais rápido.',
    steps: [
      {
        title: 'Escolha o tipo de problema',
        body: 'Selecione a categoria mais próxima: infraestrutura, meio ambiente, segurança ou outros.',
      },
      {
        title: 'Mostre onde aconteceu',
        body: 'Você pode informar o endereço manualmente ou usar a localização do navegador. Se puder, adicione uma foto.',
      },
      {
        title: 'Revise antes de enviar',
        body: 'Confira os dados antes da confirmação. Depois do envio, o relato aparece no seu painel com status e mensagens.',
      },
    ],
  },
  {
    id: 'perfil',
    title: 'Painel do Cidadão',
    eyebrow: 'Conta',
    summary: 'Este painel concentra seus protocolos, respostas, atividades, dados pessoais e negócios cadastrados.',
    primaryAction: 'Entre com sua conta para ver seu histórico completo.',
    steps: [
      {
        title: 'Veja suas atividades',
        body: 'Solicitações, relatos, agendamentos, matrículas, candidaturas e alertas aparecem em uma lista única.',
      },
      {
        title: 'Abra conversas pendentes',
        body: 'Quando houver nova resposta, o painel mostra um aviso. Abra o item para ler e responder, se necessário.',
      },
      {
        title: 'Mantenha seus dados atualizados',
        body: 'Nome, telefone, bairro e foto ajudam a prefeitura a identificar e atender você com mais segurança.',
      },
    ],
  },
  {
    id: 'peticoes',
    title: 'Petições e participação',
    eyebrow: 'Participação',
    summary: 'Aqui a comunidade cria e assina causas públicas. As petições mostram meta, progresso e resposta oficial quando houver.',
    primaryAction: 'Assinar uma petição pode exigir login para evitar assinaturas duplicadas.',
    steps: [
      {
        title: 'Escolha uma causa',
        body: 'A lista mostra petições abertas e o progresso de assinaturas. Abra uma petição para ler os detalhes.',
      },
      {
        title: 'Assine com segurança',
        body: 'O sistema verifica se você já assinou para manter a contagem correta e transparente.',
      },
      {
        title: 'Crie uma nova petição',
        body: 'Se a causa ainda não existe, use a opção de criar petição e explique objetivo, motivo e meta.',
      },
    ],
  },
  {
    id: 'peticao-detalhe',
    title: 'Detalhes da petição',
    eyebrow: 'Participação',
    summary: 'Nesta tela você confere o texto completo da causa, acompanha a meta e pode registrar sua assinatura.',
    steps: [
      {
        title: 'Leia antes de assinar',
        body: 'Confira o objetivo, a justificativa e a meta de assinaturas antes de apoiar.',
      },
      {
        title: 'Acompanhe o progresso',
        body: 'A barra de progresso mostra quantas assinaturas ja foram registradas e quanto falta para a meta.',
      },
      {
        title: 'Volte depois',
        body: 'Você pode retornar a esta petição para ver atualizações e respostas oficiais.',
      },
    ],
  },
  {
    id: 'saude',
    title: 'Saúde fácil',
    eyebrow: 'Serviços',
    summary: 'Consulte unidades de saúde, tempos de espera, farmácia popular e agendamentos disponíveis.',
    primaryAction: 'Para agendar, escolha a unidade, especialidade, data e confirme.',
    steps: [
      {
        title: 'Encontre uma unidade',
        body: 'Veja endereço, horário, especialidades e indicação de espera para decidir onde procurar atendimento.',
      },
      {
        title: 'Agende atendimento',
        body: 'O agendamento guia você por etapas simples: unidade, especialidade, horário e confirmação.',
      },
      {
        title: 'Consulte histórico',
        body: 'Se estiver logado, seus atendimentos aparecem no histórico de saúde e no Painel do Cidadão.',
      },
    ],
  },
  {
    id: 'educacao',
    title: 'Educação municipal',
    eyebrow: 'Serviços',
    summary: 'Consulte escolas municipais e acesse a matrícula escolar digital.',
    primaryAction: 'Para nova matrícula, entre em "Matrícula" e preencha as etapas com os dados do responsável e do aluno.',
    steps: [
      {
        title: 'Consulte escolas',
        body: 'Veja escolas, etapas atendidas, endereço e informações básicas antes de solicitar uma vaga.',
      },
      {
        title: 'Inicie a matrícula',
        body: 'A matrícula pede dados do responsável, do aluno, endereço, preferência de escola e revisão final.',
      },
      {
        title: 'Acompanhe o resultado',
        body: 'A fila de matrículas é atualizada pela gestao, e o andamento aparece no Painel do Cidadão.',
      },
    ],
  },
  {
    id: 'matricula',
    title: 'Matrícula escolar',
    eyebrow: 'Educação',
    summary: 'Este formulário coleta os dados necessários para solicitar vaga escolar de forma organizada.',
    steps: [
      {
        title: 'Preencha por etapas',
        body: 'Siga a ordem: responsável, aluno, endereço, escola desejada e revisão.',
      },
      {
        title: 'Revise CPF e dados',
        body: 'Dados incorretos podem atrasar a analise. Confira antes de confirmar.',
      },
      {
        title: 'Guarde o protocolo',
        body: 'Depois do envio, use o protocolo e o Painel do Cidadão para acompanhar a resposta.',
      },
    ],
  },
  {
    id: 'empregos',
    title: 'Empregos e candidaturas',
    eyebrow: 'Economia',
    summary: 'Veja vagas publicadas, filtre por tipo de trabalho e envie candidatura pelo portal.',
    primaryAction: 'Entre com sua conta antes de se candidatar para o sistema registrar seu interesse.',
    steps: [
      {
        title: 'Filtre as vagas',
        body: 'Use os filtros para encontrar oportunidades por tipo, como CLT, temporario, estagio ou voluntario.',
      },
      {
        title: 'Leia os requisitos',
        body: 'Abra a vaga e confira descrição, requisitos, benefícios e faixa salarial quando informada.',
      },
      {
        title: 'Envie candidatura',
        body: 'Você pode incluir uma breve apresentação. O sistema evita candidatura duplicada na mesma vaga.',
      },
    ],
  },
  {
    id: 'comercio',
    title: 'Comércio local',
    eyebrow: 'Economia',
    summary: 'A vitrine mostra negócios aprovados da cidade, com contatos, horário de funcionamento e localização.',
    primaryAction: 'Para cadastrar seu negócio, use a área "Meus Negócios" no Painel do Cidadão.',
    steps: [
      {
        title: 'Procure por categoria',
        body: 'Use os filtros para encontrar negócios por segmento e verificar se estão abertos.',
      },
      {
        title: 'Entre em contato',
        body: 'Os cards podem exibir telefone, WhatsApp, endereço e atalho para mapa.',
      },
      {
        title: 'Cadastre seu negócio',
        body: 'O cadastro passa por aprovação da gestão antes de aparecer publicamente.',
      },
    ],
  },
  {
    id: 'servicos',
    title: 'Diretório de serviços',
    eyebrow: 'Portal',
    summary: 'Esta área organiza serviços públicos municipais por categoria, local, horário e departamento.',
    steps: [
      {
        title: 'Busque pelo nome',
        body: 'Digite uma palavra relacionada ao serviço, departamento ou local para filtrar a lista.',
      },
      {
        title: 'Confira atendimento',
        body: 'Leia horário, localização e departamento responsável antes de se deslocar.',
      },
      {
        title: 'Use como ponto de partida',
        body: 'Quando estiver em dúvida, o diretório ajuda a descobrir qual área do portal deve ser usada.',
      },
    ],
  },
  {
    id: 'avisos',
    title: 'Avisos oficiais',
    eyebrow: 'Portal',
    summary: 'Comunicados, alertas e informativos da prefeitura aparecem aqui com prioridade e validade.',
    steps: [
      {
        title: 'Leia a prioridade',
        body: 'Avisos podem ser informativos, alertas ou urgências. Prioridades maiores merecem atenção imediata.',
      },
      {
        title: 'Confira a validade',
        body: 'Alguns avisos expiram depois de uma data. O portal filtra comunicados antigos quando necessário.',
      },
      {
        title: 'Volte para atualizações',
        body: 'Novos avisos também podem aparecer no topo do app quando forem urgentes.',
      },
    ],
  },
  {
    id: 'eventos',
    title: 'Agenda de eventos',
    eyebrow: 'Vida urbana',
    summary: 'Consulte eventos da cidade com data, horário, local, preço e detalhes publicados pela gestao.',
    steps: [
      {
        title: 'Veja data e local',
        body: 'Os cards destacam quando e onde o evento acontece para facilitar o planejamento.',
      },
      {
        title: 'Abra para detalhes',
        body: 'A página do evento pode trazer descrição completa, informações de preço e orientações.',
      },
      {
        title: 'Acompanhe novidades',
        body: 'Eventos publicados pela gestao aparecem automaticamente nesta agenda.',
      },
    ],
  },
  {
    id: 'evento-detalhe',
    title: 'Detalhes do evento',
    eyebrow: 'Vida urbana',
    summary: 'Aqui ficam as informações completas de um evento específico.',
    steps: [
      {
        title: 'Confira antes de ir',
        body: 'Leia data, horário, local, preço e descrição para evitar deslocamento desnecessario.',
      },
      {
        title: 'Use o local como referência',
        body: 'Quando houver endereço ou ponto de referência, use essa informação para se planejar.',
      },
      {
        title: 'Volte para a agenda',
        body: 'A lista de eventos mostra outras atividades disponíveis na cidade.',
      },
    ],
  },
  {
    id: 'obras',
    title: 'Obras públicas',
    eyebrow: 'Gestao urbana',
    summary: 'Acompanhe obras municipais com localização, tipo, orçamento, progresso e atualizações.',
    steps: [
      {
        title: 'Veja o progresso',
        body: 'Cada obra pode mostrar percentual de andamento e informações principais.',
      },
      {
        title: 'Entenda o impacto',
        body: 'Confira tipo da obra, localização e atualizações para saber o que está acontecendo na região.',
      },
      {
        title: 'Abra detalhes',
        body: 'A página detalhada concentra histórico e dados completos quando disponíveis.',
      },
    ],
  },
  {
    id: 'obra-detalhe',
    title: 'Detalhes da obra',
    eyebrow: 'Gestao urbana',
    summary: 'Nesta tela você acompanha uma obra específica com dados completos e atualizações.',
    steps: [
      {
        title: 'Confira status e progresso',
        body: 'Use as informações de andamento para entender a fase atual da obra.',
      },
      {
        title: 'Leia as atualizações',
        body: 'A linha do tempo ajuda a acompanhar mudanças, etapas concluídas e comunicados.',
      },
      {
        title: 'Compare com outras obras',
        body: 'Volte para a lista para consultar outros locais e iniciativas municipais.',
      },
    ],
  },
  {
    id: 'votos',
    title: 'Votações públicas',
    eyebrow: 'Participação',
    summary: 'Participe de enquetes oficiais e veja resultados atualizados com contagem de votos.',
    primaryAction: 'Seu voto pode exigir login para garantir uma participação por pessoa.',
    steps: [
      {
        title: 'Escolha uma enquete',
        body: 'Leia a pergunta e as opções antes de votar.',
      },
      {
        title: 'Vote com cuidado',
        body: 'Depois de confirmar, o voto e registrado de forma controlada para manter a contagem correta.',
      },
      {
        title: 'Veja resultados',
        body: 'Acompanhe a distribuicao dos votos e volte depois para ver novas enquetes.',
      },
    ],
  },
  {
    id: 'seguranca',
    title: 'Segurança cidadã',
    eyebrow: 'Serviços',
    summary: 'Consulte zonas seguras e use recursos de alerta de emergência quando necessário.',
    primaryAction: 'Use o SOS apenas em situações reais de risco.',
    steps: [
      {
        title: 'Consulte zonas',
        body: 'As zonas mostram áreas cadastradas e nível de risco para orientar deslocamentos.',
      },
      {
        title: 'Acione emergencia com responsabilidade',
        body: 'O botão SOS gera alerta e protocolo para a fila de atendimento.',
      },
      {
        title: 'Acompanhe pelo painel',
        body: 'Alertas vinculados a sua conta aparecem no Painel do Cidadão.',
      },
    ],
  },
  {
    id: 'transito',
    title: 'Trânsito e mobilidade',
    eyebrow: 'Serviços',
    summary: 'Veja alertas de acidentes, obras, desvios, congestionamentos e validade das informações.',
    steps: [
      {
        title: 'Observe a severidade',
        body: 'Alertas podem ter gravidade baixa, media, alta ou critica.',
      },
      {
        title: 'Confira o local',
        body: 'Use a localização para decidir melhor rota ou evitar trechos impactados.',
      },
      {
        title: 'Veja a validade',
        body: 'Alguns alertas deixam de valer após uma data ou horário.',
      },
    ],
  },
  {
    id: 'tributos',
    title: 'Tributos municipais',
    eyebrow: 'Gestao',
    summary: 'Consulte informações sobre IPTU, ISS, ITBI, taxas, valores, vencimentos e status quando publicados.',
    steps: [
      {
        title: 'Identifique o tributo',
        body: 'Confira o tipo de registro antes de interpretar valores ou vencimentos.',
      },
      {
        title: 'Observe status e data',
        body: 'Status e vencimento ajudam a entender se ha pendencia, prazo aberto ou item informativo.',
      },
      {
        title: 'Procure atendimento se precisar',
        body: 'Quando houver dúvida sobre cobrança ou regularização, abra solicitação na Ouvidoria.',
      },
    ],
  },
  {
    id: 'social',
    title: 'Programas sociais',
    eyebrow: 'Serviços',
    summary: 'Veja programas, benefícios, requisitos, locais de atendimento e orientações sociais do município.',
    steps: [
      {
        title: 'Leia os requisitos',
        body: 'Cada programa pode ter critérios de participação. Confira antes de procurar atendimento.',
      },
      {
        title: 'Confira local e categoria',
        body: 'Use categoria e localização para encontrar o programa correto.',
      },
      {
        title: 'Abra solicitação se precisar',
        body: 'Se faltar informação ou houver dúvida, use a Ouvidoria para pedir orientação.',
      },
    ],
  },
  {
    id: 'meio-ambiente',
    title: 'Meio ambiente',
    eyebrow: 'Serviços',
    summary: 'Acompanhe dados e alertas ambientais, como qualidade da água, ar, áreas verdes e ocorrências.',
    steps: [
      {
        title: 'Entenda o indicador',
        body: 'Leia o tipo, valor e unidade para interpretar corretamente cada dado ambiental.',
      },
      {
        title: 'Veja a localização',
        body: 'Alguns dados se aplicam a áreas específicas do município.',
      },
      {
        title: 'Relate problemas',
        body: 'Para lixo irregular, risco ambiental ou situação urgente, use Relatar Problema ou Ouvidoria.',
      },
    ],
  },
  {
    id: 'comunidade',
    title: 'Comunidade',
    eyebrow: 'Vida urbana',
    summary: 'Encontre grupos, iniciativas e atividades comunitárias cadastradas no município.',
    steps: [
      {
        title: 'Procure por categoria',
        body: 'Filtre grupos por tema, bairro ou interesse quando essas informações estiverem disponíveis.',
      },
      {
        title: 'Leia a descrição',
        body: 'A descrição explica o objetivo do grupo e o público envolvido.',
      },
      {
        title: 'Participe da vida local',
        body: 'Use as informações de contato ou local para se aproximar das iniciativas da cidade.',
      },
    ],
  },
  {
    id: 'gestao',
    title: 'Painel de gestao',
    eyebrow: 'Equipe',
    summary: 'Área restrita para equipes autorizadas acompanharem filas, protocolos, conteúdos, usuários e auditoria.',
    primaryAction: 'Priorize itens com nova resposta, pendencias e alertas de emergencia.',
    steps: [
      {
        title: 'Use as abas do painel',
        body: 'As seções organizam solicitações, relatos, conteúdos, petições, usuários e auditoria conforme seu perfil.',
      },
      {
        title: 'Filtre antes de agir',
        body: 'Busca, status e ordenação ajudam a encontrar protocolos urgentes e respostas novas do cidadão.',
      },
      {
        title: 'Registre respostas claras',
        body: 'Atualizar status e resposta oficial mantém o cidadão informado e cria histórico para acompanhamento.',
      },
    ],
  },
  {
    id: 'sobre',
    title: 'Sobre o portal',
    eyebrow: 'Informação',
    summary: 'Esta página explica a proposta do Conecta Santa Maria e os canais digitais do município.',
    steps: [
      {
        title: 'Entenda o objetivo',
        body: 'O portal centraliza serviços, participação e acompanhamento de demandas municipais.',
      },
      {
        title: 'Use como referência',
        body: 'Quando quiser explicar o app para outra pessoa, esta página resume a finalidade do projeto.',
      },
      {
        title: 'Volte aos serviços',
        body: 'Depois de entender o portal, use o menu para acessar a área que precisa.',
      },
    ],
  },
  {
    id: 'legal',
    title: 'Privacidade e termos',
    eyebrow: 'Informação',
    summary: 'Aqui ficam regras de uso, privacidade e informações legais do portal.',
    steps: [
      {
        title: 'Leia antes de usar dados pessoais',
        body: 'Entenda como dados de cadastro, protocolos e atividades podem ser usados no atendimento digital.',
      },
      {
        title: 'Confira responsabilidades',
        body: 'Os termos explicam condutas esperadas e limites do serviço.',
      },
      {
        title: 'Volte quando precisar',
        body: 'O link fica disponível no rodapé para consulta futura.',
      },
    ],
  },
];

const ROUTE_GUIDE_IDS: readonly [RegExp, string][] = [
  [/^\/$/, 'home'],
  [/^\/ouvidoria\/?$/, 'ouvidoria'],
  [/^\/relatar\/?$/, 'relatar'],
  [/^\/perfil\/?$/, 'perfil'],
  [/^\/peticoes\/[^/]+\/?$/, 'peticao-detalhe'],
  [/^\/peticoes\/?$/, 'peticoes'],
  [/^\/saude\/?$/, 'saude'],
  [/^\/educacao\/matricula\/?$/, 'matricula'],
  [/^\/educacao\/?$/, 'educacao'],
  [/^\/empregos\/?$/, 'empregos'],
  [/^\/comercio\/?$/, 'comercio'],
  [/^\/servicos\/?$/, 'servicos'],
  [/^\/avisos\/?$/, 'avisos'],
  [/^\/eventos\/[^/]+\/?$/, 'evento-detalhe'],
  [/^\/eventos\/?$/, 'eventos'],
  [/^\/obras\/[^/]+\/?$/, 'obra-detalhe'],
  [/^\/obras\/?$/, 'obras'],
  [/^\/votos\/?$/, 'votos'],
  [/^\/seguranca\/?$/, 'seguranca'],
  [/^\/transito\/?$/, 'transito'],
  [/^\/tributos\/?$/, 'tributos'],
  [/^\/social\/?$/, 'social'],
  [/^\/meio-ambiente\/?$/, 'meio-ambiente'],
  [/^\/comunidade\/?$/, 'comunidade'],
  [/^\/gestao\/?$/, 'gestao'],
  [/^\/sobre\/?$/, 'sobre'],
  [/^\/legal\/?$/, 'legal'],
];

export function getOnboardingGuide(pathname: string | null): OnboardingGuide {
  const path = pathname ?? '/';
  const match = ROUTE_GUIDE_IDS.find(([pattern]) => pattern.test(path));
  const guideId = match?.[1] ?? 'home';
  return ONBOARDING_GUIDES.find((guide) => guide.id === guideId) ?? ONBOARDING_GUIDES[0];
}
