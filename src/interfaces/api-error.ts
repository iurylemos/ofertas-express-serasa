export class ApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super("Não foi possível concluir a solicitação.");
    this.name = "ApiError";
    this.status = status;
  }
}

export class CheckoutError extends ApiError {
  constructor(status: number) {
    super(status);
    this.name = "CheckoutError";
  }
}
