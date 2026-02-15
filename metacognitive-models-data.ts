// Baseado em Fisher & Wells (2009) - Metacognitive Therapy: Distinctive Features

export interface MetacognitiveModel {
  disorder: string;
  trigger: string;
  positiveBeliefs: string[];
  negativeBeliefs: string[];
  cognitiveAttentionalSyndrome: {
    worry: string;
    rumination: string;
    threatMonitoring: string;
    thoughtSuppression: string;
  };
  emotions: string[];
  behaviors: string[];
}

// Metacrenças Positivas Comuns (aplicáveis a vários transtornos)
export const COMMON_POSITIVE_BELIEFS = [
  "Preocupar-me me ajuda a resolver problemas",
  "Preocupar-me me mantém preparado",
  "Preocupar-me evita que coisas ruins aconteçam",
  "Ruminar me ajuda a entender meus sentimentos",
  "Ruminar sobre o passado me ajuda a prevenir erros futuros",
  "Analisar meus pensamentos me ajuda a ter controle",
  "Preciso monitorar constantemente meus pensamentos",
  "Focar em ameaças me mantém seguro",
  "Verificar perigos me protege",
  "Controlar meus pensamentos é essencial"
];

// Metacrenças Negativas Comuns (aplicáveis a vários transtornos)
export const COMMON_NEGATIVE_BELIEFS = [
  "Minha preocupação é incontrolável",
  "Minha preocupação é perigosa para mim",
  "Não consigo parar de ruminar quando começo",
  "Ruminar pode me fazer perder o controle",
  "Meus pensamentos podem me fazer mal",
  "Não tenho controle sobre meus pensamentos",
  "Pensar certas coisas pode fazer com que aconteçam",
  "Minha mente está falhando",
  "Vou enlouquecer com meus pensamentos",
  "Não posso confiar na minha memória"
];

// Modelo para TAG (Transtorno de Ansiedade Generalizada)
export const GAD_MODEL: MetacognitiveModel = {
  disorder: "TAG - Transtorno de Ansiedade Generalizada",
  trigger: "Pensamento intrusivo sobre ameaça futura (ex: 'E se algo der errado?')",