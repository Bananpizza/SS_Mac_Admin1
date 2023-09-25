---
title: Intune and PSSO
description: Create your own solutions
author: SS Mac Admin
date: 2023-09-25
tags:
  - blog
---

## Intune and PSSO

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
From the device and user perspective, it's quite smooth.
When the Company Portal is set up and the user log in, a toast notification will tell the user to use your IDP password to login to the Mac.
![](/static/img/psso_toast_register.png)

When clicking on Register, you will be redirected to register the device with Microsoft Entra.
![](/static/img/psso_toast_register_entra.png)

When finalized, the last prompt is displayed and this asks for your current local device password. When entered and finished, the Platform SSO payload is completed and the user can now use their IdP credentials to login to the device from the log in screen.
![](/static/img/psso_toast_register_complete.png)

To verify that the device is registered and the tokens has been recieved, type **app-sso platorm -s** in the terminal and you can see all the configurations.
![](/static/img/psso_terminal.png)

## Thoughts
This is a great step for the IdP sync for Intune and macOS devices. No more hassle with the SSO Extension and kerberos sync with On-Prem and use of VPN to enable the sync in the first place.

I'm looking forward to more enhancements to the PSSO development within Intune and some kind of integration with the onboarding experience during an ADE enrollment.

And from the looks of it, a lot of great features in development when looking through the Settings Catalog for Platform SSO.
![](/static/img/psso_new_settings.png)
