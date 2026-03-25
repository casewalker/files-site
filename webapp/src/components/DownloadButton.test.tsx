import { render, screen } from "@testing-library/react";
import DownloadButton from "#components/DownloadButton.tsx";
import { getPresignedDownloadLink } from "#utils/fetchers.ts";

vi.mock("#utils/fetchers.ts", () => ({
  getPresignedDownloadLink: vi.fn(),
}));

describe(DownloadButton, () => {
  it("should have a download button and a hidden download anchor", () => {
    render(<DownloadButton fileKey="key1" />);
    expect(screen.getByRole("button", { name: "Download file" })).toBeInTheDocument();
    const anchor = document.querySelector("a[download]");
    assert(anchor != null, "Expected to find a download anchor element");
    expect(anchor.className).toContain("hidden");
    expect(anchor.className).toContain("invisible");
    expect(anchor).toHaveAttribute("aria-hidden", "true");
  });

  it("gets a presigned URL and triggers a download when clicked", async () => {
    const mockDownloadUrl = "http://1.2.3.4/fakeDownloadEndpoint";
    vi.mocked(getPresignedDownloadLink).mockResolvedValue(mockDownloadUrl);

    render(<DownloadButton fileKey="key1" />);

    const anchor = document.querySelector("a[download]") as HTMLAnchorElement | null;
    assert(anchor != null, "Expected to find a download anchor element");
    const anchorClickSpy = vi.fn();
    anchor.click = anchorClickSpy;

    // When the button is clicked, the anchor is also "clicked" with the right href
    screen.getByRole("button", { name: "Download file" }).click();
    await vi.waitFor(() => {
      expect(getPresignedDownloadLink).toHaveBeenCalledWith("key1");
      expect(anchor.getAttribute("href")).toBe(mockDownloadUrl);
      expect(anchorClickSpy).toHaveBeenCalled();
    });
  });
});
