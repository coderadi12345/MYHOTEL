#!/usr/bin/env bash
set -euo pipefail

# Pull latest code and redeploy
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

cd "$ROOT_DIR"

if [ -d .git ]; then
  echo "==> Pulling latest changes..."
  git pull
fi

exec "$ROOT_DIR/deploy/scripts/deploy.sh"
