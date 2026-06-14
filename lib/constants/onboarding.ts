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
    eyebrow: 'Inicio',
    summary: 'Aqui voce encontra os principais caminhos do portal: solicitar atendimento, acompanhar protocolos, ver servicos e participar das decisoes da cidade.',
    primaryAction: 'Comece por "Abrir solicitacao" se precisa falar com a prefeitura.',
    steps: [
      {
        title: 'Escolha o que precisa fazer',
        body: 'Os cards de acesso rapido levam direto para as tarefas mais usadas, como abrir solicitacao, consultar protocolo, peticoes e painel do cidadao.',
      },
      {
        title: 'Use o mapa de servicos',
        body: 'O botao "Servicos" no topo mostra todas as areas do app em uma grade simples. E o melhor caminho quando voce nao sabe exatamente onde clicar.',
      },
      {
        title: 'Acompanhe tudo pelo painel',
        body: 'Depois de enviar uma solicitacao, relato, matricula, candidatura ou agendamento, o andamento aparece no Painel do Cidadao.',
        tip: 'O simbolo ? fica disponivel para rever esta explicacao quando quiser.',
      },
    ],
  },
  {
    id: 'ouvidoria',
    title: 'Como funciona a Ouvidoria',
    eyebrow: 'Atendimento',
    summary: 'Use esta area para reclamacoes, sugestoes, denuncias e elogios. Cada envio gera um protocolo para acompanhamento.',
    primaryAction: 'Informe tipo, categoria, detalhes e acompanhe a resposta pelo protocolo.',
    steps: [
      {
        title: 'Registre a manifestacao',
        body: 'Escolha se e reclamacao, sugestao, denuncia ou elogio. Depois descreva o assunto com o maximo de clareza possivel.',
      },
      {
        title: 'Guarde o protocolo',
        body: 'Ao confirmar, o sistema gera um codigo unico. Esse codigo ajuda a encontrar a solicitacao depois.',
      },
      {
        title: 'Continue a conversa',
        body: 'Quando a equipe responder, a conversa fica na linha do tempo. Voce pode complementar informacoes sem abrir outro pedido.',
      },
    ],
  },
  {
    id: 'relatar',
    title: 'Como relatar um problema urbano',
    eyebrow: 'Relatos',
    summary: 'Use esta area para avisar sobre buracos, iluminacao, lixo, risco ambiental, seguranca e outros problemas da cidade.',
    primaryAction: 'Foto e localizacao ajudam a equipe a entender e resolver mais rapido.',
    steps: [
      {
        title: 'Escolha o tipo de problema',
        body: 'Selecione a categoria mais proxima: infraestrutura, meio ambiente, seguranca ou outros.',
      },
      {
        title: 'Mostre onde aconteceu',
        body: 'Voce pode informar o endereco manualmente ou usar a localizacao do navegador. Se puder, adicione uma foto.',
      },
      {
        title: 'Revise antes de enviar',
        body: 'Confira os dados antes da confirmacao. Depois do envio, o relato aparece no seu painel com status e mensagens.',
      },
    ],
  },
  {
    id: 'perfil',
    title: 'Painel do Cidadao',
    eyebrow: 'Conta',
    summary: 'Este painel concentra seus protocolos, respostas, atividades, dados pessoais e negocios cadastrados.',
    primaryAction: 'Entre com sua conta para ver seu historico completo.',
    steps: [
      {
        title: 'Veja suas atividades',
        body: 'Solicitacoes, relatos, agendamentos, matriculas, candidaturas e alertas aparecem em uma lista unica.',
      },
      {
        title: 'Abra conversas pendentes',
        body: 'Quando houver nova resposta, o painel mostra um aviso. Abra o item para ler e responder, se necessario.',
      },
      {
        title: 'Mantenha seus dados atualizados',
        body: 'Nome, telefone, bairro e foto ajudam a prefeitura a identificar e atender voce com mais seguranca.',
      },
    ],
  },
  {
    id: 'peticoes',
    title: 'Peticoes e participacao',
    eyebrow: 'Participacao',
    summary: 'Aqui a comunidade cria e assina causas publicas. As peticoes mostram meta, progresso e resposta oficial quando houver.',
    primaryAction: 'Assinar uma peticao pode exigir login para evitar assinaturas duplicadas.',
    steps: [
      {
        title: 'Escolha uma causa',
        body: 'A lista mostra peticoes abertas e o progresso de assinaturas. Abra uma peticao para ler os detalhes.',
      },
      {
        title: 'Assine com seguranca',
        body: 'O sistema verifica se voce ja assinou para manter a contagem correta e transparente.',
      },
      {
        title: 'Crie uma nova peticao',
        body: 'Se a causa ainda nao existe, use a opcao de criar peticao e explique objetivo, motivo e meta.',
      },
    ],
  },
  {
    id: 'peticao-detalhe',
    title: 'Detalhes da peticao',
    eyebrow: 'Participacao',
    summary: 'Nesta tela voce confere o texto completo da causa, acompanha a meta e pode registrar sua assinatura.',
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
        body: 'Voce pode retornar a esta peticao para ver atualizacoes e respostas oficiais.',
      },
    ],
  },
  {
    id: 'saude',
    title: 'Saude facil',
    eyebrow: 'Servicos',
    summary: 'Consulte unidades de saude, tempos de espera, farmacia popular e agendamentos disponiveis.',
    primaryAction: 'Para agendar, escolha a unidade, especialidade, data e confirme.',
    steps: [
      {
        title: 'Encontre uma unidade',
        body: 'Veja endereco, horario, especialidades e indicacao de espera para decidir onde procurar atendimento.',
      },
      {
        title: 'Agende atendimento',
        body: 'O agendamento guia voce por etapas simples: unidade, especialidade, horario e confirmacao.',
      },
      {
        title: 'Consulte historico',
        body: 'Se estiver logado, seus atendimentos aparecem no historico de saude e no Painel do Cidadao.',
      },
    ],
  },
  {
    id: 'educacao',
    title: 'Educacao municipal',
    eyebrow: 'Servicos',
    summary: 'Consulte escolas municipais e acesse a matricula escolar digital.',
    primaryAction: 'Para nova matricula, entre em "Matricula" e preencha as etapas com os dados do responsavel e do aluno.',
    steps: [
      {
        title: 'Consulte escolas',
        body: 'Veja escolas, etapas atendidas, endereco e informacoes basicas antes de solicitar uma vaga.',
      },
      {
        title: 'Inicie a matricula',
        body: 'A matricula pede dados do responsavel, do aluno, endereco, preferencia de escola e revisao final.',
      },
      {
        title: 'Acompanhe o resultado',
        body: 'A fila de matriculas e atualizada pela gestao, e o andamento aparece no Painel do Cidadao.',
      },
    ],
  },
  {
    id: 'matricula',
    title: 'Matricula escolar',
    eyebrow: 'Educacao',
    summary: 'Este formulario coleta os dados necessarios para solicitar vaga escolar de forma organizada.',
    steps: [
      {
        title: 'Preencha por etapas',
        body: 'Siga a ordem: responsavel, aluno, endereco, escola desejada e revisao.',
      },
      {
        title: 'Revise CPF e dados',
        body: 'Dados incorretos podem atrasar a analise. Confira antes de confirmar.',
      },
      {
        title: 'Guarde o protocolo',
        body: 'Depois do envio, use o protocolo e o Painel do Cidadao para acompanhar a resposta.',
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
        body: 'Abra a vaga e confira descricao, requisitos, beneficios e faixa salarial quando informada.',
      },
      {
        title: 'Envie candidatura',
        body: 'Voce pode incluir uma breve apresentacao. O sistema evita candidatura duplicada na mesma vaga.',
      },
    ],
  },
  {
    id: 'comercio',
    title: 'Comercio local',
    eyebrow: 'Economia',
    summary: 'A vitrine mostra negocios aprovados da cidade, com contatos, horario de funcionamento e localizacao.',
    primaryAction: 'Para cadastrar seu negocio, use a area "Meus Negocios" no Painel do Cidadao.',
    steps: [
      {
        title: 'Procure por categoria',
        body: 'Use os filtros para encontrar negocios por segmento e verificar se estao abertos.',
      },
      {
        title: 'Entre em contato',
        body: 'Os cards podem exibir telefone, WhatsApp, endereco e atalho para mapa.',
      },
      {
        title: 'Cadastre seu negocio',
        body: 'O cadastro passa por aprovacao da gestao antes de aparecer publicamente.',
      },
    ],
  },
  {
    id: 'servicos',
    title: 'Diretorio de servicos',
    eyebrow: 'Portal',
    summary: 'Esta area organiza servicos publicos municipais por categoria, local, horario e departamento.',
    steps: [
      {
        title: 'Busque pelo nome',
        body: 'Digite uma palavra relacionada ao servico, departamento ou local para filtrar a lista.',
      },
      {
        title: 'Confira atendimento',
        body: 'Leia horario, localizacao e departamento responsavel antes de se deslocar.',
      },
      {
        title: 'Use como ponto de partida',
        body: 'Quando estiver em duvida, o diretorio ajuda a descobrir qual area do portal deve ser usada.',
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
        body: 'Avisos podem ser informativos, alertas ou urgencias. Prioridades maiores merecem atencao imediata.',
      },
      {
        title: 'Confira a validade',
        body: 'Alguns avisos expiram depois de uma data. O portal filtra comunicados antigos quando necessario.',
      },
      {
        title: 'Volte para atualizacoes',
        body: 'Novos avisos tambem podem aparecer no topo do app quando forem urgentes.',
      },
    ],
  },
  {
    id: 'eventos',
    title: 'Agenda de eventos',
    eyebrow: 'Vida urbana',
    summary: 'Consulte eventos da cidade com data, horario, local, preco e detalhes publicados pela gestao.',
    steps: [
      {
        title: 'Veja data e local',
        body: 'Os cards destacam quando e onde o evento acontece para facilitar o planejamento.',
      },
      {
        title: 'Abra para detalhes',
        body: 'A pagina do evento pode trazer descricao completa, informacoes de preco e orientacoes.',
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
    summary: 'Aqui ficam as informacoes completas de um evento especifico.',
    steps: [
      {
        title: 'Confira antes de ir',
        body: 'Leia data, horario, local, preco e descricao para evitar deslocamento desnecessario.',
      },
      {
        title: 'Use o local como referencia',
        body: 'Quando houver endereco ou ponto de referencia, use essa informacao para se planejar.',
      },
      {
        title: 'Volte para a agenda',
        body: 'A lista de eventos mostra outras atividades disponiveis na cidade.',
      },
    ],
  },
  {
    id: 'obras',
    title: 'Obras publicas',
    eyebrow: 'Gestao urbana',
    summary: 'Acompanhe obras municipais com localizacao, tipo, orcamento, progresso e atualizacoes.',
    steps: [
      {
        title: 'Veja o progresso',
        body: 'Cada obra pode mostrar percentual de andamento e informacoes principais.',
      },
      {
        title: 'Entenda o impacto',
        body: 'Confira tipo da obra, localizacao e atualizacoes para saber o que esta acontecendo na regiao.',
      },
      {
        title: 'Abra detalhes',
        body: 'A pagina detalhada concentra historico e dados completos quando disponiveis.',
      },
    ],
  },
  {
    id: 'obra-detalhe',
    title: 'Detalhes da obra',
    eyebrow: 'Gestao urbana',
    summary: 'Nesta tela voce acompanha uma obra especifica com dados completos e atualizacoes.',
    steps: [
      {
        title: 'Confira status e progresso',
        body: 'Use as informacoes de andamento para entender a fase atual da obra.',
      },
      {
        title: 'Leia as atualizacoes',
        body: 'A linha do tempo ajuda a acompanhar mudancas, etapas concluidas e comunicados.',
      },
      {
        title: 'Compare com outras obras',
        body: 'Volte para a lista para consultar outros locais e iniciativas municipais.',
      },
    ],
  },
  {
    id: 'votos',
    title: 'Votacoes publicas',
    eyebrow: 'Participacao',
    summary: 'Participe de enquetes oficiais e veja resultados atualizados com contagem de votos.',
    primaryAction: 'Seu voto pode exigir login para garantir uma participacao por pessoa.',
    steps: [
      {
        title: 'Escolha uma enquete',
        body: 'Leia a pergunta e as opcoes antes de votar.',
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
    title: 'Seguranca cidada',
    eyebrow: 'Servicos',
    summary: 'Consulte zonas seguras e use recursos de alerta de emergencia quando necessario.',
    primaryAction: 'Use o SOS apenas em situacoes reais de risco.',
    steps: [
      {
        title: 'Consulte zonas',
        body: 'As zonas mostram areas cadastradas e nivel de risco para orientar deslocamentos.',
      },
      {
        title: 'Acione emergencia com responsabilidade',
        body: 'O botao SOS gera alerta e protocolo para a fila de atendimento.',
      },
      {
        title: 'Acompanhe pelo painel',
        body: 'Alertas vinculados a sua conta aparecem no Painel do Cidadao.',
      },
    ],
  },
  {
    id: 'transito',
    title: 'Transito e mobilidade',
    eyebrow: 'Servicos',
    summary: 'Veja alertas de acidentes, obras, desvios, congestionamentos e validade das informacoes.',
    steps: [
      {
        title: 'Observe a severidade',
        body: 'Alertas podem ter gravidade baixa, media, alta ou critica.',
      },
      {
        title: 'Confira o local',
        body: 'Use a localizacao para decidir melhor rota ou evitar trechos impactados.',
      },
      {
        title: 'Veja a validade',
        body: 'Alguns alertas deixam de valer apos uma data ou horario.',
      },
    ],
  },
  {
    id: 'tributos',
    title: 'Tributos municipais',
    eyebrow: 'Gestao',
    summary: 'Consulte informacoes sobre IPTU, ISS, ITBI, taxas, valores, vencimentos e status quando publicados.',
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
        body: 'Quando houver duvida sobre cobranca ou regularizacao, abra solicitacao na Ouvidoria.',
      },
    ],
  },
  {
    id: 'social',
    title: 'Programas sociais',
    eyebrow: 'Servicos',
    summary: 'Veja programas, beneficios, requisitos, locais de atendimento e orientacoes sociais do municipio.',
    steps: [
      {
        title: 'Leia os requisitos',
        body: 'Cada programa pode ter criterios de participacao. Confira antes de procurar atendimento.',
      },
      {
        title: 'Confira local e categoria',
        body: 'Use categoria e localizacao para encontrar o programa correto.',
      },
      {
        title: 'Abra solicitacao se precisar',
        body: 'Se faltar informacao ou houver duvida, use a Ouvidoria para pedir orientacao.',
      },
    ],
  },
  {
    id: 'meio-ambiente',
    title: 'Meio ambiente',
    eyebrow: 'Servicos',
    summary: 'Acompanhe dados e alertas ambientais, como qualidade da agua, ar, areas verdes e ocorrencias.',
    steps: [
      {
        title: 'Entenda o indicador',
        body: 'Leia o tipo, valor e unidade para interpretar corretamente cada dado ambiental.',
      },
      {
        title: 'Veja a localizacao',
        body: 'Alguns dados se aplicam a areas especificas do municipio.',
      },
      {
        title: 'Relate problemas',
        body: 'Para lixo irregular, risco ambiental ou situacao urgente, use Relatar Problema ou Ouvidoria.',
      },
    ],
  },
  {
    id: 'comunidade',
    title: 'Comunidade',
    eyebrow: 'Vida urbana',
    summary: 'Encontre grupos, iniciativas e atividades comunitarias cadastradas no municipio.',
    steps: [
      {
        title: 'Procure por categoria',
        body: 'Filtre grupos por tema, bairro ou interesse quando essas informacoes estiverem disponiveis.',
      },
      {
        title: 'Leia a descricao',
        body: 'A descricao explica o objetivo do grupo e o publico envolvido.',
      },
      {
        title: 'Participe da vida local',
        body: 'Use as informacoes de contato ou local para se aproximar das iniciativas da cidade.',
      },
    ],
  },
  {
    id: 'gestao',
    title: 'Painel de gestao',
    eyebrow: 'Equipe',
    summary: 'Area restrita para equipes autorizadas acompanharem filas, protocolos, conteudos, usuarios e auditoria.',
    primaryAction: 'Priorize itens com nova resposta, pendencias e alertas de emergencia.',
    steps: [
      {
        title: 'Use as abas do painel',
        body: 'As secoes organizam solicitacoes, relatos, conteudos, peticoes, usuarios e auditoria conforme seu perfil.',
      },
      {
        title: 'Filtre antes de agir',
        body: 'Busca, status e ordenacao ajudam a encontrar protocolos urgentes e respostas novas do cidadao.',
      },
      {
        title: 'Registre respostas claras',
        body: 'Atualizar status e resposta oficial mantem o cidadao informado e cria historico para acompanhamento.',
      },
    ],
  },
  {
    id: 'sobre',
    title: 'Sobre o portal',
    eyebrow: 'Informacao',
    summary: 'Esta pagina explica a proposta do Conecta Santa Maria e os canais digitais do municipio.',
    steps: [
      {
        title: 'Entenda o objetivo',
        body: 'O portal centraliza servicos, participacao e acompanhamento de demandas municipais.',
      },
      {
        title: 'Use como referencia',
        body: 'Quando quiser explicar o app para outra pessoa, esta pagina resume a finalidade do projeto.',
      },
      {
        title: 'Volte aos servicos',
        body: 'Depois de entender o portal, use o menu para acessar a area que precisa.',
      },
    ],
  },
  {
    id: 'legal',
    title: 'Privacidade e termos',
    eyebrow: 'Informacao',
    summary: 'Aqui ficam regras de uso, privacidade e informacoes legais do portal.',
    steps: [
      {
        title: 'Leia antes de usar dados pessoais',
        body: 'Entenda como dados de cadastro, protocolos e atividades podem ser usados no atendimento digital.',
      },
      {
        title: 'Confira responsabilidades',
        body: 'Os termos explicam condutas esperadas e limites do servico.',
      },
      {
        title: 'Volte quando precisar',
        body: 'O link fica disponivel no rodape para consulta futura.',
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
