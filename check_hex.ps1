$content = Get-Content 'C:\Users\Usuario1\Desktop\CONTABILIDAD MASTER\OneDrive\MasterHerramientasServicios\index.html' -Raw
$startIndex = 4500
$length = 1000
if ($startIndex + $length -gt $content.Length) { $length = $content.Length - $startIndex }
$substring = $content.Substring($startIndex, $length)
$bytes = [System.Text.Encoding]::UTF8.GetBytes($substring)
for ($i = 0; $i -lt $bytes.Length -and $i -lt 100; $i++) {
    Write-Host ('{0:X2} ' -f $bytes[$i]) -NoNewline
    if (($i + 1) % 16 -eq 0) { Write-Host '' }
}