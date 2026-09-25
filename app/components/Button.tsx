import type { ComponentProps, ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type ButtonProps =
  | (BaseProps & { href: string } & Omit<ComponentProps<"a">, keyof BaseProps>)
  | (BaseProps & { href?: undefined } & Omit<ComponentProps<"button">, keyof BaseProps>);

const outer = "group inline-flex cursor-pointer items-center justify-center";

// On hover the corners grow from 12px to 20px and the button shrinks slightly
const inner =
  "squircle flex h-[42px] w-[140px] items-center justify-center bg-white px-4 text-base leading-[0.95] font-medium tracking-[-0.02em] whitespace-nowrap text-neutral-900 [--radius:12px] transition-[border-radius,scale] duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:scale-95 group-hover:[--radius:20px] group-focus-visible:scale-95 group-focus-visible:[--radius:20px]";

export default function Button({ children, className = "", ...props }: ButtonProps) {
  const content = <span className={inner}>{children}</span>;

  if (props.href !== undefined) {
    return (
      <a {...(props as ComponentProps<"a">)} className={`${outer} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...(props as ComponentProps<"button">)}
      className={`${outer} ${className}`}
    >
      {content}
    </button>
  );
}
