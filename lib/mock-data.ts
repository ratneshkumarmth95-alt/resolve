export interface MachineData {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'healthy' | 'drifting' | 'critical';
  downtimeCostPerHr: number;
  repairCost: number;
  currentTemp: number;
  currentVibration: number;
  currentCurrentDraw: number;
  currentPressure: number;
  currentCycleTime: number;
  currentNoise: number;
  tempThreshold: number;
  vibrationThreshold: number;
  currentDrawThreshold: number;
  pressureThreshold: number;
  cycleTimeThreshold: number;
  noiseThreshold: number;
  driftVelocity: number; // e.g. 0.45 units/hr
  timeToScreamSeconds: number;
  breachMetric: 'temperature' | 'vibration' | 'currentDraw' | 'pressure' | 'cycleTime' | 'noise';
  confidence: number;
  activeFault?: string | null;
  posX: number;
  posY: number;
}

export interface InterventionData {
  id: string;
  machineId: string;
  issueTitle: string;
  description: string;
  actionType: 'Trigger Maintenance' | 'Reduce Load' | 'Reassign Shift' | 'Order Part';
  actionCost: number;
  timeSavedHrs: number;
  projectedCostIfIgnored: number;
  roi: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'EXECUTED' | 'DISMISSED';
  createdAt: string;
  executedAt?: string | null;
}

export const INITIAL_MACHINES: MachineData[] = [
  {
    id: 'mach-01',
    name: 'CNC Mill Alpha-1',
    type: 'Precision Mill',
    location: 'Zone A-1',
    status: 'drifting',
    downtimeCostPerHr: 14500,
    repairCost: 2800,
    currentTemp: 78.4,
    currentVibration: 4.8,
    currentCurrentDraw: 32.1,
    currentPressure: 6.2,
    currentCycleTime: 44.5,
    currentNoise: 68.2,
    tempThreshold: 85.0,
    vibrationThreshold: 6.5,
    currentDrawThreshold: 40.0,
    pressureThreshold: 8.0,
    cycleTimeThreshold: 55.0,
    noiseThreshold: 80.0,
    driftVelocity: 0.38,
    timeToScreamSeconds: 5240, // ~1h 27m
    breachMetric: 'temperature',
    confidence: 94.2,
    activeFault: 'Spindle Bearing Thermal Creep',
    posX: 18,
    posY: 22,
  },
  {
    id: 'mach-02',
    name: 'Hydraulic Press H-500',
    type: 'Stamping Press',
    location: 'Zone B-2',
    status: 'critical',
    downtimeCostPerHr: 22000,
    repairCost: 5400,
    currentTemp: 89.2,
    currentVibration: 7.9,
    currentCurrentDraw: 54.0,
    currentPressure: 11.4,
    currentCycleTime: 18.2,
    currentNoise: 87.5,
    tempThreshold: 90.0,
    vibrationThreshold: 8.0,
    currentDrawThreshold: 55.0,
    pressureThreshold: 12.0,
    cycleTimeThreshold: 22.0,
    noiseThreshold: 85.0,
    driftVelocity: 1.25,
    timeToScreamSeconds: 1140, // 19 minutes
    breachMetric: 'vibration',
    confidence: 97.8,
    activeFault: 'Hydraulic Valve Cavitation Drift',
    posX: 45,
    posY: 25,
  },
  {
    id: 'mach-03',
    name: 'Rotary Compressor K-09',
    type: 'Air Compressor',
    location: 'Zone A-3',
    status: 'healthy',
    downtimeCostPerHr: 9500,
    repairCost: 1200,
    currentTemp: 52.1,
    currentVibration: 1.8,
    currentCurrentDraw: 18.4,
    currentPressure: 7.5,
    currentCycleTime: 12.0,
    currentNoise: 55.0,
    tempThreshold: 75.0,
    vibrationThreshold: 4.5,
    currentDrawThreshold: 28.0,
    pressureThreshold: 9.5,
    cycleTimeThreshold: 18.0,
    noiseThreshold: 70.0,
    driftVelocity: 0.02,
    timeToScreamSeconds: 142000, // ~39 hours
    breachMetric: 'temperature',
    confidence: 99.1,
    activeFault: null,
    posX: 72,
    posY: 20,
  },
  {
    id: 'mach-04',
    name: 'Chiller Unit C-12',
    type: 'Industrial Chiller',
    location: 'Zone C-1',
    status: 'drifting',
    downtimeCostPerHr: 16800,
    repairCost: 3100,
    currentTemp: 18.9, // refrigerant subcool drift
    currentVibration: 3.2,
    currentCurrentDraw: 41.5,
    currentPressure: 4.1,
    currentCycleTime: 60.0,
    currentNoise: 62.0,
    tempThreshold: 25.0,
    vibrationThreshold: 5.5,
    currentDrawThreshold: 48.0,
    pressureThreshold: 6.0,
    cycleTimeThreshold: 75.0,
    noiseThreshold: 75.0,
    driftVelocity: 0.42,
    timeToScreamSeconds: 12400, // ~3h 26m
    breachMetric: 'currentDraw',
    confidence: 91.5,
    activeFault: 'Refrigerant Micro-Leakage',
    posX: 25,
    posY: 60,
  },
  {
    id: 'mach-05',
    name: 'Packaging Arm P-02',
    type: 'Robotic Arm',
    location: 'Zone D-4',
    status: 'healthy',
    downtimeCostPerHr: 11000,
    repairCost: 1800,
    currentTemp: 41.0,
    currentVibration: 1.4,
    currentCurrentDraw: 14.2,
    currentPressure: 3.0,
    currentCycleTime: 4.2,
    currentNoise: 48.0,
    tempThreshold: 65.0,
    vibrationThreshold: 4.0,
    currentDrawThreshold: 25.0,
    pressureThreshold: 5.5,
    cycleTimeThreshold: 8.0,
    noiseThreshold: 65.0,
    driftVelocity: 0.01,
    timeToScreamSeconds: 280000,
    breachMetric: 'cycleTime',
    confidence: 98.4,
    activeFault: null,
    posX: 52,
    posY: 65,
  },
  {
    id: 'mach-06',
    name: 'Conveyor Motor M-04',
    type: 'Drive Motor',
    location: 'Zone D-1',
    status: 'drifting',
    downtimeCostPerHr: 8200,
    repairCost: 950,
    currentTemp: 64.3,
    currentVibration: 3.9,
    currentCurrentDraw: 22.8,
    currentPressure: 2.1,
    currentCycleTime: 30.0,
    currentNoise: 71.0,
    tempThreshold: 75.0,
    vibrationThreshold: 5.0,
    currentDrawThreshold: 28.0,
    pressureThreshold: 4.0,
    cycleTimeThreshold: 40.0,
    noiseThreshold: 78.0,
    driftVelocity: 0.28,
    timeToScreamSeconds: 9800, // ~2h 43m
    breachMetric: 'vibration',
    confidence: 93.0,
    activeFault: 'Belt Tension Misalignment',
    posX: 80,
    posY: 58,
  },
  {
    id: 'mach-07',
    name: 'Injection Molder IM-80',
    type: 'Plastic Injector',
    location: 'Zone B-4',
    status: 'healthy',
    downtimeCostPerHr: 18500,
    repairCost: 4200,
    currentTemp: 210.5,
    currentVibration: 2.1,
    currentCurrentDraw: 65.0,
    currentPressure: 140.0,
    currentCycleTime: 28.0,
    currentNoise: 64.0,
    tempThreshold: 230.0,
    vibrationThreshold: 4.5,
    currentDrawThreshold: 85.0,
    pressureThreshold: 165.0,
    cycleTimeThreshold: 36.0,
    noiseThreshold: 75.0,
    driftVelocity: 0.05,
    timeToScreamSeconds: 156000,
    breachMetric: 'temperature',
    confidence: 96.7,
    activeFault: null,
    posX: 38,
    posY: 82,
  },
  {
    id: 'mach-08',
    name: 'Robotic Welder W-03',
    type: 'Spot Welder',
    location: 'Zone A-2',
    status: 'healthy',
    downtimeCostPerHr: 13000,
    repairCost: 2100,
    currentTemp: 55.4,
    currentVibration: 1.2,
    currentCurrentDraw: 88.0,
    currentPressure: 5.8,
    currentCycleTime: 15.0,
    currentNoise: 59.0,
    tempThreshold: 78.0,
    vibrationThreshold: 3.8,
    currentDrawThreshold: 120.0,
    pressureThreshold: 8.0,
    cycleTimeThreshold: 22.0,
    noiseThreshold: 72.0,
    driftVelocity: 0.03,
    timeToScreamSeconds: 210000,
    breachMetric: 'currentDraw',
    confidence: 98.9,
    activeFault: null,
    posX: 68,
    posY: 80,
  }
];

