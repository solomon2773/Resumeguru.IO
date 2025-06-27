// components/Resume.js
import React from 'react';
import CoverletterLayout from './CoverletterLayout';
import CoverletterHeader from './CoverletterHeader';
import CoverletterTextSection from './CoverletterTextSection';

import {useSelector} from "react-redux";

const CoverletterStyle = () => {
    const resumeData = useSelector(state => state.resumeEdit.resumeDetails);
    const userData = useSelector(state => state.user);
    return (
        <CoverletterLayout>
            <CoverletterHeader
                name={userData.profile && (userData.profile.firstName + ' ' + userData.profile.lastName)}
                email={userData.profile.email ? userData.profile.email : 'abc@def.com'}
                phone={userData.profile.phoneNumber ? userData.profile.phoneNumber : '123-456-7890'}
                city={userData.profile.city ? userData.profile.city : ''}
                region={userData.profile.region ? userData.profile.region : ''}
                country={userData.profile.country ? userData.profile.country : ''}
            />
            <div id="bd">
                <div id="yui-main">
                    <div className="yui-b">
                        <CoverletterTextSection coverletterData={resumeData.coverletterData ? resumeData.coverletterData : ""} />
                    </div>
                </div>
            </div>
        </CoverletterLayout>
    );
};

export default CoverletterStyle;
