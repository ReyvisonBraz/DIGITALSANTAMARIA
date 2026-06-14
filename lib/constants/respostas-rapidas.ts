/**
 * Templates de respostas rápidas para o painel de gestão.
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
      text: 'Para agilizar o atendimento da sua solicitação de infraestrutura, por favor informe:\n\n- Endereço completo com ponto de referência\n- Bairro\n- Data em que o problema foi observado\n- Se possível, uma foto do local\n\nEssas informações ajudam a localizar e priorizar o atendimento.',
      group: 'solicitar_dados',
    },
    {
      label: 'Pedir dados - iluminação',
      text: 'Para verificarmos a iluminação pública no local informado, precisamos que nos envie:\n\n- Endereço completo, com rua e número aproximado\n- Bairro\n- Número do poste, se estiver visível\n- O problema é lâmpada apagada, quebrada ou intermitente?\n\nCom esses dados, encaminhamos a equipe técnica.',
      group: 'solicitar_dados',
    },
    {
      label: 'Pedir dados - saneamento/agua',
      text: 'Para sua solicitação de saneamento ou água, precisamos das seguintes informações:\n\n- Endereço completo com ponto de referência\n- Bairro\n- Tipo de problema: vazamento, falta de água, esgoto a céu aberto ou entupimento\n- Desde quando o problema ocorre\n- Há risco à saúde ou segurança?\n\nEncaminharemos ao setor responsável.',
      group: 'solicitar_dados',
    },
  ],
  saude: [
    {
      label: 'Pedir dados - atendimento',
      text: 'Para darmos andamento à sua manifestação sobre saúde, favor informar:\n\n- Nome completo do paciente\n- Número do Cartão SUS\n- Unidade de saúde onde ocorreu o fato\n- Data e horário do ocorrido\n- Nome do profissional, se aplicável\n\nSeus dados serão tratados com sigilo.',
      group: 'solicitar_dados',
    },
    {
      label: 'Pedir dados - medicamento',
      text: 'Sobre sua solicitação de medicamento, precisamos verificar:\n\n- Nome completo do paciente\n- Número do Cartão SUS\n- Nome do medicamento e dosagem\n- Receita médica válida\n- Unidade de saúde de referência\n\nA disponibilidade depende do estoque municipal.',
      group: 'solicitar_dados',
    },
  ],
  educacao: [
    {
      label: 'Pedir dados - matrícula',
      text: 'Para sua solicitação sobre matrícula escolar, precisamos dos seguintes dados:\n\n- Nome completo do aluno\n- Data de nascimento\n- Nome do responsável e telefone de contato\n- Endereço completo e bairro\n- Escola de preferência\n- Série ou ano pretendido',
      group: 'solicitar_dados',
    },
    {
      label: 'Pedir dados - transporte escolar',
      text: 'Para cadastro no transporte escolar, favor informar:\n\n- Nome do aluno\n- Escola onde está matriculado\n- Endereço completo e bairro\n- Série e turno\n- Nome e telefone do responsável\n\nO setor responsável avaliará a rota disponível.',
      group: 'solicitar_dados',
    },
  ],
  seguranca: [
    {
      label: 'Pedir dados - ocorrência',
      text: 'Para encaminharmos sua solicitação de segurança, informe:\n\n- Local exato da ocorrência com ponto de referência\n- Bairro\n- Data e horário do ocorrido\n- Descrição detalhada da situação\n- Se há testemunhas ou vítimas\n- Se já foi registrado boletim de ocorrência\n\nEncaminharemos aos órgãos competentes.',
      group: 'solicitar_dados',
    },
  ],
  transito: [
    {
      label: 'Pedir dados - sinalização',
      text: 'Para seu relato de trânsito, nos informe:\n\n- Local exato, com rua ou avenida e cruzamento\n- Bairro\n- Tipo de problema: semáforo apagado, placa danificada, falta de sinalização ou faixa de pedestres\n- Data e horário em que observou\n- Se há risco de acidente\n\nA equipe de trânsito fará vistoria no local.',
      group: 'solicitar_dados',
    },
  ],
  meio_ambiente: [
    {
      label: 'Pedir dados - denúncia ambiental',
      text: 'Para processar sua denúncia ambiental, precisamos de:\n\n- Local exato com ponto de referência\n- Bairro\n- Tipo de ocorrência: queimada, desmatamento, lixo, entulho, poluição de rio ou poda irregular\n- Data e horário\n- Foto ou vídeo, se possível\n\nDenúncias podem ser anônimas.',
      group: 'solicitar_dados',
    },
  ],
  social: [
    {
      label: 'Pedir dados - cadastro social',
      text: 'Para sua solicitação na área social, favor informar:\n\n- Nome completo\n- CPF e NIS, se possuir\n- Endereço completo e bairro\n- Telefone para contato\n- Composição familiar\n- Renda familiar aproximada\n\nO atendimento será encaminhado ao setor responsável.',
      group: 'solicitar_dados',
    },
  ],
  outros: [
    {
      label: 'Pedir dados - geral',
      text: 'Para darmos andamento à sua manifestação, pedimos que nos envie mais informações:\n\n- Detalhes específicos do ocorrido\n- Local e bairro\n- Data em que o fato aconteceu\n- Documentos ou fotos que ajudem na análise\n\nSua colaboração é importante para um atendimento mais ágil.',
      group: 'solicitar_dados',
    },
  ],
};

export const GENERIC_QUICK_RESPONSES: QuickResponse[] = [
  {
    label: 'Resolvido - finalizar',
    text: 'Sua manifestação foi analisada e as providências cabíveis foram tomadas. Agradecemos o contato e reforçamos que a Ouvidoria Municipal está à disposição para novas solicitações.\n\nAtenciosamente,\nOuvidoria Municipal de Santa Maria do Pará',
    group: 'resolucao',
  },
  {
    label: 'Resolvido - serviço executado',
    text: 'Informamos que o serviço solicitado foi executado pela equipe responsável. O local passou por vistoria e a situação foi regularizada.\n\nAgradecemos por nos informar sobre o problema.\n\nAtenciosamente,\nPrefeitura Municipal de Santa Maria do Pará',
    group: 'resolucao',
  },
  {
    label: 'Recusado - fora da competencia',
    text: 'Sua manifestação foi analisada, mas este tipo de solicitação não está na competência direta da Prefeitura Municipal. Recomendamos entrar em contato com o órgão responsável.\n\nPermanecemos à disposição para outras demandas de âmbito municipal.',
    group: 'rejeicao',
  },
  {
    label: 'Recusado - falta de informações',
    text: 'Sua manifestação não pode ser processada porque faltam informações essenciais para análise. Por favor, abra uma nova solicitação com descrição detalhada, endereço completo, bairro e data do ocorrido.\n\nEstamos à disposição para auxiliar.',
    group: 'rejeicao',
  },
  {
    label: 'Encaminhamento - interno',
    text: 'Sua manifestação foi recebida e encaminhada para o departamento responsável. O prazo para análise é de até 15 dias úteis.\n\nAcompanhe o andamento pelo número do protocolo no portal.\n\nAtenciosamente,\nOuvidoria Municipal',
    group: 'encaminhamento',
  },
  {
    label: 'Encaminhamento - setor externo',
    text: 'Sua manifestação foi encaminhada ao setor responsável pelo serviço. Assim que houver retorno, atualizaremos este protocolo no portal.\n\nAtenciosamente,\nOuvidoria Municipal',
    group: 'encaminhamento',
  },
];

export function getResponsesForCategory(category: string): QuickResponse[] {
  const specific = QUICK_RESPONSES[category] || QUICK_RESPONSES.outros;
  return [...specific, ...GENERIC_QUICK_RESPONSES];
}
