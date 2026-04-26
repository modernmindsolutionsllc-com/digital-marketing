import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export default function MetricCounter({ value, prefix = "", suffix = "", label, decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <div ref={ref} className="glass-card rounded-3xl p-6">
      <div className="font-display text-3xl font-bold text-white sm:text-4xl">
        {prefix}
        {formatNumber(displayValue, decimals)}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-slate-300">{label}</p>
      <div className="metric-line mt-4 h-1.5 rounded-full" aria-hidden="true" />
    </div>
  );
}
