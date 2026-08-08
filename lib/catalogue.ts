import type { CatalogueId } from "@/lib/types";

export interface CatalogueItem {
  id: CatalogueId;
  classification: "canon" | "expanded";
  category: "core" | "module";
  image?: string;
}

export const catalogue: CatalogueItem[] = [
  {
    id: "suspension",
    classification: "canon",
    category: "core",
    image: "/images/cryo-suite.png",
  },
  {
    id: "lucidDream",
    classification: "canon",
    category: "core",
    image: "/images/lucid-horizon.png",
  },
  { id: "memorySplice", classification: "expanded", category: "module" },
  { id: "dreamArchitecture", classification: "expanded", category: "module" },
  { id: "lifeArchive", classification: "expanded", category: "module" },
];

export const corePrograms = catalogue.filter((item) => item.category === "core");
export const modules = catalogue.filter((item) => item.category === "module");
