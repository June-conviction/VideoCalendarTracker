#!/usr/bin/env bash
# 1) Make sure ~/.ssh exists
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 2) Write the private key exactly as in the SSH_PRIVATE_KEY env var
printf '%s\n' "$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519

# 3) Add GitHub to known_hosts so we never get the authenticity prompt again
ssh-keyscan github.com >> ~/.ssh/known_hosts

# 4) Start the agent and add the key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 5) Finally run whatever command was passed in (your dev server)
exec "$@"
