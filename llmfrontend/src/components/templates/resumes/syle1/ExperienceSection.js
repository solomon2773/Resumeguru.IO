// components/ExperienceSection.js
import React from 'react';
const ExperienceSection = ({ experiences }) => {

    return (
        <div className="yui-gf">
            <div className="yui-u first">
                <h2>Experience</h2>
            </div>
            <div className="yui-u">
                {experiences.map((job, index) => (
                    <div className="job" key={index}>
                        <h2>{job.companyName}</h2>
                        <h3>{job.professionalExperienceTitle}</h3>
                        <h4>{job.jobStartDate} {job.jobEndDate}</h4>
                        {job.professionalExperienceDescriptionBulletPoints && job.professionalExperienceDescriptionBulletPoints.length > 0 && job.professionalExperienceDescriptionBulletPoints.map((point, index) => (
                            <p className="enlarge" key={index} style={{"margin":"2px"}}> - {point}</p>
                        ))}
                        {job.professionalExperienceDescription && (
                            <p className="enlarge">{job.professionalExperienceDescription}</p>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceSection;
