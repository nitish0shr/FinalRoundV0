#!/bin/bash

# FinalRound - Supabase Setup Helper Script
# This script helps you set up Supabase Cloud for FinalRound

set -e

echo "🚀 FinalRound - Supabase Setup Helper"
echo "======================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Run: brew install supabase/tap/supabase"
    exit 1
fi

echo "✅ Supabase CLI found: $(supabase --version)"
echo ""

# Check if already logged in
if supabase projects list &> /dev/null; then
    echo "✅ Already logged in to Supabase"
else
    echo "📝 Logging in to Supabase..."
    echo "This will open your browser. Please authorize the CLI."
    echo ""
    supabase login
fi

echo ""
echo "📋 Next, we need to link this project to your Supabase cloud project."
echo ""
echo "First, get your Project ID:"
echo "  1. Go to https://app.supabase.com"
echo "  2. Open your project"
echo "  3. Go to Settings → General"
echo "  4. Copy the 'Reference ID'"
echo ""
read -p "Enter your Supabase Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID is required"
    exit 1
fi

echo ""
echo "🔗 Linking project..."
supabase link --project-ref "$PROJECT_ID"

echo ""
echo "✅ Project linked successfully!"
echo ""
echo "🗄️  Pushing database migrations to cloud..."
supabase db push

echo ""
echo "✅ Migrations deployed!"
echo ""
echo "📊 Verifying tables..."
supabase db remote list

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env.local with your Supabase credentials"
echo "  2. Restart dev server: npm run dev"
echo "  3. Test signup at http://localhost:3000/signup"
echo ""
echo "Get credentials from: https://app.supabase.com/project/$PROJECT_ID/settings/api"
echo ""
