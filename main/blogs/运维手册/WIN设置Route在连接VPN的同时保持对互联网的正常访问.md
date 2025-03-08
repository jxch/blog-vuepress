---
title: Windows 设置 Route 在连接 VPN 的同时保持对互联网的正常访问
date: 2025/03/08
tags:
 - Windows
categories:
 - 运维手册
---

## 操作方法

1. `win+R` 输入 `ncpa.cpl`，按回车
2. 右键需要操作的 VPN 设备，点击`属性`
3. 点击`网络`选项卡，双击 `TCP/IPv4`，点击`高级`
4. 取消勾选：`在远程网络上使用默认网关`
5. 连接VPN
6. 管理员模式打开 `powershell` 或 `cmd`
7. 输入命令 `ipconfig /all` 回车，查看需要操作的VPN（如PPP连接）的IP地址，如`192.168.33.19`
8. 添加永久静态路由：`route add 172.16.0.0 mask 255.255.0.0  192.168.33.19 -p` 
   - 将 `172.16.0.0` 网段，子网掩码为 `255.255.0.0` 的所有流量通过 `192.168.33.19` 接口访问，而 `192.168.33.19` 正是该VPN的接口

::: info
该方法的原理是，仅让特定网段的流量走VPN，其他流量依然走本地默认路由
:::

## Powershell 脚本

```powershell
# auto-vpn-route.ps1

param([String]$vpn, [String]$ip, [String]$mask)

$vpn_ipv4 = (Get-NetIPAddress | Where-Object {$_.InterfaceAlias -eq $vpn}).IPAddress

Write-Host "vpn: $vpn; vpn-ipv4: $vpn_ipv4"
If([String]::IsNullOrEmpty($vpn_ipv4)) {
    Write-Warning "请连接 VPN：$vpn"
} Else {
    Write-Host "route delete $ip" -ForegroundColor DarkGray
    route delete $ip
    Write-Host "route add $ip mask $mask $vpn_ipv4" -ForegroundColor DarkGray
    route add $ip mask $mask $vpn_ipv4

    If([String]::IsNullOrEmpty((route print | Select-String -Pattern "\s0.0.0.0" | Select-String $vpn_ipv4))) {
        Write-Host "操作完成！可使用 route print | select-string $ip 查询路由表是否修改。"
    } Else {
        Write-Host "route delete $ip" -ForegroundColor DarkGray
        route delete $ip
        Write-Warning "请去控制面板关闭 $vpn 网卡的默认网关功能" 
        Write-Warning "参见：ncpa.cpl -> $vpn -> 属性 -> 网络 -> (TCP/IPv4) -> 高级 -> 在远程网络上使用默认网关" 
        Write-Warning "重新连接 $vpn"
    }
}
```

```powershell
.\auto-vpn-route.ps1 -vpn 云开发 -ip 172.0.0.0 -mask 255.0.0.0
```

