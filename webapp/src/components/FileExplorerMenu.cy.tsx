import FileExplorerMenu from "@secure-cloud-files/webapp/src/components/FileExplorerMenu";
import {
  type S3Directory,
  type S3File,
  S3ObjectType,
} from "@secure-cloud-files/webapp/src/utils/s3FileTypes";

const FILE1: S3File = {
  type: S3ObjectType.FILE,
  name: "testfile1",
  lastModified: new Date("2020-01-01"),
  size: 1,
  path: "dir2/dir1/testfile1",
};

const DIR1: S3Directory = {
  type: S3ObjectType.DIRECTORY,
  name: "dir1",
  contents: [FILE1],
  path: "dir2/dir1",
};

const EMPTY_DIR: S3Directory = {
  type: S3ObjectType.DIRECTORY,
  name: "dir3",
  contents: [],
  path: "dir2/dir3"
};

const DIR2: S3Directory = {
  type: S3ObjectType.DIRECTORY,
  name: "dir2",
  contents: [DIR1, EMPTY_DIR],
  path: "dir2"
};

describe("<FileExplorerMenu>", () => {
  it("should display a single file", () => {
    cy.mount(<FileExplorerMenu files={[FILE1]} />);
    cy.get("ul").should("contain.html", "li");
    cy.get("li").should("have.length", 1);
    cy.get("li").should("contain.text", "testfile1");
  });

  it("should display a single directory with a single file, hidden until clicked", () => {
    cy.mount(<FileExplorerMenu files={[DIR1]} />);
    cy.get("ul").should("contain.html", "li");
    cy.get("li").should("have.length", 2);
    cy.get("li").contains("dir1").should("be.visible");
    // Cypress bug: https://github.com/cypress-io/cypress/issues/20706
    cy.get("li").contains("testfile1").should("be.visible");
    cy.get("details").should("not.have.attr", "open");

    cy.get("li").contains("dir1").click();
    cy.get("details").should("have.attr", "open");
  });

  it("should display a single directly with no files, saying '(empty folder)'", () => {
    cy.mount(<FileExplorerMenu files={[EMPTY_DIR]} />);
    cy.get("ul").should("contain.html", "li");
    cy.get("li").should("have.length", 2);
    cy.get("li").contains("dir3").should("be.visible");
    cy.get("li").contains("(empty folder)").should("be.visible");
    cy.get("details").should("not.have.attr", "open");
  });

  it("should correctly display a complex nested structure", () => {
    cy.mount(<FileExplorerMenu files={[DIR2]} />);
    cy.get("ul").should("contain.html", "li");
    cy.get("li").should("have.length", 5);
    cy.contains("details", "dir2").should("be.visible");
    cy.contains("details", "dir2").children("ul")
      .contains("dir1").should("be.visible");

    cy.contains("details", "dir1").should("be.visible");
    cy.contains("details", "dir1").children("ul")
      .contains("testfile1").should("be.visible");

    cy.contains("details", "dir3").should("be.visible");
    cy.contains("details", "dir3").children("ul")
      .contains("(empty folder)").should("be.visible");

    cy.get("details").should("have.length", 3);
    cy.get("details").eq(0).should("not.have.attr", "open");
    cy.get("details").eq(1).should("not.have.attr", "open");
    cy.get("details").eq(2).should("not.have.attr", "open");
  });
});
