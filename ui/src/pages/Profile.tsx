import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Calendar, Shield, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';

export function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [profileSuccess, setProfileSuccess] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
  }, [user]);

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

  const getUserInitials = () => {
    if (!user) return '?';
    const first = user.first_name?.charAt(0)?.toUpperCase() || '';
    const last = user.last_name?.charAt(0)?.toUpperCase() || '';
    return first + last || user.username?.charAt(0)?.toUpperCase() || '?';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.username || user.email;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
      setPasswordSuccess('Password changed successfully. Redirecting to login...');
    } catch (err) {
      setPasswordErrors({
        oldPassword: err instanceof Error ? err.message : 'Failed to change password',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-ink-muted-48)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[var(--color-canvas-parchment)]">

      {/* Light Hero Header */}
      <section className="bg-[var(--color-canvas)] border-b border-[var(--color-divider-soft)] px-[32px] py-[48px]">
        <h1 className="text-display-lg text-[var(--color-ink)]">Profile.</h1>
        <p className="text-lead mt-[8px] text-[var(--color-ink-muted-80)]">
           Manage your account settings and preferences.
        </p>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 px-[32px] py-[48px] flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col gap-[24px]">

          {/* Personal Information Card */}
          <Card>
            <div className="px-[24px] py-[16px] border-b border-[var(--color-divider-soft)] bg-[var(--color-surface-pearl)]">
              <h2 className="text-body-strong text-[var(--color-ink)]">Personal Information</h2>
            </div>
            <CardContent className="p-[24px]">

              {/* Avatar Row */}
              <div className="flex items-center gap-[24px] mb-[32px]">
                <div className="w-[80px] h-[80px] rounded-full bg-[var(--color-surface-chip-translucent)] flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--color-ink)] font-semibold text-display-md">{getUserInitials()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-display-md text-[var(--color-ink)] mb-[8px]">{getUserDisplayName()}</h3>
                  <div className="flex items-center gap-[16px] text-caption text-[var(--color-ink-muted-80)]">
                    <div className="flex items-center gap-[6px]">
                      <Mail className="w-[14px] h-[14px]" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      <Calendar className="w-[14px] h-[14px]" />
                      <span>Joined {formatDate(user.date_joined)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-[16px] border-t border-[var(--color-divider-soft)] pt-[24px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                  <div className="space-y-[8px]">
                    <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">First Name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setProfileErrors((prev) => ({ ...prev, firstName: undefined }));
                      }}
                      placeholder="Enter first name"
                    />
                    {profileErrors.firstName && (
                      <p className="text-caption text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-[14px] h-[14px]" />
                        {profileErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-[8px]">
                    <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">Last Name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setProfileErrors((prev) => ({ ...prev, lastName: undefined }));
                      }}
                      placeholder="Enter last name"
                    />
                    {profileErrors.lastName && (
                      <p className="text-caption text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-[14px] h-[14px]" />
                        {profileErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-[8px]">
                  <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">Username</label>
                  <Input
                    value={user.username || ''}
                    disabled
                    className="bg-[var(--color-canvas-parchment)] text-[var(--color-ink-muted-48)]"
                  />
                  <p className="text-fine-print text-[var(--color-ink-muted-48)]">Username cannot be changed</p>
                </div>

                {profileSuccess && (
                  <div className="flex items-center gap-[8px] text-body-default text-green-600 bg-green-50 px-[16px] py-[12px] rounded-sm">
                    <Check className="w-[16px] h-[16px]" />
                    {profileSuccess}
                  </div>
                )}

                <div className="pt-[8px]">
                  <Button
                    onClick={handleProfileSave}
                    disabled={profileLoading}
                    variant="primary"
                  >
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Card */}
          <Card>
            <div className="px-[24px] py-[16px] border-b border-[var(--color-divider-soft)] bg-[var(--color-surface-pearl)]">
              <h2 className="text-body-strong text-[var(--color-ink)]">Change Password</h2>
            </div>
            <CardContent className="p-[24px] space-y-[16px]">

              <div className="space-y-[8px]">
                <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      setPasswordErrors((prev) => ({ ...prev, oldPassword: undefined }));
                    }}
                    placeholder="Enter current password"
                    className="pr-[40px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
                  </button>
                </div>
                {passwordErrors.oldPassword && (
                  <p className="text-caption text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-[14px] h-[14px]" />
                    {passwordErrors.oldPassword}
                  </p>
                )}
              </div>

              <div className="space-y-[8px]">
                <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
                    }}
                    placeholder="Enter new password (min. 8 characters)"
                    className="pr-[40px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-caption text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-[14px] h-[14px]" />
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-[8px]">
                <label className="text-caption-strong text-[var(--color-ink)] uppercase tracking-wide">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    placeholder="Confirm new password"
                    className="pr-[40px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-caption text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-[14px] h-[14px]" />
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-[8px] text-body-default text-green-600 bg-green-50 px-[16px] py-[12px] rounded-sm mt-[16px]">
                  <Check className="w-[16px] h-[16px]" />
                  {passwordSuccess}
                </div>
              )}

              <div className="pt-[8px]">
                <Button
                  onClick={handlePasswordChange}
                  disabled={passwordLoading || !oldPassword || !newPassword || !confirmPassword}
                  variant="secondary-pill"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
