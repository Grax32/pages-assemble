# PowerShell script to generate a full list of .md and .html files in src/articles/

$mdFiles = Get-ChildItem -Path .\src\articles\ -Filter *.md -File | Sort-Object Name
$htmlFiles = Get-ChildItem -Path .\src\articles\ -Filter *.html -File | Sort-Object Name

$mdSection = "## Markdown (.md) files`n" + ($mdFiles | ForEach-Object { $_.FullName }) -join "`n"
$htmlSection = "## HTML (.html) files`n" + ($htmlFiles | ForEach-Object { $_.FullName }) -join "`n"

$total = $mdFiles.Count + $htmlFiles.Count

$content = "# All .md and .html files in src/articles/`n`n$mdSection`n`n$htmlSection`n`nTotal files: $total`n"

Set-Content -Path .\articles-file-list.md -Value $content
