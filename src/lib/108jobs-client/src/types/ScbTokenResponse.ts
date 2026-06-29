export type ScbStatus = {
  code: number;
  description: string;
};

export type ScbTokenData = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt?: number | null;
};

export type ScbTokenResponse = {
  status: ScbStatus;
  data?: ScbTokenData | null;
};
