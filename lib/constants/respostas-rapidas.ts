/**
 * Templates de respostas rapidas para o painel de gestao.
 *
 * Organizados por categoria e por cenario. O gestor clica no chip e o texto
 * preenche o textarea sem perder a liberdade de editar antes de salvar.
 */

export interface QuickResponse {
  label: string;
  text: string;
  group: 'solicitar_dados' | 'resolucao' | 'rejeicao' | 'encaminhamento';
}

export const QUICK_RESPONSES: Record<string, QuickResponse[]> = {
  infraestrutura: [
    {
      label: 'Pedir dados - asfalto/buraco',
      text: 'Para agilizar o atendimento da sua solicitacao de infraestrutura, por favor informe:\n\n- Endereco completo com ponto de referencia\n- Bairro\n- Data em que o problema foi observado\n- Se possivel, uma foto do local\n\nEssas informacoes ajudam a localizar e priorizar o atendimento.',
      group: 'solicitar_dados',
    },
    {
      label: 'Pedir dados - iluminacao',
      text: 'Para verificarmos a iluminacao publica no local informado, precisamos que nos envie:\n\n- Endereco completo, com rua e numero aproximado\n- Bairro\n- Numero do poste, se estiver visivel\n- O problema e lampada apagada, quebrada ou intermitente?\n\nCom esses dados, encaminhamos a equipe tecnica.',
      group: 'solicitar_dados',
    },
    {
      label: 'Pedir dados - saneamento/agua',
      text: 'Para sua solicitacao de saneamento ou agua, precisamos das seguintes informacoes:\n\n- Endereco completo com ponto de referencia\n- Bairro\n- Tipo de problema: vazamento, falta de agua, esgoto a ceu aberto ou entupimento\n- Desde quando o problema ocorre\n- Ha risco a saude ou seguranca?\n\nEncaminharemos ao setor responsavel.',
      group: 'solicitar_dados',
    },
  ],
  saude: [
    {
      label: 'Pedir dados - atendimento',
      text: 'Para darmos andamento a sua manifestacao sobre saude, favor informar:\n\n- Nome completo do paciente\n- Numero do Cartao SUS\n- Unidade de saude onde ocorreu o fato\n- Data e horario do ocorrido\n- Nome do profissional, se aplicavel\n\nSeus dados serao tratados com sigilo.',
      group: 'solicitar_dados',
    },
    {
      label: 'Pedir dados - medicamento',
      text: 'Sobre sua solicitacao de medicamento, precisamos verificar:\n\n- Nome completo do paciente\n- Numero do Cartao SUS\n- Nome do medicamento e dosagem\n- Receita medica valida\n- Unidade de saude de referencia\n\nA disponibilidade depende do estoque municipal.',
      group: 'solicitar_dados',
    },
  ],
  educacao: [
    {
      label: 'Pedir dados - matricula',
      text: 'Para sua solicitacao sobre matricula escolar, precisamos dos seguintes dados:\n\n- Nome completo do aluno\n- Data de nascimento\n- Nome do responsavel e telefone de contato\n- Endereco completo e bairro\n- Escola de preferencia\n- Serie ou ano pretendido',
      group: 'solicitar_dados',
    },
    {
      label: 'Pedir dados - transporte escolar',
      text: 'Para cadastro no transporte escolar, favor informar:\n\n- Nome do aluno\n- Escola onde esta matriculado\n- Endereco completo e bairro\n- Serie e turno\n- Nome e telefone do responsavel\n\nO setor responsavel avaliara a rota disponivel.',
      group: 'solicitar_dados',
    },
  ],
  seguranca: [
    {
      label: 'Pedir dados - ocorrencia',
      text: 'Para encaminharmos sua solicitacao de seguranca, informe:\n\n- Local exato da ocorrencia com ponto de referencia\n- Bairro\n- Data e horario do ocorrido\n- Descricao detalhada da situacao\n- Se ha testemunhas ou vitimas\n- Se ja foi registrado boletim de ocorrencia\n\nEncaminharemos aos orgaos competentes.',
      group: 'solicitar_dados',
    },
  ],
  transito: [
    {
      label: 'Pedir dados - sinalizacao',
      text: 'Para seu relato de transito, nos informe:\n\n- Local exato, com rua ou avenida e cruzamento\n- Bairro\n- Tipo de problema: semaforo apagado, placa danificada, falta de sinalizacao ou faixa de pedestres\n- Data e horario em que observou\n- Se ha risco de acidente\n\nA equipe de transito fara vistoria no local.',
      group: 'solicitar_dados',
    },
  ],
  meio_ambiente: [
    {
      label: 'Pedir dados - denuncia ambiental',
      text: 'Para processar sua denuncia ambiental, precisamos de:\n\n- Local exato com ponto de referencia\n- Bairro\n- Tipo de ocorrencia: queimada, desmatamento, lixo, entulho, poluicao de rio ou poda irregular\n- Data e horario\n- Foto ou video, se possivel\n\nDenuncias podem ser anonimas.',
      group: 'solicitar_dados',
    },
  ],
  social: [
    {
      label: 'Pedir dados - cadastro social',
      text: 'Para sua solicitacao na area social, favor informar:\n\n- Nome completo\n- CPF e NIS, se possuir\n- Endereco completo e bairro\n- Telefone para contato\n- Composicao familiar\n- Renda familiar aproximada\n\nO atendimento sera encaminhado ao setor responsavel.',
      group: 'solicitar_dados',
    },
  ],
  outros: [
    {
      label: 'Pedir dados - geral',
      text: 'Para darmos andamento a sua manifestacao, pedimos que nos envie mais informacoes:\n\n- Detalhes especificos do ocorrido\n- Local e bairro\n- Data em que o fato aconteceu\n- Documentos ou fotos que ajudem na analise\n\nSua colaboracao e importante para um atendimento mais agil.',
      group: 'solicitar_dados',
    },
  ],
};

