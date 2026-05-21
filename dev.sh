#!/bin/bash

# =========================================
# Geetesh Portfolio - Development Script
# =========================================
# This script handles common development tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Geetesh Portfolio Development${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
fi

# Display menu
echo -e "${BLUE}What would you like to do?${NC}"
echo ""
echo -e "${GREEN}1${NC} - Start development server (npm run dev)"
echo -e "${GREEN}2${NC} - Build for production (npm run build)"
echo -e "${GREEN}3${NC} - Preview production build (npm run preview)"
echo -e "${GREEN}4${NC} - Run linting (npm run lint)"
echo -e "${GREEN}5${NC} - Type checking (npm run type-check)"
echo -e "${GREEN}6${NC} - Update dependencies (npm update)"
echo -e "${GREEN}7${NC} - Check for security issues (npm audit)"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo -e "${YELLOW}🚀 Starting development server...${NC}"
        npm run dev
        ;;
    2)
        echo -e "${YELLOW}🔨 Building for production...${NC}"
        npm run build
        echo -e "${GREEN}✅ Build complete! Check dist/ folder${NC}"
        ;;
    3)
        echo -e "${YELLOW}👀 Previewing production build...${NC}"
        npm run preview
        ;;
    4)
        echo -e "${YELLOW}🔍 Running linting...${NC}"
        npm run lint
        ;;
    5)
        echo -e "${YELLOW}📝 Running type checking...${NC}"
        npm run type-check
        ;;
    6)
        echo -e "${YELLOW}📦 Updating dependencies...${NC}"
        npm update
        echo -e "${GREEN}✅ Dependencies updated${NC}"
        ;;
    7)
        echo -e "${YELLOW}🔐 Checking for security issues...${NC}"
        npm audit
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
