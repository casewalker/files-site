import { FOLDER_ICON } from "@/utils/svgs";

interface Props {
  directoryLocations: string[];
}

export default function Breadcrumbs({ directoryLocations }: Props) {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {directoryLocations.map((directoryLocation, index) => {
          const breadcrumbContent = <>{FOLDER_ICON}{directoryLocation}</>;

          return (
            <li key={`${index}:${directoryLocation}`}>
              {(index === directoryLocations.length - 1) ? (
                <span className="inline-flex items-center gap-0.5">
                  {breadcrumbContent}
                </span>
              ) : (
                <a className="link link-neutral gap-0.5 inline-flex">
                  {breadcrumbContent}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  );
};