export const GENERIC_QUICK_RESPONSES: QuickResponse[] = [
  {
    label: 'Resolvido - finalizar',
    text: 'Sua manifestacao foi analisada e as providencias cabiveis foram tomadas. Agradecemos o contato e reforcamos que a Ouvidoria Municipal esta a disposicao para novas solicitacoes.\n\nAtenciosamente,\nOuvidoria Municipal de Santa Maria do Para',
    group: 'resolucao',
  },
  {
    label: 'Resolvido - servico executado',
    text: 'Informamos que o servico solicitado foi executado pela equipe responsavel. O local passou por vistoria e a situacao foi regularizada.\n\nAgradecemos por nos informar sobre o problema.\n\nAtenciosamente,\nPrefeitura Municipal de Santa Maria do Para',
    group: 'resolucao',
  },
  {
    label: 'Recusado - fora da competencia',
    text: 'Sua manifestacao foi analisada, mas este tipo de solicitacao nao esta na competencia direta da Prefeitura Municipal. Recomendamos entrar em contato com o orgao responsavel.\n\nPermanecemos a disposicao para outras demandas de ambito municipal.',
    group: 'rejeicao',
  },
  {
    label: 'Recusado - falta de informacoes',
    text: 'Sua manifestacao nao pode ser processada porque faltam informacoes essenciais para analise. Por favor, abra uma nova solicitacao com descricao detalhada, endereco completo, bairro e data do ocorrido.\n\nEstamos a disposicao para auxiliar.',
    group: 'rejeicao',
  },
  {
    label: 'Encaminhamento - interno',
    text: 'Sua manifestacao foi recebida e encaminhada para o departamento responsavel. O prazo para analise e de ate 15 dias uteis.\n\nAcompanhe o andamento pelo numero do protocolo no portal.\n\nAtenciosamente,\nOuvidoria Municipal',
    group: 'encaminhamento',
  },
  {
    label: 'Encaminhamento - setor externo',
    text: 'Sua manifestacao foi encaminhada ao setor responsavel pelo servico. Assim que houver retorno, atualizaremos este protocolo no portal.\n\nAtenciosamente,\nOuvidoria Municipal',
    group: 'encaminhamento',
  },
];

export function getResponsesForCategory(category: string): QuickResponse[] {
  const specific = QUICK_RESPONSES[category] || QUICK_RESPONSES.outros;
  return [...specific, ...GENERIC_QUICK_RESPONSES];
}
