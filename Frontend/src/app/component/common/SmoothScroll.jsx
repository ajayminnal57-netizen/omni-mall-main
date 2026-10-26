'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = () => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            return undefined;
        }

        const lenis = new Lenis({
            autoRaf: true,
            duration: 1.15,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.3,
        });

        return () => lenis.destroy();
    }, []);

    return null;
};

export default SmoothScroll;
