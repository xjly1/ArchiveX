$ProjectRoot = Resolve-Path "$PSScriptRoot\..\.."
$Python = Join-Path $PSScriptRoot ".venv_en\Scripts\python.exe"
$Script = Join-Path $PSScriptRoot "ocr.py"
& $Python $Script @args
exit $LASTEXITCODE