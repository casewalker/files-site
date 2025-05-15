import FilesTable from "@secure-cloud-files/webapp/src/components/FilesTable";
import { ObjectType } from "@secure-cloud-files/webapp/src/utils/s3FileTypes";

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
    const type = ObjectType.FILE as const;
    const files = [
      { key: "k1", fileName: "file1.png", filePath: "dir1/", createdDate: "", type },
      { key: "k2", fileName: "file2.txt", filePath: "dir2/", createdDate: "", type },
    ];
    cy.mount(<FilesTable files={files} />);
    cy.get("tbody").should("contain.html", "tr");
    cy.get("tbody > tr").should("have.length", 2);
    cy.get("tbody > tr").eq(0).should("contain.text", "file1.png");
    cy.get("tbody > tr").eq(1).should("contain.text", "file2.txt");
    cy.get('svg[data-testid="downarrow-svg"]').should("exist");
    cy.get('svg[data-testid="downarrow-svg"]').should("have.length", 2);
  });

  it("should have the Image SVGs for an image", () => {
    const type = ObjectType.FILE as const;
    const files = [
      { key: "k1", fileName: "file1.png", filePath: "dir1/", createdDate: "", type },
    ];
    cy.mount(<FilesTable files={files} />);
    cy.get("tbody > tr").eq(0).should("contain.text", "file1.png");
    cy.get('svg[data-testid="image-svg"]').should("exist");
    cy.get('svg[data-testid="file-svg"]').should("not.exist");
  });

  it("should have the File SVGs for a text file", () => {
    const type = ObjectType.FILE as const;
    const files = [
      { key: "k2", fileName: "file2.txt", filePath: "dir2/", createdDate: "", type },
    ];
    cy.mount(<FilesTable files={files} />);
    cy.get("tbody > tr").eq(0).should("contain.text", "file2.txt");
    cy.get('svg[data-testid="file-svg"]').should("exist");
    cy.get('svg[data-testid="image-svg"]').should("not.exist");
  });
});
