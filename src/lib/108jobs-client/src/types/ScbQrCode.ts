export type ScbQrCodeBody = Record<string, unknown>;

export type ScbQrCodeRequest = {
    body: ScbQrCodeBody;
};

export type ScbQrCodeData = {
    qrRawData: string;
    qrImage: string;
    csExtExpiryTime?: string | null;
    qrcodeId: string;
    responseCode: string;
    qrCodeType: string;
};

export type ScbQrCodeStatus = {
    code: number; // server uses u64/i32; represent as number in TS
    description: string;
};

export type ScbQrCodeResponse = {
    status: ScbQrCodeStatus;
    data?: ScbQrCodeData | null;
};
