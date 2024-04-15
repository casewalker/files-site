import React from "react";
import FileExplorer from "./fileExplorer";

describe("<FileExplorer />", () => {
  it("renders", () => {
    cy.mount(<FileExplorer />);
  });
});
