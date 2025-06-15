#!/bin/bash

echo "🔧 StoneTrader - Git Repository Inicializace"
echo "============================================"

cd ~/StoneTrader

# 1. Inicializace Git repository
echo "📋 1. Inicializace Git repository..."
git init
echo "✅ Git repository inicializováno!"

# 2. Nastavení základní konfigurace (pokud není)
echo ""
echo "📋 2. Kontrola Git konfigurace..."
GIT_USER=$(git config user.name 2>/dev/null)
GIT_EMAIL=$(git config user.email 2>/dev/null)

if [ -z "$GIT_USER" ]; then
    echo "⚠️  Git user.name není nastaven"
    echo "Nastavte: git config --global user.name 'Your Name'"
fi

if [ -z "$GIT_EMAIL" ]; then
    echo "⚠️  Git user.email není nastaven"
    echo "Nastavte: git config --global user.email 'your.email@example.com'"
fi

if [ -n "$GIT_USER" ] && [ -n "$GIT_EMAIL" ]; then
    echo "✅ Git konfigurace OK: $GIT_USER <$GIT_EMAIL>"
fi

# 3. Přidání .gitignore (pokud ještě neběžel update script)
echo ""
echo "📋 3. Kontrola .gitignore..."
if [ ! -f ".gitignore" ]; then
    echo "🔧 Vytváření .gitignore..."
    cat > .gitignore << 'EOF'
# StoneTrader - Professional Trading Client
# =========================================

# Project Tracker - DŮVĚRNÉ INFORMACE
project_tracker.md
project_tracker*.md

# Environment variables - CREDENTIALS
backend/.env
backend/.env.*
.env
.env.*

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.vite/

# Development
.DS_Store
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.local
.env.development.local
.env.test.local
.env.production.local

# Backup files
*.backup
*.backup.*

# Temporary files
tmp/
temp/
.tmp/

# OS generated files
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/

# cTrader specific
*.cbot
*.algo

# Trading data (if any)
data/
cache/
sessions/

# Security
secrets/
keys/
certificates/
EOF
    echo "✅ .gitignore vytvořen!"
else
    echo "✅ .gitignore již existuje"
fi

# 4. Staging všech souborů (kromě ignorovaných)
echo ""
echo "📦 4. Staging souborů pro initial commit..."
git add .

# 5. Status check
echo ""
echo "📋 5. Git status po staging..."
git status

# 6. Příprava commit message
echo ""
echo "🎯 PŘIPRAVENO PRO INITIAL COMMIT!"
echo "================================"
echo ""
echo "🚀 PŘÍKAZY PRO DOKONČENÍ:"
echo ""
echo "# Initial commit"
echo "git commit -m '🎉 Initial commit: StoneTrader Professional Trading Client'"
echo ""
echo "# Připojení GitHub remote (nahraďte URL)"
echo "git remote add origin https://github.com/VASE_USERNAME/StoneTrader.git"
echo ""
echo "# Push na GitHub"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "💡 NEBO pokud už máte GitHub repo:"
echo "git remote add origin [YOUR_GITHUB_URL]"
echo "git push -u origin main"
echo ""
echo "🛡️  CHRÁNĚNO:"
echo "✅ project_tracker.md - ignorováno (obsahuje credentials)"
echo "✅ backend/.env - ignorováno (obsahuje API keys)"
echo "✅ node_modules/ - ignorováno (dependencies)"
echo ""
echo "📁 CO BUDE NA GITHUBU:"
echo "✅ Všechen zdrojový kód"
echo "✅ Package.json soubory"
echo "✅ Frontend a backend struktura"
echo "✅ README.md (pokud existuje)"
echo "❌ Žádné credentials nebo secrets"