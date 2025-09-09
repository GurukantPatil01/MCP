export interface HealthMetric {
  type: 'steps' | 'calories' | 'heart_rate' | 'sleep' | 'weight';
  value: number;
  unit: string;
  timestamp: Date;
  date: string; // YYYY-MM-DD format
}

export interface HealthData {
  steps: HealthMetric[];
  calories: HealthMetric[];
  heart_rate: HealthMetric[];
  sleep: HealthMetric[];
  weight: HealthMetric[];
  lastSync: Date;
}

export interface DailyHealthSummary {
  date: string;
  steps: number;
  calories: number;
  averageHeartRate: number;
  sleepHours: number;
  weight?: number;
}

export interface HealthInsight {
  id: string;
  type: 'tip' | 'trend' | 'achievement' | 'warning';
  title: string;
  description: string;
  metric?: string;
  change?: number;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  healthData?: Partial<HealthData>;
}

export interface MCPToolRequest {
  tool: 'get_health_data' | 'ask_health_question' | 'get_health_summary';
  params: Record<string, unknown>;
}

export interface MCPToolResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp: Date;
}

export interface GoogleFitDataSource {
  dataTypeName: string;
  type: string;
  lastSync: Date;
}

export interface HealthPeriod {
  startTimeMillis: string;
  endTimeMillis: string;
}

export interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  target?: number;
  progress: number; // 0-1
  change?: {
    value: number;
    period: string;
    positive: boolean;
  };
  icon?: React.ReactNode;
}

export interface HealthTrend {
  metric: string;
  period: 'week' | 'month';
  direction: 'up' | 'down' | 'stable';
  change: number;
  changePercent: number;
  description: string;
}
