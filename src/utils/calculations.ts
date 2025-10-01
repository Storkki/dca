import { Row, ComputeRowsParams, Totals } from '../types';

export function computeRows({
  gridSize,
  startPrice,
  totalCapital,
  stepPct,
  allocation,
  stepMultiplier,
  tpPct,
}: ComputeRowsParams): Row[] {
  const N = Math.max(1, Math.floor(Number(gridSize) || 0));
  const P0 = Math.max(0.00000001, Number(startPrice) || 0);
  const C = Math.max(0, Number(totalCapital) || 0);
  const s = Math.max(0, Number(stepPct) || 0) / 100;
  const m = Math.max(0.0001, Number(stepMultiplier) || 1);
  const t = Math.max(0, Number(tpPct) || 0) / 100;

  const prices: number[] = Array.from({ length: N }, (_, i) => P0 * Math.pow(1 - s, i));

  let usdAlloc: number[] = [];
  if (allocation === "equal" || Math.abs(m - 1) < 1e-9) {
    usdAlloc = new Array(N).fill(C / N);
  } else {
    const denom = Math.pow(m, N) - 1;
    const a = denom === 0 ? C / N : (C * (m - 1)) / denom;
    usdAlloc = Array.from({ length: N }, (_, i) => a * Math.pow(m, i));
  }

  let cumTokens = 0;
  let cumUsd = 0;
  const result = prices.map((price, idx) => {
    const usd = usdAlloc[idx] || 0;
    const tokens = price > 0 ? usd / price : 0;
    cumTokens += tokens;
    cumUsd += usd;
    const avgPrice = cumTokens > 0 ? cumUsd / cumTokens : 0;
    const tpPrice = avgPrice * (1 + t);
    const stepProfit = tokens * (tpPrice - price);

    return {
      order: idx + 1,
      price,
      usd,
      tokens,
      cumTokens,
      cumUsd,
      avgPrice,
      tpPrice,
      stepProfit,
    } as Row;
  });

  return result;
}

export function computeTotals(rows: Row[]): Totals {
  const cumUsd = rows.reduce((a, r) => a + r.usd, 0);
  const cumTokens = rows.reduce((a, r) => a + r.tokens, 0);
  const avgPrice = cumTokens > 0 ? cumUsd / cumTokens : 0;
  return { cumUsd, cumTokens, avgPrice };
}
