import React from "react";

import { Panel, PanelBody, PanelHeading } from "../panel";
import { BlockTeckStack } from "./block-teck-stack";

export const TeckStack = () => {
  return (
    <Panel>
      <PanelHeading title="Tech Stack" />
      <PanelBody>
        <BlockTeckStack />
      </PanelBody>
    </Panel>
  );
};
