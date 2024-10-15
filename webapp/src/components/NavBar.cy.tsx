import NavBar from "./NavBar";

describe("<NavBar />", () => {
  it("has four buttons, the home button, new directory, upload a file, and logout", () => {
    cy.mount(<NavBar />);
    cy.get("a").should("contain.text", "SecureCloudFiles");
    cy.get("button").should("contain.text", "New Folder");
    cy.get("button").should("contain.text", "Upload File");
    cy.get("button").should("contain.text", "Log out");
  });
});
