import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLinkIcon, GitForkIcon, StarIcon } from "lucide-react";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  topics?: string[];
};

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "Firyal-dev";

async function getRepositories() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=12`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const repos = (await response.json()) as GitHubRepo[];

    return repos
      .filter((repo) => !repo.fork && !repo.archived)
      .slice(0, 6);
  } catch {
    return [];
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function Projects() {
  const repositories = await getRepositories();

  return (
    <section id="projects" className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="soft-in flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Projects
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl">
              Recent work from my GitHub repositories.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              A selection of projects that reflect how I build, learn, and
              solve problems through code.
            </p>
          </div>

          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            GitHub profile
            <ExternalLinkIcon className="size-4" />
          </a>
        </div>

        {repositories.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {repositories.map((repo) => (
              <Card
                key={repo.id}
                className="interactive-card rounded-lg border border-border bg-background py-0 ring-0"
              >
                <CardHeader className="border-b border-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground">
                        {repo.name}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2 leading-6">
                        {repo.description ?? "No description provided yet."}
                      </CardDescription>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${repo.name} on GitHub`}
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <ExternalLinkIcon className="size-4" />
                    </a>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-wrap items-center gap-3 p-5 text-sm text-muted-foreground">
                  {repo.language && (
                    <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 font-medium text-foreground">
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <StarIcon className="size-4" />
                    {repo.stargazers_count}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GitForkIcon className="size-4" />
                    {repo.forks_count}
                  </span>
                  <span className="ml-auto">Updated {formatDate(repo.pushed_at)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="interactive-card mt-10 rounded-lg border border-border bg-background ring-0">
            <CardContent className="p-5 text-sm leading-6 text-muted-foreground">
              GitHub repositories could not be loaded right now. Set
              <span className="font-medium text-foreground"> GITHUB_USERNAME </span>
              if you want to use a different account.
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
