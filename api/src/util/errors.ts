/**
 * True when a DynamoDB conditional write (or a transaction containing one) failed its condition.
 * These are correctness guards hit only in rare races — callers surface an error, never retry-until-win.
 */
export const isConditionalCheckFailure = (error: unknown): boolean =>
  error instanceof Error &&
  (error.name === "ConditionalCheckFailedException" ||
    (error.name === "TransactionCanceledException" &&
      error.message.includes("ConditionalCheckFailed")));
