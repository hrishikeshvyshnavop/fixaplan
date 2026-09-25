"use client";

import { useActionState, useEffect, useId, useRef, useState, type ComponentProps, type FormEvent } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/waitlist/actions";
import { WAITLIST_HASH } from "@/app/waitlist/constants";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/*
 * Modal states (styles and timings live in globals.css, measured from the original):
 *   closed  – not rendered (native <dialog> closed)
 *   opening – shown, card still below the screen; next frame → open
 *   open    – card rises from the bottom, backdrop fades in; as it lands the close button
 *             drips up out of the card (gooey filter) and its X fades in
 *   closing – card drops back down, backdrop fades out; then → closed
 */
type ModalState = "closed" | "opening" | "open" | "closing";

const CLOSE_MS = 400;
// Card rise + close-button drip; the gooey filter is only needed while they move
const OPEN_ANIMATION_MS = 1000;

export default function WaitlistDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<ModalState>("closed");
  const [animating, setAnimating] = useState(false);
  const [goo, setGoo] = useState(false);
  // Bumped after a successful signup, so the next open starts with an empty form
  const [formKey, setFormKey] = useState(0);
  const submitted = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function open() {
    clearTimeout(timer.current);
    setState((s) => (s === "open" ? s : "opening"));
  }

  function close() {
    clearTimeout(timer.current);
    setState("closing");
    timer.current = setTimeout(() => {
      setState("closed");
      if (submitted.current) {
        submitted.current = false;
        setFormKey((k) => k + 1);
      }
    }, CLOSE_MS);
  }

  // Open from any "#waitlist" link. Capture phase, so Lenis doesn't try to scroll to the hash.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (link?.getAttribute("href") !== WAITLIST_HASH) return;
      e.preventDefault();
      e.stopPropagation();
      open();
    };
    document.addEventListener("click", onClick, true);
    // The gooey filter renders badly in Safari, so it's skipped there (same as the header)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on the browser, unknown during SSR
    setGoo(!isSafari);
    // Shared links like fixaplan.com/#waitlist open it straight away
    if (window.location.hash === WAITLIST_HASH) open();
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(timer.current);
    };
  }, []);

  // Drive the native dialog (focus trap, top layer) and pause page scrolling while it's up
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (state === "closed") {
      if (dialog.open) dialog.close();
      return;
    }
    if (state !== "opening") return;

    if (!dialog.open) dialog.showModal();
    // Lay out the start position now, so the card has somewhere to animate from
    void dialog.offsetHeight;
    // Only jump into the field with a mouse — on phones it would throw the keyboard up at once
    if (window.matchMedia("(pointer: fine)").matches) {
      dialog.querySelector<HTMLElement>("#waitlist-name")?.focus({ preventScroll: true });
    }
    // One frame in the start position, then animate to open
    const frame = requestAnimationFrame(() => {
      setState("open");
      setAnimating(true);
    });
    const done = setTimeout(() => setAnimating(false), OPEN_ANIMATION_MS);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(done);
    };
  }, [state]);

  // Lenis (autoToggle) stops while the page can't overflow
  const visible = state !== "closed";
  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [visible]);

  return (
    <dialog
      ref={dialogRef}
      data-state={state}
      aria-labelledby="waitlist-title"
      data-lenis-prevent
      // Esc: play the closing animation instead of vanishing
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      className="waitlist-modal fixed inset-0 m-0 size-full max-h-none max-w-none overflow-clip bg-transparent p-0"
    >
      {/* Gooey filter: melts the close button and the card together while the button drips out */}
      <svg aria-hidden="true" className="absolute size-0">
        <filter id="waitlist-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      {/* overflow-clip (not hidden) so focusing a field in the off-screen card can't scroll the dialog */}
      {/* Like the original, clicking the backdrop doesn't close the modal (so nothing typed is lost) */}
      <div aria-hidden="true" className="waitlist-backdrop absolute inset-0 bg-black/20 backdrop-blur-[4px]" />

      <div
        className="waitlist-card-wrap absolute bottom-[30px] left-1/2 w-[456px] max-md:left-4 max-md:w-[calc(100%-32px)]"
        style={{ filter: goo && animating ? "url(#waitlist-goo)" : undefined }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="waitlist-close absolute left-1/2 flex cursor-pointer items-center justify-center bg-white text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg
            className="waitlist-close-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="waitlist-card relative max-h-[calc(100dvh-124px)] overflow-y-auto rounded-xl bg-white px-10 py-[30px] text-black max-md:p-5">
          <WaitlistForm key={formKey} onSubmitted={() => (submitted.current = true)} />
        </div>
      </div>
    </dialog>
  );
}

type ButtonState = "default" | "loading" | "success" | "error";

function WaitlistForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [state, formAction, pending] = useActionState<WaitlistState, FormData>(joinWaitlist, { status: "idle" });
  // Controlled, so React doesn't clear what was typed when the server sends back an error
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hint, setHint] = useState("");
  // A server error shows on the button until the person edits a field again
  const [serverError, setServerError] = useState(false);
  const [lastState, setLastState] = useState(state);
  const hintId = useId();

  if (state !== lastState) {
    setLastState(state);
    if (state.status === "error") setServerError(true);
    if (state.status === "joined") onSubmitted();
  }

  const button: ButtonState = pending
    ? "loading"
    : state.status === "joined"
      ? "success"
      : serverError
        ? "error"
        : "default";

  function edit(set: (v: string) => void, value: string) {
    set(value);
    setHint("");
    setServerError(false);
  }

  // Catch a missing or mistyped email instantly instead of waiting for the server
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (button === "success" || button === "loading") return e.preventDefault();
    const value = email.trim();
    const message = !value
      ? "Add your email so we can reach you."
      : !EMAIL.test(value)
        ? "That email doesn’t look quite right — mind checking it?"
        : "";
    if (message) {
      e.preventDefault();
      setHint(message);
      e.currentTarget.querySelector<HTMLElement>("#waitlist-email")?.focus();
    }
  }

  return (
    <div className="flex flex-col gap-10 font-medium">
      <div className="flex flex-col gap-3">
        <h2 id="waitlist-title" className="text-[28px] leading-[0.95] font-semibold">
          You’re invited to Fixa
        </h2>
        <p className="leading-[1.3] text-black/60">Get early access to Fixa and be the first to try it.</p>
      </div>

      <form action={formAction} onSubmit={onSubmit} noValidate className="relative flex flex-col gap-[60px]">
        <div className="relative flex flex-col gap-4">
          <Field
            id="waitlist-name"
            label="Your first name"
            name="name"
            type="text"
            autoComplete="given-name"
            maxLength={80}
            placeholder="First Name"
            value={name}
            onChange={(v) => edit(setName, v)}
          />
          <Field
            id="waitlist-email"
            label="Your e-mail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="E-mail"
            value={email}
            onChange={(v) => edit(setEmail, v)}
            invalid={!!hint}
            describedBy={hint ? hintId : undefined}
          />
          {/* Sits in the gap above the button, so nothing shifts when it appears */}
          <p id={hintId} aria-live="polite" className="absolute top-full px-4 pt-2.5 text-sm leading-[1.3] text-[#e5484d]">
            {hint}
          </p>
        </div>

        {/* Honeypot: hidden from people and screen readers, bots tend to fill it in */}
        <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
          <label>
            Company
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-col items-center gap-3">
          <SubmitButton state={button} />
          <p className="text-sm leading-[1.2] text-[#7f7f7f]">By signing up, you’re agreeing to our terms</p>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
} & Omit<ComponentProps<"input">, "id" | "value" | "onChange">;

function Field({ id, label, value, onChange, invalid, describedBy, ...input }: FieldProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="pl-4 text-sm leading-[1.3] text-black/40">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...input}
        // Focus: 1px #0099ff border drawn inside the edge, no fade — same as the original's Framer input
        className="h-[50px] w-full rounded-[10px] bg-[#f2f2f2] px-3 text-base leading-[1.3] text-black caret-black outline-none placeholder:text-black/60 focus:inset-ring-1 focus:inset-ring-[#0099ff] aria-invalid:inset-ring-1 aria-invalid:inset-ring-[#e5484d]/60 aria-invalid:focus:inset-ring-[#e5484d]"
      />
    </div>
  );
}

// Same states as the original's Framer button: Default, Loading, Success, Error
function SubmitButton({ state }: { state: ButtonState }) {
  const label = {
    default: "Join the waitlist",
    loading: "Joining…",
    success: "Submitted",
    error: "Something went wrong",
  }[state];

  return (
    <button
      type="submit"
      data-state={state}
      aria-disabled={state === "loading" || state === "success" || undefined}
      className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#1a1a1a] text-base leading-[1.2] text-white transition-[background-color,color,opacity] duration-200 ease-[cubic-bezier(0.44,0,0.56,1)] hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a] data-[state=error]:bg-[rgba(204,204,204,0.15)] data-[state=error]:text-[#696969] data-[state=loading]:cursor-default data-[state=success]:cursor-default"
    >
      {state === "loading" ? (
        <>
          <Spinner />
          <span className="sr-only">{label}</span>
        </>
      ) : (
        <span aria-live="polite">{label}</span>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="size-5 animate-spin" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M18 10a8 8 0 0 0-8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
