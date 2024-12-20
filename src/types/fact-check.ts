export interface FactCheckResult {
  veracity: 'true' | 'false' | 'uncertain';
  explanation: string;
  sources: string[];
  confidence: number;
}