// components/SkillsSection.js
import React from 'react';
const SkillsSection = ({ skills }) => {
    return (
        <>
            <h2 className="rit-titl"><i className="fas fa-users-cog"></i> Skills</h2>
            <div className="education">
                <ul className="custom-row no-margin">
                    {skills.map((skill, index) => (
                        <li style={{"padding":"3px"}} key={index}>
                            <h3> {index > 0 && ", "}{skill.skillName}</h3>
                            {/*<p>{skill.skillDescription ? skill.skillDescription : ''}</p>*/}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default SkillsSection;
