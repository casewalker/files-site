import type { ApiGatewayEvent } from "#util/types.ts";

/** Parses a JSON object body from an API Gateway event; undefined if absent or malformed. */
export const parseJsonBody = (event: ApiGatewayEvent): Record<string, unknown> | undefined => {
  if (event.body == null) {
    return undefined;
  }
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
};

/** Returns the named field if it is a non-blank string, otherwise undefined. */
export const getStringField = (
  body: Record<string, unknown>,
  fieldName: string,
): string | undefined => {
  const value = body[fieldName];
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
};
