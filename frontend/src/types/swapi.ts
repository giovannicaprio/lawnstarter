export type SwapiResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: any[];
  [key: string]: any;
}; 