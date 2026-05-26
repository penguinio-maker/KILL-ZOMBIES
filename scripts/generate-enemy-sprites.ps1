Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$outDir = Join-Path $PSScriptRoot "..\src\assets\enemies"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$S = 3

function C($hex, $a = 255) {
  [System.Drawing.Color]::FromArgb(
    $a,
    [Convert]::ToInt32($hex.Substring(0, 2), 16),
    [Convert]::ToInt32($hex.Substring(2, 2), 16),
    [Convert]::ToInt32($hex.Substring(4, 2), 16)
  )
}

$outline = C "090b0f"
$skin = C "8b866f"
$skin2 = C "5d614d"
$skin3 = C "3a4036"
$cloth = C "242b31"
$cloth2 = C "151a22"
$vest = C "3b3130"
$red = C "8b2d2d"
$hotRed = C "e64b36"
$orange = C "e7812e"
$yellow = C "f0c35f"
$bone = C "c7b58b"
$acid = C "78d84c"
$acid2 = C "2f6f31"
$metal = C "4b5353"
$metal2 = C "20262b"
$black = C "050608"

function P($x, $y) {
  New-Object System.Drawing.Point ([int]($x * $script:S)), ([int]($y * $script:S))
}

function Brush($color) {
  New-Object System.Drawing.SolidBrush $color
}

function Rect($g, $x, $y, $w, $h, $color, $a = 255) {
  $b = Brush ([System.Drawing.Color]::FromArgb($a, $color.R, $color.G, $color.B))
  $g.FillRectangle($b, [int]($x * $script:S), [int]($y * $script:S), [int]($w * $script:S), [int]($h * $script:S))
  $b.Dispose()
}

function Poly($g, $points, $color) {
  $pts = $points | ForEach-Object { P $_[0] $_[1] }
  $b = Brush $outline
  $g.FillPolygon($b, $pts)
  $b.Dispose()
  $inner = $points | ForEach-Object { @($_[0], $_[1]) }
  $cx = 0; $cy = 0
  foreach ($p in $inner) { $cx += $p[0]; $cy += $p[1] }
  $cx /= $inner.Count; $cy /= $inner.Count
  $inPts = $inner | ForEach-Object {
    $ix = $cx + ($_[0] - $cx) * 0.88
    $iy = $cy + ($_[1] - $cy) * 0.88
    P $ix $iy
  }
  $f = Brush $color
  $g.FillPolygon($f, $inPts)
  $f.Dispose()
}

function Ellipse($g, $x, $y, $w, $h, $color, $a = 255) {
  $ob = Brush $outline
  $g.FillEllipse($ob, [int](($x - 2) * $script:S), [int](($y - 2) * $script:S), [int](($w + 4) * $script:S), [int](($h + 4) * $script:S))
  $ob.Dispose()
  $b = Brush ([System.Drawing.Color]::FromArgb($a, $color.R, $color.G, $color.B))
  $g.FillEllipse($b, [int]($x * $script:S), [int]($y * $script:S), [int]($w * $script:S), [int]($h * $script:S))
  $b.Dispose()
}

function Line($g, $x1, $y1, $x2, $y2, $width, $color) {
  $p0 = New-Object System.Drawing.Pen $outline, (($width + 4) * $script:S)
  $p0.StartCap = [System.Drawing.Drawing2D.LineCap]::Square
  $p0.EndCap = [System.Drawing.Drawing2D.LineCap]::Square
  $g.DrawLine($p0, (P $x1 $y1), (P $x2 $y2))
  $p0.Dispose()
  $p = New-Object System.Drawing.Pen $color, ($width * $script:S)
  $p.StartCap = [System.Drawing.Drawing2D.LineCap]::Square
  $p.EndCap = [System.Drawing.Drawing2D.LineCap]::Square
  $g.DrawLine($p, (P $x1 $y1), (P $x2 $y2))
  $p.Dispose()
}

