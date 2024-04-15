import React from "react";
import FileExplorer from "./fileExplorer";

describe("<FileExplorer />", () => {
  it("has two buttons, one to create a new directory, one to upload a file", () => {
    cy.mount(<FileExplorer />);
    cy.get("button").should("contain.text", "New Folder");
    cy.get("button").should("contain.text", "Upload File");
  });
});
