#!/bin/bash

# FinalRound - Update Supabase Credentials Script
# This script helps you update .env.local with Supabase credentials

echo "🔑 Supabase Credentials Update Helper"
echo "======================================"
echo ""
echo "Go to: https://supabase.com/dashboard/project/jkwpfuonvrlvmvdiqhcz/settings/api"
echo ""
echo "You'll need to copy 3 values:"
echo ""

# Get Project URL
echo "1️⃣  PROJECT URL"
echo "   Copy the value from the 'URL' field (should be: https://jkwpfuonvrlvmvdiqhcz.supabase.co)"
read -p "   Paste it here: " SUPABASE_URL

# Get anon key
echo ""
echo "2️⃣  ANON PUBLIC KEY"
echo "   Copy the 'anon' 'public' key (long JWT token starting with 'eyJ')"
read -p "   Paste it here: " ANON_KEY

# Get service role key
echo ""
echo "3️⃣  SERVICE ROLE KEY"
echo "   Click 'Reveal' next to 'service_role' 'secret', then copy it"
read -p "   Paste it here: " SERVICE_KEY

# Backup existing .env.local
echo ""
echo "📦 Backing up existing .env.local..."
cp .env.local .env.local.backup

# Update .env.local
echo ""
echo "✏️  Updating .env.local..."

# Use sed to update the values
sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL|" .env.local
sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" .env.local
sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY|" .env.local

echo ""
echo "✅ Environment variables updated!"
echo ""
echo "📄  Your updated .env.local:"
echo "─────────────────────────────────────────"
grep "SUPABASE" .env.local
echo "─────────────────────────────────────────"
echo ""
echo "🔄  Next step: Restart your dev server"
echo "   1. Press Ctrl+C to stop current server"
echo "   2. Run: npm run dev"
echo ""
echo "📝  Backup saved to: .env.local.backup"
echo ""
