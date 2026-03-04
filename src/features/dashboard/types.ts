export type DateRangePreset = 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_90_DAYS' | 'CUSTOM';

export interface DateRange {
  start: string; // ISO date string at start of range
  end: string; // ISO date string at end of range
  preset?: DateRangePreset;
}

export interface StockoutEvent {
  id: string;
  sku: string;
  locationId: string;
  locationName: string;
  occurredAt: string;
  resolvedAt?: string;
  quantityShort: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface StockoutBreakdownByLocation {
  locationId: string;
  locationName: string;
  stockoutCount: number;
  stockoutPercentage: number;
}

export interface StockoutKpi {
  totalStockouts: number;
  stockoutPercentage: number;
  averageDurationHours: number;
  criticalSkuCount: number;
  byLocation: StockoutBreakdownByLocation[];
}

export interface InventoryTurnoverKpi {
  turnoverRatio: number;
  trailingPeriods: number;
  daysOfCover: number;
  daysOfCoverTarget: number;
  periodComparisonDelta: number;
}

export interface SlowMovingSku {
  sku: string;
  description: string;
  locationName: string;
  daysInInventory: number;
  quantityOnHand: number;
  lastMovementAt: string;
}

export interface ProgressToTargetKpi {
  metricName: string;
  actual: number;
  target: number;
  progressPercentage: number;
  targetDate?: string;
}

export interface DashboardSnapshot {
  range: DateRange;
  generatedAt: string;
  stockouts: StockoutKpi;
  stockoutEvents: StockoutEvent[];
  turnover: InventoryTurnoverKpi;
  slowMovingSkus: SlowMovingSku[];
  targetProgress: ProgressToTargetKpi[];
}

export interface DashboardFilters {
  range: DateRange;
  locationIds?: string[];
}

export interface DashboardApiParams extends DashboardFilters {
  includeEvents?: boolean;
  includeSlowMoving?: boolean;
}

export interface DashboardApiResponse extends DashboardSnapshot {}
