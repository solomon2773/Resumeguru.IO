// components/ExperienceSection.js
import React from 'react';
const ExperienceSection = ({ experiences }) => {

    return (
        <>
            <h2 className="rit-titl"><i className="fas fa-briefcase"></i> Work Experiance</h2>
            {experiences.map((job, index) => (
                <div className="work-exp" key={index}>
                    <h6>{job.professionalExperienceTitle}<span>{job.jobStartDate} {job.jobEndDate}</span></h6>
                    <i>{job.companyName}</i>
                    {
                        job.professionalExperienceDescriptionBulletPoints && job.professionalExperienceDescriptionBulletPoints.length > 0 ? (
                            <ul>
                                {
                                    job.professionalExperienceDescriptionBulletPoints.map((point, index) => (
                                        <li key={index}><i className="far fa-hand-point-right"></i> {point}</li>
                                    ))
                                }
                            </ul>
                        ) : (
                            job.professionalExperienceDescription && (
                                <div className="about">
                                    <p>{job.professionalExperienceDescription}</p>
                                </div>
                            )
                        )
                    }
                </div>
            ))}
        </>
    );
};

export default ExperienceSection;
