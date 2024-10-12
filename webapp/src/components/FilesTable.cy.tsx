import FilesTable from "@/components/FilesTable";

describe("<FilesTable />", () => {
  it("should have a table with a correct header", () => {
    cy.mount(<FilesTable files={[]} />);
    cy.get("thead").should("contain.text", "Name");
    cy.get("thead").should("contain.text", "Created");
    cy.get("thead").should("contain.text", "Modified");
    cy.get("thead").should("contain.text", "Download");
  });

  it("should have no data rows when there are no input files", () => {
    cy.mount(<FilesTable files={[]} />);
    cy.get("tbody").should("not.contain.html", "tr");
  });

  it("should have a table with two rows for two files", () => {
    cy.mount(<FilesTable files={["file1.png", "file2.txt"]} />);
    cy.get("tbody").should("contain.html", "tr");
    cy.get("tbody > tr").should("have.length", 2);
    cy.get("tbody > tr").eq(0).should("contain.text", "file1.png");
    cy.get("tbody > tr").eq(1).should("contain.text", "file2.txt");
    cy.get('svg[data-testid="downarrow-svg"]').should("exist");
    cy.get('svg[data-testid="downarrow-svg"]').should("have.length", 2);
  });

  it("should have the Image SVGs for an image", () => {
    cy.mount(<FilesTable files={["file1.png"]} />);
    cy.get("tbody > tr").eq(0).should("contain.text", "file1.png");
    cy.get('svg[data-testid="image-svg"]').should("exist");
    cy.get('svg[data-testid="file-svg"]').should("not.exist");
  });

  it("should have the File SVGs for a text file", () => {
    cy.mount(<FilesTable files={["file2.txt"]} />);
    cy.get("tbody > tr").eq(0).should("contain.text", "file2.txt");
    cy.get('svg[data-testid="file-svg"]').should("exist");
    cy.get('svg[data-testid="image-svg"]').should("not.exist");
  });
});
