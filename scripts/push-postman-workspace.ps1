param(
    [string]$ApiKey = $env:POSTMAN_API_KEY
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path

if (-not (Get-Command postman -ErrorAction SilentlyContinue)) {
    throw "Postman CLI is not installed or not on PATH. Install it, then rerun this script."
}

Push-Location $apiRoot
try {
    if ($ApiKey) {
        & postman login --with-api-key $ApiKey
        if ($LASTEXITCODE -ne 0) {
            exit $LASTEXITCODE
        }
    }

    & postman workspace prepare
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    & postman workspace push --yes
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Pop-Location
}
