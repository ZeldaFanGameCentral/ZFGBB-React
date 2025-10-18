{
  description = "ZFGCBB-React";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs-slim
            pkgs.corepack
            pkgs.bash
          ];

          shellHook = ''
            corepack prepare --activate
            yarn cache clean
            yarn install
          '';
        };
      });
}
