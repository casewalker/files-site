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
                <span className="inline-flex items-center">
                  {breadcrumbContent}
                </span>
              ) : (
                <a className="link link-neutral">
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
