export const ANALYTICS_CHART_COLORS = [
  '#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78',
];

export type AnalyticsChartsData = {
  scansByDay: { date: string; count: number }[];
  scansByDayPrevious?: { date: string; count: number }[] | null;
  scansByDevice: { name: string; value: number }[];
  scansByBrowser: { name: string; value: number }[];
  scansByOS: { name: string; value: number }[];
  scansByHour?: { name: string; value: number }[];
  peakInsights?: {
    peakDay: { name: string; count: number } | null;
    peakHour: { name: string; count: number } | null;
  };
  scansByCountry: { name: string; value: number }[];
  scansByCity?: { name: string; value: number }[];
  scansBySource?: { name: string; value: number }[];
  scansByAbVariant?: { name: string; value: number }[];
  heatmapPoints?: import('@/lib/gps-heatmap').HeatmapPoint[];
};
