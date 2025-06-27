// components/ResumeHeader.js
import React from 'react';
import {useSelector} from "react-redux";

const CoverletterLHS = () => {
    const clData = useSelector(state => state.coverLetterEdit.clData);
    const userData = useSelector(state => state.user);

    return (
        <td
                style={{
                  backgroundColor: '#9fb5d1a2',
                  minWidth: '131.4pt',
                  padding: '54.4pt 25.2pt',
                  verticalAlign: 'top',
                }}
              >
                <div style={{ minHeight: '98%' }}>
                  <h2>Contact</h2>
                  <p className="paraText" >{userData.profile.phoneNumber ? userData.profile.phoneNumber : '123-456-7890'}</p>
                  <p className="paraText" >{userData.profile.email ? userData.profile.email : 'abc@def.com'}</p>
                  <p className="paraText" >{userData.profile.city}{userData.profile.region && ", "+userData.profile.region}, {userData.profile.country && ", "+userData.profile.country.countryDisplayName}</p>
                  <p className="paraText" >&nbsp;</p>
                  <p className="paraText" >&nbsp;</p>
                  <p className="paraText" >&nbsp;</p>
                  <h3>STRENGTHS</h3>
                  <p className="paraText" >&nbsp;</p>
                  {
                    clData.coverLetterCandidateStrengthMessageContent && clData.coverLetterCandidateStrengthMessageContent.length > 0 && clData.coverLetterCandidateStrengthMessageContent.map((strength, indx) => {
                        return (
                          <p key={indx} className="paraText" >{strength.strength}</p>
                        )
                    })
                  }
                </div>
              </td>
    );
};

export default CoverletterLHS;
