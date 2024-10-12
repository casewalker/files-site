import FilesTable from "@/components/FilesTable";
import HeaderButtons from "@/components/HeaderButtons";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Home() {
  return (
    <main>
      <Breadcrumbs directoryLocations={["example1", "example2", "example3"]}/>
      <HeaderButtons />
      <FilesTable files={["image1.png", "file2.txt", "directory3"]}/>
    </main>
  );
}
