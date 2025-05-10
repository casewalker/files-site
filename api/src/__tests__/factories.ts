import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

export const makeApiGatewayProxyEvent = (queryStringParameters?: Record<string, string | undefined>): APIGatewayProxyEventV2WithJWTAuthorizer => ({
  queryStringParameters,
  headers: {},
  isBase64Encoded: false,
  rawPath: "/test",
  rawQueryString: "test=true",
  requestContext: {
    authorizer: {
      principalId: "123",
      integrationLatency: 0,
      jwt: {
        claims: {},
        scopes: []
      }
    },
    accountId: "123",
    apiId: "abc",
    domainName: "example",
    domainPrefix: "",
    http: {
      method: "GET",
      path: "/test",
      protocol: "HTTPS",
      sourceIp: "1.2.3.4",
      userAgent: "Mozilla/5.0"
    },
    requestId: "123",
    routeKey: "abc",
    stage: "",
    time: "",
    timeEpoch: 0
  },
  routeKey: "",
  version: ""
});
