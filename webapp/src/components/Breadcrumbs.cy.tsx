import Breadcrumbs from "@/components/Breadcrumbs";

describe("<Breadcrumbs />", () => {
  it("should have three folders in order when given as props", () => {
    cy.mount(
      <Breadcrumbs directoryLocations={["directory1", "Directory2", "Dir3"]} />
    );
    cy.get("ul").should("contain.html", "li");
    cy.get("li").eq(0).should("contain.text", "directory1");
    cy.get("li").eq(1).should("contain.text", "Directory2");
    cy.get("li").eq(2).should("contain.text", "Dir3");
  });

  it("should not have any entries if no locations are provided", () => {
    cy.mount(<Breadcrumbs directoryLocations={[]}/>);
    cy.get("ul").should("not.contain.html", "li");
  });

  it("the last breadcrumb should not be a link, the others should be", () => {
    cy.mount(
      <Breadcrumbs directoryLocations={["directory1", "Directory2", "Dir3"]} />
    );
    cy.get("ul").should("contain.html", "li");
    cy.get("li").eq(0).should("have.descendants", "a");
    cy.get("li").eq(1).should("have.descendants", "a");
    cy.get("li").eq(2).should("not.have.descendants", "a");
  });
});
