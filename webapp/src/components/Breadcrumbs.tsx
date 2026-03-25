import type { JSX } from "react";
import { FOLDER_ICON } from "#utils/svgs.tsx";

interface Props {
  directoryLocations: string[];
}

export default function Breadcrumbs({ directoryLocations }: Props): JSX.Element {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-2.5">
        {directoryLocations.map((directoryLocation, index) => {
          const isLast = index === directoryLocations.length - 1;
          const breadcrumbContent = (
            <>
              {FOLDER_ICON}
              {directoryLocation}
            </>
          );

          return (
            <li key={`${index}:${directoryLocation}`} className="inline-flex items-center gap-1.5">
              {index > 0 && <span className="text-muted-foreground">›</span>}
              {!isLast ? (
                <a
                  className="inline-flex items-center gap-0.5 text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
                  href="/" // TODO: Fix this to go to the right place someday
                >
                  {breadcrumbContent}
                </a>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-foreground">{breadcrumbContent}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
