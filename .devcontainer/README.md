# ZFGCBB-React Dev Container

This is a [dev container](https://code.visualstudio.com/docs/devcontainers/containers) for ZFGCBB-React. It includes the following:

- Node.js
- Yarn
- Corepack
- Nix
- Bash

## Usage

1. Open the repository in VS Code.
2. Open the Command Palette (Ctrl+Shift+P).
3. Type in `Dev Containers: Reopen in Container`.
4. Select "Dev Containers: Reopen in Container".
5. Wait for the container to start. It will set everything up for you and run ZFGCBB-React in watch mode, so you can start coding.

## Files

- [setup-nix.sh](./setup-nix.sh) - Sets up Nix and the Nix flakes, and configures the local shell environment.
- [devcontainer.json](./devcontainer.json) - Defines the dev container configuration.
