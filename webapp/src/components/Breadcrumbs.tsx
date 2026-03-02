import type { JSX } from "react";
import { FOLDER_ICON } from "#utils/svgs.tsx";

interface Props {
  directoryLocations: string[];
}

export default function Breadcrumbs({ directoryLocations }: Props): JSX.Element {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {directoryLocations.map((directoryLocation, index) => {
          const breadcrumbContent = (
            <>
              {FOLDER_ICON}
              {directoryLocation}
            </>
          );

          return (
            <li key={`${index}:${directoryLocation}`}>
              {index < directoryLocations.length - 1 ? (
                <a className="link link-neutral gap-0.5 inline-flex">{breadcrumbContent}</a>
              ) : (
                <span className="items-center gap-0.5 inline-flex">{breadcrumbContent}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
