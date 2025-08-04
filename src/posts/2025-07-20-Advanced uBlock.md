---
title: Advanced uBlock Config
description: Remediation to the rescue
author: SS Mac Admin
date: 2025-07-20
tags:
  - blog
---

##Configure

With uBlock deployed to the orgainzation from the last post. We can also dive deeper in configuring uBlock with the help of some PowerShell and we will utilize remediation scripts in Intune to have a way check in with devices from time to time if changes has been made or if we want to update some configurations.

Got the chance to do this because a customer wanted to whitelist a couple of websites for Google analytics. It's not really that convenient to ask 3000+ employees to whitelist 10+ websites manually. The best solution for us was to create the remediation.
These detect and remediate scripts also allow you to change filterlists. If you know your way around Powershell, it shouldn't be hard to add even more configurations that's available on uBlock's Wiki-page.


###Detect
Let us configure the Detection part first.

First we need to set the location to the rigstry key that contain all information about the extension. Then we run a detection how we want the settings to be as our baseline. If it doesn't match, the remediation will kick in and set the parameters we would like. 

We will mainly touch the part of the script that includes "trustedSiteDirectives". This is where the whitelisting of websites that's not going to be touched by uBlock will be put. This part need to be identical in both the Detect and Remediate part, since we want to find out if something has been changed from our baseline. This setting do not interfere with the manual whitelists users might have done on their own with the extension.

```ps
# Detect
[int32]$SkipRemediate = 0
[int32]$Remediate = 1

$Policy = "HKLM:\Software\Policies\Microsoft\Edge\3rdparty\Extensions\odfafepnkmbhccpbejgmiehpchacaeak\policy"

# Expected userSettings
$userSettings = @'
[
    ["contextMenuEnabled", "true"],
    ["showIconBadge", "true"]
]
'@

# Expected toOverwrite
$toOverwrite = @'
{
    "filterLists": [
        "user-filters", "ublock-filters", "ublock-badware", "ublock-privacy",
        "ublock-abuse", "ublock-unbreak", "easylist", "easyprivacy",
        "urlhaus-1", "adguard-annoyance", "ublock-annoyances", "plowe-0"
    ],
    "trustedSiteDirectives": [
        "about-scheme", "chrome-extension-scheme", "chrome-scheme",
        "edge-scheme", "moz-extension-scheme", "opera-scheme",
        "vivaldi-scheme", "wyciwyg-scheme", "website1.dk", "website2.no",
        "website3.se", "chrome-extension-scheme", "another.one.com",
        "moz-extension-scheme", "macos.rules.com"
    ]
}
'@

try {
    if (-Not (Test-Path -Path $Policy -ErrorAction SilentlyContinue)) {
        Write-Host "Remediate. uBlock whitelist missing."
        exit $Remediate
    }

    # Get registry values
    $policyValues = Get-ItemProperty -Path $Policy

    # Save for troubleshooting
    $policyValues | Out-File -FilePath $RemediateWhitelistOnDomains -Force

    # Check if userSettings matches
    $currentUserSettings = $policyValues.userSettings
    $currentToOverwrite = $policyValues.toOverwrite

    if ($currentUserSettings -ne $userSettings -or $currentToOverwrite -ne $toOverwrite) {
        Write-Host "Remediate. uBlock whitelist update required."
        exit $Remediate
    }

    Write-Host "Skip Remediate. uBlock whitelist match."
    exit $SkipRemediate

} catch {
    Write-Host $_.Exception.Message
    exit $Remediate
}
```

###Remediate

The remediate part kicks in if we find anomalies from what we want our baseline to be in uBlock. The settings, as mentioned in the detection part, should be identical otherwise it will just loop itself to infinity and beyond.


```ps
# Remediate
[int32]$Success = 0
[int32]$Failure = 1

$Policy = "HKLM:\Software\Policies\Microsoft\Edge\3rdparty\Extensions\odfafepnkmbhccpbejgmiehpchacaeak\policy"

# userSettings
$userSettings = @{
    "Force" = $true
    "Path"  = $Policy
    "Type"  = "String"
    "Name"  = "userSettings"
    "Value" = @'
[
    ["contextMenuEnabled", "true"],
    ["showIconBadge", "true"]
]
'@
}

# toOverwrite
$toOverwrite = @{
    "Force" = $true
    "Path"  = $Policy
    "Type"  = "String"
    "Name"  = "toOverwrite"
    "Value" = @'
{
    "filterLists": [
        "user-filters", "ublock-filters", "ublock-badware", "ublock-privacy",
        "ublock-abuse", "ublock-unbreak", "easylist", "easyprivacy",
        "urlhaus-1", "adguard-annoyance", "ublock-annoyances", "plowe-0"
    ],
    "trustedSiteDirectives": [
        "about-scheme", "chrome-extension-scheme", "chrome-scheme",
        "edge-scheme", "moz-extension-scheme", "opera-scheme",
        "vivaldi-scheme", "wyciwyg-scheme", "website1.dk", "website2.no",
        "website3.se", "chrome-extension-scheme", "another.one.com",
        "moz-extension-scheme", "macos.rules.com"
    ]
}
'@
}

try {
    If (-Not (Test-Path -Path $Policy)) { New-Item -Force -Path $Policy }

    Get-Item -Path $Policy
    
    Set-ItemProperty @userSettings
    Set-ItemProperty @toOverwrite

    exit $Success

} catch {
    Write-Host $_.Exception.Message
    exit $Failure
}
```


Save the scripts as two seperate .ps1-files and upload the scripts as a remediation in your tenant. This can be deployed without interfering the users.

Signed, sealed and delivered uBlock configuration. Enjoy!
