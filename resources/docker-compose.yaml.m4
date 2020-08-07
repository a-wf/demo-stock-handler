version: '3'
services:
  COMPONENT:
    image: DOCKER_IMG_NAME:DOCKER_IMG_TAG
    restart: unless-stopped
    ports:
      - 'SERVICE_PORT:DOCKER_ENDPOINT_PORT'
    volumes:
      - ARTIFACTS_CONFIG:/usr/local/app/src/config/config.toml
      - ARTIFACTS_LOG_DIR:/var/log
