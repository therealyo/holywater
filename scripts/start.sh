#!/bin/bash
cp .env.example .env
docker-compose down --remove-orphans
docker-compose up -d --build