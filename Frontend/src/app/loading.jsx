import React from "react";

const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse rounded-md bg-stone-300/80 ${className}`} />
);

const ProductCardSkeleton = () => (
    <div className="card flex h-96 w-72 shrink-0 flex-col justify-around bg-amber-50">
        <Skeleton className="h-64 w-full rounded-lg bg-stone-200" />
        <div className="flex justify-center px-4">
            <Skeleton className="h-4 w-3/4 bg-stone-200" />
        </div>
    </div>
);

const GalleryCardSkeleton = ({ featured = false }) => (
    <div
        className={`relative flex min-h-[340px] animate-pulse flex-col overflow-hidden rounded-[1.75rem] bg-stone-300 p-6 sm:p-8 ${
            featured ? "md:row-span-2 md:min-h-[580px]" : "md:min-h-[280px]"
        }`}
    >
        <div className="mt-auto space-y-4">
            <Skeleton className="h-3 w-32 bg-white/30" />
            <Skeleton className="h-8 w-3/4 bg-white/30" />
            <Skeleton className="h-4 w-full max-w-sm bg-white/20" />
            <Skeleton className="h-4 w-2/3 max-w-xs bg-white/20" />
        </div>
    </div>
);

export default function Loading() {
    return (
        <main className="min-h-screen bg-amber-50">

            {/* Hero and Header Skeleton */}
            <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gray-900">

                <header className="relative z-10 flex w-full items-center justify-around px-3 py-4 sm:px-5 sm:py-5 md:px-8">

                    <div className="m-auto flex shrink-0 items-center justify-center">
                        <Skeleton className="h-12 w-20 bg-white/15 sm:w-24" />
                    </div>

                    <div className="flex w-[70vw] min-w-0 flex-1 justify-center px-2 sm:px-3 md:w-[70vw] md:flex-none">
                        <div className="flex h-10 w-full items-center rounded-2xl border border-white/20 bg-white/10 p-1 sm:h-12">
                            <Skeleton className="h-7 w-full bg-white/10" />
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
                        <Skeleton className="size-9 rounded-full bg-white/15" />
                        <Skeleton className="size-9 rounded-full bg-white/15" />
                        <Skeleton className="size-9 rounded-full bg-white/15" />
                    </div>
                </header>

                {/* Hero Text and Buttons */}
                <div className="flex flex-1 items-center px-4 pt-20 sm:px-6 sm:pt-16 md:px-8 lg:px-10">
                    <div className="w-full max-w-6xl p-4 sm:w-[55vw] sm:p-6 md:p-8">
                        <Skeleton className="mb-3 h-10 w-full max-w-lg bg-white/15 sm:h-12 md:h-16 lg:h-20" />
                        <Skeleton className="h-10 w-4/5 max-w-md bg-white/15 sm:h-12 md:h-16 lg:h-20" />

                        <div className="mt-5 space-y-3">
                            <Skeleton className="h-4 w-full max-w-md bg-white/15" />
                            <Skeleton className="h-4 w-3/4 max-w-sm bg-white/15" />
                        </div>

                        <div className="my-5 flex gap-2">
                            <Skeleton className="h-12 w-32 rounded-3xl bg-white/20" />
                            <Skeleton className="h-12 w-28 rounded-3xl bg-white/15" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Skeleton */}
            <section className="h-auto w-full bg-amber-50 px-6 py-5 md:p-10">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-36 bg-stone-300" />
                    <Skeleton className="h-8 w-full max-w-md bg-stone-200 sm:h-10" />
                </div>

                <div className="product-list mt-5 flex w-auto gap-2 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </section>

            {/* Image Gallery Skeleton */}
            <section className="w-full bg-[#f4f1eb] px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
                        <div className="w-full space-y-4">
                            <Skeleton className="h-3 w-36 bg-stone-300" />
                            <Skeleton className="h-9 w-full max-w-xl bg-stone-300 sm:h-12" />
                        </div>

                        <div className="w-full space-y-3 sm:max-w-sm">
                            <Skeleton className="h-4 w-full bg-stone-300" />
                            <Skeleton className="h-4 w-4/5 bg-stone-300" />
                        </div>
                    </div>

                    <div className="grid auto-rows-[minmax(280px,1fr)] grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                        <GalleryCardSkeleton featured />
                        <GalleryCardSkeleton />
                        <GalleryCardSkeleton />
                    </div>
                </div>
            </section>

        </main>
    );
}