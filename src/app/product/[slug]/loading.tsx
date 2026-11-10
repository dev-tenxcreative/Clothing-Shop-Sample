export default function Loading() {
  return (
    <div className="container-velora pt-4" aria-busy="true" aria-label="Loading product">
      <div className="skeleton h-4 w-56" />
      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="grid gap-4 md:grid-cols-[84px_1fr] lg:col-span-7">
          <div className="hidden flex-col gap-3 md:flex">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton aspect-[3/4]" />
            ))}
          </div>
          <div className="skeleton aspect-[3/4]" />
        </div>
        <div className="space-y-5 lg:col-span-5">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-12 w-4/5" />
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
