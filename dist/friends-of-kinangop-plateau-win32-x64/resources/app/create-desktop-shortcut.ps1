# PowerShell script to create a desktop shortcut for the Electron app

$WshShell = New-Object -ComObject WScript.Shell
$ShortcutPath = [System.IO.Path]::Combine([Environment]::GetFolderPath("Desktop"), "Friends of Kinangop Plateau.lnk")
$TargetPath = Join-Path (Get-Location) "node_modules\.bin\electron.cmd"
$AppPath = Get-Location

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.Arguments = "`"$AppPath`""
$Shortcut.WorkingDirectory = $AppPath
$Shortcut.WindowStyle = 1
$Shortcut.Description = "Launch Friends of Kinangop Plateau App"
# Optional: set icon if you have an icon file
# $Shortcut.IconLocation = "$AppPath\icon.ico"
$Shortcut.Save()
