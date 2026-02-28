$files = Get-ChildItem -Path ".\Galerie" -Recurse -File | Where-Object { $_.Extension -match "jpg|jpeg|png|mp4" }
$json = $files | ForEach-Object {
    $type = if ($_.Extension -match "jpg|jpeg|png") { "image" } else { "video" }
    $dance = $_.FullName.Split("\")[-2]
    @{
        name = $_.Name
        url = "/Storage/Galerie/$dance/$($_.Name)"
        date = $_.LastWriteTime.ToString("yyyy-MM-dd")
        year = $_.LastWriteTime.Year
        type = $type
        dance = $dance
    }
} | ConvertTo-Json
$json | Out-File -FilePath "..\..\src\media-manifest.json" -Encoding utf8
Write-Host "FELICITARI! Galeria a fost actualizata cu succes." -ForegroundColor Green
Pause
