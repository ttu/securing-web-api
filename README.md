# Securing Web API

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)

Example project for the article: [Efficiently Securing Web Applications Against Denial-of-Service Attacks](https://ttu.github.io/securing-web-app/)

### Running the project

```sh
docker-compose up
```

```sh
curl localhost:80/api/user
curl localhost:80/api/user/1
```

### Running API project

```sh
cd api
npm i
npm start
```

```sh
curl localhost:3000/api/user
curl localhost:3000/api/user/1
```

### Links

- https://medium.com/@aedemirsen/load-balancing-with-docker-compose-and-nginx-b9077696f624
