#!/bin/bash
# FinalRound - Master Setup Script
# Run this to set up your entire development environment

echo "🚀 FinalRound Setup Script"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in correct directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: Please run this script from the FinalRoundV0 directory${NC}"
  exit 1
fi

echo -e "${BLUE}📦 Step 1: Installing Dependencies${NC}"
npm install next-auth @daily-co/daily-js stripe bcryptjs openai
npm install --save-dev @types/bcryptjs
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}🔑 Step 2: Environment Variables${NC}"
echo "Please set up these services and add keys to .env.local:"
echo ""
echo "1. Supabase (Database)"
echo "   → Go to: https://supabase.com/dashboard"
echo "   → Copy: URL and anon key"
echo ""
echo "2. Daily.co (Video)"
echo "   → Go to: https://dashboard.daily.co/"
echo "   → Get: API key"
echo ""
echo "3. Stripe (Payments)"
echo "   → Go to: https://dashboard.stripe.com/"
echo "   → Enable: Connect (Express accounts)"
echo "   → Get: Publishable and Secret keys"
echo ""
echo "4. LinkedIn (OAuth)"
echo "   → Go to: https://www.linkedin.com/developers/"
echo "   → Create app and get: Client ID and Secret"
echo ""
echo "5. OpenAI (AI Features)"
echo "   → Go to: https://platform.openai.com/"
echo "   → Get: API key"
echo ""
echo "6. Generate NextAuth secret:"
openssl rand -base64 32
echo ""
read -p "Press Enter when you've added all environment variables to .env.local..."
echo ""

echo -e "${BLUE}🗄️  Step 3: Database Setup${NC}"
echo "1. Go to your Supabase project SQL Editor"
echo "2. Copy the entire contents of: database/schema.sql"
echo "3. Paste and click 'Run'"
echo "4. Verify 7 tables were created"
echo ""
read -p "Press Enter when database is set up..."
echo ""

echo -e "${BLUE}💳 Step 4: Stripe Webhook Setup${NC}"
echo "1. Go to: https://dashboard.stripe.com/webhooks"
echo "2. Add endpoint: http://localhost:3001/api/stripe/webhook (for dev)"
echo "3. Select events: payment_intent.*, transfer.*, account.updated"
echo "4. Copy webhook secret to .env.local"
echo ""
read -p "Press Enter when webhook is configured..."
echo ""

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "🎯 Next Steps:"
echo "1. Run: npm run dev"
echo "2. Visit: http://localhost:3001"
echo "3. Test features:"
echo "   - Login: http://localhost:3001/login"
echo "   - Experts: http://localhost:3001/experts"
echo "   - Booking: http://localhost:3001/booking?expert=1"
echo "   - Dashboard: http://localhost:3001/dashboard/expert"
echo ""
echo "📚 Documentation:"
echo "   - Setup: PRODUCTION_FEATURES_SUMMARY.md"
echo "   - Deployment: DEPLOYMENT_CHECKLIST.md"
echo "   - Components: COMPONENT_INTEGRATION_GUIDE.md"
echo ""
echo "🚀 Ready to build!"
