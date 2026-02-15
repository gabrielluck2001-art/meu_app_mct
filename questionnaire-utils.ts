import type { Assessment, AssessmentResponse } from '@/types/models';
import { MCQ30, NBRS, PBRS, type Questionnaire } from '@/questionnaires-data';

// Calcular score total de uma avaliação
export function calculateTotalScore(responses: AssessmentResponse[]): number {
  return responses.reduce((sum, response) => sum + response.value, 0);
}

// Calcular scores por subescala (para MCQ-30)
export function calculateSubscaleScores(
  responses: AssessmentResponse[],
  questionnaire: Questionnaire
): Record<string, number> {
  if (!questionnaire.subscales) {
    return {};
  }

  const subscaleScores: Record<string, number> = {};
  
  questionnaire.subscales.forEach(subscale => {
    const subscaleResponses = responses.filter(r => r.subscale === subscale);
    subscaleScores[subscale] = subscaleResponses.reduce((sum, r) => sum + r.value, 0);
  });

  return subscaleScores;
}

// Interpretar score baseado no questionário
export function interpretScore(score: number, questionnaireId: string): string {
  const questionnaire = getQuestionnaireById(questionnaireId);
  if (!questionnaire || !questionnaire.interpretation) {
    return 'Interpretação não disponível';
  }

  const maxScore = questionnaire.items.length * (questionnaire.scaleType === 'likert4' ? 4 : 5);
  const percentage = (score / maxScore) * 100;

  if (percentage < 33) {
    return questionnaire.interpretation.low;
  } else if (percentage < 67) {
    return questionnaire.interpretation.moderate;
  } else {
    return questionnaire.interpretation.high;
  }
}

// Obter questionário por ID
export function getQuestionnaireById(id: string): Questionnaire | undefined {
  switch (id) {
    case 'mcq30':
      return MCQ30;
    case 'nbrs':
      return NBRS;
    case 'pbrs':
      return PBRS;
    default:
      return undefined;
  }
}

// Calcular mudança percentual entre duas avaliações
export function calculatePercentChange(oldScore: number, newScore: number): number {
  if (oldScore === 0) return 0;
  return ((newScore - oldScore) / oldScore) * 100;
}

// Determinar tendência (melhora, piora, estável)
export function getTrend(percentChange: number): 'improvement' | 'decline' | 'stable' {
  if (percentChange < -5) return 'improvement'; // Redução de score é melhora
  if (percentChange > 5) return 'decline'; // Aumento de score é piora
  return 'stable';
}

// Obter cor baseada na tendência
export function getTrendColor(trend: 'improvement' | 'decline' | 'stable'): string {
  switch (trend) {
    case 'improvement':
      return '#22C55E'; // success
    case 'decline':
      return '#EF4444'; // error
    case 'stable':
      return '#F59E0B'; // warning
  }
}

// Formatar data para exibição
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Formatar data com hora
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calcular média de scores
export function calculateAverageScore(assessments: Assessment[]): number {
  if (assessments.length === 0) return 0;
  const total = assessments.reduce((sum, a) => sum + a.totalScore, 0);
  return total / assessments.length;
}

// Obter última avaliação de um paciente
export function getLastAssessment(
  patientId: string,
  assessments: Assessment[]
): Assessment | undefined {
  const patientAssessments = assessments
    .filter(a => a.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return patientAssessments[0];
}

// Calcular dias desde última avaliação
export function daysSinceLastAssessment(lastAssessmentDate: string): number {
  const now = new Date();
  const lastDate = new Date(lastAssessmentDate);
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
