# Securing Web API

Example infrastructure for the article: [Efficiently Securing Web Applications Against High User Peaks and Denial-of-Service Attacks](https://ttu.github.io/securing-web-app/)

The purpose of the project is not to provide a thorough understanding of the infrastructure, but to offer a simple example that can be executed locally, giving developers the opportunity to grasp the concept.

The project includes training scenarios that start with a single instance of the API and a database. The scenarios incrementally build the infrastructure to include cache, multiple instances, load balancer, CDN, and rate limiting. Scenarios are implemented with [K6](https://k6.io/).

## Infrastructure

![Infrastructure](https://ttu.github.io/images/posts/securing-web-app/infrastructure.png)

- WAF - _Part of CDN_
- CDN - _nginx_
- File Storage - S3 - _LocalStack_
- Load Balancer - _nginx_
- API - _Node.js Express_
- Cache - _Redis_
- Database + Read Replica - _PostgreSQL_

## Setup

### Running Infrastructure With Docker

```sh
docker compose up
```

### Exposed Ports

```txt
80: CDN
8080: Load Balancer
6379: Redis
5432: DB
5433: DB Replica
4566: S3
3000: API
```

When API has multiple instances, exposed ports do not work with docker compose.

### Example Requests

Endpoints:

```sh
### Endpoint where data does not change frequently
# Data changes once per day, once per month etc.
GET /products/details/
GET /products/prices/

### Endpoint to update data and invalidate cache
# This endpoint updates the prices for the models
# E.g. manual update of prices once per day
# This could also be automated process
POST /products/admin/prices/

### Authenticated endpoint
# Get customer (own) orders
GET /orders/
# Create customer specific orders
POST /orders/

### Non-authenticated post endpoint
# Send message to customer support
POST /support/messages

### Endpoint with CPU expensive operation that will block the server
# Create reports of orders, customers etc.
GET /reports/
```

Requests:

```sh
# CDN
curl localhost:80/api/products/details
curl localhost:80/api/products/catalog/en

# API
curl localhost:3000/api/products/details
curl localhost:3000/api/products/catalog/en

# Static files
# S3 through CDN
http://localhost:80/s3/index.html
# Static files from CDN
http://localhost:80/static/index.html
```

### Cache

#### CDN

CDN has a cache based on the `Cache-Control` header.

#### Load Balancer

Load Balancer has a simple cache for only `GET` 200 status code responses. This is disabled by default.

#### API

API has two caches:

1. Middleware cache
2. Code-level cache

API can be configured to use in-memory cache or Redis cache.

### Running Only The API Project

#### VS Code

1. Open the repository in VS Code
2. Run and Debug -> "Launch API"

#### Script

Start only API project and DB + Cache from docker compose

```sh
chmod +x ./api_local.sh
./api_local.sh
```

### API Unit Tests

Unit tests are implemented with [Jest](https://jestjs.io/).

```sh
cd api
npm install
npm test
```

or open the api directory in VS Code and run the tests with the test runner.

### Integration Tests

Integartion tests are implemented with [Jest](https://jestjs.io/).

```sh
cd integration_tests
npm install
npm test
```

or open the integration_tests directory in VS Code and run the tests with the test runner.

## Training Scenarios

Scenarios tests are implmented with [K6](https://k6.io/).

Install [K6](https://grafana.com/docs/k6/latest/set-up/install-k6/). E.g.

```sh
# macOS
brew install k6
# Windows
choco install k6
# Linux
...
```

Scenario is in the `scenarios` directory. Scenarios build on each other, so start from the first scenario.

[training-scenarios](https://github.com/ttu/securing-web-api/tree/training-scenarios) branch contains a starting point for the scenarios.

```sh
git checkout training-scenarios
```

First scenario has only a single instance of the API and a database. Start the infrastructure with Docker Compose.

```sh
docker compose up
```

Execute the following command to run the scenario:

```sh
k6 run scenarios/scenario_1.js
```

NOTE: If you are using VS Code to run the API, modify the command in `tasks.json` that starts the DB and Cache to docker `compose up -d db`, as the cache is not part of the first scenario.

## Docker Compose commands

```sh
docker compose up
docker compose down
docker compose down --volumes
docker compose logs
docker compose build
docker compose restart
docker compose up [service]
docker compose restart load_balancer
```

Tail PostgreSQL logs

```sh
docker exec -it securing-web-api-db-1 tail -f /var/lib/postgresql/data/pg_log/postgresql-2024-09-12.log
```
