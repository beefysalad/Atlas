"use client"

import {
  RiNotification3Line,
  RiShieldCheckLine,
  RiSunLine,
  RiUser3Line,
} from "@remixicon/react"

import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { SecuritySettings } from "@/components/settings/security-settings"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <section className="flex flex-col gap-1">
        <p className="text-muted-foreground text-sm">Settings</p>
        <h1 className="font-heading text-3xl font-semibold tracking-normal md:text-4xl">
          Workspace settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your profile, theme, notifications, and account preferences.
        </p>
      </section>

      <Tabs defaultValue="profile" className="gap-5">
        <TabsList
          variant="line"
          className="w-full justify-start overflow-x-auto"
        >
          <TabsTrigger value="profile">
            <RiUser3Line />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <RiSunLine />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <RiNotification3Line />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <RiShieldCheckLine />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export { SettingsPage }
