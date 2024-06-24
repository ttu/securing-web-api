# Securing Web API

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

Example project for the article: [Efficiently Securing Web Applications Against Denial-of-Service Attacks](https://ttu.github.io/securing-web-app/)

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
docker-compose up
```

### Exposed ports

```txt
80: CDN
8080: Load Balancer
3000: API
6379: Redis
```

### Example Requests

```sh
curl localhost:80/api/users
curl localhost:80/api/users/1

curl localhost:3000/api/users
curl localhost:3000/api/users/1
```

### Running API project

Start project with Redis cache

```sh
chmod +x ./api_local.sh
./api_local.sh
```

Start project

```sh
cd api
npm i
npm start
```

### Links

- https://medium.com/@aedemirsen/load-balancing-with-docker-compose-and-nginx-b9077696f624
- https://geshan.com.np/blog/2022/01/redis-docker/
