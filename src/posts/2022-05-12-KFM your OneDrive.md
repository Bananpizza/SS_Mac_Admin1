---
title: KFM your OneDrive
description: Known folder move for OneDrive on macOS!
author: SS Mac Admin
date: 2022-05-15
tags:
  - macOS
---

Microsoft has finally released the option to KFM your files to OneDrive on macOS (Late Feb/early March). This has been a function that has been available for a while on Windows.

We are currently able to sync folders Desktop, Documents and Pictures. Pictures is optional and has to be added in the profile.

<div class="alert alert-warning shadow-lg">
	<div>
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
		<span>Note that you can only have one sync of these folders activated, i.e; you can not have iCloud Drive sync and OneDrive sync enabled at the same time.</span>
	</div>
</div>

So, let's get started.
<br/> We need to following to start creating the config:
* Correct version of OneDrive installed, the minimum version of OneDrive on macOS need to be 22.022.
* Azure TenantID.

The important configurations we need to have in our mobileconfig is the following keys:<br/>
<b>Automatically move known folders</b><br/>
```xml
<key>KFMSilentOptIn</key>
<string>(TenantID)</string>
```
<br/>
<b>If you want to prompt the users, use the following key.</b><br/>

```xml
<key>KFMOptInWithWizard</key>
<string>(TenantID)</string>
```

This leaves us with a OneDrive config initially with these settings:<br/><br/>

<b>OneDrive configuration part of mobileconfig</b>

```xml 
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>DisablePersonalSync</key>
			<false/>
			<key>FilesOnDemandEnabled</key>
			<true/>
			<key>OpenAtLogin</key>
			<true/>
			<key>KFMSilentOptIn</key>
			<string>(TenantID)</string>
			<key>KFMBlockOptOut</key>
			<true/>
			<key>PayloadDisplayName</key>
			<string>Microsoft OneDrive</string>
			<key>PayloadIdentifier</key>
		    <string>com.microsoft.OneDrive</string>
			<key>PayloadType</key>
			<string>com.microsoft.OneDrive</string>
			<key>PayloadUUID</key>
			<string>{UUID-GOES-HERE}</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
		</dict>
```

Although this might look sufficient, we need to allow OneDrive for Full Disk access along with Desktop and Documents folder. We can add these TCC configurations in the same config file. If you want to, you can create a separate configuration in your MDM to grant OneDrive those permissions.

So we need to add the following:


<b>Allow OneDrive disk access</b>

```xml
<dict>
	<key>PayloadDisplayName</key>
		<string>Privacy Preferences Policy Control #1</string>
		<key>PayloadIdentifier</key>
		<string>com.apple.TCC.configuration-profile-policy</string>
		<key>PayloadType</key>
		<string>com.apple.TCC.configuration-profile-policy</string>
		<key>PayloadUUID</key>
		<string>{UUID-GOES-HERE}</string>
		<key>PayloadVersion</key>
		<integer>1</integer>
		<key>Services</key>
		<dict>
			<key>SystemPolicyAllFiles</key>
			<array>
				<dict>
					<key>Allowed</key>
					<true/>
					<key>CodeRequirement</key>
					<string>identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */ and certificate leaf[field.1.2.840.113635.100.6.1.13] /* exists */ and certificate leaf[subject.OU] = UBF8T346G9</string>
					<key>Identifier</key>
					<string>com.microsoft.OneDrive</string>
					<key>IdentifierType</key>
					<string>bundleID</string>
					<key>StaticCode</key>
					<false/>
				</dict>
			</array>
			<key>SystemPolicyDesktopFolder</key>
			<array>
				<dict>
					<key>Allowed</key>
					<true/>
					<key>CodeRequirement</key>
					<string>identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */ and certificate leaf[field.1.2.840.113635.100.6.1.13] /* exists */ and certificate leaf[subject.OU] = UBF8T346G9</string>
					<key>Identifier</key>
					<string>com.microsoft.OneDrive</string>
					<key>IdentifierType</key>
					<string>bundleID</string>
					<key>StaticCode</key>
					<false/>
				</dict>
			</array>
			<key>SystemPolicyDocumentsFolder</key>
			<array>
				<dict>
					<key>Allowed</key>
					<true/>
					<key>CodeRequirement</key>
					<string>identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */ and certificate leaf[field.1.2.840.113635.100.6.1.13] /* exists */ and certificate leaf[subject.OU] = UBF8T346G9</string>
					<key>Identifier</key>
					<string>com.microsoft.OneDrive</string>
					<key>IdentifierType</key>
					<string>bundleID</string>
					<key>StaticCode</key>
					<false/>
				</dict>
			</array>
			<key>SystemPolicyDownloadsFolder</key>
			<array>
				<dict>
					<key>Allowed</key>
					<true/>
					<key>CodeRequirement</key>
					<string>identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */ and certificate leaf[field.1.2.840.113635.100.6.1.13] /* exists */ and certificate leaf[subject.OU] = UBF8T346G9</string>
					<key>Identifier</key>
					<string>com.microsoft.OneDrive</string>
					<key>IdentifierType</key>
					<string>bundleID</string>
					<key>StaticCode</key>
					<false/>
				</dict>
			</array>
		</dict>
```


