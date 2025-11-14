import { useRef } from 'react';
import type { CandleStick } from '@/types';

export function useLightweightChart(
  chartType: 'Area' | 'Line' | 'Candlestick',
  data: CandleStick[],
  showMA20: boolean,
  showMA200: boolean,
  showRSI: boolean
) {
  // Only need a container ref for the client component
  const chartContainerRef = useRef<HTMLDivElement>(null);

  return { chartContainerRef };
}