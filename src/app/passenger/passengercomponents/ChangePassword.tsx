import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';


const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match!', variant: 'destructive' });
      return;
    }

    const token = Cookies.get('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({ title: 'Error', description: errorData.message || 'Failed to change password', variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Password changed successfully', variant: 'default' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'An error occurred while changing password', variant: 'destructive' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Enter your current password and a new password to update your account.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="currentPassword">
              Current Password
            </Label>
            <Input className="col-span-3" id="currentPassword" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="newPassword">
              New Password
            </Label>
            <Input className="col-span-3" id="newPassword" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <Input className="col-span-3" id="confirmPassword" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleChangePassword}>
            Change Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;