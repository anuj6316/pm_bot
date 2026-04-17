import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function Settings() {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  // User Profile state
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [profileSuccess, setProfileSuccess] = useState('');

  // Change Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Sync state with user when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
  }, [user]);

  // Clear success messages after 6 seconds
  useEffect(() => {
    if (profileSuccess) {
      const timer = setTimeout(() => setProfileSuccess(''), 6000);
      return () => clearTimeout(timer);
    }
  }, [profileSuccess]);

  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => {
        setPasswordSuccess('');
        navigate('/login', { replace: true });
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess, navigate]);

  // Profile handlers
  const handleProfileSave = async () => {
    const errors: { firstName?: string; lastName?: string } = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setProfileErrors({});
    setProfileLoading(true);

    try {
      await updateProfile({ first_name: firstName.trim(), last_name: lastName.trim() });
      setProfileSuccess('Profile updated successfully');
    } catch (err) {
      setProfileErrors({
        firstName: err instanceof Error ? err.message : 'Failed to update profile',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Password handlers
  const handlePasswordChange = async () => {
    const errors: { oldPassword?: string; newPassword?: string; confirmPassword?: string } = {};

    if (!oldPassword) {
      errors.oldPassword = 'Current password is required';
    }
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setPasswordLoading(true);

    try {
      await changePassword(oldPassword, newPassword, confirmPassword);
      // AuthContext will auto-logout after password change
      setPasswordSuccess('Password changed. Redirecting to login...');
    } catch (err) {
      setPasswordErrors({
        oldPassword: err instanceof Error ? err.message : 'Failed to change password',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-apple-text-muted mt-1">Manage your PM Bot preferences and integrations.</p>
      </div>

      <div className="grid gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setProfileErrors((prev) => ({ ...prev, firstName: undefined }));
                  }}
                  placeholder="Enter first name"
                />
                {profileErrors.firstName && (
                  <p className="text-sm text-red-500">{profileErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setProfileErrors((prev) => ({ ...prev, lastName: undefined }));
                  }}
                  placeholder="Enter last name"
                />
                {profileErrors.lastName && (
                  <p className="text-sm text-red-500">{profileErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={user?.email || ''} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input value={user?.username || ''} disabled className="bg-gray-50" />
            </div>
            {profileSuccess && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                {profileSuccess}
              </div>
            )}
            <Button onClick={handleProfileSave} disabled={profileLoading}>
              {profileLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password (minimum 8 characters)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setPasswordErrors((prev) => ({ ...prev, oldPassword: undefined }));
                }}
                placeholder="Enter current password"
              />
              {passwordErrors.oldPassword && (
                <p className="text-sm text-red-500">{passwordErrors.oldPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                placeholder="Enter new password"
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="Confirm new password"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
              )}
            </div>
            {passwordSuccess && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                {passwordSuccess}
              </div>
            )}
            <Button
              onClick={handlePasswordChange}
              disabled={passwordLoading || !oldPassword || !newPassword || !confirmPassword}
            >
              {passwordLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Plane Integration Card */}
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

        {/* Agent Preferences Card */}
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
