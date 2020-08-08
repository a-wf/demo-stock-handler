# include params.mk

# CURRENT_DIR = $(shell pwd)
# RESOURCES_DIR = $(CURRENT_DIR)/resources
# SCRIPTS_DIR = $(CURRENT_DIR)/scripts

# OUTPUT_DIR = $(CURRENT_DIR)/output
# INSTALL_DIR = $(OUTPUT_DIR)/app
# BUILD_DIR = $(OUTPUT_DIR)/build
# RELEASE_DIR = $(OUTPUT_DIR)/release

# ARTIFACTS_DIR = $(OUTPUT_DIR)/artifacts
# LOG_DIR = $(OUTPUT_DIR)/log


# cert-files:
# 	mkdir -p $(LOG_DIR) $(ARTIFACTS_DIR)
# 	sh $(SCRIPTS_DIR)/cert-gen.sh $(ARTIFACTS_DIR)

# install: 
# 	mkdir -p $(INSTALL_DIR)
# 	cp -R $(CURRENT_DIR)/src $(INSTALL_DIR)/src
# 	mkdir -p $(LOG_DIR) $(ARTIFACTS_DIR)
# 	@m4  -P -DSERVICE_VERSION=$(COMPONENT_TAG) $(RESOURCES_DIR)/package.json.m4 > $(ARTIFACTS_DIR)/package.json
# 	@m4  -P -DSERVICE_PROTOCOL=$(SERVICE_PROTOCOL) \
# 					-DSERVICE_PORT=$(SERVICE_PORT) \
# 					-DSERVICE_PRIVATE_KEY=$(ARTIFACTS_DIR)/server.key \
# 					-DSERVICE_CERTIFICATE=$(ARTIFACTS_DIR)/server.cert \
# 					-DLOG_MODE=debug \
# 					-DSERVICE_LOG_FOLDER_PATH=$(LOG_DIR) \
# 					$(RESOURCES_DIR)/$(CONFIG_FILE).m4 > $(ARTIFACTS_DIR)/$(CONFIG_FILE)

# 	ln $(ARTIFACTS_DIR)/$(CONFIG_FILE) $(INSTALL_DIR)/src/config/$(CONFIG_FILE)
# 	ln $(ARTIFACTS_DIR)/package.json $(INSTALL_DIR)/package.json
# 	cd $(INSTALL_DIR); npm i

# run:
# 	cd $(INSTALL_DIR); npm run dev

# test:
# 	cd $(INSTALL_DIR); npm test

# build: 
# 	mkdir -p $(BUILD_DIR)
# 	rsync -av --progress $(INSTALL_DIR) $(BUILD_DIR)/src_tmp --exclude node_modules
# 	@m4  -P -DSERVICE_PORT=$(SERVICE_PORT) \
# 					-DCODE_SOURCE_FOR_BUILD=./src_tmp/app \
# 					$(RESOURCES_DIR)/Dockerfile.m4 > $(ARTIFACTS_DIR)/Dockerfile
# 	docker build $(BUILD_DIR) -f $(ARTIFACTS_DIR)/Dockerfile -t docker_$(COMPONENT):$(COMPONENT_TAG)
# 	docker save docker_$(COMPONENT):$(COMPONENT_TAG) > $(BUILD_DIR)/docker_$(COMPONENT)_$(COMPONENT_TAG).img
# 	@m4  -P -DSERVICE_PROTOCOL=$(SERVICE_PROTOCOL) \
# 					-DSERVICE_PORT=$(SERVICE_PORT) \
# 					-DSERVICE_PRIVATE_KEY=$(ARTIFACTS_DIR)/server.key \
# 					-DSERVICE_CERTIFICATE=$(ARTIFACTS_DIR)/server.cert \
# 					-DLOG_MODE=info \
# 					-DSERVICE_LOG_FOLDER_PATH=/var/log \
# 					$(RESOURCES_DIR)/$(CONFIG_FILE).m4 > $(ARTIFACTS_DIR)/config_build.toml
# 	mv $(ARTIFACTS_DIR)/config_build.toml $(BUILD_DIR)/config_build.toml
# 	rm -rf $(BUILD_DIR)/src_tmp
# 	@m4 -P -DCOMPONENT=$(COMPONENT) \
# 				 -DDOCKER_IMG_NAME=docker_$(COMPONENT) \
# 				 -DDOCKER_IMG_TAG=$(COMPONENT_TAG) \
# 				 -DSERVICE_PORT=$(SERVICE_PORT) \
# 				 -DDOCKER_ENDPOINT_PORT=$(SERVICE_PORT) \
# 				 -DARTIFACTS_CONFIG=$(BUILD_DIR)/config_build.toml \
# 				 -DARTIFACTS_LOG_DIR=$(LOG_DIR) \
# 					$(RESOURCES_DIR)/docker-compose.yaml.m4 > $(ARTIFACTS_DIR)/docker-compose.yaml
# 	cp $(ARTIFACTS_DIR)/docker-compose.yaml $(BUILD_DIR)/docker-compose.yaml

# release:
# 	mkdir -p $(RELEASE_DIR)
# 	cp $(BUILD_DIR)/docker_$(COMPONENT)_$(COMPONENT_TAG).img $(RELEASE_DIR)/docker_$(COMPONENT)_$(COMPONENT_TAG).img
# 	# to package, compress tar.gz, etc
		
# deploy:
# 	docker load -i $(BUILD_DIR)/docker_$(COMPONENT)_$(COMPONENT_TAG).img
# 	docker-compose -f $(BUILD_DIR)/docker-compose.yaml up -d
	
# clean:
# 	rm -rf $(OUTPUT_DIR)