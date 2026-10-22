import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface ProfileDetails { name: string; email: string; address: string }

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const storageKey = `10x-shop-profile-${user.username}`;
  const [details, setDetails] = useState<ProfileDetails>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) as ProfileDetails : { name: user.username, email: "", address: "" };
    } catch {
      return { name: user.username, email: "", address: "" };
    }
  });
  const [saved, setSaved] = useState(false);

  const update = (field: keyof ProfileDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(details));
    setSaved(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-8 border-b border-zara-border pb-5 font-editorial text-3xl text-zara-black sm:text-4xl">My account</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {(["name", "email", "address"] as const).map((field) => (
          <div key={field}>
            <label htmlFor={`profile-${field}`} className="mb-2 block text-xs uppercase tracking-widest text-zara-gray">{field === "name" ? "Name" : field === "email" ? "Email" : "Delivery address"}</label>
            <input id={`profile-${field}`} type={field === "email" ? "email" : "text"} value={details[field]} onChange={(event) => update(field, event.target.value)} className="min-h-12 w-full border-b border-zara-border bg-transparent px-1 text-sm outline-none focus:border-zara-black" />
          </div>
        ))}
        <button type="submit" className="min-h-12 bg-zara-black px-7 text-xs uppercase tracking-widest text-zara-white">Save details</button>
        {saved && <p role="status" className="text-sm text-zara-gray">Your details have been saved.</p>}
      </form>
      <div className="mt-10 flex flex-wrap gap-4 border-t border-zara-border pt-6">
        <Link to="/orders" className="min-h-11 border border-zara-black px-5 py-3 text-xs uppercase tracking-widest">My orders</Link>
        <button type="button" onClick={() => { logout(); navigate("/"); }} className="min-h-11 px-5 text-xs uppercase tracking-widest text-zara-gray underline underline-offset-4">Logout</button>
      </div>
    </main>
  );
}
