#!/bin/bash

# 🚀 GitHub Setup Script for Jumeira Coffee Website
# Замените YOUR_USERNAME на ваш GitHub username

GITHUB_USERNAME="YOUR_USERNAME"
REPO_NAME="jumeira-coffee-website"

echo "🔗 Connecting to GitHub repository..."

# Add remote origin
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Set main branch
git branch -M main

# Push to GitHub  
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo "📋 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "🌐 Next step: Deploy to Vercel"
echo "Go to https://vercel.com and import your GitHub repository" 