import { useEffect, useState } from "react";
import { STAGES, STAGE_LABELS, type StageKey } from "@/lib/data";

export type Session =
  | { role: "admin"; email: string; name: string; title: string }
  | { role: "buyer"; email: string; name: string; title: string }
  | { role: "process"; email: string; name: string; title: string; stage: StageKey };

const KEY = "texmind-session";

type Account = { email: string; password: string; session: Session };

export const processAccounts: (Account & { stage: StageKey })[] = STAGES.map((stage) => ({
  email: `${stage}@texmind.in`,
  password: `${stage}@123`,
  stage,
  session: {
    role: "process",
    stage,
    email: `${stage}@texmind.in`,
    name: `${STAGE_LABELS[stage]} Incharge`,
    title: `${STAGE_LABELS[stage]} Process Portal`,
  },
}));

export const accounts: Account[] = [
  {
    email: "manager@texmind.in",
    password: "texmind",
    session: {
      role: "admin",
      email: "manager@texmind.in",
      name: "Factory Manager",
      title: "Administrator",
    },
  },
  {
    email: "buyer@texmind.in",
    password: "buyer@123",
    session: {
      role: "buyer",
      email: "buyer@texmind.in",
      name: "Anita Sharma",
      title: "ABC Fashion · Buyer",
    },
  },
  ...processAccounts,
];

export function authenticate(email: string, password: string): Session | null {
  const found = accounts.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  );
  return found ? found.session : null;
}

export function saveSession(session: Session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("texmind-session-change"));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("texmind-session-change"));
}

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function homeFor(session: Session): string {
  if (session.role === "admin") return "/dashboard";
  if (session.role === "buyer") return "/buyer/dashboard";
  return `/production/${session.stage}`;
}

export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const sync = () => setSession(readSession());
    sync();
    window.addEventListener("texmind-session-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("texmind-session-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return session;
}
