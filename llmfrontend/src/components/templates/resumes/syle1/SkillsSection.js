// components/SkillsSection.js
import React from 'react';
const SkillsSection = ({ skills }) => {
    return (
        <div className="yui-gf">
            <div className="yui-u first">
                <h2>Skills</h2>
            </div>
            <div className="yui-u">
                <p  className="enlarge" style={{"display":"inline-block"}}>
                {skills.map((skill, index) => (
                    <skill key={index}>
                        {skill.skillName},
                        {/*<p>{skill.skillDescription ? skill.skillDescription : ''}</p>*/}
                    </skill>




                ))}
                    </p>
            </div>
        </div>
    );
};

export default SkillsSection;
