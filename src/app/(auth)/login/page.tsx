import Link from "next/link";
import { LoginForm } from "@/components/auth/AuthForms";
export default function LoginPage() { return <><h1 className="display text-3xl text-[var(--navy)]">Portal sign in</h1><p className="mb-6 mt-2 text-sm text-[var(--stone)]">Use your Finekarts account to access your workspace.</p><LoginForm /><p className="mt-5 text-center text-sm text-[var(--stone)]">New buyer? <Link className="text-[var(--navy)] underline" href="/register/buyer">Register your organization</Link></p></>; }
