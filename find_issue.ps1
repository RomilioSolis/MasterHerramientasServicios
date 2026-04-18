$content = Get-Content 'C:\Users\Usuario1\Desktop\CONTABILIDAD MASTER\OneDrive\MasterHerramientasServicios\index.html' -Raw
$styleStart = $content.IndexOf('<style>')
$styleEnd = $content.IndexOf('</style>')
if ($styleStart -ge 0 -and $styleEnd -gt $styleStart) {
    $styleBlock = $content.Substring($styleStart, $styleEnd - $styleStart + 8)
    # Look for pattern "property:" directly followed by } or ; or end of line (with optional whitespace)
    if ($styleBlock -match ':\s*[}\n]') {
        Write-Host "Found match!"
        $styleBlock -match ':\s*[}\n]' | Out-Null
        $matches[0] | Write-Host
    }
    # Check for any property: value pair with missing semicolon or closing brace
    $lines = $styleBlock -split "`n"
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        # Skip comments and empty lines
        if ($line -match '^\s*(\/\*|\*\/)' -or $line -match '^\s*$') { continue }
        # Check if line ends with colon (property without value)
        if ($line -match ':\s*$') {
            Write-Host "Line $($i+1) (ends with colon): $line"
        }
    }
}