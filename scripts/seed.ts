import { PrismaClient } from '@prisma/client';
import { INITIAL_MACHINES, INITIAL_INTERVENTIONS } from '../lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Murmur database...');

  await prisma.intervention.deleteMany({});
  await prisma.reading.deleteMany({});
  await prisma.machine.deleteMany({});

  for (const m of INITIAL_MACHINES) {
    const createdMachine = await prisma.machine.create({
      data: {
        id: m.id,
        name: m.name,
        type: m.type,
        location: m.location,
        status: m.status,
        downtimeCostPerHr: m.downtimeCostPerHr,
        repairCost: m.repairCost,
        currentTemp: m.currentTemp,
        currentVibration: m.currentVibration,
        currentCurrentDraw: m.currentCurrentDraw,
        currentPressure: m.currentPressure,
        currentCycleTime: m.currentCycleTime,
        currentNoise: m.currentNoise,
        tempThreshold: m.tempThreshold,
        vibrationThreshold: m.vibrationThreshold,
        currentDrawThreshold: m.currentDrawThreshold,
        pressureThreshold: m.pressureThreshold,
        cycleTimeThreshold: m.cycleTimeThreshold,
        noiseThreshold: m.noiseThreshold,
        driftVelocity: m.driftVelocity,
        timeToScreamSeconds: m.timeToScreamSeconds,
        breachMetric: m.breachMetric,
        confidence: m.confidence,
        activeFault: m.activeFault,
        posX: m.posX,
        posY: m.posY,
      },
    });

    console.log(`Created Machine: ${createdMachine.name} (${createdMachine.id})`);
  }

  for (const item of INITIAL_INTERVENTIONS) {
    await prisma.intervention.create({
      data: {
        id: item.id,
        machineId: item.machineId,
        issueTitle: item.issueTitle,
        description: item.description,
        actionType: item.actionType,
        actionCost: item.actionCost,
        timeSavedHrs: item.timeSavedHrs,
        projectedCostIfIgnored: item.projectedCostIfIgnored,
        roi: item.roi,
        urgency: item.urgency,
        status: item.status,
      },
    });
  }

  console.log('✅ Murmur database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
