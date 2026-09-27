import { makeApiGatewayProxyEvent } from "#__tests__/factories.ts";
import { getStringField, parseJsonBody } from "#util/requestUtils.ts";

describe(parseJsonBody, () => {
  it("parses a JSON object body", () => {
    const event = { ...makeApiGatewayProxyEvent(), body: JSON.stringify({ name: "docs" }) };
    expect(parseJsonBody(event)).toEqual({ name: "docs" });
  });

  it("parses a base64-encoded JSON object body", () => {
    const event = {
      ...makeApiGatewayProxyEvent(),
      body: Buffer.from(JSON.stringify({ name: "docs" })).toString("base64"),
      isBase64Encoded: true,
    };
    expect(parseJsonBody(event)).toEqual({ name: "docs" });
  });

  it.each([
    ["there is no body", undefined],
    ["the body is not valid JSON", "{oops"],
    ["the body is a JSON array", JSON.stringify([1, 2])],
    ["the body is a JSON string", JSON.stringify("hello")],
    ["the body is a JSON number", "5"],
    ["the body is JSON null", "null"],
  ])("returns undefined if %s", (_description, body) => {
    const event = { ...makeApiGatewayProxyEvent(), body };
    expect(parseJsonBody(event)).toBeUndefined();
  });
});

describe(getStringField, () => {
  it("returns the field when it is a non-blank string", () => {
    expect(getStringField({ name: "docs" }, "name")).toBe("docs");
  });

  it.each([
    ["missing", {}],
    ["undefined", { name: undefined }],
    ["null", { name: null }],
    ["blank", { name: "   " }],
    ["empty", { name: "" }],
    ["not a string", { name: 42 }],
  ])("returns undefined when the field is %s", (_description, body) => {
    expect(getStringField(body, "name")).toBeUndefined();
  });
});
