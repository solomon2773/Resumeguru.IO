// components/ProfileSection.js
import React from 'react';
import {useSelector} from "react-redux";
const CoverletterRHS = () => {
  const clData = useSelector(state => state.coverLetterEdit.clData);

    return (
        <td
                style={{
                  width: '296.1pt',
                  padding: '14.4pt 25.2pt',
                  verticalAlign: 'top',
                }}
              >
                <p className="Title">{clData.firstName}</p>
                <p className="Subtitle">{clData.lastName}</p>
                <p style={{ lineHeight: '110%', fontSize: '14pt' }}>
                  
                </p>
                <h1>&nbsp;</h1>
                <div style={{ marginTop: '20px' }}>
                  <p className="paraText" >&nbsp;</p>
                  {
                    clData.coverLetterAiGenerate && clData.coverLetterAiGenerate.length > 0 && clData.coverLetterAiGenerate.map((line, index) => {
                      return (
                          <div key={index} >
                            <p className="paraText" >{line.line}</p>
                            <p className="paraText" >&nbsp;</p>
                          </div>
                        )
                      })
                    }
                </div>
              </td>
    );
};

export default CoverletterRHS;
