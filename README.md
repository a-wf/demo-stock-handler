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

There are also secured (by apiKey) public commands to list products, to list what products are holded by an user account, to hold new products, to inscreas and descrease an amount of holded products and to take out from the depot holded products. If an account is deleted without move out the holded products, products will be returned to the depot stock.

This service is packaged in a docker image to easly deploy and test.

Implementation progress can be see in the changelog file, but it is really accurate. (It is mainly for myself: I update version each time I take a break)

For beginning, I used the stack liste below to implement the project:

```

Express

Mongoose

REST openapi

Jest

Supertest

```

if I have time, I want also add features like graphql API (`express-grapql or apollo-server-express`), change`mongo`by`Bookshelf + Knex + ProstgresQL`, create a customized error class, try to convert code in typescript and add metric producer for monitoring better.

```

Express

Bookshelf+Knex+Postgresql

Graphql API

Jest

Supertest

```

And finally, we can discuss about pro and con of features in the next step. (if there is a technical review interview)

## Configuration

Configuration can be done by declaring environment variables or by editing the dotenv file in `src` folder. Same case for using docker.

_Note_: this API application can normally be run with only default configuration.

List of config value:

```Bash

# Common part
# nodejs environment variable (<string>, ['development', 'production', 'staging', 'test'], default: 'development')
NODE_ENV=development



# Server part
# type of api (<string>, ['rest', 'graphql'], default: 'graphql')
API_TYPE=rest
# API server port (<string>, default: 'http')
API_PROTOCOL=http

# API server protocol (<number>, default: 8080)
API_PORT=8080

# basic authentication login (<string>, default: 'admin')
API_ADMIN_LOGIN=admin

# basic authentication password (<string>, default: 'admin')
API_ADMIN_PASSWORD=admin

#  jtw token secret, usable only if graphql api is enabled (<string>, default: 'admin-sercret')
API_GRAPHQL_ADMIN_TOKEN_SECRET="admin-secret"

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

The REST design can be see with the openapi.yaml file or by running the api application in `development` mode, on `/rest-api-doc` endpoint.

run command: `NODE_ENV="development" API_TYPE="rest" yarn dev"

All commands are secured by apiKey (if provided) and admin commands have additional additional security access basic authentication.

**Note**: We cannot use POST commands to increase or decrease already registered/holded product. Have to use PATCH commands.

### Graphql

The trends (https://www.npmtrends.com/apollo-server-vs-express-graphql-vs-graphql-yoga-vs-prisma-vs-apollo-server-express) suggest to use apollo-server-express. So I chose this module instead of express-graphql (I know it is a very good one too, I used for my personal project and I want to discover new tech).

The Graphql design can be see in `src/api-graphql` folder or by running the api application in `development` mode, on `/graphql` endpoint.

run command: `NODE_ENV="development" API_TYPE="graphql" yarn dev"

**Note**: this Graphql API is not the mirror of the REST API, It has more commands, for instance for getting user account data.

All commands are secured by apyKey (if provided) and admin commands have additional security access with token. The token generation is based on username/password encrypted with `bcrypt` module then transform to a jwt token. the server token will be logged in logger's debug mode.

_Note_: As I didn't set a expiration time, all tokens base on the same username/password will be considered as valid tokens.

_Note_: There is a `openapi-to-graphql` module (see https://www.npmjs.com/package/openapi-to-graphql) that can easly convert an openapi doc into a graphql schema and then build api server with `express-graphql`. But it not the purpose of this project.

## Datamodel Design

![datamodel](./resources/datamodel.png)

As you can see, account table, product table and cart table.
Each time an account user holds an amount of a product, the product amount in product table will decrease. It will decrease if user release an amount of this product.

## Test

### Unit tests

For unit test, I didn't implemente all functions' tests, because I am worried about the remaining time,
So for `controllers` and `queries` I just implemente tests for a few functions, for proving my capability to implement unit test with Jest. (I can also do Mocha, Chai, Sinon and Istanbul coverage, I choose Jest because it has more features by itself)

### Integration tests

#### REST API

Integration tests are implemented using `Supertest`. I didn't implement full use-cases tests because of the same reason for unit tests implementation. (Infact, with what I already implemented as integrations tests, full use-cases tests will be _"copy/past"_ of those tests with ordering logic)

#### Graphql API

As for REST API, tests are implemented using `Supertest`. As with `Resolvers Chains` feature, Graphql API have more flexibility than REST API, use-cases are almost fully tested.
