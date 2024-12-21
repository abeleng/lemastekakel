export interface FactCheckResult {
  veracity: string;
  explanation: string;
  sources: string[];
  confidence: number;
}