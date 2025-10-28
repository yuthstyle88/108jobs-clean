export type ScbQrInquiryRequest = {
  token: string | null;
  qrId: string | null;
};

export type ScbQrInquiryData = {
  transactionId?: string | null;
  amount?: string | null;
  transactionDateandTime?: string | null;
  merchantPAN?: string | null;
  consumerPAN?: string | null;
  currencyCode?: string | null;
  merchantId?: string | null;
  terminalId?: string | null;
  qrId?: string | null;
  traceNo?: string | null;
  authorizeCode?: string | null;
  paymentMethod?: string | null;
  transactionType?: string | null;
  channelCode?: string | null;
  invoice?: string | null;
  note?: string | null;
};

export type ScbQrInquiryStatus = {
  code: number;
  description: string;
};

export type ScbQrInquiryResponse = {
  status: ScbQrInquiryStatus;
  data?: ScbQrInquiryData | null;
};
