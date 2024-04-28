import HeaderButtons from "./headerButtons";

describe("<HeaderButtons />", () => {
  it("has two buttons, one to create a new directory, one to upload a file", () => {
    cy.mount(<HeaderButtons />);
    cy.get("button").should("contain.text", "New Folder");
    cy.get("button").should("contain.text", "Upload File");
  });
});
