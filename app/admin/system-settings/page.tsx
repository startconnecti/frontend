'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SaveIcon, AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SystemSettingsPage() {
  return (
    <>
      <AdminPageHeader
        title="System Settings"
        description="Configure platform-wide settings and configuration."
      />

      <div className="space-y-6">
        <Alert>
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Read-only mode</AlertTitle>
          <AlertDescription>
            System settings are currently managed via configuration files. Editing through the dashboard will be available in a future update.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-1">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="notification">Notification</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general">
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-bold">General Settings</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input id="platformName" defaultValue="Connecti" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" defaultValue="support@connecti.com" disabled />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Disable all client-side interactions and show maintenance page.
                      </p>
                    </div>
                    <Switch disabled />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="booking">
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-bold">Booking Workflows</h3>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holdDuration">Booking Hold Duration (minutes)</Label>
                      <Input id="holdDuration" type="number" defaultValue="15" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cancelWindow">Cancellation Window (hours)</Label>
                      <Input id="cancelWindow" type="number" defaultValue="24" disabled />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Allow Tutor Cancellation</Label>
                        <p className="text-sm text-muted-foreground">Tutors can cancel bookings before session starts.</p>
                      </div>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Allow Student Cancellation</Label>
                        <p className="text-sm text-muted-foreground">Students can cancel bookings within the window.</p>
                      </div>
                      <Switch defaultChecked disabled />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-bold">Payment Configuration</h3>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label>Default Payment Gateway</Label>
                    <Select defaultValue="stripe" disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gateway" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankInfo">Bank Transfer Info</Label>
                    <Textarea 
                      id="bankInfo" 
                      defaultValue="Bank: Connecti Bank\nAcc Name: Connecti Platform\nAcc No: 1234567890\nRef: [Booking ID]" 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expireTime">Payment Expiration (hours)</Label>
                    <Input id="expireTime" type="number" defaultValue="2" disabled />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="commission">
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-bold">Commission & Payouts</h3>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Platform Commission (%)</Label>
                    <Input id="commissionRate" type="number" defaultValue="15" disabled />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holdPeriod">Tutor Payout Hold Duration (days)</Label>
                      <Input id="holdPeriod" type="number" defaultValue="7" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minPayout">Minimum Payout Amount ($)</Label>
                      <Input id="minPayout" type="number" defaultValue="50" disabled />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notification">
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-bold">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Global Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send transaction and session emails to users.</p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminderTime">Session Reminder Time (minutes before)</Label>
                    <Input id="reminderTime" type="number" defaultValue="30" disabled />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>System Announcements</Label>
                      <p className="text-sm text-muted-foreground">Show platform-wide alerts to logged-in users.</p>
                    </div>
                    <Switch disabled />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="p-6 space-y-6">
                <h3 className="text-lg font-bold">Security & Sessions</h3>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionDuration">Admin Session Duration (hours)</Label>
                    <Input id="sessionDuration" type="number" defaultValue="12" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minPassLength">Minimum Password Length</Label>
                    <Input id="minPassLength" type="number" defaultValue="8" disabled />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Require Strong Password</Label>
                      <p className="text-sm text-muted-foreground">Force use of symbols, numbers and uppercase letters.</p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button disabled className="gap-2">
            <SaveIcon className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
