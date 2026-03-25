import { render, screen, within } from "@testing-library/react";
import Breadcrumbs from "#components/Breadcrumbs.tsx";

describe(Breadcrumbs, () => {
  it("should not have any entries if no locations are provided", () => {
    render(<Breadcrumbs directoryLocations={[]} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getByRole("list").children).toHaveLength(0);
  });

  it("should have three folders in the order provided", () => {
    render(<Breadcrumbs directoryLocations={["directory1", "Directory2", "Dir3"]} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    const items = within(nav).getByRole("list").children;
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain("directory1");
    expect(items[1].textContent).toContain("Directory2");
    expect(items[2].textContent).toContain("Dir3");
  });

  it("should have a link for each breadcrumb except the last one which is not a link", () => {
    render(<Breadcrumbs directoryLocations={["directory1", "Directory2", "Dir3"]} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    const items = within(nav).getAllByRole("listitem");
    expect(within(items[0]).queryByRole("link")).toBeInTheDocument();
    expect(within(items[1]).queryByRole("link")).toBeInTheDocument();
    expect(within(items[2]).queryByRole("link")).not.toBeInTheDocument();
  });
});
