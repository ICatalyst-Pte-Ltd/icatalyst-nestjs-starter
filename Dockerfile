# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.22.0

FROM node:${NODE_VERSION}-alpine AS base

FROM base AS build
ENV NODE_ENV=build
WORKDIR /build
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY nest-cli.json tsconfig.json tsconfig.build.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build

FROM base
ENV NODE_ENV=production
RUN apk add --no-cache tini
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
COPY --from=build /build/prisma.config.ts ./
COPY --from=build /build/prisma ./prisma
COPY --from=build /build/dist ./dist
ARG BUILD_VERSION
ARG PIPELINE_ID
ARG PIPELINE_INTERNAL_ID
ARG PIPELINE_URL
ARG GIT_BRANCH
ARG COMMIT_SHA
ARG COMMIT_TIME
ENV APP_INFO_BUILD_VERSION=${BUILD_VERSION} \
    APP_INFO_CI_PIPELINE_ID=${PIPELINE_ID} \
    APP_INFO_CI_PIPELINE_INTERNAL_ID=${PIPELINE_INTERNAL_ID} \
    APP_INFO_CI_PIPELINE_URL=${PIPELINE_URL} \
    APP_INFO_GIT_BRANCH=${GIT_BRANCH} \
    APP_INFO_GIT_COMMIT_SHA=${COMMIT_SHA} \
    APP_INFO_GIT_COMMIT_TIME=${COMMIT_TIME}
USER node
EXPOSE 3000
ENTRYPOINT ["tini", "--", "docker-entrypoint.sh"]
CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/main.js"]
