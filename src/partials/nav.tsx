"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function Nav() {
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About Me", href: "#about-me" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 shadow-sm shadow-foreground/5 backdrop-blur transition-colors">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#home" className="text-base font-extrabold tracking-normal">
          firyal.dev
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex min-w-max items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden md:inline-flex"
          >
            <Link href="mailto:firyal.dev@gmail.com">Email me</Link>
          </Button>

          {/* mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>firyal.dev</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <SheetClose key={item.label} asChild>
                    <a
                      href={item.href}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </div>

              <SheetFooter>
                <div className="grid gap-2">
                  <a
                    href="https://github.com/Firyal-dev"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Firyal on GitHub"
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-4 fill-current"
                    >
                      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.01c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.81c0 .27.18.59.69.49A10.18 10.18 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/firyal.dev/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Firyal on Instagram"
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-4 fill-current"
                    >
                      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/firyal-muhammad-azka-546096373/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Firyal on LinkedIn"
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-4 fill-current"
                    >
                      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8h4.2v13H.4V8Zm7 0h4.02v1.78h.06c.56-1.06 1.94-2.18 3.99-2.18 4.27 0 5.06 2.81 5.06 6.47V21h-4.2v-6.14c0-1.46-.03-3.35-2.04-3.35-2.04 0-2.35 1.6-2.35 3.25V21H7.4V8Z" />
                    </svg>
                  </a>
                </div>
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="mailto:firyal.dev@gmail.com">Email me</Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
