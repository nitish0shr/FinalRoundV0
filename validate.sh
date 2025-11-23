#!/bin/bash
# FinalRound - Complete Validation Script
# Checks that everything is properly configured

echo "🔍 FinalRound - System Validation"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check Node.js version
echo "📦 Checking Node.js..."
NODE_VERSION=$(node -v)
if [[ $? -eq 0 ]]; then
  echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION"
else
  echo -e "${RED}✗${NC} Node.js not found"
  ((ERRORS++))
fi

# Check npm
echo "📦 Checking npm..."
NPM_VERSION=$(npm -v)
if [[ $? -eq 0 ]]; then
  echo -e "${GREEN}✓${NC} npm $NPM_VERSION"
else
  echo -e "${RED}✗${NC} npm not found"
  ((ERRORS++))
fi

# Check if in correct directory
echo ""
echo "📁 Checking project structure..."
if [ ! -f "package.json" ]; then
  echo -e "${RED}✗${NC} Not in FinalRound directory"
  ((ERRORS++))
  exit 1
fi
echo -e "${GREEN}✓${NC} In FinalRound directory"

# Check package.json dependencies
echo ""
echo "📦 Checking dependencies..."
REQUIRED_DEPS=(
  "next"
  "react"
  "next-auth"
  "@daily-co/daily-js"
  "stripe"
  "openai"
  "@supabase/supabase-js"
)

for dep in "${REQUIRED_DEPS[@]}"; do
  if grep -q "\"$dep\"" package.json; then
    echo -e "${GREEN}✓${NC} $dep"
  else
    echo -e "${RED}✗${NC} $dep missing"
    ((ERRORS++))
  fi
done

# Check environment variables
echo ""
echo "🔑 Checking environment variables..."
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓${NC} .env.local exists"
  
  REQUIRED_VARS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "NEXTAUTH_SECRET"
    "NEXT_PUBLIC_DAILY_API_KEY"
    "STRIPE_SECRET_KEY"
    "OPENAI_API_KEY"
  )
  
  for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^$var=" .env.local 2>/dev/null; then
      VALUE=$(grep "^$var=" .env.local | cut -d '=' -f2)
      if [[ -n "$VALUE" && "$VALUE" != "your_"* ]]; then
        echo -e "${GREEN}✓${NC} $var is set"
      else
        echo -e "${YELLOW}⚠${NC} $var exists but needs value"
        ((WARNINGS++))
      fi
    else
      echo -e "${RED}✗${NC} $var not found"
      ((ERRORS++))
    fi
  done
else
  echo -e "${RED}✗${NC} .env.local not found"
  echo "  Run: cp .env.local.example .env.local"
  ((ERRORS++))
fi

# Check critical files
echo ""
echo "📄 Checking critical files..."
CRITICAL_FILES=(
  "src/app/api/auth/[...nextauth]/route.ts"
  "src/app/api/session/create/route.ts"
  "src/app/api/stripe/webhook/route.ts"
  "src/app/api/stripe/create-payment-intent/route.ts"
  "src/app/api/feedback/submit/route.ts"
  "src/app/api/jd/parse/route.ts"
  "src/components/session/video-session-room.tsx"
  "src/components/session/video-tile.tsx"
  "src/components/feedback/feedback-flow.tsx"
  "src/components/booking/booking-flow.tsx"
  "src/lib/daily-video.ts"
  "src/lib/stripe-payments.ts"
  "database/schema.sql"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file missing"
    ((ERRORS++))
  fi
done

# Check node_modules
echo ""
echo "📦 Checking installed packages..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} node_modules exists"
  
  # Check specific critical packages
  CRITICAL_PACKAGES=(
    "node_modules/next"
    "node_modules/@daily-co/daily-js"
    "node_modules/stripe"
    "node_modules/next-auth"
    "node_modules/openai"
  )
  
  for pkg in "${CRITICAL_PACKAGES[@]}"; do
    if [ -d "$pkg" ]; then
      echo -e "${GREEN}✓${NC} $(basename $pkg) installed"
    else
      echo -e "${RED}✗${NC} $(basename $pkg) not installed"
      ((ERRORS++))
    fi
  done
else
  echo -e "${RED}✗${NC} node_modules not found"
  echo "  Run: npm install"
  ((ERRORS++))
fi

# Check build
echo ""
echo "🔨 Checking build capability..."
if command -v tsc &> /dev/null; then
  echo -e "${GREEN}✓${NC} TypeScript compiler available"
else
  echo -e "${YELLOW}⚠${NC} TypeScript compiler not found"
  ((WARNINGS++))
fi

# Summary
echo ""
echo "=================================="
echo "📊 Validation Summary"
echo "=================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
  echo ""
  echo "🚀 Your app is ready to run!"
  echo ""
  echo "Next steps:"
  echo "  1. npm run dev"
  echo "  2. Visit: http://localhost:3001"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠ $WARNINGS WARNING(S)${NC}"
  echo ""
  echo "Your app should work but check warnings above."
  echo ""
  exit 0
else
  echo -e "${RED}✗ $ERRORS ERROR(S)${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS WARNING(S)${NC}"
  fi
  echo ""
  echo "Please fix errors above before running."
  echo ""
  echo "Common fixes:"
  echo "  - Run: npm install"
  echo "  - Copy: cp .env.local.example .env.local"
  echo "  - Configure environment variables"
  echo ""
  exit 1
fi
