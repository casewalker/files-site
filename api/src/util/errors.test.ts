import { isConditionalCheckFailure } from "#util/errors.ts";

const makeNamedError = (name: string, message = "error"): Error =>
  Object.assign(new Error(message), { name });

describe(isConditionalCheckFailure, () => {
  it("is true for a ConditionalCheckFailedException", () => {
    expect(isConditionalCheckFailure(makeNamedError("ConditionalCheckFailedException"))).toBe(true);
  });

  it("is true for a transaction cancelled by a conditional check", () => {
    const error = makeNamedError(
      "TransactionCanceledException",
      "Transaction cancelled, please refer cancellation reasons for specific reasons [ConditionalCheckFailed, None]",
    );
    expect(isConditionalCheckFailure(error)).toBe(true);
  });

  it("is false for a transaction cancelled for other reasons", () => {
    const error = makeNamedError(
      "TransactionCanceledException",
      "Transaction cancelled, please refer cancellation reasons for specific reasons [TransactionConflict, None]",
    );
    expect(isConditionalCheckFailure(error)).toBe(false);
  });

  it("is false for other errors", () => {
    expect(isConditionalCheckFailure(makeNamedError("ValidationException"))).toBe(false);
    expect(isConditionalCheckFailure(new Error("plain error"))).toBe(false);
  });

  it("is false for non-Error values", () => {
    expect(isConditionalCheckFailure(undefined)).toBe(false);
    expect(isConditionalCheckFailure("ConditionalCheckFailedException")).toBe(false);
    expect(isConditionalCheckFailure({ name: "ConditionalCheckFailedException" })).toBe(false);
  });
});
