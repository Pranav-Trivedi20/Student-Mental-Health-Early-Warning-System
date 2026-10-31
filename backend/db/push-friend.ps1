$source = "P:\JUET\Minor Project 1"
$target = "P:\JUET\Friend-Upload"

Write-Host "Syncing backend..." -ForegroundColor Cyan

robocopy "$source\backend" "$target\backend" /E /XD __pycache__ venv .venv node_modules /XF .env

if ($LASTEXITCODE -ge 8) {
    throw "Backend copy failed!"
}

Write-Host "Syncing frontend..." -ForegroundColor Cyan

robocopy "$source\frontend" "$target\frontend" /E /XD node_modules dist build .vite /XF .env .env.local .env.development.local .env.production.local

if ($LASTEXITCODE -ge 8) {
    throw "Frontend copy failed!"
}

Write-Host "Preparing Git commit..." -ForegroundColor Cyan

git -C $target add backend frontend

git -C $target diff --cached --quiet

if ($LASTEXITCODE -eq 1) {
    git -C $target commit -m "Update frontend and backend"
}
elseif ($LASTEXITCODE -eq 0) {
    Write-Host "No new changes to commit." -ForegroundColor Yellow
}
else {
    throw "Git comparison failed!"
}

Write-Host "Uploading to friend's repository..." -ForegroundColor Cyan

git -C $target push upstream prayanshu-project-upload

if ($LASTEXITCODE -ne 0) {
    throw "Push failed!"
}

Write-Host "Upload completed successfully!" -ForegroundColor Green