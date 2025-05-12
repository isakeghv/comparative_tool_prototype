#!/bin/bash

set -e

WD="$(cd "$(dirname "$0")" && pwd)"

bash "${WD}/copy.docker.compose.sh"
bash "${WD}/run.docker.sh"

set +e