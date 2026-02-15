// Baseado em Fisher & Wells (2009) - Metacognitive Therapy: Distinctive Features

export interface QuestionnaireItem {
  id: string;
  text: string;
  subscale?: string;
}

export interface Questionnaire {
  id: string;
  name: string;
  fullName: string;
  description: string;
  items: QuestionnaireItem[];
  scaleType: 'likert4' | 'likert5';
  scaleLabels: string[];
  estimatedMinutes: number;
  subscales?: string[];
  interpretation?: {
    low: string;
    moderate: string;
    high: string;
  };
}

// MCQ-30: Metacognitions Questionnaire-30
// Avalia crenças metacognitivas em 5 dimensões
export const MCQ30: Questionnaire = {
  id: 'mcq30',
  name: 'MCQ-30',
  fullName: 'Metacognitions Questionnaire-30',
  description: 'Avalia crenças metacognitivas relacionadas a preocupação, controle de pensamentos e automonitoramento cognitivo.',
  estimatedMinutes: 10,
  scaleType: 'likert4',
  scaleLabels: ['Não concordo', 'Concordo ligeiramente', 'Concordo moderadamente', 'Concordo muito'],
  subscales: [
    'Crenças Positivas sobre Preocupação',
    'Incontrolabilidade e Perigo',
    'Confiança Cognitiva',
    'Necessidade de Controlar Pensamentos',
    'Autoconsciência Cognitiva'
  ],
  items: [
    { id: 'mcq30_1', text: 'Preocupar-me ajuda a evitar problemas no futuro', subscale: 'Crenças Positivas sobre Preocupação' },
    { id: 'mcq30_2', text: 'Minha preocupação é perigosa para mim', subscale: 'Incontrolabilidade e Perigo' },
    { id: 'mcq30_3', text: 'Tenho pouca confiança na minha memória para palavras e nomes', subscale: 'Confiança Cognitiva' },
    { id: 'mcq30_4', text: 'Meus pensamentos de preocupação persistem, não importa como eu tente pará-los', subscale: 'Incontrolabilidade e Perigo' },
    { id: 'mcq30_5', text: 'Preocupar-me com um problema ajuda a encontrar soluções', subscale: 'Crenças Positivas sobre Preocupação' },
    { id: 'mcq30_6', text: 'Tenho pouca confiança na minha memória para lugares', subscale: 'Confiança Cognitiva' },
    { id: 'mcq30_7', text: 'Presto muita atenção à forma como minha mente funciona', subscale: 'Autoconsciência Cognitiva' },
    { id: 'mcq30_8', text: 'Tenho muitos pensamentos que não consigo parar', subscale: 'Incontrolabilidade e Perigo' },
    { id: 'mcq30_9', text: 'Preocupar-me me ajuda a lidar com as coisas', subscale: 'Crenças Positivas sobre Preocupação' },
    { id: 'mcq30_10', text: 'Preciso me preocupar para permanecer organizado', subscale: 'Crenças Positivas sobre Preocupação' },
    { id: 'mcq30_11', text: 'Tenho pouca confiança na minha memória para ações', subscale: 'Confiança Cognitiva' },
    { id: 'mcq30_12', text: 'Monitoro constantemente meus pensamentos', subscale: 'Autoconsciência Cognitiva' },
    { id: 'mcq30_13', text: 'Devo controlar todos os meus pensamentos', subscale: 'Necessidade de Controlar Pensamentos' },
    { id: 'mcq30_14', text: 'Minha memória pode me enganar às vezes', subscale: 'Confiança Cognitiva' },
    { id: 'mcq30_15', text: 'Minha capacidade de controlar meus pensamentos está falhando', subscale: 'Incontrolabilidade e Perigo' },
    { id: 'mcq30_16', text: 'Preciso me preocupar para trabalhar bem', subscale: 'Crenças Positivas sobre Preocupação' },
    { id: 'mcq30_17', text: 'Não confio na minha memória', subscale: 'Confiança Cognitiva' },
    { id: 'mcq30_18', text: 'Penso muito sobre meus pensamentos', subscale: 'Autoconsciência Cognitiva' },
    { id: 'mcq30_19', text: 'Poderia ser punido por não controlar certos pensamentos', subscale: 'Necessidade de Controlar Pensamentos' },
    { id: 'mcq30_20', text: 'Tenho pensamentos que tentam me controlar', subscale: 'Incontrolabilidade e Perigo' },
    { id: 'mcq30_21', text: 'Preciso me preocupar para me manter seguro', subscale: 'Crenças Positivas sobre Preocupação' },
    { id: 'mcq30_22', text: 'Seria capaz de funcionar muito melhor se não tivesse maus pensamentos', subscale: 'Necessidade de Controlar Pensamentos' },
    { id: 'mcq30_23', text: 'Estou constantemente ciente do meu pensamento', subscale: 'Autoconsciência Cognitiva' },
    { id: 'mcq30_24', text: 'Tenho dificuldade em lembrar se realmente fiz algo ou apenas pensei sobre isso', subscale: 'Confiança Cognitiva' },
    { id: 'mcq30_25', text: 'É ruim ter certos pensamentos', subscale: 'Necessidade de Controlar Pensamentos' },
    { id: 'mcq30_26', text: 'Não deveria ter certos pensamentos', subscale: 'Necessidade de Controlar Pensamentos' },
    { id: 'mcq30_27', text: 'Quando começo a me preocupar, não consigo parar', subscale: 'Incontrolabilidade e Perigo' },
    { id: 'mcq30_28', text: 'Poderia ficar louco com meus pensamentos de preocupação', subscale: 'Incontrolabilidade e Perigo' },
    { id: 'mcq30_29', text: 'Analiso constantemente o que estou pensando', subscale: 'Autoconsciência Cognitiva' },
    { id: 'mcq30_30', text: 'Algumas coisas não deveriam ser pensadas', subscale: 'Necessidade de Controlar Pensamentos' }
  ],
  interpretation: {
    low: 'Baixos níveis de crenças metacognitivas disfuncionais',
    moderate: 'Níveis moderados de crenças metacognitivas que podem requerer atenção',
    high: 'Altos níveis de crenças metacognitivas disfuncionais que podem estar mantendo sintomas'
  }
};

// NBRS: Negative Beliefs about Rumination Scale
export const NBRS: Questionnaire = {
  id: 'nbrs',
  name: 'NBRS',
  fullName: 'Negative Beliefs about Rumination Scale',
  description: 'Avalia crenças negativas sobre a incontrolabilidade e perigo da ruminação.',
  estimatedMinutes: 5,
  scaleType: 'likert4',
  scaleLabels: ['Não concordo', 'Concordo ligeiramente', 'Concordo moderadamente', 'Concordo muito'],
  items: [
    { id: 'nbrs_1', text: 'Ruminar sobre meus problemas é incontrolável' },
    { id: 'nbrs_2', text: 'Ruminar sobre o passado é perigoso para mim' },
    { id: 'nbrs_3', text: 'Não consigo parar de ruminar quando começo' },
    { id: 'nbrs_4', text: 'Ruminar pode me fazer perder o controle' },
    { id: 'nbrs_5', text: 'Ruminar sobre meus sentimentos é prejudicial' },
    { id: 'nbrs_6', text: 'Minha ruminação vai piorar se eu não fizer algo' },
    { id: 'nbrs_7', text: 'Ruminar pode me fazer mal fisicamente' },
    { id: 'nbrs_8', text: 'Não tenho controle sobre minha ruminação' },