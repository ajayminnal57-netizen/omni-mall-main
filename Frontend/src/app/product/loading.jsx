import React from 'react'
import ActionButton from '../component/common/ActionButton'

const ProductSkeleton = () => {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm animate-pulse">
            <div className="aspect-square w-full bg-stone-200" />

            <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded-md bg-stone-200" />
                <div className="h-3 w-1/2 rounded-md bg-stone-200" />

                <div className="flex items-center justify-between pt-2">
                    <div className="h-5 w-20 rounded-md bg-stone-200" />
                    <div className="h-9 w-9 rounded-full bg-stone-200" />
                </div>
            </div>
        </div>
    )
}

const Loading = () => {
    return (
        <div className="min-h-screen bg-gray-950">

            {/* Header */}
            <header className="top-0 left-0 z-10 flex w-full items-center justify-around px-3 py-4 text-white sm:px-5 sm:py-5 md:px-8">

                <div className="brand m-auto flex shrink-0 items-center justify-center">
                    <img
                        src="/images/brand-logo.png"
                        alt=""
                        className="w-[20vw] max-w-[120px] min-w-[65px] scale-110 px-2 sm:w-[15vw] sm:scale-125 sm:px-4 md:w-[12vw] md:scale-[1.6] md:px-5"
                    />
                </div>

                <div className="flex w-[70vw] min-w-0 flex-1 justify-center px-2 sm:px-3 md:w-[70vw] md:flex-none">
                    <form className="flex w-full min-w-0 items-center rounded-2xl border border-white/20 bg-white/10 p-1 py-1 backdrop-blur-md sm:p-2 sm:py-1">

                        <button type="button" className="shrink-0 p-1 py-0 sm:p-1">
                            <i className="fa-solid fa-magnifying-glass p-2 text-[12px]" />
                        </button>

                        <input
                            type="text"
                            placeholder="search"
                            className="w-full min-w-0 border-0 bg-transparent px-2 text-sm font-bold capitalize text-amber-100 outline-0 sm:px-4"
                        />
                    </form>
                </div>

                <div className="nav-actions flex shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
                    <ActionButton
                        name="search"
                        icon="fa-regular fa-circle-user"
                    />

                    <ActionButton
                        name="like"
                        icon="fa-regular fa-heart"
                    />

                    <ActionButton
                        name="notifications"
                        icon="fa-regular fa-bell"
                    />
                </div>
            </header>

            {/* Main Content Skeleton */}
            <main className="min-h-screen bg-amber-50 px-4 py-10 sm:px-8 sm:py-14">

                {/* Heading Skeleton */}
                <header className="mx-auto mb-8 w-full max-w-7xl sm:mb-10">
                    <div className="mb-3 h-3 w-32 animate-pulse rounded bg-stone-300" />

                    <div className="h-8 w-full max-w-xl animate-pulse rounded-md bg-stone-200 sm:h-12" />

                    <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-stone-200" />
                </header>

                {/* Product Grid Skeleton */}
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductSkeleton key={index} />
                    ))}
                </div>

            </main>
        </div>
    )
}

export default Loading