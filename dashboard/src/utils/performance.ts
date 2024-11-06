// src/utils/performance.ts
type PerformanceData = Array<{
    weight: number;
    reps: number;
    date: string;
  }>;
  
  export const getBestWeight = (performanceData: PerformanceData | undefined): number => {
    if (!performanceData || performanceData.length === 0) return 0;
    return Math.max(...performanceData.map(p => p.weight));
  };
  
  export const getBestReps = (performanceData: PerformanceData | undefined): number => {
    if (!performanceData || performanceData.length === 0) return 0;
    return Math.max(...performanceData.map(p => p.reps));
  };
  
  export const getLastPerformance = (performanceData: PerformanceData | undefined) => {
    if (!performanceData || performanceData.length === 0) return null;
    
    // Sort by date and get the most recent
    const sortedData = [...performanceData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedData[0];
  };
  
  export const getProgressTrend = (performanceData: PerformanceData | undefined) => {
    if (!performanceData || performanceData.length < 2) return 'neutral' as const;
    
    const sortedData = [...performanceData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstWeight = sortedData[0].weight;
    const lastWeight = sortedData[sortedData.length - 1].weight;
    
    if (lastWeight > firstWeight) return 'up' as const;
    if (lastWeight < firstWeight) return 'down' as const;
    return 'neutral' as const;
  };