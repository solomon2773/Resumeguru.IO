import React from 'react';
import ExperienceSection from './ExperienceSection'
import EducationSection from './EducationSection'
import ProfileSection from './ProfileSection'
import SkillsSection from './SkillsSection'
const ResumeRightContent = ({name, profileText, skills, experiences, education}) => {
    return (
        <div className="custom-col-8 rt-div">
            <div className="rit-cover">
                {/*<div className="hotkey">*/}
                {/*    <h1>{name}</h1>*/}
                {/*    /!* <small>Job title comes here</small> *!/*/}
                {/*</div>*/}
                <ProfileSection profileText={profileText} />
                {/*<SkillsSection skills={skills} />*/}
                <ExperienceSection experiences={experiences} />
                <EducationSection education={education} />

            </div>
        </div>
    );
};

export default ResumeRightContent;
