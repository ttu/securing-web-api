#!/bin/bash

# Start Redis service with Docker Compose in detached mode
docker-compose up -d cache

# Navigate to the api directory and run npm start
cd api

CACHE=redis npm start
# CACHE=local npm start