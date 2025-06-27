import React from 'react';
import ResumeContactInfo from './ResumeContactInfo'
import Image from 'next/image'
import SkillsSection from "./SkillsSection";
import CertificationSection from "./CertificationSection";
const ResumeLeftContent = ({name, email, phone, city, region, country, skills, certifications}) => {
    return (
        <div className="custom-col-4 left-co">
            <div className="left-side">
                <div className="profile-info ">
                    {/*<Image*/}
                    {/*    src={profileImage.imageUrl ? profileImage.imageUrl : "https://localhost:3000/images/author-placeholder.jpg"}*/}
                    {/*    id="click_profile_img_default"*/}
                    {/*    alt={profileImage.imageAlt ? profileImage.imageAlt : "Profile Image"}*/}
                    {/*    width={120}*/}
                    {/*    height={120}*/}
                    {/*/>*/}
                    <h2 style={{"textAlign":"center", "paddingTop":"10px",}}>{name}</h2>
                    {/*<span>/!* Job title comes  here *!/</span>*/}
                </div>
                <ResumeContactInfo
                    email={email}
                    phone={phone}
                    city={city}
                    region={region}
                    country={country}
                />
                <SkillsSection skills={skills} />
                <CertificationSection certifications={certifications}/>

                {/* <h4 className="ltitle">Contact</h4>
                <ul className="custom-row social-link no-margin">
                    <li><i className="fab fa-facebook-f"></i></li>
                    <li><i className="fab fa-twitter"></i></li>
                    <li><i className="fab fa-google-plus-g"></i></li>
                    <li><i className="fab fa-linkedin-in"></i></li>
                    <li><i className="fab fa-github"></i></li>
                </ul> */}
                {/* <h4 className="ltitle">Referencess</h4>
                <div className="refer-cov">
                    <b>Jonney Smith</b>
                    <p>CEO Casinocarol</p>
                    <span>p +00 890 1232 8767</span>
                </div>
                <div className="refer-cov">
                    <b>Jonney Smith</b>
                    <p>System Administrator</p>
                    <span>p +00 890 1232 8767</span>
                </div> */}
                {/* <h4 className="ltitle">Hobbies</h4>
                <ul className="hoby custom-row no-margin">
                    <li><i className="fas fa-pencil-alt"></i> <br/> Writing</li>
                    <li><i className="fas fa-bicycle"></i> <br/> Cycling</li>
                    <li><i className="fas fa-futbol"></i> <br/> Football</li>
                    <li><i className="fas fa-film"></i><br/> Movies</li>
                    <li><i className="fas fa-plane-departure"></i> <br/>Travel</li>
                    <li><i className="fas fa-gamepad"></i> <br/> Games</li>
                </ul> */}
            </div>
        </div>
    );
};

export default ResumeLeftContent;
