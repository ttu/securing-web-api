# Notes for Going Through the Project

There are intentional slowdowns in the code to demonstrate how different parts of the system work. This simulates real-world scenarios where some components of the system may be slow.

## Prerequisites

- Running infra: Docker
- Scenarios: [k6](https://k6.io/)
  - Easy to port to any other load testing tool
- Example requests: [Postman](https://www.postman.com/)
  - Postman request collection can be imported to [yaak](https://yaak.app/), [Insomnia](https://insomnia.rest/) etc.
- [Zap](https://www.zaproxy.org/) may be used to demonstrate how WAF can help with security.

## About Users and Requests

It is difficult to estimate how many users and requests the service will need to handle. The number of users may fluctuate throughout the day, and certain events could cause spikes in traffic.

It is often important that the site can handle these traffic spikes. Slowness may be acceptable, but downtime is not. If the site goes down, users may leave and not return.

**Example case:**

- 10,000 simultaneous users on the site.
- Each makes 4 actions per minute.
  - Page changes, etc.
- Each action makes an average of 2 requests to the API.
  - Loading products, comments, discounts, etc.
- How many requests per second?
  - 10,000 users = 40,000 actions per minute = 666 actions per second = 1,332 requests per second.

**Basic site:**

- Main site
  - Multiple requests
- Product listings
  - Dynamic queries
- Individual product pages
  - Single request or multiple requests
    - Reviews, comments, promotions
- Forms
  - Orders, comments, questions

**Examples:**

- Site with single request (_SSR_): [varuste.net](https://varuste.net/)
- Site with multiple requests (_SPA-ish_): [Verkkokauppa.com](https://www.verkkokauppa.com/)

## About Latencies

In the example project, everything - caller, API, databases, services are on the same computer, so everything is much faster than in real life.

**Real-life latencies:**

- To a different continent, latency can be 100-200ms.
- To a different country, latency can be 10-100ms.
- To a different data center in the same region, latency can be 2-10ms.
- To the same data center region, different AZ, latency can be 1-5ms.
- To the same data center, latency can be 0.1-1ms.

Measure latency from your browser to various cloud provider data centers: [Cloudping](https://www.cloudping.info/)

- Other things to consider:
  - Virtual private network between services.
    - Requests do not go through the public internet.

# Presentation

## Infra

- Most providers offer same services, but with different names.
- Akamai & CloudFlare handle like 40% of all internet traffic.

## Project infrastructure

- WAF - _Part of CDN_
- CDN - _nginx_
  - Uses OWASP ModSecurity image
- Load Balancer - _nginx_
- API - _Node.js Express_
- Cache - _Redis_
- Database + Read Replica - _PostgreSQL_
  - Seed data with optional creation on large volume of data
- File Storage - S3 - _LocalStack_

### API

- Express
- Features in own folders
  - Features structured to layers (Route, Business Logic, Data Access)
  - Some use layering more, some less
  - Each feature has own unit tests
- Run project with Docker, VS Code or skript
- Authentication with fake Bearer token. `Authorization: Bearer <userid>`

## No Open Endpoints - Automatic API security testing

[Zed Attack Proxy guide guide](https://ttu.github.io/zed-attack-proxy-quick-guide/)

Show Zaproxy usage on server. Show how it can be used to find vulnerabilities and bugs.

- Sometimes it's good to have open endpoints. E.g. price data to prevent scraping
- Create openapi specification with Copilot or similar
- Show endpoint with missing autheentication
- Show improper handling for 404
- When authenticated, posting malicious data
  - Validate incoming data

### WAF + Zaproxy

- How WAF can help with this?
  - Show with Zaproxy or with Postman
  - Find post with e.g. `{"id":"<%= global.process.mainModule.require('child_process').execSync('sleep 15').toString()%>","price":1.2},{"id":10,"price":1.2}`
  - https://github.com/coreruleset/coreruleset/blob/main/rules/REQUEST-934-APPLICATION-ATTACK-GENERIC.conf
- Show how WAF can be used to block requests
  - Blocking files:
    - https://github.com/coreruleset/coreruleset/blob/71e0dffa7fafee9fca5258848b1263967534cd57/rules/REQUEST-930-APPLICATION-ATTACK-LFI.conf#L119
    - https://github.com/coreruleset/coreruleset/blob/main/rules/restricted-files.data
  - Add body to GET request
    - Show with Zaproxy or Postman
    - https://ttu.github.io/rest-api-presentation/#67
- Commercial WAFs have anomality detection and other fancy features

## Cache

- CDN
  - [How CDN works](https://cf-assets.www.cloudflare.com/slt3lc6tev37/7Dy6rquZDDKSJoeS27Y6xc/4a671b7cc7894a475a94f0140981f5d9/what_is_a_cdn_distributed_server_map.png)
  - Other features: image optimization, security, etc.
- Load Balancer
  - Balance load for all instances
- Cache-Control headers
  - How headers are used by Browser, CDN, LB
- Show how cache works
  - Show how cache is used in the service, middleware, LB and CDN
- Cache invalidation
  - POST `products/admin/prices`
  - Pubsub
    - Add subscriber container with `npm run start:subscriber`
    - `npm run start:publisher`
  - Long cache and manual purge problem
    - CDN (normal vs enterprise), Redis, nginx
- Slow endpoints
  - POST to reports endpoint x 2 -> GET requests wait
  - Examples:
    - SSR was slow and could handle under 10 requests per second
    - Parsing large JSONs could handle 100 requests per second
- Stale while revalidate
  - When cache expires, multiple requests hit the server, unless stale while revalidate is used
  - Add sleep to e.g. details endpoint
  - Show with Postman how one request goes through, rest serve from cache
  - Show with k6: `k6 run scenarios/example_stale.js`
  - Remove updating from cdn config
- Cache 500-errors: Can prevent hitting external services
  - Make request to details, enable 500-error, check next requests with Postman
- Browser & ETag
  - Doesn't help with server load & malicious requests
  - Etag to false and show from browser 200 -> 304
    - http://localhost:3000/api/products/details
    - Disable cache from browser / turn off etag from A
      - `app.set('etag', true);` to false
      - enable `Last-Modified` header from details-endpoint
  - With etag requests hit to server, but no data is transmitted

## Rate Limiting

- Show how rate limiting works
  - Show with k6
    - `k6 run scenarios/example_rate_limit.js`
    - Show behaviour from API, CDN, LB
  - Show rate limit headers from Postman

## Blocking an User

- Show how to block an user
  - Show with Postman
  - Show how to block from API
  - No config in LB or CDN, but possible to add e.g. check from Authorization header
  - Block by IP/region etc.
  - JWT blacklist (short vs long, refresh device specific)

## Duplicate Requests

- Show with Postman how duplicate requests are handled in /support/message endpoint
- CAPTCHA
- Own DDOS

# Scenarios

TIP: Forget that you have just seen the complete infrastructure. Let's start from the beginning.

## 1: The beginning - Single Instance

This is a common starting point. Just a single instance running in cloud or some on-prem server.

- After this there is some in-memory cache added to the service.

## 2: Slow backend - Things Are Looking Bright

Often there is some code that is just slow. E.g. calling endpoint takes 10-50ms of execution time. Other requests are blocked during this time.

- After this there is multiple instances, load balancer and shared cache.
- Now we can server endless amount of requests.

## 3: Going global - Things Are Looking Bright

We have now lot's of customers in many regions. We want to make sure that the service is fast for everyone.

- After this there is CDN added to the service.

## 4: DoS Attack

Demonstrate how even with a simple script you can bring down the service if you are not prepared.

- After this there is rate limiting added to the service.

## 5 & 6: Idempotent Requests

Demonstrate how you can make sure that same data is not inserted multiple times.

- After this there is idempotency key added to the service.

# Load Testing Output

TODO

http_req_duration mesures the time from the start of the request to the end of the response.

```txt
http_req_duration..............:
avg=3.48ms  min=779µs  med=2.37ms  max=5.03s  p(90)=3.79ms  p(95)=4.36ms
```
