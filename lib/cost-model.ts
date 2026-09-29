/**
 * Murmur Predictive Cost Engine & Ghost Timeline Math
 * Formula: Cost(t) = DowntimeCostPerHr * ExpectedDowntimeHrs * e^(k * driftVelocity * t) + repairCost
 */

export interface CostModelParams {
  downtimeCostPerHr: number;
  expectedDowntimeHrs: number;
  driftVelocity: number; // e.g. 0.38
  repairCost: number;
  actedEarlyCost: number;
  growthFactorK?: number;
}

export interface GhostTimelinePoint {
  hour: number;
  timeLabel: string;
  ignoredCost: number;
  actedCost: number;
  moneySaved: number;
}

export function calculateCostOfInaction(
  hoursIgnored: number,
  params: CostModelParams
): number {
  const {
    downtimeCostPerHr,
    expectedDowntimeHrs,
    driftVelocity,
    repairCost,
    growthFactorK = 0.08,
  } = params;

  // Base downtime impact + exponential drift penalty + baseline repair
  const exponentialMultiplier = Math.exp(growthFactorK * Math.max(0.01, driftVelocity) * hoursIgnored);
  const cost = (downtimeCostPerHr * expectedDowntimeHrs * exponentialMultiplier) + (repairCost * (1 + 0.05 * hoursIgnored));
  
  return Math.round(cost);
}

export function generateGhostTimelineData(
  params: CostModelParams,
  maxHours: number = 48,
  stepHours: number = 2
): GhostTimelinePoint[] {
  const points: GhostTimelinePoint[] = [];

  for (let h = 0; h <= maxHours; h += stepHours) {
    const ignoredCost = calculateCostOfInaction(h, params);
    const actedCost = params.actedEarlyCost;
    const moneySaved = Math.max(0, ignoredCost - actedCost);

    let timeLabel = `${h}h`;
    if (h === 0) timeLabel = 'Now';
    else if (h % 24 === 0) timeLabel = `${h / 24}d`;

    points.push({
      hour: h,
      timeLabel,
      ignoredCost,
      actedCost,
      moneySaved,
    });
  }

  return points;
}

export const COST_FORMULA_EXPLANATION = `
Cost of Inaction = (Downtime Rate/hr × Projected Repair Window × e^(k × Drift Velocity × Time)) + Escalated Repair Premium

Where:
- k = 0.08 (Drift Escalation Coefficient)
- Drift Velocity = Rate of sensor drift (e.g. °C/hr or %/hr)
- Acted Early Cost = Standard minor component service fee
`;
