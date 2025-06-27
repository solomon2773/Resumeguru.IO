// components/EducationSection.js
import React from 'react';
const EducationSection = ({ education }) => {
    return (
        <div className="yui-gf last">
            <div className="yui-u first">
                <h2>Education</h2>
            </div>
            <div className="yui-u">
                {education.map((edu, index) => (
                    <div key={index} style={{"margin-top":"10px"}}>
                        <h2 style={{"margin":"2px"}}>{edu.school} </h2>
                        <h4 style={{"margin":"2px"}}>{edu.fieldOfStudy} {edu.degree} {edu.endDate && " - "+edu.endDate} {edu.grade && ( <>
                            &mdash; <strong>{edu.grade}</strong>
                        </>)} </h4>
                        {edu.additionalInfo && (
                            <h4 style={{"margin":"2px"}}>{edu.additionalInfo}</h4>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationSection;
