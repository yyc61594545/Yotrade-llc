#!/bin/bash

# Update and Install Essentials
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw

# Install Docker
if ! command -v docker &> /dev/null
then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
else
    echo "Docker is already installed"
fi

# Install Docker Compose (if not included in Docker plugin)
# For newer docker versions, docker compose is 'docker compose'
# Verify:
docker compose version

# Setup Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
# sudo ufw enable  # Uncomment to enable, be careful not to lock yourself out!

# Create App Directory
mkdir -p ~/apps/yotrade
sudo chown -R $USER:$USER ~/apps/yotrade

# Install Certbot for SSL (if running on host, but we will likely run via docker or just get certs here)
# Best practice with Docker Nginx is to map the certs. 
# We can run a temporary certbot command to get the certs first.

echo "Setup Complete. Please log out and back in for Docker group changes to take effect."
