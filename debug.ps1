$content = Get-Content "C:\Users\Usuario1\Desktop\CONTABILIDAD MASTER\OneDrive\MasterHerramientasServicios\index.html" -Raw
$lines = $content -split "`n"
$line171 = $lines[170]
Write-Host "Line 171 length: $($line171.Length)"
Write-Host "Line 171: $line171"
if ($line171.Length -ge 83) {
    Write-Host "Char at position 83: $($line171[82])"
}