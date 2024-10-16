# Notes for Going Through the Project

There are intentional slowdowns in the code to demonstrate how different parts of the system work. This simulates real-world scenarios where some components of the system may be slow.

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

In the example project, everything—caller, API, databases, services—is on the same computer, so everything is much faster than in real life.

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

## Automatic API security testing

[Zed Attack Proxy guide guide](https://ttu.github.io/zed-attack-proxy-quick-guide/)

Show Zaproxy usage on server. Show how it can be used to find vulnerabilities and bugs.

- Show endpoint with missing autheentication
- Show improper handling for 404
- When authenticated, posting malicious data
  - How WAF can prevent this
- Show how WAF can be used to block requests
  - Blocking files:
    - https://github.com/coreruleset/coreruleset/blob/71e0dffa7fafee9fca5258848b1263967534cd57/rules/REQUEST-930-APPLICATION-ATTACK-LFI.conf#L119
    - https://github.com/coreruleset/coreruleset/blob/main/rules/restricted-files.data

## Scenarios

TIP: Forget that you have just seen the complete infrastructure. Let's start from the beginning.

### Single Instance

This is a common starting point. Just a single instance running in cloud or some on-prem server.

- After this there is some in-memory cache added to the service.

### Exection of Blocking Code

Often there is some code that is just slow. E.g. calling endpoint takes 10-50ms of execution time. Other requests are blocked during this time.

- After this there is multiple instances, load balancer and shared cache.
- Now we can server endless amount of requests.

?? Is there a way to demonstrate how much faster this is

### Things Are Looking Bright

We have now lot's of customers in many regions. We want to make sure that the service is fast for everyone.

- After this there is CDN added to the service.

### DoS Attack

Demonstrate how even with a simple script you can bring down the service if you are not prepared.

- After this there is rate limiting added to the service.

### Idempotent Requests

Demonstrate how you can make sure that same data is not inserted multiple times.

- After this there is idempotency key added to the service.

## Other Things To Demonstrate

1. Plain API

   - Normal GET requests
     - How many requests can it handle?
     - k6 to /hello
     - k6 to slow endpoint -> get product details
   - Show slower requests
     - Etag to false and show from browser 200 -> 304
     - With etag requests hit to server, but no data is transmitted
   - Slow blocking requests
     - How a single request blocks the server
       - This is not a common case but can happen
       - Examples:
         - SSR was slow and could handle under 10 requests per second
         - Parsing large JSONs could handle 100 requests per second.

2. Add cache to service (memory cache)
   a. Can still be CPU heavy
   https://github.com/ttu/securing-web-api/blob/42350e93bf2c1f8b38bba6d41b695f9647d631d9/api/src/cache/cacheLocal.ts

3. Add cache to middleware
   a. No hit to BL
   b. Less control (user specific etc.)

https://github.com/ttu/securing-web-api/blob/2890435040b959de627d42bdc34aa9aa0938a0e8/api/src/cache/cacheMiddleware.ts

4. Crash with requests -> need more instances!
   a. How to demonstrate? Not all can be cached (e.g. SSR slow)
5. Add load balancer (no cache)
6. Add 2 instances
   a. Now can handle lot's of traffic
   b. Wait? Cached data only hit sometimes?
7. Add redis for cache
   a. Profit!

- Add read replica

  - Analytics etc. can use read replica
  - Slow queries can be done on read replica.
  - Audit log can be done on separate replica.
  - Upgrades, maintenance etc. can be done without downtime
  - In case of crash, can be used as primary

- Add cache to LB
  - No need to hit our own service
- Add cache to CDN
  - No need to hit our own setup

Notice when cache exprires, multiple requests are made to the service. Solution: Stale while revalidate.

## Load Testing Output

TODO

```txt
http_req_duration..............:
avg=3.48ms  min=779µs    med=2.37ms max=5.03s  p(90)=3.79ms p(95)=4.36ms
```
