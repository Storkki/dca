import { useEffect, useMemo, useState } from "react";
import { DEFAULT_VALUES, ALLOCATION_MODES, DECIMAL_SEPARATORS, TOAST_CONFIG, UI_CONFIG } from "../constants";
import { AllocationMode, DecimalSeparator, ToastState } from "../types";
import { computeRows, computeTotals } from "../utils/calculations";
// import { runSelfTests } from "../utils/tests";
import { createFormatter, copyText, generateCSV, downloadCSV } from "../utils";
import { Field, NumberInput, SummaryCard } from "./ui";

export default function GridAveragingCalculator() {
  const [gridSize, setGridSize] = useState<number>(DEFAULT_VALUES.GRID_SIZE);
  const [startPrice, setStartPrice] = useState<number>(DEFAULT_VALUES.START_PRICE);
  const [totalCapital, setTotalCapital] = useState<number>(DEFAULT_VALUES.TOTAL_CAPITAL);

  const [stepPct, setStepPct] = useState<number>(DEFAULT_VALUES.STEP_PCT);
  const [allocation, setAllocation] = useState<AllocationMode>(ALLOCATION_MODES.EQUAL);
  const [stepMultiplier, setStepMultiplier] = useState<number>(DEFAULT_VALUES.STEP_MULTIPLIER);
  const [tpPct, setTpPct] = useState<number>(DEFAULT_VALUES.TP_PCT);
  const [decimalSep, setDecimalSep] = useState<DecimalSeparator>(() => {
    const saved = localStorage.getItem('grid-calc-decimal-sep');
    return (saved as DecimalSeparator) || DECIMAL_SEPARATORS.DOT;
  });
  const [priceDecimals, setPriceDecimals] = useState<number>(() => {
    const saved = localStorage.getItem('grid-calc-price-decimals');
    return saved ? parseInt(saved, 10) : DEFAULT_VALUES.PRICE_DECIMALS;
  });
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('grid-calc-theme');
    return saved === 'dark';
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const rows = useMemo(() =>
    computeRows({ gridSize, startPrice, totalCapital, stepPct, allocation, stepMultiplier, tpPct }),
  [gridSize, startPrice, totalCapital, stepPct, allocation, stepMultiplier, tpPct]);

  const totals = useMemo(() => computeTotals(rows), [rows]);

  // const [testResults, setTestResults] = useState<{ name: string; pass: boolean; details?: string }[]>([]);
  // useEffect(() => {
  //   const results = runSelfTests();
  //   results.forEach(r => {
  //     // eslint-disable-next-line no-console
  //     console[r.pass ? "log" : "error"](`TEST ${r.pass ? "PASS" : "FAIL"}: ${r.name}${r.details ? " — " + r.details : ""}`);
  //   });
  //   setTestResults(results);
  // }, []);

  useEffect(() => {
    localStorage.setItem('grid-calc-decimal-sep', decimalSep);
  }, [decimalSep]);

  useEffect(() => {
    localStorage.setItem('grid-calc-price-decimals', priceDecimals.toString());
  }, [priceDecimals]);

  useEffect(() => {
    localStorage.setItem('grid-calc-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const [toast, setToast] = useState<ToastState>({ msg: "", visible: false });
  function showToast(msg: string) {
    setToast({ msg, visible: true });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast({ msg: "", visible: false }), TOAST_CONFIG.DURATION);
  }

  const { fmtPrice, fmtOther } = createFormatter(priceDecimals, decimalSep);

  function handleDownloadCSV() {
    const csv = generateCSV(rows, decimalSep, priceDecimals);
    downloadCSV(csv);
  }

  // const passCount = testResults.filter(t => t.pass).length;
  // const failCount = testResults.length - passCount;

  const palette = dark
    ? {
        bg: "bg-neutral-900",
        card: "bg-neutral-800",
        text: "text-neutral-200",
        subtext: "text-neutral-400",
        border: "border-neutral-700",
        header: "bg-neutral-800",
        tableHead: "bg-neutral-800 text-neutral-300",
        hover: "hover:bg-neutral-700",
        button: "bg-neutral-800 border-neutral-700",
        buttonActive: "bg-neutral-200 text-neutral-900",
      }
    : {
        bg: "bg-gray-50",
        card: "bg-white",
        text: "text-gray-900",
        subtext: "text-gray-600",
        border: "border-gray-200",
        header: "bg-white",
        tableHead: "bg-gray-100 text-gray-700",
        hover: "hover:bg-gray-50",
        button: "bg-white border-gray-200",
        buttonActive: "bg-black text-white",
      };

  const focusRing = dark
    ? "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-1 focus:ring-offset-neutral-800"
    : "focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-1 focus:ring-offset-white";

  const btnBase = `inline-flex items-center justify-center rounded-xl border px-3 py-2 transition-colors transition-transform duration-150 ease-out hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${focusRing}`;
  const btnLg = `inline-flex items-center justify-center rounded-xl border px-4 py-2 transition-colors transition-transform duration-150 ease-out hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${focusRing}`;
  
  const btnInactive = `${palette.border} ${palette.button}`;
  const btnActive = dark 
    ? `bg-neutral-200 text-neutral-900 border-neutral-700` 
    : `bg-black text-white border-gray-200`;

  return (
    <div className={`min-h-screen w-full ${palette.bg} p-6 ${palette.text}`}>
      <style>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; appearance: textfield; }
      `}</style>
      <div className="max-w-5xl mx-auto space-y-6">
        <header className={`flex items-center justify-between gap-4 ${palette.header} p-4 rounded-xl border ${palette.border}`}>
          <div>
            <h1 className="text-2xl font-semibold">Grid Averaging Calculator</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDark(d => !d)} className={`${btnBase} ${btnInactive}`}>
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Grid size (orders)">
            <NumberInput value={gridSize} setValue={setGridSize} step={1} min={1} dark={dark} />
          </Field>
          <Field label="Start price">
            <NumberInput value={startPrice} setValue={setStartPrice} dark={dark} />
          </Field>
          <Field label="Total capital ($)">
            <NumberInput value={totalCapital} setValue={setTotalCapital} dark={dark} />
          </Field>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Step between orders (%)">
            <NumberInput value={stepPct} setValue={setStepPct} step={0.1} min={0} dark={dark} />
          </Field>
          <Field label="Allocation">
            <div className="flex items-center gap-2">
              <button onClick={() => setAllocation(ALLOCATION_MODES.EQUAL)} className={`${btnBase} ${allocation === ALLOCATION_MODES.EQUAL ? btnActive : btnInactive}`}>Equal</button>
              <button onClick={() => setAllocation(ALLOCATION_MODES.PROGRESSIVE)} className={`${btnBase} ${allocation === ALLOCATION_MODES.PROGRESSIVE ? btnActive : btnInactive}`}>Progressive</button>
            </div>
          </Field>
          <Field label="Step multiplier (size ×)">
            <NumberInput value={stepMultiplier} setValue={setStepMultiplier} step={0.05} min={1} disabled={allocation !== ALLOCATION_MODES.PROGRESSIVE} dark={dark} />
          </Field>
          <Field label="Take-profit over avg (%)">
            <NumberInput value={tpPct} setValue={setTpPct} step={0.1} min={0} dark={dark} />
          </Field>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <SummaryCard title="Total allocated" value={`$${fmtOther(totals.cumUsd)}`} dark={dark} />
          <SummaryCard title="Total tokens" value={fmtOther(totals.cumTokens)} dark={dark} />
          <SummaryCard title="Weighted average price" value={`$${fmtPrice(totals.avgPrice)}`} dark={dark} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Grid Results</h2>
            <button onClick={handleDownloadCSV} className={`${btnLg} ${btnInactive}`}>Export CSV</button>
          </div>
          <div className={`overflow-auto rounded-2xl shadow ${palette.card} border ${palette.border}`}>
          <table className="min-w-full text-sm">
            <thead className={palette.tableHead}>
              <tr>
                {[
                  "#",
                  "Price",
                  "Size ($)",
                  "Size (Token)",
                  "Cum.size (Token)",
                  "Cum.size ($)",
                  "Avg Price",
                  "TP Price",
                  "Profit ($)",
                ].map((h) => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.order} className={`border-t ${palette.border}`}>
                  <td className="px-4 py-2 font-medium">{r.order}</td>
                  {/* Price: click to copy */}
                  <td
                    className={`px-4 py-2 cursor-pointer select-none ${palette.hover}`}
                    title="Click to copy price"
                    onClick={() => { copyText(fmtPrice(r.price)); showToast("Price copied"); }}
                  >
                    ${fmtPrice(r.price)}
                  </td>
                  <td className="px-4 py-2">${fmtOther(r.usd)}</td>
                  <td className="px-4 py-2">{fmtOther(r.tokens)}</td>
                  <td className="px-4 py-2">{fmtOther(r.cumTokens)}</td>
                  <td className="px-4 py-2">${fmtOther(r.cumUsd)}</td>
                  <td className="px-4 py-2">${fmtPrice(r.avgPrice)}</td>
                  <td
                    className={`px-4 py-2 cursor-pointer select-none ${palette.hover}`}
                    title="Click to copy TP price"
                    onClick={() => { copyText(fmtPrice(r.tpPrice)); showToast("TP price copied"); }}
                  >
                    ${fmtPrice(r.tpPrice)}
                  </td>
                  <td className="px-4 py-2">${fmtOther(r.stepProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-opacity pointer-events-none ${toast.visible ? "opacity-100" : "opacity-0"}`}>
          <div className={`px-4 py-2 rounded-xl shadow-lg ${dark ? "bg-neutral-800 text-neutral-100" : "bg-black text-white"}`}>
            {toast.msg}
          </div>
        </div>

        <button
          onClick={() => setShowSettingsModal(true)}
          className={`fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-all hover:scale-110 ${dark ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          title="Settings"
        >
          ⚙️
        </button>

        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSettingsModal(false)}>
            <div className={`${palette.card} rounded-2xl p-6 max-w-md w-full mx-4 border ${palette.border}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Settings</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${palette.hover}`}
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <Field label="Decimal separator">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDecimalSep(DECIMAL_SEPARATORS.DOT)} 
                      className={`${btnBase} ${decimalSep === DECIMAL_SEPARATORS.DOT ? btnActive : btnInactive}`}
                    >
                      .
                    </button>
                    <button 
                      onClick={() => setDecimalSep(DECIMAL_SEPARATORS.COMMA)} 
                      className={`${btnBase} ${decimalSep === DECIMAL_SEPARATORS.COMMA ? btnActive : btnInactive}`}
                    >
                      ,
                    </button>
                  </div>
                </Field>
                
                <Field label="Price decimals">
                  <input
                    type="number"
                    min={UI_CONFIG.MIN_PRICE_DECIMALS}
                    max={UI_CONFIG.MAX_PRICE_DECIMALS}
                    value={priceDecimals}
                    onChange={(e) => setPriceDecimals(Math.min(UI_CONFIG.MAX_PRICE_DECIMALS, Math.max(UI_CONFIG.MIN_PRICE_DECIMALS, Number(e.target.value))))}
                    className={`w-full px-3 py-2 rounded-xl border ${palette.button} ${palette.border}`}
                  />
                </Field>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}