import NavBarButtons from "@secure-cloud-files/webapp/src/components/NavBarButtons";

describe("<NavBarButtons />", () => {
  it("has three buttons: new directory, upload a file, and logout", () => {
    cy.mount(<NavBarButtons />);
    cy.get("button").should("contain.text", "New Folder");
    cy.get("button").should("contain.text", "Upload File");
    cy.get("button").should("contain.text", "Log out");
  });
});
