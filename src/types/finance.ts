// Existing interfaces...

export interface TaxBracket {
  rate: number;
  threshold: number;
}

export interface StateInfo {
  name: string;
  taxBrackets: TaxBracket[];
}