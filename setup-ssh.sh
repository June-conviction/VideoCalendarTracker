#!/bin/bash

# Create SSH directory with proper permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Setup SSH config
cat > ~/.ssh/config << EOF
Host github.com
  IdentityFile ~/.ssh/id_ed25519
  User git
EOF
chmod 600 ~/.ssh/config

# Check if SSH key exists, if not, create it
if [ ! -f ~/.ssh/id_ed25519 ]; then
  echo "Creating new SSH key pair..."
  ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C "github-key-for-replit"
  echo "New SSH key created. Add this public key to your GitHub account:"
  cat ~/.ssh/id_ed25519.pub
else
  echo "SSH key already exists."
fi

# Display instructions
echo ""
echo "Instructions to use this SSH key:"
echo "1. Copy the public key above and add it to GitHub"
echo "2. Run 'bash setup-ssh.sh' whenever you restart Replit"
echo "3. You can now use 'git push' commands"