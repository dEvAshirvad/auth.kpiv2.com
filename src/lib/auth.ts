import { betterAuth, BetterAuthOptions } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { db } from '@/configs/db/mongodb';
import { admin, openAPI } from 'better-auth/plugins';
import origins from '@/configs/origins';
import password from '@/lib/password';
import adminConfig from '@/lib/admin';
import { authDbHooks, authHooks } from './hooks/auth';
import env from '@/configs/env';

const betterAuthConfig: BetterAuthOptions = {
  emailAndPassword: {
    enabled: true,
    password,
    disableSignUp: true,
  },
  hooks: authHooks,
  databaseHooks: authDbHooks,
  database: mongodbAdapter(db),
  plugins: [openAPI(), admin(adminConfig)],
  advanced: {
    cookiePrefix: 'rdmp',
    crossSubDomainCookies: {
      enabled: true,
      domain: env.COOKIE_DOMAIN,
    },
  },
  trustedOrigins: origins,
};

export const auth = betterAuth(betterAuthConfig);
