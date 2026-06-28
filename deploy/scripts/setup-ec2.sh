#!/usr/bin/env bash
set -euo pipefail

# MyHotel — EC2 bootstrap script (Ubuntu 22.04 / 24.04)
# Run as ubuntu user with sudo:
#   chmod +x deploy/scripts/setup-ec2.sh
#   ./deploy/scripts/setup-ec2.sh

echo "==> Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "==> Installing dependencies..."
sudo apt-get install -y ca-certificates curl git ufw

echo "==> Installing Docker..."
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
fi

echo "==> Adding current user to docker group..."
sudo usermod -aG docker "$USER" || true

echo "==> Enabling Docker on boot..."
sudo systemctl enable docker
sudo systemctl start docker

echo "==> Configuring firewall (UFW)..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable || true

echo ""
echo "Setup complete."
echo "IMPORTANT: Log out and back in so docker group membership applies."
echo "Then clone the repo and run: ./deploy/scripts/deploy.sh"
