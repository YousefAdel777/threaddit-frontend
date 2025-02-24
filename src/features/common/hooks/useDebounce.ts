import { useState, useEffect } from "react";

const useDebounce = <T>(value: T, delay: number) : { debouncedValue: T | null } => {
    const [debouncedValue, setDebouncedValue] = useState<T | null>(null);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timeout);
    }, [delay, value]);

    return { debouncedValue };
}

export default useDebounce;