import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-apple-text-muted mt-1">Manage your PM Bot preferences and integrations.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plane Integration</CardTitle>
            <CardDescription>Configure your connection to Plane workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace Slug</label>
              <Input placeholder="e.g. my-company" defaultValue="demo-workspace" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input type="password" placeholder="plane_api_..." defaultValue="plane_api_12345" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Preferences</CardTitle>
            <CardDescription>Customize how PM Bot analyzes and responds to issues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Polling Interval (minutes)</label>
              <Input type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Triage Label Color</label>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer ring-2 ring-offset-2 ring-apple-blue"></div>
                <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
              </div>
            </div>
            <Button variant="outline">Update Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
