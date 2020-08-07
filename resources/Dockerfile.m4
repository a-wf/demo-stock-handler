FROM node:dubnium-slim

RUN mkdir -p /usr/local/app

WORKDIR /usr/app

ADD CODE_SOURCE_FOR_BUILD/ ./

RUN npm i --production 

VOLUME [ "/usr/local/app/src/config", "/var/log" ]

EXPOSE SERVICE_PORT

CMD [ "npm", "start" ]