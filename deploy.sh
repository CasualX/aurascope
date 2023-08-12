#!/usr/bin/env bash
set -e

pushd $(dirname $0)
git_commit=$(git rev-parse --short HEAD)
git branch -D gh-pages || true
git worktree add --no-checkout --detach gh-pages
pushd gh-pages
git checkout --orphan gh-pages
git rm -rf .

cp -a "../dist/." .

git add -A
git commit -m "Deploy $git_commit"
git push -f origin gh-pages
popd
git worktree remove --force gh-pages
popd
