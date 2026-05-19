import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutMe() {
  const highlights = [
    {
      title: "Focus",
      description: "Fullstack web development",
    },
    {
      title: "Approach",
      description: "From idea to working product",
    },
    {
      title: "Mindset",
      description: "Keep it clear and useful",
    },
  ];

  return (
    <section id="about-me" className="border-t border-border bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:py-20 lg:px-8">
        <div className="soft-in">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            About me
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl">
            Building web apps from interface to backend logic.
          </h2>
        </div>

        <div className="soft-in space-y-8">
          <div className="space-y-5 text-base leading-7 text-muted-foreground">
            <p>
              Hi, I am Firyal, a junior fullstack web developer focused on
              building responsive interfaces and the backend logic that powers
              them. I enjoy turning ideas into useful web experiences with clear
              structure from the UI to the data flow.
            </p>
            <p>
              My current focus is strengthening my fullstack fundamentals,
              writing maintainable components, designing practical APIs, and
              learning how to ship better products with modern web tools.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <Card
                key={item.title}
                size="sm"
                className="interactive-card rounded-lg border border-border bg-background py-4 ring-0"
              >
                <CardHeader className="px-4">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <CardDescription className="text-sm leading-6">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
