
# ==============================================================================
# SSVproff.ps1 - Whitelist безопасных PowerShell команд
# ==============================================================================
# Этот файл содержит разрешённые команды для выполнения через панель.
# Только команды из этого файла могут быть выполнены через Flows компонент.
#
# ⚠️ ВАЖНО:
# - Добавляйте только проверенные команды
# - Избегайте команд с прямым доступом к системе
# - Не используйте Invoke-Expression с пользовательским вводом
# ==============================================================================

# ==============================================================================
# Информационные команды
# ==============================================================================

# Получить текущую дату и время
function Get-CurrentDateTime {
    Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

# Получить информацию о системе
function Get-SystemInfo {
    $OS = Get-CimInstance -ClassName Win32_OperatingSystem
    $Computer = Get-CimInstance -ClassName Win32_ComputerSystem
    
    [PSCustomObject]@{
        ComputerName = $Computer.Name
        OS = $OS.Caption
        Version = $OS.Version
        Architecture = $OS.OSArchitecture
        Memory = [math]::Round($Computer.TotalPhysicalMemory / 1GB, 2)
        Uptime = (Get-Date) - $OS.LastBootUpTime
    }
}

# Получить информацию о дисках
function Get-DiskInfo {
    Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -ne $null } | Select-Object Name, @{Name="Used(GB)";Expression={[math]::Round($_.Used / 1GB, 2)}}, @{Name="Free(GB)";Expression={[math]::Round($_.Free / 1GB, 2)}}
}

# ==============================================================================
# rclone команды
# ==============================================================================

# Проверить версию rclone
function Get-RcloneVersion {
    rclone version
}

# Получить список remotes в rclone
function Get-RcloneRemotes {
    rclone listremotes
}

# Получить размер директории в rclone
function Get-RcloneSize {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Remote,
        
        [Parameter(Mandatory=$false)]
        [string]$Path = ""
    )
    
    $RemotePath = if ($Path) { "${Remote}:${Path}" } else { "${Remote}:" }
    rclone size $RemotePath
}

# Получить список файлов в rclone директории
function Get-RcloneFiles {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Remote,
        
        [Parameter(Mandatory=$false)]
        [string]$Path = ""
    )
    
    $RemotePath = if ($Path) { "${Remote}:${Path}" } else { "${Remote}:" }
    rclone lsf $RemotePath
}

# ==============================================================================
# Сетевые команды
# ==============================================================================

# Проверить доступность хоста
function Test-HostConnection {
    param (
        [Parameter(Mandatory=$true)]
        [string]$HostName
    )
    
    Test-Connection -ComputerName $HostName -Count 4 -Quiet
}

# Получить IP адрес
function Get-IpAddress {
    Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" } | Select-Object InterfaceAlias, IPAddress
}

# ==============================================================================
# Файловые команды (безопасные)
# ==============================================================================

# Получить размер директории
function Get-DirectorySize {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Path
    )
    
    if (Test-Path $Path) {
        $Size = (Get-ChildItem -Path $Path -Recurse -File | Measure-Object -Property Length -Sum).Sum
        [math]::Round($Size / 1GB, 2)
    } else {
        Write-Error "Путь не найден: $Path"
    }
}

# Получить список файлов в директории
function Get-DirectoryFiles {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Path
    )
    
    if (Test-Path $Path) {
        Get-ChildItem -Path $Path | Select-Object Name, Length, LastWriteTime
    } else {
        Write-Error "Путь не найден: $Path"
    }
}

# ==============================================================================
# Примеры использования
# ==============================================================================

# Пример 1: Получить текущее время
# Get-CurrentDateTime

# Пример 2: Получить информацию о системе
# Get-SystemInfo

# Пример 3: Получить список rclone remotes
# Get-RcloneRemotes

# Пример 4: Проверить размер директории в rclone
# Get-RcloneSize -Remote "myremote" -Path "backup/2024"

# Пример 5: Получить список файлов в rclone
# Get-RcloneFiles -Remote "myremote" -Path "documents"

# ==============================================================================
# Конец whitelist
# ==============================================================================
