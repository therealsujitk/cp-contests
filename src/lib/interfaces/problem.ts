export interface Problem {
  index: string;
  name: string;
  rating?: number;
  status?: 'SOLVED' | 'UPSOLVED' | 'UNSOLVED';
}
