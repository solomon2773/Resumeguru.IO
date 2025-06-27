"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { IStaticMethods } from 'preline/preline';

declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
    }
}

export default function PrelineScript() {
    const { pathname } = useRouter();

    useEffect(() => {
        import('preline/preline');
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (window.HSStaticMethods) {
                window.HSStaticMethods.autoInit();
            }
        }, 100);

        return () => clearTimeout(timer); // Clear timeout if the component unmounts
    }, [pathname]);

    return null;
}
