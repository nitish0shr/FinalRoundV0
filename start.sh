#!/bin/bash

# FinalRound - Quick Start Script
# This script verifies your setup and starts the development server

echo "================================================"
echo "   FinalRound - Setup Verification"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Found $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} Found v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found!"
    exit 1
fi

# Check if node_modules exists
echo -n "Checking dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Dependencies installed successfully"
    else
        echo -e "${RED}✗${NC} Failed to install dependencies"
        exit 1
    fi
fi

# Check .env.local
echo -n "Checking environment variables... "
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local found"
    
    # Check OpenAI key
    if grep -q "OPENAI_API_KEY=sk-proj-placeholder" .env.local; then
        echo -e "${YELLOW}⚠${NC} OpenAI API key not configured!"
        echo "  Please edit .env.local and add your OpenAI API key"
        echo "  Get your key at: https://platform.openai.com/api-keys"
        echo ""
        echo "Continue anyway? (y/n)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✓${NC} OpenAI API key configured"
    fi
else
    echo -e "${RED}✗${NC} .env.local not found!"
    echo "Please check the SETUP.md for instructions"
    exit 1
fi

echo ""
echo "================================================"
echo -e "${GREEN}✓ All checks passed!${NC}"
echo "================================================"
echo ""
echo "Starting development server..."
echo "The app will open at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev
