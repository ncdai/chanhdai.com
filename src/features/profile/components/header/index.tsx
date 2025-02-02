import { SimpleTooltip } from "@/registry/simple-tooltip";

import { USER } from "../../constants";
import { ChanhDaiAvatar } from "../chanhdai-avatar";
import { ChanhDaiCoverGrid } from "../chanhdai-cover-grid";
import { IconVerified } from "../icon-verified";

export const Header = () => {
  return (
    <header className="mt-2">
      <ChanhDaiCoverGrid />

      <div className="after:bg-grid border-grid relative flex border-x after:absolute after:bottom-0 after:-left-[100vw] after:h-px after:w-[200vw]">
        <div className="border-grid border-r">
          <div className="relative z-1 mx-0.5 my-[3px]">
            <ChanhDaiAvatar className="ring-border ring-offset-background size-32 rounded-full ring-1 ring-offset-2 sm:size-40" />
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex grow items-end pb-1 pl-4">
            <div className="hidden font-mono text-xs whitespace-pre text-zinc-300 select-none sm:block dark:text-zinc-800">
              {"text-3xl "}
              <span className="inline dark:hidden">text-zinc-950</span>
              <span className="hidden dark:inline">text-zinc-50</span>
              {" font-semibold"}
            </div>
          </div>

          <div className="border-grid border-t">
            <h1 className="font-heading flex items-center pl-4 text-3xl font-semibold">
              {USER.displayName}
              &nbsp;
              <SimpleTooltip content="Verified account">
                <span
                  aria-label="Verified account"
                  className="text-info-foreground relative top-px cursor-pointer"
                  aria-hidden
                >
                  <IconVerified size="0.6em" />
                </span>
              </SimpleTooltip>
            </h1>

            <p className="text-muted-foreground border-grid border-t py-1 pl-4 font-mono text-sm text-balance">
              {USER.bio}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
