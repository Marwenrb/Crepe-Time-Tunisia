# Crêpe Time Tunisia — Démarrage complet (Windows PowerShell)
# Usage: .\start.ps1
# Prérequis: Supabase configuré (voir GUIDE_DEMARRAGE.md)

Write-Host "=== Crêpe Time Tunisia — Démarrage ===" -ForegroundColor Cyan

# 1. Vérifier Supabase
Write-Host "`n[1/4] Vérification Supabase..." -ForegroundColor Yellow
$envFile = "food-ordering-backend\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "  ERREUR: Créez food-ordering-backend\.env à partir de .env.example" -ForegroundColor Red
    Write-Host "  Voir GUIDE_DEMARRAGE.md pour la configuration Supabase." -ForegroundColor Yellow
    exit 1
}
Write-Host "  .env trouvé." -ForegroundColor Green

# 2. Seed si nécessaire
Write-Host "`n[2/4] Seed de la base de données..." -ForegroundColor Yellow
Push-Location food-ordering-backend
npm run seed 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Seed échoué. Vérifiez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env" -ForegroundColor Red
    Write-Host "  Exécutez le schéma SQL dans supabase/migrations/001_initial_schema.sql" -ForegroundColor Yellow
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "  Seed OK." -ForegroundColor Green

# 3. Backend
Write-Host "`n[3/4] Démarrage du backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd food-ordering-backend; npm run dev" -WindowStyle Normal

# 4. Frontend
Write-Host "`n[4/4] Démarrage du frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd food-ordering-frontend; npm run dev" -WindowStyle Normal

Write-Host "`n=== Prêt ===" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Admin:    admin@crepetime.tn / CrepeTime2026!" -ForegroundColor Cyan
Write-Host "  Client:   test@user.com / 12345678" -ForegroundColor Cyan
