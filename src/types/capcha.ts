export interface CaptchaResponse {
  ok: {
    png: string;
    wav?: string;
    uuid: string;
  };
}
