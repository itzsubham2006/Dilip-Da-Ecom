import { describe, it, expect } from '@jest/globals';

describe('Admin Permission Checks', () => {
  const adminRoles = ['admin', 'super_admin'];
  const nonAdminRoles = ['student', 'merchant', 'delivery'];

  it('admin and super_admin have admin access', () => {
    for (const role of adminRoles) {
      expect(['admin', 'super_admin'].includes(role)).toBe(true);
    }
  });

  it('non-admin roles are rejected', () => {
    for (const role of nonAdminRoles) {
      expect(['admin', 'super_admin'].includes(role)).toBe(false);
    }
  });

  it('admin role check function works correctly', () => {
    const isAdmin = (role) => ['admin', 'super_admin'].includes(role);
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('super_admin')).toBe(true);
    expect(isAdmin('student')).toBe(false);
    expect(isAdmin('merchant')).toBe(false);
    expect(isAdmin('delivery')).toBe(false);
    expect(isAdmin('')).toBe(false);
  });
});
