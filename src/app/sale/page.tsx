import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shop/PageHeader";
import { ListingSkeleton, ProductListing } from "@/components/shop/ProductListing";
import { getSaleProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Sale",
  description: "Selected VELORA pieces, now reduced. Limited sizes — when they're gone, they're gone.",
  alternates: { canonical: "/sale" },
};

export default function SalePage() {
  return (
    <>
      <section className="bg-rose text-ivory">
        <div className="container-velora py-4 text-center text-[0.7rem] font-semibold tracking-[0.25em] uppercase">
          Up to 30% off selected styles · Final sizes going fast
        </div>
      </section>
      <PageHeader
        title="The Sale"
        eyebrow="Limited time"
        intro="Our favourite pieces at softer prices. Limited sizes — when they’re gone, they’re gone."
        crumbs={[{ label: "Home", href: "/" }, { label: "Sale" }]}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing products={getSaleProducts()} hideSaleToggle />
      </Suspense>
    </>
  );
}
