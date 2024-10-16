# Securing Web API

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

Example project for the article: [Efficiently Securing Web Applications Against High User Peaks and Denial-of-Service Attacks](https://ttu.github.io/securing-web-app/)

The purpose of the project is not to provide a thorough understanding of the infrastructure, but to offer a simple example that can be executed locally, giving developers the opportunity to grasp the concept.

## Infrastructure

![Infrastructure](https://ttu.github.io/images/posts/securing-web-app/infrastructure.png)

Implemented components:

- [x] WAF
- [x] CDN
- [x] File Storage
- [x] Load Balancer
- [x] API
- [x] Cache
- [x] Database + Read Replica

## Setup

### Running the project with Docker

```sh
docker compose up
```

### Exposed ports

```txt
80: CDN
8080: Load Balancer
6379: Redis
5432: DB
5433: DB Replica
4566: S3
3000: API
```

When API has multiple instances, exposed ports do not work with current configuration.

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

### Cache durations

```txt
CDN 10s
Load Balancer 20s
API 30s
```

### Running API project

Start project with Redis cache

```sh
chmod +x ./api_local.sh
./api_local.sh
```

### Running load tests scenarios

Load tests are implmented with [K6](https://k6.io/)

Install [K6](https://grafana.com/docs/k6/latest/set-up/install-k6/). E.g.

```sh
# macOS
brew install k6
# Windows
choco install k6
# Linux
...
```

Execute the following command to run the load tests

```sh
k6 run scenarios/scenario_1.js
```

### Integration tests

Integartion tests are implemented with [Jest](https://jestjs.io/).

```sh
cd integration_tests
npm install
npm test
```

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
