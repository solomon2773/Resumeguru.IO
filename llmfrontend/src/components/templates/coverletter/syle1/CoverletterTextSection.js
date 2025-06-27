// components/ProfileSection.js
import React from 'react';
const CoverletterTextSection = ({ coverletterData }) => {
    return (
        <div className="yui-gf">
            <div>
                {
                coverletterData.coverLetterCandidateStrengthAiGenerate && coverletterData.coverLetterCandidateStrengthAiGenerate.length > 0 && coverletterData.coverLetterCandidateStrengthAiGenerate.map((strength, index) => {

                    return (
                        <div key={index} className="yui-u first">
                            <h2>{strength}</h2>
                        </div>
                    )
                })
                }
            </div>
            <div className="yui-u">
                <p className="enlarge">{coverletterData.coverLetterAiGenerate}</p>
            </div>
        </div>
    );
};

export default CoverletterTextSection;
