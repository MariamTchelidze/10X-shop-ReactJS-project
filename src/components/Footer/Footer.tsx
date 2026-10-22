import { Link } from "react-router-dom";

const helpLinks = [
  { label: "Help & FAQ", href: "mailto:support@10xshop.com?subject=Help%20and%20FAQ" },
  { label: "Contact Us", href: "mailto:support@10xshop.com?subject=Contact%20Us" },
  { label: "Return as a Guest", href: "/" },
  { label: "Search for Store Receipt", href: "mailto:support@10xshop.com?subject=Store%20Receipt" },
  { label: "Request an Invoice", href: "mailto:support@10xshop.com?subject=Request%20an%20Invoice" },
];

const brandLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Work With Us", href: "mailto:careers@10xshop.com?subject=Work%20With%20Us" },
];

const interestLinks = [
  { label: "Women", href: "/?category=womens-dresses&page=1" },
  { label: "Men", href: "/?category=mens-shirts&page=1" },
  { label: "Teen", href: "/?category=tops&page=1" },
  { label: "Kids", href: "/?category=sports-accessories&page=1" },
  { label: "Home", href: "/?category=home-decoration&page=1" },
];

const legalLinks = [
  "Terms and Conditions",
  "Privacy Policy",
  "Cookies Policy",
  "Sitemap",
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "Facebook", href: "https://www.facebook.com/" },
  { name: "Twitter", href: "https://www.twitter.com/" },
  { name: "TikTok", href: "https://www.tiktok.com/" },
  { name: "YouTube", href: "https://www.youtube.com/" },
  { name: "Pinterest", href: "https://www.pinterest.com/" },
  { name: "Spotify", href: "https://open.spotify.com/" },
] as const;

const footerLinkClass =
  "text-xs text-zara-gray transition-colors duration-200 hover:text-zara-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black";

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <section>
      <h2 className="mb-5 text-[11px] font-medium uppercase tracking-[0.16em] text-zara-black">
        {title}
      </h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("mailto:") ? (
              <a href={link.href} className={footerLinkClass}>
                {link.label}
              </a>
            ) : (
              <Link to={link.href} className={footerLinkClass}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SocialIcon({ name }: { name: (typeof socialLinks)[number]["name"] }) {
  const iconClass = "h-4 w-4 fill-current";

  switch (name) {
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
        </svg>
      );
    case "Twitter":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path d="M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.7 1 4.1 4.1 0 0 0-7 3.7 11.7 11.7 0 0 1-8.5-4.3 4.1 4.1 0 0 0 1.3 5.5 4.1 4.1 0 0 1-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4.2 4.2 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.5a11.7 11.7 0 0 0 18-9.9v-.5A8.4 8.4 0 0 0 22 5.9Z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path d="M19.6 7.2a6.9 6.9 0 0 1-4.2-1.4v8.1a5.6 5.6 0 1 1-4.8-5.5v3a2.6 2.6 0 1 0 1.8 2.5V2.5h3a4 4 0 0 0 4.2 3.8v.9Z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
        </svg>
      );
    case "Pinterest":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.7l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.8 0 1.2.6 1.2 1.4 0 .8-.5 2-.8 3.1-.2.9.5 1.6 1.4 1.6 1.7 0 3-1.8 3-4.4 0-2.3-1.7-3.8-4-3.8-2.8 0-4.4 2.1-4.4 4.3 0 .9.3 1.9.8 2.4.1.2.2.4.1.6l-.3 1.1c-.1.4-.3.5-.7.3-1.2-.6-1.9-2.4-1.9-3.9 0-3.2 2.3-6.2 6.7-6.2 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.4-5.2 6.4-1 0-2-.6-2.4-1.2l-.7 2.7c-.3 1-.9 2-1.3 2.8A10 10 0 1 0 12 2Z" />
        </svg>
      );
    case "Spotify":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.8.8 0 0 1-1.1.3 9.8 9.8 0 0 0-7.7-.9.8.8 0 1 1-.5-1.5 11.4 11.4 0 0 1 9 1.1.8.8 0 0 1 .3 1Zm1.2-2.7a1 1 0 0 1-1.3.3 12 12 0 0 0-9.3-1.1 1 1 0 1 1-.6-1.8 14 14 0 0 1 10.9 1.3 1 1 0 0 1 .3 1.3Zm.1-2.8a1.2 1.2 0 0 1-1.6.4 14.5 14.5 0 0 0-10.9-1.2 1.2 1.2 0 1 1-.7-2.3 17 17 0 0 1 12.8 1.4 1.2 1.2 0 0 1 .4 1.7Z" />
        </svg>
      );
  }
}

export function Footer() {
  return (
    <footer className="border-t border-zara-border bg-zara-white text-zara-black">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-12">
          <FooterSection title="Do you need help?" links={helpLinks} />
          <FooterSection title="We are 10X Shop" links={brandLinks} />
          <FooterSection title="You might be interested in" links={interestLinks} />
        </div>

        <nav aria-label="Social media" className="mt-10 flex flex-wrap gap-2 sm:mt-12 lg:justify-end">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zara-black text-zara-white transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black"
            >
              <SocialIcon name={social.name} />
            </a>
          ))}
        </nav>

        <div className="mt-10 border-t border-zara-border pt-6 sm:mt-12">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-3">
            {legalLinks.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replaceAll(" ", "-")}`}
                className="text-[10px] uppercase tracking-[0.12em] text-zara-gray transition-colors hover:text-zara-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zara-black sm:text-xs"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3 text-[10px] uppercase tracking-[0.12em] text-zara-gray sm:flex-row sm:items-center sm:justify-between sm:text-xs">
            <span>GEORGIA <span aria-hidden="true">|</span> GEORGIAN</span>
            <span>© 2026 10X SHOP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
