$ErrorActionPreference = 'SilentlyContinue'
$base = 'https://qrbanner.com'
$paths = @('/', '/pricing', '/login', '/signup', '/features', '/blog', '/qr-types', '/contact',
           '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/api/billing/status',
           '/favicon.ico', '/icon', '/pay', '/dashboard', '/nonexistent-page-xyz')

foreach ($p in $paths) {
  $url = "$base$p"
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $r = Invoke-WebRequest -Uri $url -MaximumRedirection 0 -UseBasicParsing -TimeoutSec 20
    $sw.Stop()
    $code = $r.StatusCode
    $len = $r.RawContentLength
    "{0,-30} {1}  {2,6}ms  {3} bytes" -f $p, $code, $sw.ElapsedMilliseconds, $len
  } catch {
    $sw.Stop()
    $resp = $_.Exception.Response
    if ($resp) {
      $code = [int]$resp.StatusCode
      $loc = $resp.Headers['Location']
      "{0,-30} {1}  {2,6}ms  -> {3}" -f $p, $code, $sw.ElapsedMilliseconds, $loc
    } else {
      "{0,-30} ERR  {1}" -f $p, $_.Exception.Message
    }
  }
}
