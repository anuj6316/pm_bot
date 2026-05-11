import React from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';

export function Settings() {
  return (
    <div className="flex flex-col min-h-full bg-[var(--color-canvas-parchment)]">

      {/* Light Hero Header */}
      <section className="bg-[var(--color-canvas)] border-b border-[var(--color-divider-soft)] px-[32px] py-[48px]">
        <h1 className="text-display-lg text-[var(--color-ink)]">Settings.</h1>
        <p className="text-lead mt-[8px] text-[var(--color-ink-muted-80)]">
           Manage your PM Bot preferences and integrations.
        </p>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 px-[32px] py-[48px] flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col gap-[24px]">

          {/* Plane Integration Card */}
          <Card>
            <div className="px-[24px] py-[16px] border-b border-[var(--color-divider-soft)] bg-[var(--color-surface-pearl)]">
              <h2 className="text-body-strong text-[var(--color-ink)]">Plane Integration</h2>
              <p className="text-caption text-[var(--color-ink-muted-48)] mt-[4px]">Configure your connection to Plane workspace.</p>
            </div>
            <CardContent className="p-[24px] space-y-[16px]">
              <div className="space-y-[8px]">
                <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">Workspace Slug</label>
                <Input
                  placeholder="e.g. my-company"
                  defaultValue="demo-workspace"
                />
              </div>
              <div className="space-y-[8px]">
                <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">API Key</label>
                <Input
                  type="password"
                  placeholder="plane_api_..."
                  defaultValue="plane_api_12345"
                />
              </div>
              <div className="pt-[8px]">
                <Button variant="primary">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agent Preferences Card */}
          <Card>
            <div className="px-[24px] py-[16px] border-b border-[var(--color-divider-soft)] bg-[var(--color-surface-pearl)]">
              <h2 className="text-body-strong text-[var(--color-ink)]">Agent Preferences</h2>
              <p className="text-caption text-[var(--color-ink-muted-48)] mt-[4px]">Customize how PM Bot analyzes and responds to issues.</p>
            </div>
            <CardContent className="p-[24px] space-y-[16px]">
              <div className="space-y-[8px]">
                <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">Polling Interval (minutes)</label>
                <Input
                  type="number"
                  defaultValue="5"
                />
              </div>
              <div className="space-y-[8px]">
                <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">Default Triage Label Color</label>
                <div className="flex gap-[12px] pt-[4px]">
                  <button className="w-[32px] h-[32px] rounded-full bg-red-500 cursor-pointer ring-2 ring-offset-2 ring-[var(--color-primary)] transition-all" title="Red" />
                  <button className="w-[32px] h-[32px] rounded-full bg-orange-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-[var(--color-hairline)] transition-all" title="Orange" />
                  <button className="w-[32px] h-[32px] rounded-full bg-green-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-[var(--color-hairline)] transition-all" title="Green" />
                  <button className="w-[32px] h-[32px] rounded-full bg-blue-500 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-[var(--color-hairline)] transition-all" title="Blue" />
                </div>
              </div>
              <div className="pt-[8px]">
                <Button variant="secondary-pill">
                  Update Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
