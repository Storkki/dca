export type AllocationMode = "equal" | "progressive";

export type DecimalSeparator = "." | ",";

export type Row = {
  order: number;
  price: number;
  usd: number;
  tokens: number;
  cumTokens: number;
  cumUsd: number;
  avgPrice: number;
  tpPrice: number;
  stepProfit: number;
};

export type Totals = {
  cumUsd: number;
  cumTokens: number;
  avgPrice: number;
};

export type TestResult = {
  name: string;
  pass: boolean;
  details?: string;
};

export type ToastState = {
  msg: string;
  visible: boolean;
};

export type ComputeRowsParams = {
  gridSize: number;
  startPrice: number;
  totalCapital: number;
  stepPct: number;
  allocation: AllocationMode;
  stepMultiplier: number;
  tpPct: number;
};
