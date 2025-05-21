#!/bin/bash

# Create SSH directory
mkdir -p ~/.ssh

# Create a basic RSA key pair since they're more widely compatible than ED25519
ssh-keygen -t rsa -b 4096 -C "replit-github-$(date +%Y%m%d)" -f ~/.ssh/github_rsa -N ""

# Configure SSH to use the keys for GitHub
cat > ~/.ssh/config << EOF
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_rsa
  IdentitiesOnly yes
EOF

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/github_rsa ~/.ssh/config
chmod 644 ~/.ssh/github_rsa.pub

# Add GitHub to known hosts
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts 2>/dev/null

# Display the public key to add to GitHub
echo "=================================================="
echo "ADD THIS PUBLIC KEY TO YOUR GITHUB ACCOUNT:"
echo "=================================================="
cat ~/.ssh/github_rsa.pub
echo "=================================================="
echo "1. Go to GitHub → Settings → SSH and GPG keys → New SSH key"
echo "2. Give it a title like 'Replit RSA' and paste the key above"
echo "3. Click 'Add SSH key'"
echo ""
echo "Once added, try running: git push"