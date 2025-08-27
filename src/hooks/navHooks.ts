import { useState, useEffect, RefObject } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useClickOutside(refs: RefObject<HTMLElement | null>[], handler: () => void) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (refs.every(ref => ref.current && !ref.current.contains(event.target as Node))) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [refs, handler]);
}

