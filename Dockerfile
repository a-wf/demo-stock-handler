FROM node:12.18.3-stretch-slim
ENV NODE_ENV "production"
ENV LOG_PATH "/var/log"
ENV LOG_LEVEL "info"

RUN mkdir -p /usr/local/app

WORKDIR /usr/app

ADD dist/ ./

RUN yarn install --production


VOLUME [ "/usr/local/app/.env", "/var/log" ]

EXPOSE 8080
EXPOSE 7777

CMD [ "node", "index.js" ]