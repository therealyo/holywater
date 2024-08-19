ARG NODE_VERSION=22.5.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NestJS"

WORKDIR /app

ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.22
RUN npm install -g yarn@$YARN_VERSION --force


FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 procps && rm -rf /var/lib/apt/lists/*


COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY --link . .

RUN yarn run build


FROM base

COPY --from=build /app /app

EXPOSE 3000
CMD [ "yarn", "run", "start" ]
