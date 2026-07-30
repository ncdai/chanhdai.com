# Bun is required by "pnpm registry:build".
FROM oven/bun:1.3.14 AS bun-tool

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
ENV HUSKY=0
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN corepack enable \
    && corepack prepare pnpm@11.5.3 --activate
WORKDIR /app

FROM base AS dependencies
COPY --from=bun-tool /usr/local/bin/bun /usr/local/bin/bun
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM dependencies AS build
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_REGISTRY_NAMESPACE
ARG NEXT_PUBLIC_REGISTRY_NAMESPACE_URL
ARG NEXT_PUBLIC_DMCA_URL
ARG NEXT_PUBLIC_OPENPANEL_CLIENT_ID
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_ADSENSE_CLIENT

ENV NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}"
ENV NEXT_PUBLIC_REGISTRY_NAMESPACE="${NEXT_PUBLIC_REGISTRY_NAMESPACE}"
ENV NEXT_PUBLIC_REGISTRY_NAMESPACE_URL="${NEXT_PUBLIC_REGISTRY_NAMESPACE_URL}"
ENV NEXT_PUBLIC_DMCA_URL="${NEXT_PUBLIC_DMCA_URL}"
ENV NEXT_PUBLIC_OPENPANEL_CLIENT_ID="${NEXT_PUBLIC_OPENPANEL_CLIENT_ID}"
ENV NEXT_PUBLIC_GTM_ID="${NEXT_PUBLIC_GTM_ID}"
ENV NEXT_PUBLIC_ADSENSE_CLIENT="${NEXT_PUBLIC_ADSENSE_CLIENT}"

COPY . .
RUN pnpm build

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app

RUN groupadd --system --gid 1001 nextjs \
    && useradd --system --uid 1001 --gid nextjs nextjs

COPY --from=build --chown=nextjs:nextjs /app/public ./public
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static

# These directories are read through process.cwd() by MDX, registry and OG
# routes and may not all be included by Next.js output tracing.
COPY --from=build --chown=nextjs:nextjs \
    /app/src/features/doc/content ./src/features/doc/content
COPY --from=build --chown=nextjs:nextjs \
    /app/src/registry ./src/registry
COPY --from=build --chown=nextjs:nextjs \
    /app/src/assets/fonts ./src/assets/fonts

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server.js"]

