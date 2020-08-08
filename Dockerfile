FROM node:14.7.0-stretch-slim

RUN mkdir -p /usr/local/app

WORKDIR /usr/app

ADD build/ ./

RUN yarn install --production

ENV LOG_PATH "/var/log"
ENV NODE_ENV "production"

VOLUME [ "/usr/local/app/src/config", "/var/log" ]

EXPOSE 8080

CMD [ "node", "app.js" ]