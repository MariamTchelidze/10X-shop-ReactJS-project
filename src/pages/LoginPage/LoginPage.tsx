import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface LoginValues {
  username: string;
  password: string;
}

interface LoginErrors {
  username?: string;
  password?: string;
}

export function LoginPage() {
  const [values, setValues] = useState<LoginValues>({ username: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};
    const username = values.username.trim();

    if (!username) {
      nextErrors.username = "Username is required";
    }

    if (!values.password) {
      nextErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    login(username);
    const from = (location.state as { from?: unknown } | null)?.from;
    const destination = typeof from === "string" && from.startsWith("/") ? from : "/";
    navigate(destination, { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center px-5 py-12">
      <h1 className="font-editorial text-center text-4xl text-zara-black">Log in</h1>
      <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-xs uppercase tracking-[0.16em] text-zara-gray"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={values.username}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "username-error" : undefined}
            onChange={(event) => {
              setValues((current) => ({ ...current, username: event.target.value }));
              setErrors((current) => ({ ...current, username: undefined }));
            }}
            className="min-h-12 w-full border-b border-zara-border bg-transparent px-1 text-sm text-zara-black outline-none transition-colors placeholder:text-zara-gray focus:border-zara-black"
          />
          {errors.username && (
            <p id="username-error" className="mt-2 text-sm text-red-700" role="alert">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs uppercase tracking-[0.16em] text-zara-gray"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            onChange={(event) => {
              setValues((current) => ({ ...current, password: event.target.value }));
              setErrors((current) => ({ ...current, password: undefined }));
            }}
            className="min-h-12 w-full border-b border-zara-border bg-transparent px-1 text-sm text-zara-black outline-none transition-colors placeholder:text-zara-gray focus:border-zara-black"
          />
          {errors.password && (
            <p id="password-error" className="mt-2 text-sm text-red-700" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="min-h-12 w-full bg-zara-black px-5 text-xs font-medium uppercase tracking-[0.16em] text-zara-white transition-colors hover:bg-zara-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
        >
          Log in
        </button>
      </form>
      <Link
        to="/"
        className="mt-8 text-center text-xs uppercase tracking-[0.14em] text-zara-gray underline-offset-4 hover:text-zara-black hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
      >
        Back to catalog
      </Link>
    </main>
  );
}
