$content = Get-Content 'C:\Users\Usuario1\Desktop\CONTABILIDAD MASTER\OneDrive\MasterHerramientasServicios\index.html' -Raw
$styleStart = $content.IndexOf('<style>')
$styleEnd = $content.IndexOf('</style>')
if ($styleStart -ge 0 -and $styleEnd -gt $styleStart) {
    $styleBlock = $content.Substring($styleStart, $styleEnd - $styleStart + 8)
    $openBrace = ($styleBlock.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $closeBrace = ($styleBlock.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    Write-Host "Open braces: $openBrace"
    Write-Host "Close braces: $closeBrace"
    if ($openBrace -ne $closeBrace) { Write-Host "MISMATCH FOUND!" }
}