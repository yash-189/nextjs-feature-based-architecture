import Link from "next/link";
import { Routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { buttonVariants } from "@/ui/primitives/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="font-semibold text-4xl tracking-tight">{site.name}</h1>
      <p className="text-lg text-muted-foreground">{site.description}</p>
      <div>
        <Link href={Routes.dashboard} className={buttonVariants()}>
          Open the app
        </Link>
      </div>
    </main>
  );
}
