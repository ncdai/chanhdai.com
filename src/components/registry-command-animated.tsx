"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { registryConfig } from "@/config/registry";
import type { PackageManager } from "@/hooks/use-config";
import { useConfig } from "@/hooks/use-config";
import { FlipSentences } from "@/registry/flip-sentences";
import { components } from "@/registry/registry-components";

import { CopyButton } from "./copy-button";
import { getIconForPackageManager } from "./icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const pmCommands = {
  pnpm: "pnpm dlx",
  yarn: "npx",
  npm: "npx",
  bun: "bunx --bun",
};

const registryItemNames = components
  .map((component) => component.name)
  .sort((a, b) =>
    a.localeCompare(b, "en", {
      sensitivity: "base",
    })
  );

export function RegistryCommandAnimated() {
  const [config, setConfig] = useConfig();

  const packageManager = config.packageManager || "pnpm";

  const currentItemRef = useRef("");

  return (
    <div className="relative overflow-hidden">
      <Tabs
        className="gap-0"
        value={packageManager}
        onValueChange={(value) => {
          setConfig((prev) => ({
            ...prev,
            packageManager: value as PackageManager,
          }));
        }}
      >
        <div className="px-4 shadow-[inset_0_-1px_0_0] shadow-edge">
          <TabsList className="h-auto gap-4 rounded-none bg-transparent p-0 dark:bg-transparent [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {getIconForPackageManager(packageManager)}

            {Object.entries(pmCommands).map(([key]) => {
              return (
                <TabsTrigger
                  key={key}
                  className="h-10 rounded-none border-b border-transparent p-0 font-mono data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
                  value={key}
                >
                  {key}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <pre className="-translate-y-px p-4">
          <code
            data-language="bash"
            className="block font-mono text-sm text-muted-foreground max-sm:leading-6"
          >
            {Object.entries(pmCommands).map(([key, command]) => {
              return (
                <TabsContent key={key} value={key} asChild>
                  <span className="block sm:inline-block">
                    {command} shadcn add <span className="sm:hidden">\</span>
                  </span>
                </TabsContent>
              );
            })}

            <span>{registryConfig.namespace}/</span>

            <FlipSentences
              className="text-foreground"
              as={motion.span}
              variants={{
                initial: { y: -12, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                exit: { y: 12, opacity: 0 },
              }}
              onIndexChange={(index: number) => {
                currentItemRef.current = registryItemNames[index];
              }}
            >
              {registryItemNames}
            </FlipSentences>
          </code>
        </pre>
      </Tabs>

      <CopyButton
        className="absolute top-1.5 right-1.5 size-7 rounded-lg [&_svg]:size-3.5"
        getValue={() => {
          const baseCommand = pmCommands[packageManager] || pmCommands["pnpm"];
          return `${baseCommand} ${registryConfig.namespace}/${currentItemRef.current}`;
        }}
        event="copy_npm_command"
      />
    </div>
  );
}
