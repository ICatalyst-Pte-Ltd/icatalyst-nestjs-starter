ARG NODE_VERSION=24.22.0

FROM node:${NODE_VERSION}-alpine as base

FROM base as build
ENV NODE_ENV=build
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base
ENV NODE_ENV=production
RUN apk add --no-cache tini
ENTRYPOINT ["tini", "--", "docker-entrypoint.sh"]
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /build/prisma/ ./prisma/
COPY --from=build /build/prisma.config.ts ./
COPY --from=build /build/dist/ ./dist/
ARG BUILD_VERSION
ARG PIPELINE_ID
ARG PIPELINE_INTERNAL_ID
ARG PIPELINE_URL
ARG GIT_BRANCH
ARG COMMIT_SHA
ARG COMMIT_TIME
ENV APP_INFO_BUILD_VERSION=${BUILD_VERSION}
ENV APP_INFO_CI_PIPELINE_ID=${PIPELINE_ID}
ENV APP_INFO_CI_PIPELINE_INTERNAL_ID=${PIPELINE_INTERNAL_ID}
ENV APP_INFO_CI_PIPELINE_URL=${PIPELINE_URL}
ENV APP_INFO_GIT_BRANCH=${GIT_BRANCH}
ENV APP_INFO_GIT_COMMIT_SHA=${COMMIT_SHA}
ENV APP_INFO_GIT_COMMIT_TIME=${COMMIT_TIME}
USER node
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]