'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LineStyle, IPriceLine } from 'lightweight-charts';
import type { CandleStick, Signal, UserParams, LivePosition } from '@/types';
import { useLightweightChart } from '@/hooks/useLightweightChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2Icon } from '@/components/icons/Loader2Icon';
import { ChartControls } from './ChartControls';
import { OneClickTradeBar } from './OneClickTradeBar';
import { BybitTradeDetails } from '@/services/executionService';
import LightweightChartClient from '../charts/LightweightChartClient';

interface LivePriceChartProps {
  symbol: string;
  data: CandleStick[];
  currentPrice: number | null;
  isLoading: boolean;
  signal: Signal | null;
  signalParams: UserParams | null;
  hitTpLevels: number[];
  oneClickTradingEnabled?: boolean;
  onOneClickTrade?: (tradeDetails: BybitTradeDetails) => void;
  oneClickTradeMargin?: number;
  onOneClickMarginChange?: (margin: number) => void;
  isSubmittingOneClick?: boolean;
  livePositions?: LivePosition[];
  onModifyPosition?: (positionId: string, newTp?: number, newSl?: number) => void;
}

export const LivePriceChart = ({
  symbol, data, currentPrice, isLoading, signal, signalParams, hitTpLevels,
  oneClickTradingEnabled, onOneClickTrade, oneClickTradeMargin, onOneClickMarginChange, isSubmittingOneClick,
  livePositions, onModifyPosition
}: LivePriceChartProps) => {
  // Component-local state for UI settings, ensuring independence between instances
  const [chartType, setChartType] = useState<'Area' | 'Line' | 'Candlestick'>('Area');
  const [timeRange, setTimeRange] = useState<'30m' | '1h' | '4h' | '1D' | 'All'>('4h');
  const [showRSI, setShowRSI] = useState(false);
  const [showMA20, setShowMA20] = useState(false);
  const [showMA200, setShowMA200] = useState(false);

  // Use the ref hook to get the chart container ref
  const { chartContainerRef } = useLightweightChart(chartType, data, showMA20, showMA200, showRSI);
  const priceLinesRef = useRef<Record<string, IPriceLine>>({});
  const livePositionLinesRef = useRef<Record<string, { tpLine?: IPriceLine; slLine?: IPriceLine; position: LivePosition }>>({});

  // Note: Time range zoom can't be handled directly anymore since chart is in client component
  // This would require a separate implementation or passing data to the client component
  // For now, we'll leave this functionality as is in the client component

  // Note: Price line drawing can't be handled directly anymore since chart is in client component
  // This functionality would need to be moved to the client component

  // Drag and drop logic for live position lines
  const isDraggingRef = useRef(false);
  const draggedLineInfo = useRef<{ positionId: string; lineType: 'tp' | 'sl'; line: IPriceLine } | null>(null);

  // Note: Drag and drop functionality can't be handled directly anymore since chart is in client component
  // This functionality would need to be moved to the client component

  const handleOneClickTrade = useCallback((direction: 'Buy' | 'Sell') => {
    if (!onOneClickTrade || !currentPrice || !oneClickTradeMargin || !signalParams?.risk) return;

    const stopDistance = currentPrice * 0.002; // Default 0.2% SL
    const tpDistance = stopDistance * 1.5; // Default 1.5 R:R

    const isLong = direction === 'Buy';
    const stopLoss = isLong ? currentPrice - stopDistance : currentPrice + stopDistance;
    const takeProfit = isLong ? currentPrice + tpDistance : currentPrice - tpDistance;

    const quantity = (oneClickTradeMargin * 20) / currentPrice; // Assume 20x leverage for quick trades

    const tradeDetails: BybitTradeDetails = {
        symbol: symbol.split(' ')[0],
        side: direction,
        orderType: 'Market',
        qty: quantity.toFixed(3),
        takeProfit: takeProfit.toFixed(4),
        stopLoss: stopLoss.toFixed(4),
    };
    onOneClickTrade(tradeDetails);

  }, [onOneClickTrade, currentPrice, symbol, oneClickTradeMargin, signalParams?.risk]);

  const priceColor = currentPrice && data.length > 1 && currentPrice >= data[data.length - 2]?.close ? 'text-green-400' : 'text-red-400';

  return (
    <Card className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300 ease-in-out flex flex-col">
      <CardHeader className="px-6 pt-6 pb-4 border-b border-gray-700/50">
        <div className="flex flex-wrap justify-between items-start gap-y-3">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-50">{symbol || "No Symbol Selected"}</CardTitle>
            <CardDescription className="text-sm text-gray-400 mt-1">1-minute interval data</CardDescription>
          </div>
          {currentPrice && (
            <p className={`text-4xl font-mono font-extrabold transition-colors duration-200 ${priceColor}`}>
              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
            </p>
          )}
        </div>
        <div className="mt-4">
          <ChartControls
              chartType={chartType} setChartType={setChartType}
              timeRange={timeRange} setTimeRange={setTimeRange}
              showMA20={showMA20} setShowMA20={setShowMA20}
              showMA200={showMA200} setShowMA200={setShowMA200}
              showRSI={showRSI} setShowRSI={setShowRSI}
          />
        </div>
      </CardHeader>
      <CardContent className="h-[450px] p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 rounded-b-xl z-10">
            <Loader2Icon className="w-10 h-10 animate-spin text-cyan-500" />
            <p className="mt-4 text-lg text-gray-300">Loading live chart data...</p>
          </div>
        )}
        <div className="h-full w-full" style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
          <LightweightChartClient
            chartType={chartType}
            data={data}
            showMA20={showMA20}
            showMA200={showMA200}
            showRSI={showRSI}
            containerRef={chartContainerRef as React.RefObject<HTMLDivElement>}
          />
        </div>
        {oneClickTradingEnabled && (
          <OneClickTradeBar
            margin={oneClickTradeMargin ?? 50}
            onMarginChange={onOneClickMarginChange!}
            onTrade={handleOneClickTrade}
            isSubmitting={isSubmittingOneClick ?? false}
          />
        )}
      </CardContent>
    </Card>
  );
};
