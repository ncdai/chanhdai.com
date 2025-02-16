import { ExternalLink } from "lucide-react";
import React from "react";

import { Tag } from "@/components/ui/tag";

import { PROJECTS } from "../../constants";
import { Panel, PanelHeading } from "../panel";

export const Projects = () => {
  return (
    <Panel id="projects" className="scroll-mt-[4.75rem]">
      <PanelHeading title="Projects" />

      <div className="divide-grid divide-y">
        {PROJECTS.map((project, index) => {
          return (
            <div key={index} className="p-4">
              <a
                className="mb-1 flex items-center gap-2 font-mono text-sm font-semibold text-balance underline-offset-4 hover:underline"
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                {project.title}
                <ExternalLink className="text-muted-foreground pointer-events-none relative -top-px size-4 shrink-0" />
              </a>

              <div className="text-muted-foreground font-mono text-sm">
                {project.time}
              </div>

              {Array.isArray(project.tags) && project.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((skill, index) => {
                    return <Tag key={index}>{skill}</Tag>;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
