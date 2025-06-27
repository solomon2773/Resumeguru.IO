// components/Resume.js
import React from 'react';
import CoverletterLayout from './CoverletterLayout';
import CoverletterLHS from './CoverletterLHS';
import CoverletterRHS from './CoverletterRHS';

const CoverletterStyle = () => {
    return (
        <CoverletterLayout>
            <CoverletterLHS
            />
            <CoverletterRHS />
        </CoverletterLayout>
    );
};

export default CoverletterStyle;
