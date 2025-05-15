import DownloadButton from "@secure-cloud-files/webapp/src/components/DownloadButton";

describe("<DownloadButton>", () => {
  it("calls getPresignedDownloadLink and then downloads a file from the respsonse URL", () => {
    cy.intercept("GET", "**/getPresignedDownloadLink*", {
      statusCode: 200,
      body: '{ "data": { "url": "http://1.2.3.4/fakeDownloadEndpoint" } }',
    }).as("getPresignedLink");
    cy.intercept("GET", "**/fakeDownloadEndpoint", {
      statusCode: 200,
      headers: {
        "Content-Type": "application-html",
        "Content-Disposition": "attachment; filename=fake-download.html",
      },
      body: `
        <body>
          <p>
            This must be an HTML file due to a Cypress limitation:
            https://github.com/cypress-io/cypress/issues/24395
          </p>
        </body>`,
    }).as("fileDownload");

    cy.mount(<DownloadButton fileKey="key1" />);
    cy.get("button").click();

    cy.wait("@getPresignedLink");
    cy.wait("@fileDownload");
    cy.readFile(`${Cypress.config("downloadsFolder")}/fake-download.html`);
  });
});
