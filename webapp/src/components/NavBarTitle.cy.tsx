import NavBarTitle from "@/components/NavBarTitle";

describe("<NavBarTitle />", () => {
  it("has one link: the home link", () => {
    cy.mount(<NavBarTitle />);
    cy.get("a").should("contain.text", "SecureCloudFiles");
  });
});
