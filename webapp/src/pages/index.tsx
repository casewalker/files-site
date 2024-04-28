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
    </main>
  );
}
