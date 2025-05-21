#!/bin/bash

# Create SSH directory if it doesn't exist
mkdir -p ~/.ssh

# Create SSH config file with GitHub configuration
cat > ~/.ssh/config << EOF
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
EOF

# Set proper permissions for SSH config
chmod 600 ~/.ssh/config

# Create SSH private key from secret if available
if [[ -n "$SSH_PRIVATE_KEY" ]]; then
  echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
  chmod 600 ~/.ssh/id_ed25519
  
  # Generate public key from private key if needed
  ssh-keygen -y -f ~/.ssh/id_ed25519 > ~/.ssh/id_ed25519.pub
  chmod 644 ~/.ssh/id_ed25519.pub
  
  echo "SSH key configuration successful!"
else
  # If no secret is available, generate a new key
  if [[ ! -f ~/.ssh/id_ed25519 ]]; then
    ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C "github-replit-$(date +%Y%m%d)"
    echo "New SSH key generated. Add the public key to your GitHub account:"
    cat ~/.ssh/id_ed25519.pub
  else
    echo "Using existing SSH key."
  fi
fi

# Add GitHub to known hosts
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts 2>/dev/null

# Display configuration summary
echo "Git SSH configuration is ready!"
echo "Configuration details:"
ls -la ~/.ssh/
echo ""
echo "If you see a 'Permission denied' error when using git push, make sure to:"
echo "1. Add the public key to your GitHub account"
echo "2. Check that your SSH_PRIVATE_KEY secret is correctly set in Replit"