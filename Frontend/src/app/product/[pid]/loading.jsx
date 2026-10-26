import React from "react";

const Loading = () => {
  return (
    <>
      {/* Skeleton Header */}
      <header className="h-20 w-full bg-white px-8 flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded-md bg-gray-200" />

        <div className="hidden md:flex gap-8">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
      </header>

      {/* Product Detail Skeleton */}
      <main className="min-h-screen w-full bg-amber-50 px-4 py-10 md:px-10 lg:px-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex gap-3">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16">

          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square w-full animate-pulse rounded-2xl bg-gray-200" />

            {/* Thumbnail Images */}
            <div className="flex gap-4">
              <div className="h-20 w-20 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-20 w-20 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-20 w-20 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col pt-2">
            {/* Category */}
            <div className="mb-5 h-4 w-24 animate-pulse rounded bg-gray-200" />

            {/* Product Title */}
            <div className="mb-3 h-8 w-4/5 animate-pulse rounded bg-gray-200" />
            <div className="mb-6 h-8 w-2/5 animate-pulse rounded bg-gray-200" />

            {/* Rating */}
            <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200" />

            {/* Price */}
            <div className="mb-3 h-10 w-36 animate-pulse rounded bg-gray-200" />
            <div className="mb-8 h-4 w-48 animate-pulse rounded bg-gray-200" />

            {/* Description */}
            <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="mb-3 h-4 w-11/12 animate-pulse rounded bg-gray-200" />
            <div className="mb-8 h-4 w-3/4 animate-pulse rounded bg-gray-200" />

            {/* Quantity and Actions */}
            <div className="mb-6 flex gap-4">
              <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-300" />
            </div>

            <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />

            {/* Additional Details */}
            <div className="mt-10 space-y-4 border-t border-gray-200 pt-6">
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-44 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default Loading;