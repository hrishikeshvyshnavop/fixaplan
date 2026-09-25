"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type NavLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  logo?: string;
  links?: NavLink[];
};

/*
 * Menu states, in order (styles and timings live in globals.css):
 *   closed     – white dot hidden behind the header pill, burger shows "="
 *   dropped    – dot drips down below the pill (0.8s), burger turns into "X"
 *   expanding  – 450ms later the dot stretches to fit the links (0.25s)
 *   open       – 250ms later the links fade in (0.3s)
 *   collapsing – on close, shrinks back to a dot (0.2s), then 200ms later → closed
 */
type MenuState = "closed" | "dropped" | "expanding" | "open" | "collapsing";

export default function Header({
  logo = "Brand.",
  links = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ],
}: HeaderProps) {
  const [state, setState] = useState<MenuState>("closed");
  const [menuWidth, setMenuWidth] = useState<number>();
  const [goo, setGoo] = useState(false);
  const linksRef = useRef<HTMLUListElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const isOpen = state !== "closed" && state !== "collapsing";

  function schedule(steps: [MenuState, number][]) {
    timers.current.forEach(clearTimeout);
    timers.current = steps.map(([next, delay]) => setTimeout(() => setState(next), delay));
  }

  function openMenu() {
    if (linksRef.current) setMenuWidth(linksRef.current.offsetWidth + 8);
    setState("dropped");
    schedule([
      ["expanding", 450],
      ["open", 700],
    ]);
  }

  function closeMenu() {
    setState("collapsing");
    schedule([["closed", 200]]);
  }

  // Like the original, the burger only responds when the menu is fully closed or fully open
  function toggle() {
    if (state === "closed") openMenu();
    else if (state === "open") closeMenu();
  }

  useEffect(() => {
    if (state !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      timers.current.forEach(clearTimeout);
      setState("collapsing");
      timers.current = [setTimeout(() => setState("closed"), 200)];
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state]);

  useEffect(() => {
    // The gooey filter renders badly in Safari, so it's skipped there (same as the original)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on the browser, unknown during SSR
    setGoo(!isSafari);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <header className="header-drop fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-[30px]">
      {/* Gooey filter: blur + alpha threshold melts the pill and the dot together */}
      <svg aria-hidden="true" className="absolute size-0">
        <filter id="header-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <nav
        data-state={state}
        className="header-menu relative text-neutral-900"
        // Only filter while the menu is moving or open, so the closed header isn't re-filtered on every scroll
        style={{ filter: goo && state !== "closed" ? "url(#header-goo)" : undefined }}
      >
        {/* Header pill */}
        <div className="relative z-10 flex items-center gap-[52px] rounded-xl bg-white p-4">
          <a href="#" className="text-xl leading-[0.95] font-semibold">
            {logo}
          </a>

          <div className="relative size-4">
            <span className="burger-line burger-top absolute left-0 h-0.5 w-4 rounded-full bg-black" />
            <span className="burger-line burger-bottom absolute left-0 h-0.5 w-4 rounded-full bg-black" />
            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="header-menu"
              onClick={toggle}
              className="absolute top-1/2 -left-3 size-10 -translate-y-1/2 cursor-pointer md:-left-[7px] md:size-[30px]"
            />
          </div>
        </div>

        {/* Dot that becomes the menu */}
        <div
          className="menu-blob z-0 flex items-center justify-center bg-white"
          style={menuWidth ? ({ "--menu-w": `${menuWidth}px` } as CSSProperties) : undefined}
        >
          <ul ref={linksRef} id="header-menu" className="flex flex-none items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                {/* Like the original, the menu stays open while the page scrolls to the section */}
                <a
                  href={link.href}
                  tabIndex={state === "open" ? undefined : -1}
                  className="menu-link flex w-[98px] items-center justify-center rounded-lg px-4 leading-[0.95] font-medium whitespace-nowrap hover:bg-black/10"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
