$scancodes = [System.Collections.Generic.Dictionary[string, string[]]]::new()

$base = @{
    'a' = @('1e', '9e'); 'b' = @('30', 'b0'); 'c' = @('2e', 'ae'); 'd' = @('20', 'a0');
    'e' = @('12', '92'); 'f' = @('21', 'a1'); 'g' = @('22', 'a2'); 'h' = @('23', 'a3');
    'i' = @('17', '97'); 'j' = @('24', 'a4'); 'k' = @('25', 'a5'); 'l' = @('26', 'a6');
    'm' = @('32', 'b2'); 'n' = @('31', 'b1'); 'o' = @('18', '98'); 'p' = @('19', '99');
    'q' = @('10', '90'); 'r' = @('13', '93'); 's' = @('1f', '9f'); 't' = @('14', '94');
    'u' = @('16', '96'); 'v' = @('2f', 'af'); 'w' = @('11', '91'); 'x' = @('2d', 'ad');
    'y' = @('15', '95'); 'z' = @('2c', 'ac');
    '1' = @('02', '82'); '2' = @('03', '83'); '3' = @('04', '84'); '4' = @('05', '85');
    '5' = @('06', '86'); '6' = @('07', '87'); '7' = @('08', '88'); '8' = @('09', '89');
    '9' = @('0a', '8a'); '0' = @('0b', '8b');
    ' ' = @('39', 'b9');
    '-' = @('0c', '8c');
    '/' = @('35', 'b5');
    '.' = @('34', 'b4');
    '+' = @('2a', '0d', '8d', 'aa'); # Shift + '='
    '*' = @('2a', '09', '89', 'aa'); # Shift + '8'
}
foreach ($k in $base.Keys) { $scancodes[$k] = $base[$k] }

function Send-Clean($str) {
    $vbox = "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe"
    # Ctrl+C
    & $vbox controlvm "Cafe-Boreal-UTN" keyboardputscancode 1d 2e ae 9d
    Start-Sleep -Milliseconds 200

    foreach ($char in $cmdStr.ToCharArray()) {
        $c = [string]$char
        if ($scancodes.ContainsKey($c)) {
            & $vbox controlvm "Cafe-Boreal-UTN" keyboardputscancode $scancodes[$c]
            Start-Sleep -Milliseconds 20
        }
    }
    # Enter
    & $vbox controlvm "Cafe-Boreal-UTN" keyboardputscancode 1c 9c
}

function Send-CommandDirect($cmdStr) {
    $vbox = "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe"
    foreach ($char in $cmdStr.ToCharArray()) {
        $c = [string]$char
        if ($scancodes.ContainsKey($c)) {
            & $vbox controlvm "Cafe-Boreal-UTN" keyboardputscancode $scancodes[$c]
            Start-Sleep -Milliseconds 20
        }
    }
    & $vbox controlvm "Cafe-Boreal-UTN" keyboardputscancode 1c 9c
}

# 1. Instalar docker y docker-compose
Send-CommandDirect "sudo apt install -y docker.io docker-compose"
Start-Sleep -Seconds 2
Send-CommandDirect "1234"
