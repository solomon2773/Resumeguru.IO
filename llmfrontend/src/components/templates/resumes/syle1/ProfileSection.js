// components/ProfileSection.js
import React from 'react';
const ProfileSection = ({ profileText }) => {
    return (
        <div className="yui-gf">
            <div className="yui-u first">
                <h2>Overview</h2>
            </div>
            <div className="yui-u">
                <p className="enlarge">{profileText.overviewRewrite}</p>
            </div>
        </div>
    );
};

export default ProfileSection;
