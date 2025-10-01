import { Row, DecimalSeparator } from '../types';
import { computeRows } from './calculations';

export type TestResult = {
  name: string;
  pass: boolean;
  details?: string;
};

export function runSelfTests(): TestResult[] {
  const results: TestResult[] = [];

  // Test 1: Price stepping & equal allocation sum
  {
    const rows = computeRows({ gridSize: 3, startPrice: 100, totalCapital: 300, stepPct: 10, allocation: "equal", stepMultiplier: 1.1, tpPct: 2 });
    const prices = rows.map(r => Number(r.price.toFixed(6)));
    const expected = [100, 90, 81];
    const priceOk = prices.every((p, i) => Math.abs(p - expected[i]) < 1e-9);
    const sumOk = Math.abs(rows.reduce((a, r) => a + r.usd, 0) - 300) < 1e-9;
    results.push({ 
      name: "equal: price steps & capital sum", 
      pass: priceOk && sumOk, 
      details: `prices=${prices.join(',')} sum=${rows.reduce((a, r) => a + r.usd, 0)}` 
    });
  }

  // Test 2: Progressive allocation ratio ~ multiplier
  {
    const m = 1.1;
    const rows = computeRows({ gridSize: 3, startPrice: 100, totalCapital: 300, stepPct: 0, allocation: "progressive", stepMultiplier: m, tpPct: 0 });
    const ratio1 = rows[1].usd / rows[0].usd;
    const ratio2 = rows[2].usd / rows[1].usd;
    const pass = Math.abs(ratio1 - m) < 1e-6 && Math.abs(ratio2 - m) < 1e-6;
    results.push({ 
      name: "progressive: usd ratios follow multiplier", 
      pass, 
      details: `ratios≈${ratio1.toFixed(6)},${ratio2.toFixed(6)}` 
    });
  }

  // Test 3: CSV newline join and delimiter
  {
    const rows = computeRows({ gridSize: 2, startPrice: 10, totalCapital: 20, stepPct: 0, allocation: "equal", stepMultiplier: 1.1, tpPct: 0 });
    const csvDot = makeCSVForTests(rows, ".");
    const csvComma = makeCSVForTests(rows, ",");
    const linesDot = csvDot.split("\n").length;
    const linesComma = csvComma.split("\n").length;
    const pass = linesDot === rows.length + 1 && linesComma === rows.length + 1 && csvComma.includes(";") && !csvDot.includes(";");
    results.push({ 
      name: "csv: newline + delimiter by decimal sep", 
      pass, 
      details: `lines .: ${linesDot}, ,: ${linesComma}` 
    });
  }

  // Test 4: Progressive allocation sums to total capital
  {
    const C = 500;
    const rows = computeRows({ gridSize: 5, startPrice: 50, totalCapital: C, stepPct: 5, allocation: "progressive", stepMultiplier: 1.2, tpPct: 0 });
    const sum = rows.reduce((a, r) => a + r.usd, 0);
    const pass = Math.abs(sum - C) < 1e-8;
    results.push({ 
      name: "progressive: capital conservation", 
      pass, 
      details: `sum=${sum.toFixed(6)} C=${C}` 
    });
  }

  // Test 5: With N=1 and 0% step, avg price equals start price
  {
    const P0 = 123.456;
    const rows = computeRows({ gridSize: 1, startPrice: P0, totalCapital: 100, stepPct: 0, allocation: "equal", stepMultiplier: 1.1, tpPct: 0 });
    const pass = Math.abs(rows[0].avgPrice - P0) < 1e-12;
    results.push({ 
      name: "degenerate: N=1 avg==start", 
      pass, 
      details: `avg=${rows[0].avgPrice}` 
    });
  }

  return results;
}

function makeCSVForTests(rows: Row[], decimalSep: DecimalSeparator): string {
  const headers = [
    "Order","Price","Size ($)","Size (Token)","Cum.size (Token)","Cum.size ($)","Avg Price","TP Price","Profit ($)"
  ];
  
  const numberPrice = (n: number) => {
    const s = n.toFixed(6);
    return decimalSep === "," ? s.replace(".", ",") : s;
  };
  
  const numberOther = (n: number) => {
    const s = n.toFixed(1);
    return decimalSep === "," ? s.replace(".", ",") : s;
  };
  
  const lines = rows.map((r) => [
    r.order,
    numberPrice(r.price),
    numberOther(r.usd),
    numberOther(r.tokens),
    numberOther(r.cumTokens),
    numberOther(r.cumUsd),
    numberOther(r.avgPrice),
    numberPrice(r.tpPrice),
    numberOther(r.stepProfit),
  ]);
  
  const delimiter = decimalSep === "," ? ";" : ",";
  return [headers, ...lines]
    .map((arr) => arr.map((v) => (typeof v === "string" ? '"' + v.replaceAll('"', '""') + '"' : String(v))).join(delimiter))
    .join("\n");
}
