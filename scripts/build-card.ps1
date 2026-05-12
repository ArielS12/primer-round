#
# Compone public/uploads/tarjeta-qr.png a partir de tarjeta-qr-raw.png (QR puro)
# y el logo del gimnasio. Pensado para correr DESPUÉS de generate-qr.mjs.
#
# Diseño actual: logo circular → nombre del gimnasio → subtítulo → línea →
# QR. Sin texto debajo del QR (la tarjeta termina justo después del código).
#
# Uso:
#   node scripts/generate-qr.mjs "https://primer-round.onrender.com"
#   pwsh -File scripts/build-card.ps1
#
param()

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$qrPath = Join-Path $root "public\uploads\tarjeta-qr-raw.png"
$logoPath = Join-Path $root "public\uploads\logo.jpg"
$outPath = Join-Path $root "public\uploads\tarjeta-qr.png"

if (-not (Test-Path $qrPath)) {
    Write-Error "No existe $qrPath. Ejecuta primero: node scripts/generate-qr.mjs <url>"
    exit 1
}
if (-not (Test-Path $logoPath)) {
    Write-Error "Falta el logo: $logoPath"
    exit 1
}

$W = 720
# Alto ajustado al contenido (logo + título + subtítulo + separador + QR + padding).
$H = 1020
$PRIMARY = [System.Drawing.Color]::FromArgb(249, 115, 22)
$DARK = [System.Drawing.Color]::FromArgb(23, 23, 23)
$MUTED = [System.Drawing.Color]::FromArgb(110, 110, 110)
$BORDER = [System.Drawing.Color]::FromArgb(230, 222, 212)

$bmp = New-Object System.Drawing.Bitmap $W, $H, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$g.Clear([System.Drawing.Color]::FromArgb(254, 244, 236))

$cardMargin = 40
$cardRect = New-Object System.Drawing.Rectangle $cardMargin, $cardMargin, ($W - 2*$cardMargin), ($H - 2*$cardMargin)
$radius = 40
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($cardRect.X, $cardRect.Y, $radius, $radius, 180, 90)
$path.AddArc($cardRect.Right - $radius, $cardRect.Y, $radius, $radius, 270, 90)
$path.AddArc($cardRect.Right - $radius, $cardRect.Bottom - $radius, $radius, $radius, 0, 90)
$path.AddArc($cardRect.X, $cardRect.Bottom - $radius, $radius, $radius, 90, 90)
$path.CloseFigure()
$brushCard = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$g.FillPath($brushCard, $path)
$penBorder = New-Object System.Drawing.Pen $BORDER, 2
$g.DrawPath($penBorder, $path)

$logoSize = 180
$logoX = ($W - $logoSize) / 2
$logoY = $cardMargin + 70
$logoImg = [System.Drawing.Image]::FromFile($logoPath)
$clipPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$clipPath.AddEllipse($logoX, $logoY, $logoSize, $logoSize)
$g.SetClip($clipPath)
$g.DrawImage($logoImg, $logoX, $logoY, $logoSize, $logoSize)
$g.ResetClip()
$logoImg.Dispose()
$penLogo = New-Object System.Drawing.Pen $PRIMARY, 6
$g.DrawEllipse($penLogo, $logoX, $logoY, $logoSize, $logoSize)

$titleFont = New-Object System.Drawing.Font "Georgia", 48, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$titleBrush = New-Object System.Drawing.SolidBrush $DARK
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$titleRect = New-Object System.Drawing.RectangleF 0, ($logoY + $logoSize + 18), $W, 60
$g.DrawString("Primer Round", $titleFont, $titleBrush, $titleRect, $sf)

$subFont = New-Object System.Drawing.Font "Segoe UI", 18, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$subBrush = New-Object System.Drawing.SolidBrush $PRIMARY
$subRect = New-Object System.Drawing.RectangleF 0, ($titleRect.Y + 70), $W, 30
$g.DrawString("ESCUELA DE KICKBOXING", $subFont, $subBrush, $subRect, $sf)

$lineY = $subRect.Y + 50
$penLine = New-Object System.Drawing.Pen $BORDER, 1
$g.DrawLine($penLine, $cardMargin + 60, $lineY, $W - $cardMargin - 60, $lineY)

$qrImg = [System.Drawing.Image]::FromFile($qrPath)
$qrSize = 460
$qrX = ($W - $qrSize) / 2
$qrY = $lineY + 40
$g.DrawImage($qrImg, $qrX, $qrY, $qrSize, $qrSize)
$qrImg.Dispose()

# Sin texto debajo del QR. La tarjeta termina aquí.

$g.Dispose()
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$titleFont.Dispose(); $subFont.Dispose()

Remove-Item $qrPath -Force

$info = Get-Item $outPath
"Saved $outPath  ($([math]::Round($info.Length/1KB,1)) KB, ${W}x${H})"
