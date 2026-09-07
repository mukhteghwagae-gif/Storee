import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || "Sitara guest" });
        if (res.error) throw new Error(res.error.message || "Could not create account");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Could not sign in");
      }
      window.location.assign("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-dvh">
      <img
        src="/editorial/craft.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16">
        <Link to="/" className="mb-8 text-center font-display text-4xl tracking-[0.22em] text-ivory">
          SITARA
        </Link>
        <div className="rounded-2xl bg-ivory p-6 shadow-sitara">
          <h1 className="font-display text-3xl">
            {mode === "in" ? "Enter the house" : "Open an account"}
          </h1>
          <p className="mt-1 text-sm text-stone">
            Gold coins on first sign-in. Orders, waitlists, and referrals live here.
          </p>
          {authEnabled ? (
            <>
              <div className="mt-6 flex flex-col gap-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn(p.providerId, { callbackURL: "/account" })}
                  >
                    Continue with {p.label}
                  </Button>
                ))}
              </div>
              <p className="my-4 text-center text-[11px] uppercase tracking-[0.18em] text-stone">
                or email
              </p>
              <form onSubmit={onSubmit} className="space-y-3">
                {mode === "up" && (
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                )}
                <Input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
                </Button>
              </form>
              <button
                type="button"
                className="mt-4 w-full text-sm text-stone"
                onClick={() => setMode(mode === "in" ? "up" : "in")}
              >
                {mode === "in" ? "New to Sitara? Create an account" : "Already with us? Sign in"}
              </button>
            </>
          ) : (
            <p className="mt-4 text-sm text-stone">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </main>
  );
}
