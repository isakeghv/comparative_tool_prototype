#!/bin/bash

set -e

DEFAULT_WD="/home/group3/comparative_tool_prototype"
COMPOSE_FILE="docker-compose.yaml"

WD="${WD:-$DEFAULT_WD}"

cd "$WD"

docker compose -f "${WD}/${COMPOSE_FILE}" down
docker compose -f "${WD}/${COMPOSE_FILE}" pull
docker compose -f "${WD}/${COMPOSE_FILE}" up -d

set +e