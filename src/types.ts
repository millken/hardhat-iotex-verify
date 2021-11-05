export interface Store {
  inputJSON: string;
  longVersion: string;
  platform: string;
  settings?: {};
}

export class VerifyApiResponse {
  public readonly status: boolean;
  public readonly message: string;

  constructor(response: any) {
    this.status = response.status;
    this.message = response.message;
  }

  public isOk() {
    return this.status;
  }
}
