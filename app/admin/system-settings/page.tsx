'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { mockSystemSettings } from '@/lib/admin/mock-data';

export default function SystemSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(mockSystemSettings);

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitting(false);
  };

  return (
    <>
      <AdminPageHeader
        title="System Settings"
        description="Configure platform-wide settings and configuration."
      />

      <Card>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full border-b rounded-none px-6 py-0">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="notification">Notification</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input id="platform-name" defaultValue={settings.general.platformName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" defaultValue={settings.general.supportEmail} type="email" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <Switch id="maintenance" defaultChecked={settings.general.maintenanceMode} />
            </div>
          </TabsContent>

          {/* Booking Tab */}
          <TabsContent value="booking" className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="hold-duration">Booking Hold Duration (hours)</Label>
              <Input id="hold-duration" type="number" defaultValue={settings.booking.holdDuration} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancel-window">Cancellation Window (hours)</Label>
              <Input id="cancel-window" type="number" defaultValue={settings.booking.cancellationWindow} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tutor-cancel">Allow Tutor Cancellation</Label>
              <Switch id="tutor-cancel" defaultChecked={settings.booking.allowTutorCancellation} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="student-cancel">Allow Student Cancellation</Label>
              <Switch id="student-cancel" defaultChecked={settings.booking.allowStudentCancellation} />
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="gateway">Payment Gateway</Label>
              <Input id="gateway" defaultValue={settings.payment.paymentGateway} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-info">Bank Transfer Info</Label>
              <Input id="bank-info" defaultValue={settings.payment.bankTransferInfo} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiration">Payment Expiration (days)</Label>
              <Input id="expiration" type="number" defaultValue={settings.payment.expirationTime} />
            </div>
          </TabsContent>

          {/* Commission Tab */}
          <TabsContent value="commission" className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="commission-percent">Platform Commission (%)</Label>
              <Input id="commission-percent" type="number" defaultValue={settings.commission.platformCommissionPercentage} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hold-days">Tutor Payout Hold Duration (days)</Label>
              <Input id="hold-days" type="number" defaultValue={settings.commission.tutorPayoutHoldDuration} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-payout">Minimum Payout Amount ($)</Label>
              <Input id="min-payout" type="number" defaultValue={settings.commission.minimumPayoutAmount} step="0.01" />
            </div>
          </TabsContent>

          {/* Notification Tab */}
          <TabsContent value="notification" className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email Notifications</Label>
              <Switch id="email-notif" defaultChecked={settings.notification.emailNotifications} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Session Reminder Time (hours)</Label>
              <Input id="reminder-time" type="number" defaultValue={settings.notification.sessionReminderTime} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="announcement">System Announcements</Label>
              <Switch id="announcement" defaultChecked={settings.notification.systemAnnouncement} />
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="session-duration">Admin Session Duration (minutes)</Label>
              <Input id="session-duration" type="number" defaultValue={settings.security.adminSessionDuration} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd-length">Password Minimum Length</Label>
              <Input id="pwd-length" type="number" defaultValue={settings.security.passwordMinLength} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="strong-pwd">Require Strong Password</Label>
              <Switch id="strong-pwd" defaultChecked={settings.security.requireStrongPassword} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="border-t border-border px-6 py-4">
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </>
  );
}
