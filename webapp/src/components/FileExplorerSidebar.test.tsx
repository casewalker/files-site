import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileExplorerSidebar from "#components/FileExplorerSidebar.tsx";
import { SidebarProvider } from "#components/shadcn/Sidebar.tsx";
import { ObjectType } from "#utils/s3FileTypes.ts";
import type { DirectoryObject, FileObject } from "#utils/s3FileTypes.ts";

vi.mock("#hooks/use-mobile.ts");

const sidebarWrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SidebarProvider>{children}</SidebarProvider>
);

const FILE1: FileObject = {
  key: "key1",
  type: ObjectType.FILE,
  fileName: "report.pdf",
  lastModified: new Date("2024-06-01").toISOString(),
  createdDate: new Date("2024-06-01").toISOString(),
  size: 2048,
  filePath: "docs/report.pdf",
};

const DIR1: DirectoryObject = {
  type: ObjectType.DIRECTORY,
  directoryName: "myDocs",
  contents: [FILE1],
  pathToDirectory: "myDocs",
};

describe(FileExplorerSidebar, () => {
  it("has a home link with 'SecureCloudFiles' text", () => {
    render(<FileExplorerSidebar files={[]} />, { wrapper: sidebarWrapper });
    const homeLink = screen.getByRole("link", { name: "SecureCloudFiles" });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders a file passed to it", () => {
    render(<FileExplorerSidebar files={[FILE1]} />, { wrapper: sidebarWrapper });
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });

  it("expands a directory when clicked (owns the toggle state)", () => {
    render(<FileExplorerSidebar files={[DIR1]} />, { wrapper: sidebarWrapper });
    expect(screen.getByText("myDocs")).toBeInTheDocument();
    expect(screen.queryByText("report.pdf")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("myDocs"));
    expect(screen.getByText("myDocs")).toBeInTheDocument();
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });

  it("collapses a directory when clicked again", () => {
    render(<FileExplorerSidebar files={[DIR1]} />, { wrapper: sidebarWrapper });
    expect(screen.queryByText("report.pdf")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("myDocs"));
    expect(screen.getByText("report.pdf")).toBeInTheDocument();

    fireEvent.click(screen.getByText("myDocs"));
    expect(screen.queryByText("report.pdf")).not.toBeInTheDocument();
  });
});
