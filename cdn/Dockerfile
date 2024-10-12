# CDN without WAF (Web Application Firewall)
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf

# Copy static content
COPY static /usr/share/nginx/html/static

EXPOSE 80