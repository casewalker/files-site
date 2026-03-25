import { render, screen, fireEvent } from "@testing-library/react";
import FileInputButton from "#components/FileInputButton.tsx";
import { getPresignedUploadLink } from "#utils/fetchers.ts";

vi.mock("#utils/fetchers.ts", () => ({
  getPresignedUploadLink: vi.fn(),
}));

describe(FileInputButton, () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response());

  afterEach(fetchSpy.mockClear);
  afterAll(fetchSpy.mockRestore);

  it("should have a button and a hidden file input that accepts multiple files", () => {
    render(<FileInputButton />);
    expect(screen.getByRole("button", { name: "Upload Files" })).toBeInTheDocument();
    const input = document.querySelector("input[type='file']");
    assert(input != null, "Expected to find an input element of type 'file'");
    expect(input.className).toContain("hidden");
    expect(input.className).toContain("invisible");
    expect(input).toHaveAttribute("multiple");
  });

  it("gets a presigned URL then PUTs the file to that URL", async () => {
    const mockUploadUrl = "http://1.2.3.4/fakeUploadEndpoint";
    vi.mocked(getPresignedUploadLink).mockResolvedValue(mockUploadUrl);

    render(<FileInputButton />);
    const input = document.querySelector("input[type='file']");
    assert(input != null, "Expected to find an input element of type 'file'");
    const testFile = new File(["file contents"], "testFile.json", { type: "application/json" });

    fireEvent.change(input, { target: { files: [testFile] } });

    await vi.waitFor(() => {
      expect(getPresignedUploadLink).toHaveBeenCalledWith("testFile.json", "dir1/");
      expect(fetchSpy).toHaveBeenCalledWith(mockUploadUrl, { method: "PUT", body: testFile });
    });
  });
});
