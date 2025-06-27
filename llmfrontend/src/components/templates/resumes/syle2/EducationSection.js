// components/EducationSection.js
import React from 'react';
const EducationSection = ({ education }) => {
    return (
        <>
        <h2 className="rit-titl"><i className="fas fa-graduation-cap"></i> Education</h2>
        <div className="education">
            <ul className="custom-row no-margin">
                {education.map((edu, index) => (
                    <li className="custom-col-edu" key={index} >
                        {education.endDate && (
                                <span>{education.endDate && education.endDate}</span>
                        )}
                        <br/>
                        {edu.fieldOfStudy} {edu.degree} {edu.grade && ( <>
                        &mdash; {edu.grade}
                        </>)}
                        {edu.additionalInfo && (
                            <><br/>{edu.additionalInfo}</>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default EducationSection;
