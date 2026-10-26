'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

let mouseFollowerInitialization;

const initializeMouseFollower = () => {
    window.gsap = gsap;

    return new Promise((resolve, reject) => {
        const positionFollower = (event) => {
            document.querySelectorAll('.mousefollower').forEach((follower) => {
                follower.style.left = `${event.clientX}px`;
                follower.style.top = `${event.clientY}px`;
                follower.style.opacity = '1';
            });
        };

        const script = document.createElement('script');
        script.src = '/vendor/shery.js';
        script.onload = () => {
            try {
                if (!window.Shery?.mouseFollower) {
                    throw new Error('Shery mouse follower is unavailable.');
                }

                window.Shery.mouseFollower({
                    skew: true,
                    ease: 'power3.out',
                    duration: 0.7,
                });

                window.addEventListener('mousemove', positionFollower);
                window.addEventListener('mouseleave', () => {
                    document.querySelectorAll('.mousefollower').forEach((follower) => {
                        follower.style.opacity = '0';
                    });
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        };
        script.onerror = () => reject(new Error('Failed to load the Shery browser bundle.'));
        document.body.appendChild(script);
    });
};

const MouseFollower = () => {
    useEffect(() => {
        const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!supportsHover || prefersReducedMotion) {
            return;
        }

        mouseFollowerInitialization ??= initializeMouseFollower()
            .catch((error) => {
                mouseFollowerInitialization = undefined;
                console.error('Failed to initialize Shery mouse follower:', error);
            });
    }, []);

    return null;
};

export default MouseFollower;
