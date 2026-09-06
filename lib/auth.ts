import { env } from 'cloudflare:workers';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
export function authOptions() {
  return {
    google: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    github: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
  };
}
export function getAuth() {
  if (!env.BETTER_AUTH_SECRET || !env.BETTER_AUTH_URL)
    throw new Error('Account service is not configured');
  const providers = authOptions();
  return betterAuth({
    appName: 'Molis AI',
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.BETTER_AUTH_URL],
    database: drizzleAdapter(drizzle(env.DB), {
      provider: 'sqlite',
      schema,
      transaction: false,
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      requireEmailVerification: false,
    },
    account: { accountLinking: { enabled: false } },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 60 },
    advanced: { ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] } },
    socialProviders: {
      ...(providers.google
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID!,
              clientSecret: env.GOOGLE_CLIENT_SECRET!,
            },
          }
        : {}),
      ...(providers.github
        ? {
            github: {
              clientId: env.GITHUB_CLIENT_ID!,
              clientSecret: env.GITHUB_CLIENT_SECRET!,
            },
          }
        : {}),
    },
  });
}
