#!/usr/bin/env bash
set -euo pipefail

# MyHotel — build and start all services with Docker Compose
# Run from project root:
#   chmod +x deploy/scripts/deploy.sh
#   ./deploy/scripts/deploy.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DEPLOY_DIR="$ROOT_DIR/deploy"

cd "$DEPLOY_DIR"

if [ ! -f .env ]; then
  echo "ERROR: deploy/.env not found."
  echo "Copy deploy/.env.example to deploy/.env and fill in values:"
  echo "  cp deploy/.env.example deploy/.env"
  exit 1
fi

echo "==> Building and starting MyHotel stack..."
docker compose --env-file .env down --remove-orphans 2>/dev/null || true
docker compose --env-file .env build --no-cache
docker compose --env-file .env up -d

echo ""
echo "==> Waiting for services to become healthy..."
sleep 15

echo ""
echo "==> Container status:"
docker compose --env-file .env ps

echo ""
echo "==> Health checks:"
curl -sf http://localhost/hotel-api/ping/health && echo " PlainAPI: OK" || echo " PlainAPI: FAILED"
curl -sf http://localhost/booking-api/ping/health && echo " Booking Service: OK" || echo " Booking Service: FAILED"
curl -sf http://localhost/notification-api/ping/health && echo " Notification Service: OK" || echo " Notification Service: FAILED"

PUBLIC_IP=$(curl -s http://checkip.amazonaws.com || echo "YOUR_EC2_PUBLIC_IP")
echo ""
echo "Deployment finished."
echo "Open in browser: http://${PUBLIC_IP}"
