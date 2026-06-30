/**
 * Backfill country/city on QRScan rows where geo lookup failed at scan time.
 */
import { PrismaClient } from '@prisma/client';
import { lookupGeo } from '../lib/geoip';

const prisma = new PrismaClient();

async function main() {
  const scans = await prisma.qRScan.findMany({
    where: { OR: [{ country: null }, { country: '' }] },
    select: { id: true, ip: true },
  });

  let updated = 0;
  for (const scan of scans) {
    const geo = lookupGeo(scan.ip);
    if (!geo.country && !geo.city) continue;
    await prisma.qRScan.update({
      where: { id: scan.id },
      data: {
        country: geo.country,
        city: geo.city,
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    });
    updated++;
  }

  console.log(`Backfilled ${updated} of ${scans.length} scans`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
