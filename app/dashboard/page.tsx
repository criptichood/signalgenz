import React, { useRef } from 'react';
import { useDashboardStore, WidgetId } from '@/store/dashboardStore';
import { AddWidgetDropdown } from '@/components/dashboard/AddWidgetDropdown';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { QuickActionsWidget } from '@/components/dashboard/QuickActionsWidget';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { PerformanceSnapshotWidget } from '@/components/dashboard/PerformanceSnapshotWidget';
import { LivePositionsWidget } from '@/components/dashboard/LivePositionsWidget';
import { NewsWidget } from '@/components/dashboard/NewsWidget';
import { HistoryWidget } from '@/components/dashboard/HistoryWidget';
import { Button } from '@/components/ui/button';
import { Layout, AlertTriangle } from 'lucide-react';

const WIDGET_MAP: Record<WidgetId, React.FC> = {
    'quick-actions': QuickActionsWidget,
    'chart': ChartWidget,
    'performance': PerformanceSnapshotWidget,
    'live-positions': LivePositionsWidget,
    'news': NewsWidget,
    'history': HistoryWidget,
};

const DashboardPage = () => {
    const { isEditMode, toggleEditMode, activeWidgets, availableWidgets, moveWidget } = useDashboardStore();
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    
    const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
    };

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragOverItem.current = index;
    };
    
    const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            moveWidget(dragItem.current, dragOverItem.current);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const getWidgetComponent = (widgetId: WidgetId) => {
        return WIDGET_MAP[widgetId] || null;
    };

    return (
        <div className="space-y-8 p-4 sm:p-6 md:p-8">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mission Control</h1>
                    <p className="text-gray-400 mt-1">Your unified dashboard for market analysis and activity.</p>
                </div>
                <div className="flex items-center gap-4">
                    {isEditMode && <AddWidgetDropdown />}
                    <Button variant="outline" onClick={toggleEditMode} className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                        <Layout className="w-4 h-4 mr-2" />
                        {isEditMode ? 'Save Layout' : 'Edit Layout'}
                    </Button>
                </div>
            </div>

            {isEditMode && (
                <div className="flex items-center gap-3 text-sm text-cyan-300 bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
                    <AlertTriangle className="w-5 h-5" />
                    <p>Layout editing mode: Drag widgets to reorder. Resizing/column movement not yet supported.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeWidgets.map((widgetId, index) => {
                    const WidgetComponent = getWidgetComponent(widgetId);
                    const widgetInfo = availableWidgets.find(w => w.id === widgetId);

                    if (!WidgetComponent || !widgetInfo) return null;
                    
                    const gridSpan = widgetId === 'quick-actions' ? 'md:col-span-2 lg:col-span-4' : 'md:col-span-1 lg:col-span-2';

                    return (
                        <div 
                            key={widgetId} 
                            className={`${gridSpan}`}
                            onDragEnter={(e) => onDragEnter(e, index)} 
                            onDragEnd={onDragEnd}
                        >
                             <WidgetWrapper
                                widgetId={widgetId}
                                widgetName={widgetInfo.name}
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={onDragEnd}
                             >
                                <WidgetComponent />
                            </WidgetWrapper>
                        </div>
                    );
                })}
                 {activeWidgets.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700">
                        <p className="text-gray-400">Your dashboard is empty.</p>
                        <AddWidgetDropdown />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;