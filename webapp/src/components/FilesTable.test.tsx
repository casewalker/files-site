import { render, screen, within } from "@testing-library/react";
import FilesTable from "#components/FilesTable.tsx";
import { ObjectType } from "#utils/s3FileTypes.ts";

describe(FilesTable, () => {
  it("should have a table with a correct header", () => {
    render(<FilesTable files={[]} />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveTextContent("Name");
    expect(headers[1]).toHaveTextContent("Created");
    expect(headers[2]).toHaveTextContent("Modified");
    expect(headers[3]).toHaveTextContent("Download");
  });

  it("should have no data rows when there are no input files", () => {
    render(<FilesTable files={[]} />);
    const tableBody = screen.getByTestId("files-table-body");
    expect(within(tableBody).queryAllByRole("row")).toHaveLength(0);
  });

  it("should have a table with two data rows for two files", () => {
    const type = ObjectType.FILE as const;
    const files = [
      { key: "k1", fileName: "file1.png", filePath: "dir1/", createdDate: "", type },
      { key: "k2", fileName: "file2.txt", filePath: "dir2/", createdDate: "", type },
    ];
    render(<FilesTable files={files} />);
    const dataRows = screen.getByTestId("files-table-body").children;
    expect(dataRows).toHaveLength(2);
    expect(dataRows[0]).toHaveTextContent("file1.png");
    expect(dataRows[1]).toHaveTextContent("file2.txt");
    expect(screen.getAllByTestId("downarrow-svg")).toHaveLength(2);
  });

  it("should have the Image SVG for an image file", () => {
    const type = ObjectType.FILE as const;
    const files = [{ key: "k1", fileName: "file1.png", filePath: "dir1/", createdDate: "", type }];
    render(<FilesTable files={files} />);
    expect(screen.getByTestId("image-svg")).toBeInTheDocument();
    expect(screen.queryByTestId("file-svg")).not.toBeInTheDocument();
  });

  it("should have the File SVG for a text file", () => {
    const type = ObjectType.FILE as const;
    const files = [{ key: "k2", fileName: "file2.txt", filePath: "dir2/", createdDate: "", type }];
    render(<FilesTable files={files} />);
    expect(screen.getByTestId("file-svg")).toBeInTheDocument();
    expect(screen.queryByTestId("image-svg")).not.toBeInTheDocument();
  });
});
