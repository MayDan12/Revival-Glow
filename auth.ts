import CredentialsProvider from "next-auth/providers/credentials";
import { type AuthOptions } from "next-auth";
import { createClient } from "@/utils/supabase/server"; // use your existing server client
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "admin@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const supabase = await createClient(); // ✅ create instance of supabase server client

        console.log("🔍 Checking admin for:", credentials.email);
        const { data: admin, error } = await supabase
          .from("admins")
          .select("*")
          .eq("email", credentials.email)
          .maybeSingle();

        if (error || !admin) {
          return null;
        }

        // ⚠️ In production, hash passwords using bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!isValid) {
          console.log("❌ Password mismatch");
          return null;
        }

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt", // ✅ TypeScript now infers correctly
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
