FROM openresty/openresty:alpine

COPY nginx.conf /usr/local/openresty/nginx/conf

# Copy static content. This could be a proxy to e.g. S3
COPY static /usr/local/openresty/nginx/html/static

EXPOSE 80