import { INITIAL_MACHINES, INITIAL_INTERVENTIONS, MachineData, InterventionData } from './mock-data';
import { calculateCostOfInaction } from './cost-model';

export type SpeedFactor = 1 | 10 | 60;

export interface SimulationState {
  machines: MachineData[];
  interventions: InterventionData[];
  speedFactor: SpeedFactor;
  readingsHistory: Record<string, Array<{
    timestamp: number;
    temp: number;
    vibration: number;
    currentDraw: number;
    pressure: number;
    cycleTime: number;
    noise: number;
  }>>;
  totalSavedDollars: number;
  totalHoursPreserved: number;
  failuresAverted: number;
  lastTickTime: number;
}

// In-memory global singleton state for server route handlers
class SimulationEngine {
  private state: SimulationState;
  private timer: NodeJS.Timeout | null = null;
  private listeners: Set<(state: SimulationState) => void> = new Set();

  constructor() {
    this.state = this.createInitialState();
    this.startEngine();
  }

  private createInitialState(): SimulationState {
    const history: SimulationState['readingsHistory'] = {};
    const now = Date.now();

    INITIAL_MACHINES.forEach((m) => {
      // Create initial 20 historical readings per machine
      history[m.id] = Array.from({ length: 20 }, (_, i) => ({
        timestamp: now - (20 - i) * 3000,
        temp: m.currentTemp + (Math.random() - 0.5) * 0.4,
        vibration: m.currentVibration + (Math.random() - 0.5) * 0.1,
        currentDraw: m.currentCurrentDraw + (Math.random() - 0.5) * 0.5,
        pressure: m.currentPressure + (Math.random() - 0.5) * 0.1,
        cycleTime: m.currentCycleTime + (Math.random() - 0.5) * 0.2,
        noise: m.currentNoise + (Math.random() - 0.5) * 0.3,
      }));
    });

    return {
      machines: JSON.parse(JSON.stringify(INITIAL_MACHINES)),
      interventions: JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS)),
      speedFactor: 1,
      readingsHistory: history,
      totalSavedDollars: 482500,
      totalHoursPreserved: 142.5,
      failuresAverted: 19,
      lastTickTime: now,
    };
  }

  public subscribe(listener: (state: SimulationState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.state));
  }

  private startEngine() {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  public setSpeed(speed: SpeedFactor) {
    this.state.speedFactor = speed;
    this.notify();
  }

  public getState(): SimulationState {
    return this.state;
  }

  public getMachines(): MachineData[] {
    return this.state.machines;
  }

  public getMachine(id: string): MachineData | undefined {
    return this.state.machines.find((m) => m.id === id);
  }

  public getReadings(id: string) {
    return this.state.readingsHistory[id] || [];
  }

  public getInterventions(): InterventionData[] {
    return this.state.interventions;
  }

  public injectFault(machineId: string, faultType: string) {
    const machine = this.state.machines.find((m) => m.id === machineId);
    if (!machine) return null;

    machine.activeFault = faultType;
    machine.status = 'drifting';

    // Boost drift velocity for fault
    switch (faultType) {
      case 'bearing_wear':
        machine.breachMetric = 'vibration';
        machine.driftVelocity = 1.45; // mm/s drift per hr
        break;
      case 'coolant_leak':
        machine.breachMetric = 'temperature';
        machine.driftVelocity = 1.85; // °C drift per hr
        break;
      case 'voltage_spike':
        machine.breachMetric = 'currentDraw';
        machine.driftVelocity = 2.10; // Amps drift per hr
        break;
      case 'cavitation':
        machine.breachMetric = 'pressure';
        machine.driftVelocity = 0.95; // Bar drift per hr
        break;
      default:
        machine.breachMetric = 'temperature';
        machine.driftVelocity = 1.20;
    }

    // Recalculate immediate time-to-scream
    machine.timeToScreamSeconds = Math.max(120, Math.round(3600 / machine.driftVelocity));
    machine.confidence = Number((88 + Math.random() * 9).toFixed(1));

    // Check if an intervention card already exists for this machine
    const existing = this.state.interventions.find((i) => i.machineId === machineId && i.status === 'PENDING');
    if (!existing) {
      const projCost = calculateCostOfInaction(8, {
        downtimeCostPerHr: machine.downtimeCostPerHr,
        expectedDowntimeHrs: 6,
        driftVelocity: machine.driftVelocity,
        repairCost: machine.repairCost,
        actedEarlyCost: 500,
      });

      const newIntervention: InterventionData = {
        id: `int-${Date.now()}`,
        machineId,
        issueTitle: `${faultType.replace('_', ' ').toUpperCase()} Injected`,
        description: `Micro-fault detected in ${machine.name}. Drift velocity accelerated to +${machine.driftVelocity}/hr. Immediate action required.`,
        actionType: 'Trigger Maintenance',
        actionCost: 500,
        timeSavedHrs: 14,
        projectedCostIfIgnored: projCost,
        roi: Number(((projCost - 500) / 500 * 100).toFixed(1)),
        urgency: 'CRITICAL',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      this.state.interventions.unshift(newIntervention);
    }

    this.notify();
    return machine;
  }

  public resolveFault(machineId: string) {
    const machine = this.state.machines.find((m) => m.id === machineId);
    if (!machine) return null;

    machine.activeFault = null;
    machine.status = 'healthy';
    machine.driftVelocity = 0.02;
    machine.timeToScreamSeconds = 180000; // ~50 hours
    machine.confidence = 98.5;

    // Reset sensor levels toward normal
    machine.currentTemp = Math.min(machine.currentTemp, machine.tempThreshold * 0.65);
    machine.currentVibration = Math.min(machine.currentVibration, machine.vibrationThreshold * 0.4);

    this.notify();
    return machine;
  }

  public executeIntervention(interventionId: string): InterventionData | null {
    const intervention = this.state.interventions.find((i) => i.id === interventionId);
    if (!intervention || intervention.status === 'EXECUTED') return null;

    intervention.status = 'EXECUTED';
    intervention.executedAt = new Date().toISOString();

    // Add savings to state
    this.state.totalSavedDollars += intervention.projectedCostIfIgnored - intervention.actionCost;
    this.state.totalHoursPreserved += intervention.timeSavedHrs;
    this.state.failuresAverted += 1;

    // Resolve machine fault
    this.resolveFault(intervention.machineId);

    this.notify();
    return intervention;
  }

  public resetSimulation() {
    this.state = this.createInitialState();
    this.notify();
  }

  private tick() {
    const dtSeconds = 1 * this.state.speedFactor;
    const dtHours = dtSeconds / 3600;

    this.state.machines.forEach((m) => {
      // Gaussian noise simulation
      const noise = () => (Math.random() - 0.5) * 0.1;

      // Apply drift if machine is drifting or critical
      if (m.status !== 'healthy' || m.activeFault) {
        const driftAmount = m.driftVelocity * dtHours;

        switch (m.breachMetric) {
          case 'temperature':
            m.currentTemp += driftAmount * 10;
            break;
          case 'vibration':
            m.currentVibration += driftAmount * 2;
            break;
          case 'currentDraw':
            m.currentCurrentDraw += driftAmount * 5;
            break;
          case 'pressure':
            m.currentPressure += driftAmount * 1.5;
            break;
          case 'cycleTime':
            m.currentCycleTime += driftAmount * 3;
            break;
          case 'noise':
            m.currentNoise += driftAmount * 4;
            break;
        }

        // Countdown Time-to-Scream
        if (m.timeToScreamSeconds > 0) {
          m.timeToScreamSeconds = Math.max(0, m.timeToScreamSeconds - dtSeconds);
        }

        if (m.timeToScreamSeconds < 1800) {
          m.status = 'critical';
        }
      } else {
        // Subtle baseline fluctuation
        m.currentTemp += noise() * 0.2;
        m.currentVibration = Math.max(0.5, m.currentVibration + noise() * 0.05);
      }

      // Add to history
      const history = this.state.readingsHistory[m.id];
      if (history) {
        history.push({
          timestamp: Date.now(),
          temp: Number(m.currentTemp.toFixed(2)),
          vibration: Number(m.currentVibration.toFixed(2)),
          currentDraw: Number(m.currentCurrentDraw.toFixed(2)),
          pressure: Number(m.currentPressure.toFixed(2)),
          cycleTime: Number(m.currentCycleTime.toFixed(2)),
          noise: Number(m.currentNoise.toFixed(2)),
        });

        if (history.length > 50) history.shift();
      }
    });

    this.notify();
  }
}

// Global instance attached to globalThis to survive Next.js HMR in dev mode
const globalForEngine = globalThis as unknown as {
  simulationEngine: SimulationEngine | undefined;
};

export const engine = globalForEngine.simulationEngine ?? new SimulationEngine();

if (process.env.NODE_NODE_ENV !== 'production') {
  globalForEngine.simulationEngine = engine;
}
