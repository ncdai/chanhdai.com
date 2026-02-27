import { BriefcaseBusinessIcon, CodeXmlIcon, LightbulbIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { addQueryParams } from "@/utils/url"

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"

type JobItemProps = {
  title: string
  company: string
  website: string
  experienceId?: string
}

export function JobItem({
  title,
  company,
  website,
  experienceId,
}: JobItemProps) {
  return (
    <IntroItem>
      <IntroItemIcon>{getJobIcon(title)}</IntroItemIcon>

      <IntroItemContent>
        {title} @
        <IntroItemLink
          className="ml-0.5 font-medium"
          {...(experienceId
            ? {
                href: `#experience-${experienceId}`,
                target: "_self",
                rel: "",
              }
            : {
                href: addQueryParams(website, UTM_PARAMS),
              })}
        >
          {company}
        </IntroItemLink>
      </IntroItemContent>
    </IntroItem>
  )
}

function getJobIcon(title: string) {
  if (/(developer|engineer)/i.test(title)) {
    return <CodeXmlIcon />
  }

  if (/(founder|co-founder)/i.test(title)) {
    return <LightbulbIcon />
  }

  return <BriefcaseBusinessIcon />
}
