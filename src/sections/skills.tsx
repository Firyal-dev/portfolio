import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SKILL_GROUPS = [
  {
    title: "Frontend",
    skills: ["Next.js", "React"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Laravel", "Golang"],
  },
  {
    title: "Database",
    skills: ["MySQL", "PostgreSQL", "MongoDB"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div className="soft-in">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Skills
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl">
              Tools I use to build fullstack web applications.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              A focused set of technologies for building interfaces, APIs, and
              database-backed applications.
            </p>
          </div>

          <div className="soft-in grid gap-4 sm:grid-cols-3">
            {SKILL_GROUPS.map((group) => (
              <Card
                key={group.title}
                className="interactive-card rounded-lg border border-border bg-background py-0 ring-0"
              >
                <CardHeader className="border-b border-border p-4">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {group.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 p-4">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
