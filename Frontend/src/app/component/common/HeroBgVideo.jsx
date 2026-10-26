import React from 'react'

const HeroBgVideo = () => {
    return (
        <>
            {/* Hero Background Video */}
            <div className="absolute inset-0">
                <video
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                >
                    <source src="/videos/hero-desktop.mp4" type="video/mp4" />
                </video>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40" />
            </div>
        </>
    )
}

export default HeroBgVideo