So all in all, our full mobileconfig will look like the following XML:

<b>Full code for KMF OneDrive!</b>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>DisablePersonalSync</key>
			<false/>
			<key>FilesOnDemandEnabled</key>
			<true/>
			<key>OpenAtLogin</key>
			<true/>
			<key>KFMSilentOptIn</key>
			<string>(TenantID)</string>
			<key>KFMBlockOptOut</key>
			<true/>
			<key>PayloadDisplayName</key>
			<string>Microsoft OneDrive</string>
			<key>PayloadIdentifier</key>
			<string>com.microsoft.OneDrive</string>
			<key>PayloadType</key>
			<string>com.microsoft.OneDrive</string>
			<key>PayloadUUID</key>
			<string>{YOUR-PAYLOADUUID-GOES-HERE}</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
		</dict>
		<dict>
			<key>PayloadDisplayName</key>
			<string>Privacy Preferences Policy Control #1</string>
			<key>PayloadIdentifier</key>
			<string>com.apple.TCC.configuration-profile-policy</string>
			<key>PayloadType</key>
			<string>com.apple.TCC.configuration-profile-policy</string>
			<key>PayloadUUID</key>
			<string>{YOUR-PAYLOADUUID-GOES-HERE}</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>Services</key>
			<dict>
				<key>SystemPolicyAllFiles</key>
				<array>
					<dict>
						<key>Allowed</key>
						<true/>
						<key>CodeRequirement</key>
						<string>identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */ and certificate leaf[field.1.2.840.113635.100.6.1.13] /* exists */ and certificate leaf[subject.OU] = UBF8T346G9</string>
						<key>Identifier</key>
						<string>com.microsoft.OneDrive</string>
						<key>IdentifierType</key>
						<string>bundleID</string>
						<key>StaticCode</key>
						<false/>
					</dict>
				</array>
				<key>SystemPolicyDesktopFolder</key>
				<array>
					<dict>
						<key>Allowed</key>
						<true/>
						<key>CodeRequirement</key>
						<string>identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */ and certificate leaf[field.1.2.840.113635.100.6.1.13] /* exists */ and certificate leaf[subject.OU] = UBF8T346G9</string>
						<key>Identifier</key>
						<string>com.microsoft.OneDrive</string>
						<key>IdentifierType</key>
						<string>bundleID</string>
						<key>StaticCode</key>
						<false/>
					</dict>
				</array>
				<key>SystemPolicyDocumentsFolder</key>
				<array>
					<dict>
						<key>Allowed</key>
						<true/>
						<key>CodeRequirement</key>
						<string>identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */ and certificate leaf[field.1.2.840.113635.100.6.1.13] /* exists */ and certificate leaf[subject.OU] = UBF8T346G9</string>
						<key>Identifier</key>
						<string>com.microsoft.OneDrive</string>
						<key>IdentifierType</key>
						<string>bundleID</string>
						<key>StaticCode</key>
						<false/>
					</dict>
				</array>
				<key>SystemPolicyDownloadsFolder</key>
				<array>
					<dict>
						<key>Allowed</key>
						<true/>
						<key>CodeRequirement</key>
						<string>identifier "com.microsoft.OneDrive" and anchor apple generic and certificate 1[field.1.2.840.113635.100.6.2.6] /* exists */ and certificate leaf[field.1.2.840.113635.100.6.1.13] /* exists */ and certificate leaf[subject.OU] = UBF8T346G9</string>
						<key>Identifier</key>
						<string>com.microsoft.OneDrive</string>
						<key>IdentifierType</key>
						<string>bundleID</string>
						<key>StaticCode</key>
						<false/>
					</dict>
				</array>
			</dict>
		</dict>
	</array>
	<key>PayloadDescription</key>
	<string>OneDrive</string>
	<key>PayloadDisplayName</key>
	<string>OneDrive</string>
	<key>PayloadIdentifier</key>
	<string>com.microsoft.OneDrive</string>
	<key>PayloadOrganization</key>
	<string>{YOUR-ORGANIZATION-GOES-HERE}</string>
	<key>PayloadScope</key>
	<string>System</string>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>{YOUR-PAYLOAD-GOES-HERE}</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
	<key>TargetDeviceType</key>
	<integer>5</integer>
</dict>
</plist>

```

<br/>

<b>Have fun and good luck!</b>

