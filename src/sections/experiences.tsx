import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const experiences = [
  {
    role: "Frontend Developer",
    company: "Dinas Komunikasi dan Informatika Kota Bogor",
    type: "Internship",
    period: "Jan 2026 - Mar 2026",
    duration: "3 months",
    location:
      "Jl. Ir. H. Juanda No.10, Pabaton, Bogor Tengah, Kota Bogor, Jawa Barat 16121",
    workType: "On-site",
    responsibilities: [
      "Search engine optimization through the implementation of metadata and Open Graph images.",
      "Implemented responsive design using Tailwind CSS.",
      "Integrated NPM libraries to improve user interactivity.",
      "Managed data using REST APIs.",
    ],
  },
  {
    role: "Backend Developer",
    company: "Dinas Komunikasi dan Informatika Kota Bogor",
    type: "Internship",
    period: "Aug 2025 - Oct 2025",
    duration: "3 months",
    location:
      "Jl. Ir. H. Juanda No.10, Pabaton, Bogor Tengah, Kota Bogor, Jawa Barat 16121",
    workType: "On-site",
    responsibilities: [
      "Designed and normalized database structures.",
      "Created APIs to manage application data.",
      "Optimized Laravel database queries through indexing.",
      "Authorized access rights for user roles.",
    ],
  },
];

export default function Experiences() {
  return (
    <section id="experience" className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="soft-in max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Experience
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl">
            Practical work across frontend and backend development.
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Internship experience building web features, managing APIs, and
            improving application structure for Diskominfo Kota Bogor.
          </p>
        </div>

        <div className="mt-10 grid gap-4">
          {experiences.map((experience) => (
            <Card
              key={`${experience.role}-${experience.period}`}
              className="interactive-card rounded-lg border border-border bg-background py-0 ring-0"
            >
              <CardHeader className="gap-4 border-b border-border p-5 sm:grid-cols-[1fr_auto]">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {experience.role}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6">
                    {experience.company} - {experience.type}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1 text-left sm:text-right">
                  <span className="text-sm font-medium text-foreground">
                    {experience.period}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {experience.duration}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="grid gap-6 p-5 md:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-2 text-sm leading-6 text-muted-foreground">
                  <p>{experience.location}</p>
                  <p className="font-medium text-foreground">
                    {experience.workType}
                  </p>
                </div>

                <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                  {experience.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
