#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu EC2 instance: installs Docker and lets the login user run it.
# Usage on the server:  bash ec2-setup.sh
set -euo pipefail

sudo apt-get update -y
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

echo "Docker installed. Log out and back in so '$USER' can run docker without sudo."
