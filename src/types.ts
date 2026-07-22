export type Quadrant = 'upper-right' | 'upper-left' | 'lower-left' | 'lower-right';

export type ToothStatus = 'healthy' | 'decay' | 'filled' | 'crown' | 'root-canal' | 'missing' | 'implanted' | 'selected';

export interface Tooth {
  number: number;
  name: string;
  quadrant: Quadrant;
  type: 'Incisor' | 'Canine' | 'Premolar' | 'Molar';
  status?: ToothStatus;
  notes?: string;
}

export interface SymptomInput {
  toothNumber?: number;
  painLevel: number; // 1-10
  duration: string; // e.g. "2 days", "Sudden onset", "1 week+"
  symptoms: string[];
  triggers: string[]; // "Hot", "Cold", "Sweet", "Chewing", "Lying down", "Spontaneous"
  description: string;
}

export interface TriageResult {
  urgency: 'EMERGENCY' | 'PROMPT' | 'ROUTINE';
  urgencyReason: string;
  potentialConditions: {
    name: string;
    description: string;
    likelihood: 'High' | 'Moderate' | 'Low';
  }[];
  immediateActions: string[];
  whatToAvoid: string[];
  questionsForDentist: string[];
  recommendedProcedures?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  cdtCodes: { code: string; title: string; feeEst?: number }[];
  doctorSignaturePrompt?: string;
}

export interface TreatmentPlanItem {
  toothNumber?: number;
  cdtCode: string;
  procedureName: string;
  priority: 'Immediate' | 'Phase 1' | 'Phase 2' | 'Elective';
  estimatedCost: number;
  estimatedInsuranceCoverage: number;
  notes: string;
}

export interface TreatmentPlanResult {
  patientSummary: string;
  items: TreatmentPlanItem[];
  totalCost: number;
  estInsurance: number;
  outOfPocket: number;
  recommendedPhases: string[];
}

export interface PostOpInstruction {
  title: string;
  category: string;
  doList: string[];
  dontList: string[];
  warningSigns: string[];
  timeline: { title: string; detail: string }[];
}
