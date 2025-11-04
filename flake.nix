{
  description = "Boardy Dev Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_22
            pkgs.pnpm
            pkgs.git
            pkgs.openssl
          ];

          # Prevent Node/OpenSSL mismatch errors (TypeORM / Next dev issue)
          NODE_OPTIONS = "--openssl-legacy-provider";
        };
      }
    );
}
