import FileInputButton from "@secure-cloud-files/webapp/src/components/FileInputButton";

describe("<FileInputButton />", () => {
  it("should have a button and a hidden file-input", () => {
    cy.mount(<FileInputButton />);
    cy.get(".btn").should("contain.text", "Upload Files");
    cy.get("input").should("have.attr", "type", "file");
    cy.get("input").should("have.attr", "multiple");
    cy.get("input").should("have.class", "hidden");
    cy.get("input").should("have.class", "invisible");
  });

  it("calls the getPresignedUploadLink endpoint, then uploads", () => {
    cy.intercept("GET", "**/getPresignedUploadLink*", {
      statusCode: 200,
      body: '{ "data": { "url": "http://1.2.3.4/fakeUploadEndpoint" } }',
    }).as("getPresignedLink");
    cy.intercept("PUT", "**/fakeUploadEndpoint", {
      statusCode: 200,
      body: "great file upload, thank you",
    }).as("upload");

    cy.mount(<FileInputButton />);
    cy.get("input").selectFile("cypress/fixtures/testFile.json");

    cy.wait("@getPresignedLink");
    cy.wait("@upload").then((interception) =>
      interception.response?.body === "great file upload, thank you",
    );
  });
});
