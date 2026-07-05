export type SsoPolicy = {
  required: boolean;
  passwordAllowed: boolean;
  oauthProviders: string[];
  samlWorkspaces: { slug: string; name: string; loginUrl: string }[];
};

export type SamlInfo = {
  enabled: boolean;
  name?: string;
  loginUrl?: string;
};
