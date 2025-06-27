// components/Resume.js
import React from 'react';
import ResumeLayout from './ResumeLayout';
import ResumeLeftContent from './ResumeLeftContent';
import ResumeRightContent from './ResumeRightContent';
// import SkillsSection from './SkillsSection';
// import ExperienceSection from './ExperienceSection';
// import EducationSection from './EducationSection';
import {useSelector} from "react-redux";

const ResumeStyle = () => {
    const resumeData = useSelector(state => state.resumeEdit.resumeDetails);
    const userData = useSelector(state => state.user);
    // console.log(userData.profile.country);
    return (
        <ResumeLayout>
            <ResumeLeftContent
                name={userData.profile && (userData.profile.firstName + ' ' + userData.profile.lastName)}
                email={userData.profile.email ? userData.profile.email : 'abc@def.com'}
                phone={userData.profile.phoneNumber ? userData.profile.phoneNumber : '123-456-7890'}
                city={userData.profile.city ? userData.profile.city : ''}
                region={userData.profile.region ? userData.profile.region : ''}
                country={userData.profile.country ? userData.profile.country.countryDisplayName : ''}
                skills={resumeData.skillsRewrite && resumeData.skillsRewrite.existingSkills ? resumeData.skillsRewrite.existingSkills : []}
                certifications={resumeData.resumeOriginalData && resumeData.resumeOriginalData.certifications ? resumeData.resumeOriginalData.certifications : []}
            />
            <ResumeRightContent
                name={userData.profile && (userData.profile.firstName + ' ' + userData.profile.lastName)}
                profileText={resumeData.overviewRewrite ? resumeData.overviewRewrite : ""}
                skills={resumeData.skillsRewrite && resumeData.skillsRewrite.existingSkills ? resumeData.skillsRewrite.existingSkills : []}
                experiences={resumeData.professionalExperienceRewrite ? resumeData.professionalExperienceRewrite : []}
                education={resumeData.resumeOriginalData.education ? resumeData.resumeOriginalData.education : []}
            />
            {/* <div id="bd">
                <div id="yui-main">
                    <div className="yui-b">
                        <ProfileSection profileText={resumeData.overviewRewrite ? resumeData.overviewRewrite : ""} />
                        <SkillsSection skills={resumeData.skillsRewrite && resumeData.skillsRewrite.existingSkills ? resumeData.skillsRewrite.existingSkills : []} />
                        <ExperienceSection experiences={resumeData.professionalExperienceRewrite ? resumeData.professionalExperienceRewrite : []} />
                        <EducationSection education={resumeData.resumeOriginalData.education ? resumeData.resumeOriginalData.education : []} />
                    </div>
                </div>
            </div> */}
        </ResumeLayout>
    );
};

export default ResumeStyle;
