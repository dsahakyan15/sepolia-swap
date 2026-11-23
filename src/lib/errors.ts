import { BaseError, UserRejectedRequestError } from "viem";

/** Превращает ошибку кошелька или контракта в понятное сообщение. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof BaseError) {
    if (error.walk((e) => e instanceof UserRejectedRequestError)) {
      return "Транзакция отклонена в кошельке";
    }
    return error.shortMessage;
  }
  if (error instanceof Error) return error.message;
  return String(error);
}
