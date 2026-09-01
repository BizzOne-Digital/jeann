import Image from "next/image";
import Link from "next/link";
import {
  getOrderedPackagingTypes,
  isHomepageFeaturedPackaging,
  type PackagingTypeContent,
} from "@/lib/content/packaging-content";

const CATEGORY_LABELS = {
  transport: "Transport & logistics modes",
  product: "Product packaging formats",
} as const;

function PackagingIndexGroup({
  title,
  types,
}: {
  title: string;
  types: PackagingTypeContent[];
}) {
  if (types.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold tracking-[0.12em] text-[#001a3d] uppercase">
        {title}
      </h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {types.map((type) => {
          const featured = isHomepageFeaturedPackaging(type.slug);
          const image = type.images[0];

          return (
            <li key={type.slug}>
              <Link
                href={`#${type.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#d5d0c8] bg-white transition hover:border-[#c88e4a]/50 hover:shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-[#e4e0d8]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 50vw, 240px"
                  />
                  {featured ? (
                    <span className="absolute top-2 left-2 rounded bg-[#001a3d]/90 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
                      Homepage
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-sm font-semibold text-[#001a3d] group-hover:text-[#c88e4a]">
                    {type.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#666666]">
                    {type.summary}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PackagingTypeIndex() {
  const types = getOrderedPackagingTypes();
  const transport = types.filter((type) => type.category === "transport");
  const product = types.filter((type) => type.category === "product");

  return (
    <nav id="packaging-index" aria-label="Packaging type index" className="scroll-mt-28">
      <div className="space-y-10">
        <PackagingIndexGroup title={CATEGORY_LABELS.transport} types={transport} />
        <PackagingIndexGroup title={CATEGORY_LABELS.product} types={product} />
      </div>
    </nav>
  );
}
