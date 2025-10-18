#!/usr/bin/env bash
set -euo pipefail


if ! command -v nix >/dev/null 2>&1; then
  echo "📦 Installing Nix..."
  sh <(curl -L https://nixos.org/nix/install) --no-daemon
  . "$HOME/.nix-profile/etc/profile.d/nix.sh"
fi

if [ ! -f ~/.config/nix/nix.conf ]; then
    mkdir -p ~/.config/nix
    cat > ~/.config/nix/nix.conf <<'EOF'
experimental-features = nix-command flakes
EOF
fi

nix develop --command bash
