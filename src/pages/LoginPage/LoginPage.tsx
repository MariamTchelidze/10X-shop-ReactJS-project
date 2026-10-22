import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

interface FormValues { fullName: string; email: string; password: string }
type FormErrors = Partial<Record<keyof FormValues, string>>;

export function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [values, setValues] = useState<FormValues>({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [credentialsInvalid, setCredentialsInvalid] = useState(false);
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const navigateAfterAuth = () => {
    const from = (location.state as { from?: unknown } | null)?.from;
    navigate(typeof from === "string" && from.startsWith("/") ? from : "/", { replace: true });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    const fullName = values.fullName.trim();
    const email = values.email.trim();

    if (isRegistering) {
      if (!fullName) nextErrors.fullName = "Full name is required.";
      if (!email.includes("@") || !email.includes(".")) nextErrors.email = "Enter a valid email address.";
      if (values.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    } else if (!email.includes("@") || !email.includes(".") || values.password.length < 8) {
      setErrors({ email: "Enter valid login credentials.", password: "Enter valid login credentials." });
      setCredentialsInvalid(true);
      return;
    }
    setErrors(nextErrors);
    setCredentialsInvalid(false);
    if (Object.keys(nextErrors).length > 0) return;

    if (isRegistering) {
      if (register(fullName, email, values.password) === "exists") {
        setErrors({ email: "An account with this email already exists." });
        return;
      }
      addToast("ACCOUNT CREATED", "success");
      navigateAfterAuth();
      return;
    }

    const result = login(email, values.password);
    if (result === "not-found") {
      addToast("User with this email does not exist", "error");
      setCredentialsInvalid(true);
      return;
    }
    if (result === "invalid") {
      setCredentialsInvalid(true);
      setErrors({ email: "Email or password is incorrect.", password: "Email or password is incorrect." });
      return;
    }
    addToast("WELCOME BACK", "success");
    navigateAfterAuth();
  };

  const inputClass = (field: keyof FormValues): string =>
    `min-h-12 w-full border-b bg-transparent px-1 text-sm text-zara-black outline-none transition-colors placeholder:text-zara-gray focus:border-zara-black ${errors[field] || (credentialsInvalid && !isRegistering) ? "border-red-500 ring-1 ring-red-500" : "border-zara-border"}`;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center px-5 py-12">
      <h1 className="font-editorial text-center text-4xl text-zara-black">{isRegistering ? "Create account" : "Log in"}</h1>
      <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
        {isRegistering && <div>
          <label htmlFor="fullName" className="mb-2 block text-xs uppercase tracking-[0.16em] text-zara-gray">Full name</label>
          <input id="fullName" name="fullName" autoComplete="name" value={values.fullName} aria-invalid={Boolean(errors.fullName)} onChange={(event) => { setValues((current) => ({ ...current, fullName: event.target.value })); setErrors((current) => ({ ...current, fullName: undefined })); }} className={inputClass("fullName")} />
          {errors.fullName && <p className="mt-2 text-sm text-red-700" role="alert">{errors.fullName}</p>}
        </div>}
        <div>
          <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.16em] text-zara-gray">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={values.email} aria-invalid={Boolean(errors.email) || credentialsInvalid} onChange={(event) => { setValues((current) => ({ ...current, email: event.target.value })); setErrors((current) => ({ ...current, email: undefined })); setCredentialsInvalid(false); }} className={inputClass("email")} />
          {errors.email && <p className="mt-2 text-sm text-red-700" role="alert">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-[0.16em] text-zara-gray">Password</label>
          <input id="password" name="password" type="password" autoComplete={isRegistering ? "new-password" : "current-password"} value={values.password} aria-invalid={Boolean(errors.password) || credentialsInvalid} onChange={(event) => { setValues((current) => ({ ...current, password: event.target.value })); setErrors((current) => ({ ...current, password: undefined })); setCredentialsInvalid(false); }} className={inputClass("password")} />
          {errors.password && <p className="mt-2 text-sm text-red-700" role="alert">{errors.password}</p>}
        </div>
        <button type="submit" className="min-h-12 w-full bg-zara-black px-5 text-xs font-medium uppercase tracking-[0.16em] text-zara-white transition-colors hover:bg-zara-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black">
          {isRegistering ? "Register" : "Log in"}
        </button>
      </form>
      <button type="button" onClick={() => { setIsRegistering((current) => !current); setErrors({}); setCredentialsInvalid(false); }} className="mt-6 text-center text-xs uppercase tracking-[0.14em] text-zara-gray underline-offset-4 hover:text-zara-black hover:underline">
        {isRegistering ? "Already have an account? Log in" : "New to 10X Shop? Register"}
      </button>
      <Link to="/" className="mt-6 text-center text-xs uppercase tracking-[0.14em] text-zara-gray underline-offset-4 hover:text-zara-black hover:underline">Back to catalog</Link>
    </main>
  );
}