function SaveSprite($name, $w, $h, [scriptblock]$draw) {
  $bmp = New-Object System.Drawing.Bitmap ($w * $S), ($h * $S), ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  & $draw $g
  $bmp.Save((Join-Path $outDir "$name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

function Head($g, $cx, $cy, $w, $h, $eye, $open = $false, $helmet = $true) {
  Poly $g @(@(($cx - $w * .5),($cy - $h * .35)),@(($cx - $w * .18),($cy - $h * .55)),@(($cx + $w * .38),($cy - $h * .45)),@(($cx + $w * .52),($cy - $h * .05)),@(($cx + $w * .35),($cy + $h * .42)),@(($cx - $w * .38),($cy + $h * .48)),@(($cx - $w * .55),($cy + $h * .05))) $skin
  Rect $g ($cx-$w*.35) ($cy-$h*.08) 5 12 $skin3 185
  if ($helmet) {
    Poly $g @(@(($cx - $w * .55),($cy - $h * .52)),@(($cx - $w * .05),($cy - $h * .75)),@(($cx + $w * .52),($cy - $h * .55)),@(($cx + $w * .42),($cy - $h * .25)),@(($cx - $w * .45),($cy - $h * .25))) $metal2
    Rect $g ($cx-$w*.35) ($cy-$h*.6) ($w*.55) 3 (C "313744")
  }
  Rect $g ($cx-7) ($cy-1) 4 4 $eye
  Rect $g ($cx+5) ($cy-1) 4 4 $eye
  if ($open) {
    Rect $g ($cx-6) ($cy+7) 14 8 $black
    Rect $g ($cx-3) ($cy+8) 3 3 $bone
    Rect $g ($cx+4) ($cy+8) 3 3 $bone
  } else {
    Rect $g ($cx-6) ($cy+9) 12 3 $black
  }
  Rect $g ($cx+$w*.25) ($cy+3) 5 7 $red 180
}

function Torso($g, $cx, $y, $w, $h, $color, $accent) {
  Poly $g @(@(($cx - $w * .38),$y),@(($cx + $w * .36),($y + 1)),@(($cx + $w * .55),($y + $h * .42)),@(($cx + $w * .32),($y + $h)),@(($cx - $w * .35),($y + $h)),@(($cx - $w * .55),($y + $h * .38))) $color
  Rect $g ($cx-$w*.18) ($y+4) 5 ($h-8) $cloth2 180
  Rect $g ($cx+$w*.12) ($y+8) 8 10 $accent 200
  Rect $g ($cx-$w*.22) ($y+$h*.58) ($w*.42) 5 $red 175
}

function LimbNoise($g, $cx, $cy) {
  Rect $g ($cx-2) ($cy-2) 4 4 $red 165
  Rect $g ($cx+3) ($cy+2) 3 3 $bone 180
}

SaveSprite "walker" 55 78 {
  param($g)
  Line $g 22 49 17 70 7 $cloth2
  Line $g 32 48 37 70 7 $cloth
  Torso $g 28 27 25 28 $cloth $red
  Line $g 15 30 10 55 7 $skin2
  Line $g 41 31 44 53 7 $skin
  Head $g 29 16 25 22 $yellow $false $true
  LimbNoise $g 14 43
}

SaveSprite "runner" 62 78 {
  param($g)
  Line $g 27 49 13 68 6 $cloth2
  Line $g 36 47 51 64 6 $cloth
  Torso $g 33 27 23 27 $cloth2 $red
  Line $g 20 30 9 48 6 $skin2
  Line $g 44 28 56 39 6 $skin
  Head $g 39 17 24 21 $orange $true $true
  Rect $g 21 31 20 4 $red 170
}

SaveSprite "brute" 92 98 {
  param($g)
  Line $g 34 63 28 92 13 $cloth2
  Line $g 56 63 63 92 13 $cloth
  Torso $g 46 28 57 45 (C "3d4035") $red
  Line $g 17 33 10 73 15 $skin2
  Line $g 75 32 82 74 15 $skin
  Head $g 47 15 35 28 $orange $true $true
  Rect $g 28 39 36 8 $metal2 215
  Rect $g 56 50 10 17 $hotRed 190
  LimbNoise $g 77 51
}

SaveSprite "gunner" 82 80 {
  param($g)
  Line $g 31 52 27 76 8 $cloth2
  Line $g 45 52 51 75 8 $cloth
  Torso $g 39 31 30 30 (C "29323a") $red
  Line $g 19 35 16 57 7 $skin2
  Line $g 54 36 64 46 7 $skin
  Rect $g 55 42 25 7 $outline
  Rect $g 55 43 22 4 $metal2
  Rect $g 75 41 7 3 $hotRed
  Head $g 39 18 25 22 $yellow $false $true
  Rect $g 28 29 23 7 (C "6f2628") 220
}

SaveSprite "spitter" 74 82 {
  param($g)
  Line $g 29 55 23 78 8 $cloth2
  Line $g 43 55 50 78 8 $cloth
  Torso $g 37 32 31 31 (C "24352e") $acid
  Line $g 20 38 14 60 7 $skin2
  Line $g 53 37 61 55 7 $skin
  Head $g 39 19 28 24 $acid $true $true
  Rect $g 42 31 9 9 $acid 180
  Rect $g 57 25 3 3 $acid 210
  Rect $g 63 29 2 2 $acid 190
  Rect $g 67 32 5 2 $acid 190
}

SaveSprite "shielder" 92 102 {
  param($g)
  Line $g 31 67 26 98 12 $cloth2
  Line $g 49 67 55 98 12 $cloth
  Torso $g 40 36 42 38 (C "34392f") $red
  Line $g 14 44 10 77 12 $skin2
  Head $g 40 22 31 25 $orange $false $true
  Poly $g @(@(57,27),@(83,23),@(86,82),@(61,89),@(54,58)) $metal
  Rect $g 62 35 15 5 $metal2
  Rect $g 66 64 12 5 $hotRed 180
  Rect $g 72 48 4 4 $bone
}

SaveSprite "exploder" 82 90 {
  param($g)
  Line $g 30 61 24 86 10 $cloth2
  Line $g 49 61 58 86 10 $cloth
  Torso $g 42 31 44 40 (C "432d28") $hotRed
  Line $g 18 40 12 70 10 $skin2
  Line $g 64 41 70 66 10 $skin
  Head $g 43 18 29 24 $orange $true $true
  Ellipse $g 31 41 22 21 $orange 230
  Rect $g 37 47 10 9 $yellow 245
  Rect $g 54 34 5 5 $orange 220
  Rect $g 28 30 4 4 $orange 190
}

SaveSprite "screamer" 72 86 {
  param($g)
  Line $g 28 57 23 82 8 $cloth2
  Line $g 43 57 50 82 8 $cloth
  Torso $g 36 34 27 31 (C "2d2c24") $orange
  Line $g 18 38 10 62 7 $skin2
  Line $g 54 39 63 59 7 $skin
  Head $g 37 18 31 25 $yellow $true $true
  Rect $g 32 29 12 14 $black
  Rect $g 11 15 3 34 $orange 150
  Rect $g 58 15 3 34 $orange 150
  Rect $g 6 28 3 3 $orange 185
  Rect $g 64 29 3 3 $orange 185
}

SaveSprite "bossTitan" 172 154 {
  param($g)
  Line $g 61 96 48 148 20 $cloth2
  Line $g 103 96 120 148 20 $cloth
  Torso $g 86 44 90 70 (C "443b37") $hotRed
  Line $g 25 60 12 125 25 $skin2
  Line $g 145 56 158 124 25 $skin
  Head $g 88 25 50 39 $hotRed $true $false
  Poly $g @(@(49,45),@(70,36),@(124,40),@(139,55),@(128,65),@(58,62)) $metal2
  Rect $g 69 77 32 28 $hotRed 210
  Rect $g 79 84 14 13 $yellow 240
  Rect $g 24 44 7 20 $bone
  Rect $g 134 38 7 23 $bone
  Rect $g 111 20 6 18 $bone
  LimbNoise $g 145 89
}

SaveSprite "bossGunner" 154 124 {
  param($g)
  Line $g 55 78 43 120 17 $cloth2
  Line $g 86 78 100 120 17 $cloth
  Torso $g 72 40 64 54 (C "303841") $red
  Line $g 25 53 16 100 17 $skin2
  Line $g 113 50 130 74 17 $skin
  Rect $g 96 65 55 13 $outline
  Rect $g 98 67 49 7 $metal2
  Rect $g 135 56 16 6 $hotRed
  Rect $g 108 53 28 8 $metal
  Head $g 72 23 38 31 $hotRed $false $true
  Rect $g 51 42 43 10 (C "70282a") 230
  Rect $g 132 64 5 5 $yellow
}

$sheet = New-Object System.Drawing.Bitmap 760, 400, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$sg = [System.Drawing.Graphics]::FromImage($sheet)
$sg.Clear([System.Drawing.Color]::FromArgb(255, 12, 14, 17))
$sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$items = @(
  @("walker", 10, 15, 0.7), @("runner", 80, 15, 0.7), @("brute", 160, 8, 0.7), @("gunner", 270, 15, 0.7), @("spitter", 365, 12, 0.7),
  @("shielder", 10, 180, 0.7), @("exploder", 125, 185, 0.7), @("screamer", 225, 183, 0.7), @("bossTitan", 330, 115, 0.58), @("bossGunner", 535, 150, 0.62)
)
foreach ($item in $items) {
  $img = [System.Drawing.Image]::FromFile((Join-Path $outDir "$($item[0]).png"))
  $sw = [int]($img.Width * [double]$item[3])
  $sh = [int]($img.Height * [double]$item[3])
  $sg.DrawImage($img, [int]$item[1], [int]$item[2], $sw, $sh)
  $img.Dispose()
}
$sheet.Save((Join-Path $outDir "enemy-sprites-source.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$sg.Dispose()
$sheet.Dispose()
