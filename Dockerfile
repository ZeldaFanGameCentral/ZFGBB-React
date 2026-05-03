FROM node:24-alpine AS development-dependencies-env
RUN corepack enable
COPY . /app
WORKDIR /app
RUN yarn install --immutable

FROM development-dependencies-env AS production-dependencies-env
WORKDIR /app
RUN yarn prepare:prod

FROM node:24-alpine AS build-env
RUN corepack enable
ARG REACT_ZFGBB_API_URL=https://api.bluedreamers.com/zfgbb
ARG REACT_ZFGBB_API_URL_INTERNAL=http://zfgbb.zfgbb.svc.cluster.local:8080/zfgbb
ENV REACT_ZFGBB_API_URL=$REACT_ZFGBB_API_URL
ENV REACT_ZFGBB_API_URL_INTERNAL=$REACT_ZFGBB_API_URL_INTERNAL
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN yarn build

FROM node:24-alpine AS app
RUN corepack enable
COPY ./package.json yarn.lock /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["yarn", "run", "start"]