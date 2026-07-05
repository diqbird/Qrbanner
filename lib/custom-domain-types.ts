export interface CustomDomainRecord {
  id: string;
  domain: string;
  status: string;
  verifyToken: string;
  isPrimary: boolean;
  verifiedAt: string | null;
}

export interface DnsInstructions {
  cname: { host: string; value: string };
  txt: { host: string; value: string };
}

export type DomainsData = {
  domains: CustomDomainRecord[];
  scanBaseUrl: string;
  cnameTarget: string;
};

export function parseDomains(json: unknown): DomainsData {
  const data = json as Record<string, unknown>;
  return {
    domains: (data.domains as CustomDomainRecord[]) ?? [],
    scanBaseUrl: String(data.scan_base_url ?? 'https://qrbanner.com'),
    cnameTarget: String(data.cname_target ?? 'qrbanner.com'),
  };
}
