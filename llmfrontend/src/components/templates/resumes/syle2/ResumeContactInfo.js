// components/ResumeHeader.js
import React from 'react';
const ResumeContactInfo = ({ email, phone, city, region, country }) => {
    return (
        <>
            <h4 className="ltitle">Contact</h4>
            <div className="contact-box pb0">
                <div className="icon">
                    <i className="fa-solid fa-phone"></i>
                </div>
                <div className="detail">
                    { phone }
                </div>
            </div>
            <div className="contact-box pb0">
                <div className="icon">
                    <i className="fa-solid fa-phone"></i>
                </div>
                <div className="detail">
                    { email }
                </div>
            </div>
            <div className="contact-box">
                <div className="icon">
                    <i className="fa-solid fa-phone"></i>
                </div>
                <div className="detail">
                    { region }, { city }, { country }
                </div>
            </div>
        </>
    );
};

export default ResumeContactInfo;
