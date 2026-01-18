import { HeartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SPONSORSHIP_URL } from "@/config/site";
import { SponsorItem } from "@/features/sponsors/components/sponsor-item";
import { sponsors } from "@/features/sponsors/data";

import { Panel, PanelHeader, PanelTitle } from "./panel";

export function Sponsors() {
  return (
    <Panel id="sponsors">
      <PanelHeader>
        <PanelTitle>Sponsors</PanelTitle>
      </PanelHeader>

      <div className="relative py-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge" />
          <div className="border-l border-edge" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sponsors.map((item) => (
            <SponsorItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      <div className="screen-line-before flex justify-center py-2">
        <Button asChild>
          <a href={SPONSORSHIP_URL} target="_blank" rel="noopener noreferrer">
            <HeartIcon />
            Sponsor My Work
          </a>
        </Button>
      </div>
    </Panel>
  );
}
