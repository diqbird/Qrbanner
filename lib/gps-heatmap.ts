import type { ScanRecord } from '@/lib/analytics-utils';

export interface HeatmapPoint {
  lat: number;
  lng: number;
  count: number;
  label?: string;
  source: 'gps' | 'ip';
}

const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  TR: [39.0, 35.0], US: [39.8, -98.5], GB: [55.4, -3.4], DE: [51.2, 10.5],
  FR: [46.2, 2.2], IT: [41.9, 12.6], ES: [40.5, -3.7], NL: [52.1, 5.3],
  AE: [24.0, 54.0], SA: [24.7, 45.0], IN: [20.6, 78.9], CN: [35.9, 104.2],
  JP: [36.2, 138.3], AU: [-25.3, 133.8], CA: [56.1, -106.3], BR: [-14.2, -51.9],
  MX: [23.6, -102.5], EG: [26.8, 30.8], GR: [39.1, 21.8], PL: [51.9, 19.1],
  RU: [61.5, 105.3], KR: [35.9, 127.8], SG: [1.35, 103.8], AZ: [40.1, 47.5],
};

function gridKey(lat: number, lng: number, precision = 1): string {
  const f = Math.pow(10, precision);
  return `${Math.round(lat * f) / f},${Math.round(lng * f) / f}`;
}

export function buildHeatmapPoints(scans: ScanRecord[]): HeatmapPoint[] {
  const grid = new Map<string, HeatmapPoint>();

  for (const scan of scans) {
    const s = scan as ScanRecord & {
      latitude?: number | null;
      longitude?: number | null;
      country?: string | null;
      city?: string | null;
    };

    let lat: number | null = s.latitude ?? null;
    let lng: number | null = s.longitude ?? null;
    let source: 'gps' | 'ip' = 'gps';
    let label = s.city ?? s.country ?? undefined;

    if (lat == null || lng == null) {
      const code = (s.country ?? '').slice(0, 2).toUpperCase();
      const centroid = COUNTRY_CENTROIDS[code];
      if (!centroid) continue;
      lat = centroid[0] + (Math.random() - 0.5) * 4;
      lng = centroid[1] + (Math.random() - 0.5) * 4;
      source = 'ip';
      label = s.country ?? code;
    }

    const key = gridKey(lat, lng);
    const existing = grid.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      grid.set(key, { lat, lng, count: 1, label, source });
    }
  }

  return Array.from(grid.values()).sort((a, b) => b.count - a.count);
}

export function renderGpsCaptureScript(shortCode: string, enabled: boolean): string {
  if (!enabled) return '';
  return `<script>
(function(){
  if(!navigator.geolocation)return;
  navigator.geolocation.getCurrentPosition(function(pos){
    fetch('/api/scan/geo',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        shortCode:${JSON.stringify(shortCode)},
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude
      })
    }).catch(function(){});
  },function(){},{timeout:4000,maximumAge:60000});
})();
</script>`;
}
