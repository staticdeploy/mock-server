FROM node:gallium-alpine
RUN apk add tini --no-cache

LABEL name="@staticdeploy/mock-server" \
      description="Easy to use, no frills mock server" \
      io.staticdeploy.url="https://staticdeploy.io/" \
      io.staticdeploy.version="3.0.0"

ENV PORT=3456
ENV ROOT=mock-server
ENV NODE_ENV=production

WORKDIR /home/node/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY src ./src

USER node

ENTRYPOINT ["/sbin/tini", "--"]

CMD ./src/bin/index.js --port=${PORT} --root=${ROOT}