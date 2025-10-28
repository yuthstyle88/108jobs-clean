export type Certificate = {
  id?: number | null;
  name: string;
  achievedDate: string;
  expiresDate: string | null;
  url: string;
};

export type CertificatesResponse = {
  certificates: Certificate[];
};
