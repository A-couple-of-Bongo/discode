{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

      in
      {
        devShell = pkgs.mkShell {
          name = "discode";

          nativeBuildInputs = with pkgs; [
            nodejs_22
            biome
            git
          ];

          shellHook = ''
            echo -e "\e[1mWelcome to discode!\e[0m"
            echo
            echo -e "\e[1mInstalling dependencies...\e[0m"
            npm install
            echo
            echo -e "\e[1mRunning migrations...\e[0m"
            npm run migration:up
          '';
        };
      }
    );
}
