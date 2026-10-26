const ReviewComments = ({ reviews = [] }) => (
    <section className="bg-[#f4f1eb] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Customer notes</p>
                <h2 className="text-2xl font-medium text-stone-950 sm:text-3xl">Reviews</h2>
            </div>

            {reviews.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review, index) => (
                        <article key={`${review.reviewerEmail}-${index}`} className="border border-stone-200 bg-white p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-medium text-stone-950">{review.reviewerName}</p>
                                <span className="inline-flex items-center gap-1 text-sm text-stone-600">
                                    {review.rating}
                                    <i className="fa-solid fa-star text-amber-500" aria-hidden="true" />
                                </span>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-stone-600">{review.comment}</p>
                            {review.date && (
                                <time dateTime={review.date} className="mt-4 block text-xs text-stone-400">
                                    {new Date(review.date).toLocaleDateString()}
                                </time>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <p className="border-y border-stone-300 py-6 text-sm text-stone-600">There are no reviews for this piece yet.</p>
            )}
        </div>
    </section>
);

export default ReviewComments;
