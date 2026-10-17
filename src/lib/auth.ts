import { UserRole } from '@/types/inventory';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
}

// User credentials requested by HBTX Admin
export const USERS: UserAccount[] = [
  {
    id: 'user-admin-1',
    username: 'pawan508',
    email: 'admin@hbtxprofessional.com',
    name: 'Pawan (Admin)',
    role: 'ADMIN',
    passwordHash: '5585'
  },
  {
    id: 'user-staff-1',
    username: 'hbtxstaff',
    email: 'staff@hbtxprofessional.com',
    name: 'HBTX Salon Staff',
    role: 'STAFF',
    passwordHash: '1234'
  }
];

export const AUTH_COOKIE_NAME = 'hbtx_session';

export function findUserByUsernameOrEmail(identifier: string): UserAccount | undefined {
  const query = identifier.trim().toLowerCase();
  return USERS.find(
    u => u.username.toLowerCase() === query || u.email.toLowerCase() === query
  );
}

export function createSessionToken(user: UserAccount): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 86400000 * 7 // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function parseSessionToken(token: string): { username: string; name: string; role: UserRole } | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf8');
    const parsed = JSON.parse(jsonStr);
    if (parsed.exp < Date.now()) return null;
    return { username: parsed.username, name: parsed.name, role: parsed.role };
  } catch (err) {
    return null;
  }
}
