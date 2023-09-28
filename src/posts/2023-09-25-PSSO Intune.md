---
title: Intune and PSSO
description: This is good.
author: SS Mac Admin
date: 2023-09-25
tags:
  - blog
---

## Intune and Platform Single Sign-On

Microsoft is taking a significant step forward by introducing Platform Single Sign-On (SSO) functionality to macOS devices in Intune.

In essence, Platform SSO marks a progression from the Extensible SSO payload. The noteworthy aspect is its availability at the login window, enabling users to seamlessly log in with their Identity Provider (IdP) credentials (such as Entra ID, Okta, etc.), subsequently gaining automatic access to business applications and websites. This synchronization between the local account and the IdP ensures a consistent login experience, requiring users to remember only one password.

Platform SSO offers two supported authentication methods:

* **Password Authentication**: Users can authenticate using either a local or IdP password.
* **Secure Enclave**: This method establishes SSO without impacting the local account password.

## Prep
**Microsoft Intune**

* Mac devices using ADE (Automated Device Enrollment) or Device Enrolment.
* Create a Microsoft SSO configuration profile

**Device**

* macOS Ventura 13.0 or later
* Company Portal app (Currently only support version 5.2307.99, Preview release)


## Configuration
First, we need to create a SSO Payload and we will be using the Settings Catalog for this.
![](/static/img/psso_profile_create.png)

Then we click on '+ Add Settings' and search for 'Extensible Single Sign On', and select the options as shown in the screenshot, and configure accordingly.
![](/static/img/psso_profile_settings.png)

Save the configuration and deploy it to a device that got the correct version of the Company Portal.

When deployed, the profile should look like the screenshot:
![](/static/img/psso_profile_on_device.png)

## The experience
From the perspective of both the device and the user, the experience is remarkably seamless. After setting up the Company Portal and logging in, a toast notification will prompt the user to utilize their IdP password for logging into the Mac.
![](/static/img/psso_toast_register.png)

Clicking on "Register" will redirect you to the device registration process with Microsoft Entra.
![](/static/img/psso_toast_register_entra.png)

Upon completion, the final prompt will request your current local device password. Once entered and confirmed, the Platform SSO payload is fully implemented. From this point forward, the user can use their IdP credentials to log in to the device directly from the login screen.
![](/static/img/psso_toast_register_complete.png)

To verify the successful registration of the device and the reception of tokens, simply type **app-sso platform -s** in the terminal to view all configurations.
![](/static/img/psso_terminal.png)

## Thoughts
This is a great step for the IdP sync for Intune and macOS devices. No more hassle with the SSO Extension and kerberos sync with On-Prem and use of VPN to enable the sync in the first place.

I'm really looking forward to seeing how PSSO evolves within Intune, and I've got my fingers crossed for seamless integration with the onboarding experience during an ADE enrollment.

And just peeking into the Settings Catalog for Platform SSO, it's pretty clear that there are some seriously cool features in the works.
![](/static/img/psso_new_settings.png)
