'use client'

import { Tabs } from '@/components/Tabs'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="profile">Profile form here…</Tabs.Panel>
        <Tabs.Panel value="security">Change password…</Tabs.Panel>
        <Tabs.Panel value="billing">Payment methods…</Tabs.Panel>
      </Tabs>
    </div>
  )
}
