#!/bin/bash

# Create SSH config if it doesn't exist
mkdir -p ~/.ssh
touch ~/.ssh/config

# Check if SSH key exists, if not generate it
if [ ! -f ~/.ssh/id_rsa ]; then
  echo "Generating new SSH key..."
  ssh-keygen -t rsa -b 4096 -C "replit-permanent" -f ~/.ssh/id_rsa -N ""
else
  echo "SSH key already exists"
fi

# Add GitHub to known hosts if not already there
if ! grep -q "github.com" ~/.ssh/known_hosts 2>/dev/null; then
  echo "Adding GitHub to known hosts..."
  ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
fi

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# Configure SSH to use the key for GitHub
cat > ~/.ssh/config << EOF
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
EOF

# Display the public key
echo "========================================================"
echo "Your public SSH key is:"
echo "========================================================"
cat ~/.ssh/id_rsa.pub
echo "========================================================"
echo "Add this key to your GitHub account if it's not already there."
echo "Then try: git push"