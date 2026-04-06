import Link from "next/link"
import { getSolutionCategories } from "@/lib/actions/solution-actions"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cpu, Film, FlaskConical, Microscope, Shield, Wrench } from "lucide-react"

const categoryIcons: Record<string, React.ReactNode> = {
  "medya-eglence": <Film className="size-6" />,
  "muhendislik": <Wrench className="size-6" />,
  "ai-hpc": <Cpu className="size-6" />,
  "yasam-bilimleri": <Microscope className="size-6" />,
  "adli-bilisim": <Shield className="size-6" />,
}

export default async function SolutionsPage() {
  const categories = await getSolutionCategories()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Çözümler
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Her sektör ve iş akışı için optimize edilmiş yüksek performanslı donanım çözümleri
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative flex flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {categoryIcons[cat.slug] || <FlaskConical className="size-6" />}
              </div>
              <h2 className="text-xl font-semibold">{cat.name}</h2>
              {cat.children.length > 0 && (
                <ul className="mt-3 flex-1 space-y-1.5">
                  {cat.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/cozumler/kategori/${child.slug}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 pt-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/cozumler/kategori/${cat.slug}`}>
                    Tümünü Gör <ArrowRight className="ml-1 size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
