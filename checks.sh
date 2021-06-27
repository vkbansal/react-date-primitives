#!/usr/bin/env bash
set -e

check=$1
root="$(pwd)"

for f in packages/*; do
    if [ -d "$f" ]; then
        pushd $f >> /dev/null
        if [ "$check" == "lint" ]; then
          echo "Running ESLint for $f"
          npx eslint --ext .ts --ext .tsx --config "$root/.eslintrc.yml" src
        elif [ "$check" == "prettier" ]; then
          npx prettier --check "src/**/*.{ts,tsx,scss}"
        fi
        popd >> /dev/null
    fi
done
