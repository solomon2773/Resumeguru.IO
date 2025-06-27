// components/ProfileSection.js
import React from 'react';
const ProfileSection = ({ profileText }) => {
    return (
        <>
            <h2 className="rit-titl"><i className="far fa-user"></i> Profile</h2>
            <div className="about">
                <p>{profileText.overviewRewrite}</p>
            </div>
        </>
    );
};

export default ProfileSection;
