#!/bin/bash

# Configure SSH for GitHub if needed
if [ ! -f ~/.ssh/id_ed25519 ]; then
  mkdir -p ~/.ssh
  
  # Generate the SSH key
  ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C "replit@example.com"
  
  # Configure the SSH to use the right key for github.com
  cat > ~/.ssh/config << EOF
Host github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  StrictHostKeyChecking no
EOF

  chmod 600 ~/.ssh/config
  chmod 600 ~/.ssh/id_ed25519
  
  echo "SSH key generated. Add this public key to your GitHub account:"
  cat ~/.ssh/id_ed25519.pub
fi

# Add this line to make the script executable
chmod +x ~/setup-ssh.sh

# Display SSH public key for user reference
echo "Your SSH public key (add to GitHub if not already done):"
cat ~/.ssh/id_ed25519.pub