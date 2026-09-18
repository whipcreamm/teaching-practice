#!/bin/bash
set -e

echo '=== Pulling latest changes from GitHub ==='
git pull origin main

echo '=== Installing dependencies ==='
npm install

echo '=== Building project ==='
npm run build

echo '=== Setting permissions ==='
sudo chown -R www-data:www-data dist

echo '=== Reloading Nginx ==='
sudo systemctl reload nginx

echo '=== Deployment Completed Successfully! ==='