export const INITIAL_INTERVENTIONS: InterventionData[] = [
  {
    id: 'int-01',
    machineId: 'mach-02',
    issueTitle: 'Hydraulic Valve Cavitation Drift',
    description: 'Valve pressure oscillation accelerating bearing wear (+1.25/hr drift velocity). Immediate seal replacement & flow dampening required.',
    actionType: 'Trigger Maintenance',
    actionCost: 650,
    timeSavedHrs: 18.5,
    projectedCostIfIgnored: 412500,
    roi: 634.6,
    urgency: 'CRITICAL',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'int-02',
    machineId: 'mach-01',
    issueTitle: 'Spindle Bearing Thermal Creep',
    description: 'Temperature creeping +0.38°C/hr. Reduce spindle speed by 15% and flush lubricant to stabilize before shift end.',
    actionType: 'Reduce Load',
    actionCost: 150,
    timeSavedHrs: 12.0,
    projectedCostIfIgnored: 174000,
    roi: 1160.0,
    urgency: 'HIGH',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'int-03',
    machineId: 'mach-04',
    issueTitle: 'Refrigerant Micro-Leakage',
    description: 'Compressor current draw rising 0.42A/hr as cooling efficiency drops. Order OEM replacement seals before weekend thermal spike.',
    actionType: 'Order Part',
    actionCost: 890,
    timeSavedHrs: 8.5,
    projectedCostIfIgnored: 142800,
    roi: 160.4,
    urgency: 'HIGH',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'int-04',
    machineId: 'mach-06',
    issueTitle: 'Belt Tension Misalignment',
    description: 'Vibration harmonic detected at 3.9mm/s (+0.28/hr drift). Realign motor mount during scheduled 10-min shift break.',
    actionType: 'Reassign Shift',
    actionCost: 200,
    timeSavedHrs: 6.0,
    projectedCostIfIgnored: 49200,
    roi: 246.0,
    urgency: 'MEDIUM',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  }
];
