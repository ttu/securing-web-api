# Securing Web API

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

Example project for the article: [Efficiently Securing Web Applications Against Denial-of-Service Attacks](https://ttu.github.io/securing-web-app/)

### Running the project

```sh
docker-compose up
```

Requests

```sh
curl localhost:80/api/user
curl localhost:80/api/user/1
```

### Running API project

Start project

```sh
cd api
npm i
npm start
```

Start with Redis cache

```sh
chmod +x ./api_local.sh
./api_local.sh
```

Requests

```sh
curl localhost:3000/api/user
curl localhost:3000/api/user/1
```

### Links

- https://medium.com/@aedemirsen/load-balancing-with-docker-compose-and-nginx-b9077696f624
- https://geshan.com.np/blog/2022/01/redis-docker/
