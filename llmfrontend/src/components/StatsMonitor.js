// components/StatsMonitor.js
import { useEffect } from 'react';
import Stats from 'stats.js';

const StatsMonitor = () => {
    useEffect(() => {
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);

        const animate = () => {
            stats.begin();
            // Any animation logic or code you want to monitor
            stats.end();
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        // Cleanup function to remove the stats panel when component unmounts
        return () => {
            document.body.removeChild(stats.dom);
        };
    }, []);

    return null; // This component only adds the stats panel, so no need to render anything
};

export default StatsMonitor;
