import * as React from "react";
import { render, screen } from "@testing-library/react";
import FileExplorerMenu from "#components/FileExplorerMenu.tsx";
import { SidebarProvider } from "#components/shadcn/Sidebar.tsx";
import { ObjectType } from "#utils/s3FileTypes.ts";
import type { DirectoryObject, FileObject } from "#utils/s3FileTypes.ts";

// Without this, SidebarProvider fails with `TypeError: window.matchMedia is not a function`
vi.mock("#hooks/use-mobile.ts");

const toggleDir = vi.fn();

// The menu is too tightly coupled with Sidebars, so it needs to be wrapped in a SidebarProvider
const sidebarWrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SidebarProvider>{children}</SidebarProvider>
);

const FILE1: FileObject = {
  key: "key1",
  type: ObjectType.FILE,
  fileName: "testfile1",
  lastModified: new Date("2020-01-01").toISOString(),
  createdDate: new Date("2020-01-01").toISOString(),
  size: 1,
  filePath: "dir2/dir1/testfile1",
};

const DIR1: DirectoryObject = {
  type: ObjectType.DIRECTORY,
  directoryName: "dir1",
  contents: [FILE1],
  pathToDirectory: "dir2/dir1",
};

const EMPTY_DIR: DirectoryObject = {
  type: ObjectType.DIRECTORY,
  directoryName: "dir3",
  contents: [],
  pathToDirectory: "dir2/dir3",
};

const DIR2: DirectoryObject = {
  type: ObjectType.DIRECTORY,
  directoryName: "dir2",
  contents: [DIR1, EMPTY_DIR],
  pathToDirectory: "dir2",
};

describe(FileExplorerMenu, () => {
  it("should display a single file", () => {
    render(<FileExplorerMenu files={[FILE1]} openDirs={new Set()} toggleDir={toggleDir} />, {
      wrapper: sidebarWrapper,
    });
    expect(screen.getByText("testfile1")).toBeInTheDocument();
  });

  it("should hide directory contents when closed, then show them after clicking", () => {
    const { rerender } = render(
      <FileExplorerMenu files={[DIR1]} openDirs={new Set()} toggleDir={toggleDir} />,
      { wrapper: sidebarWrapper },
    );
    expect(screen.getByText("dir1")).toBeInTheDocument();
    expect(screen.queryByText("testfile1")).not.toBeInTheDocument();

    screen.getByText("dir1").click();
    expect(toggleDir).toHaveBeenCalledWith("dir2/dir1");

    // Simulate the parent component re-rendering after the click invoked toggleDir
    rerender(
      <FileExplorerMenu files={[DIR1]} openDirs={new Set(["dir2/dir1"])} toggleDir={toggleDir} />,
    );
    expect(screen.getByText("testfile1")).toBeInTheDocument();
  });

  it("should display '(empty folder)' for an empty directory", () => {
    render(
      <FileExplorerMenu
        files={[EMPTY_DIR]}
        openDirs={new Set(["dir2/dir3"])}
        toggleDir={toggleDir}
      />,
      { wrapper: sidebarWrapper },
    );
    expect(screen.getByText("dir3")).toBeInTheDocument();
    expect(screen.getByText("(empty folder)")).toBeInTheDocument();
  });

  it("should correctly display a complex nested structure", () => {
    render(
      <FileExplorerMenu
        files={[DIR2]}
        openDirs={new Set(["dir2", "dir2/dir1", "dir2/dir3"])}
        toggleDir={toggleDir}
      />,
      { wrapper: sidebarWrapper },
    );
    expect(screen.getByText("dir2")).toBeInTheDocument();
    expect(screen.getByText("dir1")).toBeInTheDocument();
    expect(screen.getByText("testfile1")).toBeInTheDocument();
    expect(screen.getByText("dir3")).toBeInTheDocument();
    expect(screen.getByText("(empty folder)")).toBeInTheDocument();
  });
});
