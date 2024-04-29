import FilesList from "@/components/filesList";
import HeaderButtons from "@/components/headerButtons";
import Breadcrumbs from "@/components/breadcrumbs";

export default function Home() {
  return (
    <main>
      <Breadcrumbs directoryLocations={[
        "example1",
        "example2",
        "example3",
      ]} />
      <HeaderButtons />
      <FilesList files={[
        "image1.png",
        "file2.txt",
        "directory3",
      ]}
      />
    </main>
  );
}
