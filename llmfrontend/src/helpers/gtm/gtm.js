export const GA4_TRACKING_ID = process.env.NEXT_PUBLIC_GA4_ID;
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
    window.gtag("config", GA4_TRACKING_ID, {
        page_path: url,
    });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};
