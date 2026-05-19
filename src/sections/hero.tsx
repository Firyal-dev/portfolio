import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { MailIcon } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="mx-auto grid min-h-[calc(100svh-65px)] w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:py-16 lg:px-8"
    >
      <div className="soft-in order-2 max-w-2xl text-center md:order-1 md:text-left">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Portfolio
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
          Firyal Muhammad Azka
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-muted-foreground sm:text-2xl">
          Junior Fullstack Web Developer
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
          I build clean, responsive web applications with a focus on structure,
          usability, and maintainable code.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
          <Link
            href="#projects"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            View projects
          </Link>
          <Link
            href="#about-me"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            About me
          </Link>
        </div>
        <div className="mt-5 flex justify-center gap-2 md:justify-start">
          <a
            href="mailto:firyal.dev@gmail.com"
            aria-label="Email Firyal"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <MailIcon className="size-4" />
          </a>
          <a
            href="https://github.com/Firyal-dev"
            target="_blank"
            rel="noreferrer"
            aria-label="Firyal on GitHub"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.01c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.81c0 .27.18.59.69.49A10.18 10.18 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/firyal.dev/"
            target="_blank"
            rel="noreferrer"
            aria-label="Firyal on Instagram"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
              <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/firyal-muhammad-azka-546096373/"
            target="_blank"
            rel="noreferrer"
            aria-label="Firyal on LinkedIn"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8h4.2v13H.4V8Zm7 0h4.02v1.78h.06c.56-1.06 1.94-2.18 3.99-2.18 4.27 0 5.06 2.81 5.06 6.47V21h-4.2v-6.14c0-1.46-.03-3.35-2.04-3.35-2.04 0-2.35 1.6-2.35 3.25V21H7.4V8Z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="order-1 flex justify-center md:order-2 md:justify-end">
        <div className="interactive-card soft-in relative aspect-square w-full max-w-70 overflow-hidden rounded-lg border border-border bg-muted sm:max-w-90 lg:max-w-105">
          <Tooltip>
            <TooltipTrigger>
              <Image
                src="/profile-nobg.png"
                alt="Firyal Muhammad Azka"
                width={420}
                height={420}
                priority
                className="h-full w-full object-contain object-bottom p-3 grayscale"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Hello, it&apos;s me Firyal!</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </section>
  );
}
