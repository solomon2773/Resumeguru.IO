// components/EducationSection.js
import React from 'react';
const CertificationSection = ({ certifications }) => {
    return (
        <>
        <h2 className="rit-titl"><i className="fas fa-graduation-cap"></i> Certification / License</h2>
        <div className="education">
            <ul className="custom-row no-margin">
                {certifications.map((certification, index) => (
                    <li className="custom-col-edu" key={index} >
                        {certification.certificationName}
                        {certification.certificationIssueDate && (
                                <>
                                    {certification.certificationIssueDate && " ( "+certification.certificationIssueDate} {certification.certificationExpirationDate && " - "+certification.certificationExpirationDate} )</>
                        )}
                        <br/>
                        {certification.certificationIssueOrg} {certification.certificationId && " - " + certification.certificationId}
                        {certification.certificationUrl && (
                            <><br/>{certification.certificationUrl}</>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default CertificationSection;
