#!/bin/bash

# Start DB and Redis service with Docker Compose in detached mode
docker-compose up -d db cache

# Navigate to the api directory and run npm start
cd api

CACHE=redis npm start
# CACHE=local npm start