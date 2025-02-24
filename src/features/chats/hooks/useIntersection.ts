import { useEffect, useRef } from "react";

const useInteresection = (callback: () => void, threshold: number, isDisabled: boolean) => {
    const target = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const targetCurrent = target.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isDisabled) {
                callback();
            }
        }, { threshold });

        if (targetCurrent) {
            observer.observe(targetCurrent);
        }

        return () => {
            if (targetCurrent) {
                observer.unobserve(targetCurrent)
            }
        };
    }, [isDisabled, callback, threshold]);

    return { target };
}

export default useInteresection;