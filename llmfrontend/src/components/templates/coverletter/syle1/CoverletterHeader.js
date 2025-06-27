// components/ResumeHeader.js
import React from 'react';
const CoverletterHeader = ({ name,  email, phone, city, region, country }) => {
    return (
        <div id="hd">
            <div className="yui-gc">
                <div className="yui-u first">
                    <h1>{name}</h1>
                </div>
                <div className="yui-u">
                    <div className="contact-info">

                        <h3><a href={`mailto:${email}`}>{email}</a></h3>
                        <h3>{phone}</h3>
                        <h3>{city}{region && ", "+region}, {country && ", "+country.countryDisplayName}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverletterHeader;
