# Securing Web API

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

Example project for the article: [Efficiently Securing Web Applications Against High User Peaks and Denial-of-Service Attacks](https://ttu.github.io/securing-web-app/)

Purpose of the project is not to give thourough understainding of the infrastructure, but to provide a simple example for developers to get a grasp of the concept.

## Infrastructure

![Infrastructure](https://ttu.github.io/images/posts/securing-web-app/infrastructure.png)

Implemented components:

- [ ] WAF
- [x] CDN
- [ ] File Storage
- [x] Load Balancer
- [x] API
- [x] Cache
- [ ] Database

## Setup

### Running the project with Docker

```sh
docker compose up
```

### Exposed ports

```txt
80: CDN
8080: Load Balancer
3000: API
6379: Redis
```

### Example Requests

Endpoints:

```sh
# Static file
TODO

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
# Create reports of orders, users etc.
GET /reports/

```

Requests:

```sh
curl localhost:80/api/users
curl localhost:80/api/users/1

curl localhost:3000/api/users
curl localhost:3000/api/users/1
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

### Running load tests

Load tests are implmented with [K6](https://k6.io/)

Install [K6](https://grafana.com/docs/k6/latest/set-up/install-k6/). E.g.

```sh
# macOS
brew install k6
# Windows
choco install k6
```

Execute the following command to run the load tests

```sh
k6 load-tests/get_users.js
```

## Docker Compose commands

```sh
docker compose up
docker compose down
docker compose logs
docker compose build
docker compose restart
docker compose up [service]
docker compose restart load_balancer
```

### Links

- https://medium.com/@aedemirsen/load-balancing-with-docker-compose-and-nginx-b9077696f624
- https://geshan.com.np/blog/2022/01/redis-docker/
