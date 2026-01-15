import NextAuth from "next-auth";
export const runtime = "nodejs";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/server/db";
import { compare } from "bcryptjs";
import { z } from "zod";

const credentialSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "PROFESSIONAL", "CUSTOMER"]).optional()
});

const otpSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(8)
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        const parsed = credentialSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });
        if (!user || !user.passwordHash) return null;
        if (parsed.data.role && user.role !== parsed.data.role) return null;

        const ok = await compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    }),
    Credentials({
      id: "customer-password",
      name: "CustomerPassword",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
          role: "CUSTOMER"
        });
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });
        if (!user || user.role !== "CUSTOMER" || !user.passwordHash) return null;

        const ok = await compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, role: user.role };
      }
    }),
    Credentials({
      id: "customer-otp",
      name: "CustomerOTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Codigo", type: "text" }
      },
      async authorize(credentials) {
        const parsed = otpSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const record = await prisma.verificationCode.findFirst({
          where: {
            email: parsed.data.email,
            code: parsed.data.code,
            usedAt: null,
            expiresAt: { gt: new Date() }
          }
        });
        if (!record) return null;

        await prisma.verificationCode.update({
          where: { id: record.id },
          data: { usedAt: new Date() }
        });

        let user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: parsed.data.email,
              role: "CUSTOMER",
              customerProfile: {
                create: { name: parsed.data.email.split("@")[0] }
              }
            }
          });
        }

        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? token.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub;
      if (token?.role) session.user.role = token.role as string;
      return session;
    }
  }
});
