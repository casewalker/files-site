import { render, screen } from "@testing-library/react";
import NavBarButtons from "#components/NavBarButtons.tsx";

describe(NavBarButtons, () => {
  it("has buttons for new folder, upload file, and sign out", () => {
    render(<NavBarButtons />);
    expect(screen.getByRole("button", { name: "New Folder" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Upload Files" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Sign Out" })).toBeDefined();
  });
});
