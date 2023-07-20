export enum Queues {
  DEFAULT = "default",
}

export enum JobType {
  PROCESS_PAYMENT = "process-payment",
}

export interface ProcessPaymentRequest {
  cardNumber: string;
  cvv: string;
  cardExpiry: string;
}
