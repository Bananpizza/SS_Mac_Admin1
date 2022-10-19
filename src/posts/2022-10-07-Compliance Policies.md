---
title: Compliance Policies
description: Use 'em well
author: SS Mac Admin
date: 2022-09-01
tags:
  - blog
---
## Think it through

I see so very often that there is only one compliance policy assigned in Intune (per OS). This grinds my gears, and I get in discussions a lot why this is not such a great practice when I get out to customers or other vendors that have set up the environment. Especially if the setup is as a BYOD environment without DEP.</br>
In general, there is nothing wrong with one policy, but it’s quite an obstacle to work around and it get dirty very fast. The user experience is not quite there and the support team will be confused initially before looking up the device in Intune. And as of late with the great super patch for iOS which is to upgrade to iOS 15.7 or, if you use an older device (iPhone 5s, 6, 6 Plus and iPad Air, Mini 2/3 and iPod touch 6th Gen), iOS 12.5.6. You should not let anything below that through. Both for the sake of your organisation and to help the user with security.</br>
As you can see it's a great mess.

|![single policy](/static/img/single_compliance.png)|
|:--:|
|Please dont :(|

With iPhone 14 released and iOS 16 is out in the wild, we need to be able to segregate devices in a better way than to lock everything in one policy and assign it to a specific group. This will also benefit the user when they receive a notification why their device isn't compliant, since we don’t want to push generic “Contact your local IT for help” mail. <br>As a rule of thumb with everything related to Intune, SPLIT – THINGS - UP! We need to be flexible since there is a lot going on with versions of iOS and hardware models.

<details>
<summary>Before we begin, iOS 16 will require a hardware of the following models:</summary>
</br>
iPhone 14</br>
iPhone 14 Plus</br>
iPhone 14 Pro</br>
iPhone 14 Pro Max</br>
iPhone 13</br>
iPhone 13 mini</br>
iPhone 13 Pro</br>
iPhone 13 Pro Max</br>
iPhone 12</br>
iPhone 12 mini</br>
iPhone 12 Pro</br>
iPhone 12 Pro Max</br>
iPhone 11</br>
iPhone 11 Pro</br>
iPhone 11 Pro Max</br>
iPhone XS</br>
iPhone XS Max</br>
iPhone XR</br>
iPhone X</br>
iPhone 8</br>
iPhone 8 Plus</br>
iPhone SE (2nd generation or later)</br>
</details>
<br>

<details>
<summary>iPadOS 16 have the following:</summary>
</br>
iPad Pro (all models)</br>
iPad Air (3rd generation and later)</br>
iPad (5th generation and later)</br>
iPad mini (5th generation and later)</br>
</details>
</br>

## Filter like a coffeemaker
We need to talk filters. This will be our little cuddle bear in this transformation. A such small and simple thing as a filter will improve the QoL quite a lot, and we can get a better understanding of the environment as well. And it work faster than dynamic groups, since we don't need to rely on AAD syncs.
Filters are quite easy to set up and can be powerful (not just for Compliance policies, also for profiles and applications).</br>
We need to create some filters. One that filters out all devices that’s above iPhone 8 and one filter for iPhone 7 and below. You can either write the syntax, or use the drop downs to create it.

Navigate to **Devices - Filter** and hit create. We need to create three different filters.

Legacy devices:

```xml
(device.model -contains "iPhone 5s") or (device.model -contains "iPhone 6")
```

Current devices:

```xml
(device.model -contains "iPhone SE") or (device.model -contains "iPhone 8") or (device.model -contains "iPhone X") or (device.model -contains "iPhone 11") or (device.model -contains "iPhone 12") or (device.model -contains "iPhone 13") or (device.model -contains "iPhone 14")
```
As we can see with this filter for example, if we choose to preview devices, we can see that it filters through all versions of the specific models we have applied in the syntax.
![Preview](/static/img/preview.png)

The forgotten iPhone 7:

```xml 
(device.model -contains “iPhone 7”)
```

You should have the following filters created:
![Filters](/static/img/filters.png)

With the filters ready to go, let’s create policies.

## Create the policies
We want to split the policies, so we need three (unfortunately, because Apple droppen iPhone 7 from iOS 16...) policies for version handling, and this is where you can freebase, either you can run the rest in one policy (depending on your needs), or you can split it up further. This is where you decide how informative you want to be towards the users. 

<div class="alert alert-info shadow-lg">
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span>A note for <b>macOS</b> specifically. Changing a policy touching <b><i>passwords</b></i> (complexity, etc) will trigger a password reset on targeted users macOS devices.</span>
  </div>
</div>

So head to **Devices - iOS/iPad OS - Compliance Policies** and click on Create Policy.
Here we need to create three different policies to only handle version verification. Name them as you see fit, as long as you know which policy is which. In my example, I'm configuring the legacy compliance. And we only set minimum OS version in these policies.

![Preview](/static/img/compliance_policy_legacy_settings.png)
Version Setttings

![Preview](/static/img/compliance_policy_notification.png)
Select the actions you want to have for the policy


In the ‘Assignments’ tab, click on “Add all users”, and then we can select “Edit Filter”. This is where we let the filter do all the work for us.

![Preview](/static/img/compliance_policy_legacy_filterassignment.png)

Save the policy and let Intune do the work for us.

When all our policies are created, we should have the following stack:

![Preview](/static/img/complete_compliance_policy.png)

## Maintenance
The maintenance is low. When the next iOS or iPadOS is released, or a new version of the devices, simply bump up the values of the minimum OS version in the policy, and add/remove/move the models in the filters.

## Conclusion
With the split of the policys, and addition to filters, we have more control over the versionhandling of the devices, and we can easily move the models around if necessary when new releases of either OS or models. We also make it easy for the user to understand what is the cause why they can't access company data because of the compliance policy. And if the user need to contact IT for assistance, they don't need to troubleshoot or look up the device, they have the answer in the email that's sent.

So all in all, we make everyone happy :)
