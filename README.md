# Products-depot-handler

## Description

This project started with below simple instuctions:

---

We would like to be able to handle stock of products in our warehouse.

Features:

View the stock available for a specific product

Hold a stock

Release a stock

Confirm the stock mouvement (remove the stock)

Add stock with secure access

To do:

Make all those features usable by an API

Use Docker to let us using you API easily

Write API DOC in the project

Write some tests

---

and is completed after with my idea:

This project presents a backend API server of a products depot.

There are an administrator commands which can add new user accounts, new products, it can also delete account, increase or decrease an amount of products in stock.

There are also public commands to list products, to list what products are holded by an user account, to hold new products, to inscreas and descrease an amount of holded products and to take out from the depot holded products.

This service is packaged in a docker image to easly deploy and test.

For beginning, I used the stack liste below to implement the project:

```

Express

Mongoose

REST openapi

Jest

Supertest

```

I want also add features like graphql API (`express-grapql or apollo graphql express middleware`), change`mongo`by`Bookshelf + Knex + ProstgresQL` and if I have time, try to convert code in typescript, create a customized error class, add metric producer for monitoring better.

```

Express

Bookshelf+Knex+Postgresql

Graphql API

Jest

Supertest

```

## Configuration

Configuration can be done by declaring environment variables or by editing the dotenv file in `src` folder. Same case for using docker.

Note: this API application can normally be run with only default configuration.

List of config value:

```Bash

# Common part
# nodejs environment variable (<string>, ['development', 'production', 'staging', 'test'], default: 'development')
NODE_ENV=development



# Server part
# API server port (<string>, default: 'http')
API_PROTOCOL=http

# API server protocol (<number>, default: 8080)
API_PORT=8080

# basic authentication login (<string>, default: 'admin')
API_ADMIN_LOGIN=admin

# basic authentication password (<string>, default: 'admin')
API_ADMIN_PASSWORD=admin

# apiKey value (<string>, default: 'apikey ABCD')
API_APIKEY_VALUE="apikey ABCD"

# server ssl key path (<string>, default: undefined)
API_SSL_KEY="{path}/server.key"

# server cert path (<string>, default: undefined)
API_SSL_CERT="{path}/server.cert"



# Rate limiter feature part
# max number of request in a time window (<number>, default: 5)
RATE_MAX_COUNTS=5

# time window in second (<number>, default: 1)
RATE_WINDOW_DURATION=1



# Database Part

# database type (<string>, default: 'mongo')
DATABASE_TYPE=mongo

# database host address (<string>, default: 'localhost')
DATABASE_HOST=localhost

# database connection username (<string>, default: undefined)
DATABASE_USERNAME

# database connection password (<string>, default: undefined)
DATABASE_PASSWORD

# database name (<string>, default: 'products_depot_db')
DATABASE_NAME=test_db

# not used by mongo. Knex's pool min (<number>, default: 1)
DATABASE_POOL_MIN=1

# not used by mongo. Knex's pool max (<number>, default: 5)
DATABASE_POOL_MAX=5

# not used by mongo. Knex's migration path (<number>, default: migration folder in source code)
DATABASE_MIGRATIONS_PATH="migrations/path"

# not used by mongo. Knex's migration path (<number>, default: seeds folder in source code)
DATABASE_SEEDS_PATH="seeds/path"



# Logger part
# logger mode (<string>, ['info', 'debug', 'error', 'warning'], default: 'debug')
LOG_LEVEL=debug

# log file prefix (<string>, default: 'service')
LOG_FILE=service

# log file output path (<string>, default: './logs')
LOG_PATH="./logs"

#log file max size (<number>, default: 1024000)
LOG_FILE_MAXSIZE=1024000

# max number of log files - circular usage (<number>, default: 3)
LOG_MAXFILES=3



# Monitor part
# enable to monitor express API (<boolean>, default: true)
MONITOR_ENABLE=true

# metric server port (<number>, default: 7777)
MONITOR_PORT=7777

```

## Commands

**In project root directory**

Get packages:

```

yarn install --production

```

To run:

```

yarn install --production

```

To test:

```

yarn test

```

To build:

```

yarn build

```

To run as docker (with `docker-compose`):

```

docker-compose up

```

## API Design

### REST

The REST design can be see with the openapi.yaml file or by running the api application in `NODE_ENV=development` mode, on `/rest-api-doc` endpoint.

Note: we cannot use POST commands to increase or decrease already registered/holded product. Have to use PATCH commands.

### Graphql

## Datamodel Design

![datamodel](./resources/datamodel.png)

As you can see, account table, product table and cart table.
Each time an account user holds an amount of a product, the product amount in product table will decrease. It will decrease if user release an amount of this product.
