// components/EducationSection.js
import React from 'react';
const CertificationSection = ({ certifications }) => {
    return (
        <div className="yui-gf last">
            <div className="yui-u first">
                <h2>Certification / License</h2>
            </div>
            <div className="yui-u">
                {certifications.map((certification, index) => (
                    <div key={index} style={{"marginTop":"10px"}}>
                        <h2 style={{"margin":"1px"}}>{certification.certificationName}
                            {certification.certificationIssueDate && (
                                <span style={{"margin":"1px", "marginLeft" : "3px"}}>{" ( "+certification.certificationIssueDate}  {certification.certificationExpirationDate && " ~ "+certification.certificationExpirationDate} )</span>
                            ) }
                        </h2>
                        <h4 style={{"margin":"1px"}}>
                            {certification.certificationIssueOrg} {certification.certificationId && " - "+certification.certificationId}

                        </h4>

                        {certification.certificationUrl && (
                            <h4 style={{"margin":"1px"}}>{certification.certificationUrl}</h4>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificationSection;
