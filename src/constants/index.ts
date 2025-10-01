export const DEFAULT_VALUES = {
  GRID_SIZE: 15,
  START_PRICE: 1,
  TOTAL_CAPITAL: 1500,
  STEP_PCT: 2,
  STEP_MULTIPLIER: 1.1,
  TP_PCT: 2.0,
  PRICE_DECIMALS: 2,
} as const;

export const ALLOCATION_MODES = {
  EQUAL: "equal" as const,
  PROGRESSIVE: "progressive" as const,
} as const;

export const DECIMAL_SEPARATORS = {
  DOT: "." as const,
  COMMA: "," as const,
} as const;

export const THEMES = {
  LIGHT: false,
  DARK: true,
} as const;

export const CSV_CONFIG = {
  DELIMITER_DOT: ",",
  DELIMITER_COMMA: ";",
  FILENAME: "grid_calculator.csv",
} as const;

export const TOAST_CONFIG = {
  DURATION: 1200,
} as const;

export const UI_CONFIG = {
  MAX_PRICE_DECIMALS: 10,
  MIN_PRICE_DECIMALS: 0,
  FOCUS_RING_OFFSET: 1,
} as const;
