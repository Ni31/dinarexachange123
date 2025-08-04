import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./mongodb.js";
import Admin from "../models/Admin.js";
import AuditLog from "../models/AuditLog.js";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@dinarexchange.co.nz",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        try {
          await dbConnect();

          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const admin = await Admin.findOne({
            email: credentials.email.toLowerCase(),
          }).select("+password");

          if (!admin) {
            return null;
          }

          if (!admin.isActive) {
            return null;
          }

          const isValidPassword = await admin.comparePassword(
            credentials.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: admin._id.toString(),
            email: admin.email,
            firstName: admin.firstName || "",
            lastName: admin.lastName || "",
            role: admin.role || "admin",
            permissions: admin.permissions || {},
            isActive: admin.isActive,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.isActive = token.isActive;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
