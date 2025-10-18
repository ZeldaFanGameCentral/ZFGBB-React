#!/usr/bin/env bash
set -euo pipefail

IN_NIX_SHELL=${IN_NIX_SHELL:-0}
# IN_DEVCONTAINER=${IN_DEVCONTAINER:-0}
# if [ "$IN_DEVCONTAINER" != "1" ]; then
#   echo "Not in the devcontainer, exiting."
#   exit 1
# fi

# Check if we're already in nix shell
if [ "$IN_NIX_SHELL" = "1" ]; then
  echo "Already in nix shell, nothing to do."
  exit 0
fi


if ! command -v nix >/dev/null 2>&1; then
  echo "📦 Installing Nix..."
  if [ -d /nix ]; then
    sudo chown -R node /nix
  fi
  
  sh <(curl -L https://nixos.org/nix/install) --no-daemon
  source "$HOME/.nix-profile/etc/profile.d/nix.sh"
fi

if [ ! -f ~/.config/nix/nix.conf ]; then
    mkdir -p ~/.config/nix
    cat > ~/.config/nix/nix.conf <<'EOF'
experimental-features = nix-command flakes
EOF
fi

current_shell=$(basename "$SHELL")
case "$current_shell" in
  bash) shell_rc="$HOME/.bashrc" ;;
  zsh)  shell_rc="$HOME/.zshrc" ;;
  fish) shell_rc="$HOME/.config/fish/config.fish" ;;
  *)    shell_rc="$HOME/.profile" ;;
esac

# Append nix auto-shell snippet if not already present
if ! grep -q "exec nix develop" "$shell_rc"; then
  cat >> "$shell_rc" <<'EOF'

COREPACK_DIR="$HOME/.corepack/bin"

mkdir -p "$COREPACK_DIR"
export PATH="$COREPACK_DIR:$PATH"
# Automatically enter Nix flake shell in interactive terminals
if [[ $- == *i* ]] && [ -f /workspaces/flake.nix ] && [ -z "$IN_NIX_SHELL" ]; then
    source ~/.profile
    exec nix develop --command bash -i
fi

EOF
fi