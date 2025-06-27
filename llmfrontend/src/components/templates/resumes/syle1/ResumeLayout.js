// components/ResumeLayout.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsResumeLayoutLoading } from "../../../../store/resumeEditReducer";

const ResumeLayout = ({ children }) => {


    const dispatch = useDispatch();
    const selectedFontSize = useSelector(state => state.resumeEdit.resumeFontSize)
    const selectedColor = useSelector(state => state.resumeEdit.resumeFontColor)

    const colors = {
        '000000': '333333',
        '737373': '262626',
        'ef4444': '991b1b',
        'f97316': '9a3412',
        'eab308': '854d0e',
        '22c55e': '166534',
        '3b82f6': '1e40af',
        '8b5cf6': '6b21a8',
        'ec4899': '9d174d',
        'a855f7': '6b21a8'
    };

    const[styleObject, setStyleObject] = useState({
        enParaFontSize: selectedFontSize + 'px',
        paraFontColor: '#' + colors[selectedColor],
        headerFontColor: '#' + selectedColor,
        ftFontSize: ((selectedFontSize/23)*15) + 'px',
        hdH1FontSize: ((selectedFontSize/23)*48) + 'px',
        h2FontSize: ((selectedFontSize/23)*24) + 'px',
        h3FontSize: ((selectedFontSize/23)*20) + 'px',
        paraFontSize: ((selectedFontSize/23)*16) + 'px',
        skillsFontSize: ((selectedFontSize/23)*24) + 'px',
    })

    useEffect(() => {
        dispatch(setIsResumeLayoutLoading(false));
    }, []);

    useEffect(() => {
        setStyleObject({
            enParaFontSize: selectedFontSize ,
            paraFontColor: '#' + colors[selectedColor],
            headerFontColor: '#' + selectedColor,
            ftFontSize: ((selectedFontSize/23)*15) + 'px',
            hdH1FontSize: ((selectedFontSize/23)*48) + 'px',
            h2FontSize: ((selectedFontSize/23)*24) + 'px',
            h3FontSize: ((selectedFontSize/23)*20) + 'px',
            paraFontSize: ((selectedFontSize/23)*16) + 'px',
            skillsFontSize: ((selectedFontSize/23)*24) + 'px',
        })
    }, [selectedFontSize, selectedColor]);

    return (
        <div style={{ display: 'none' }} id="resume-layout-outerdiv" >
            <div style={{width: '800px', height: '1200px', color: styleObject.paraFontColor}}  id="resume-template">
                <style>
                    {`
            #resume-template .msg { padding: 2px; background: #222; position: relative; }
            #resume-template .msg h1 { color: #fff; }
            #resume-template .msg a { margin-left: 20px; background: #408814; color: white; padding: 4px 8px; text-decoration: none; }
            #resume-template .msg a:hover { background: #266400; }
            #resume-template body { font-family: Georgia; }
            #resume-template #inner { padding: 10px 40px; margin: 10px auto; background: #f5f5f5; border: solid #666; border-width: 8px 0 2px 0; }
            #resume-template #hd { margin: 1.25em 0 1.5em 0; padding-bottom: 0.75em; border-bottom: 1px solid #ccc }
            #resume-template #hd h2 { text-transform: uppercase; letter-spacing: 2px; }
            #resume-template #bd, #resume-template #ft { margin-bottom: 2em; }
            #resume-template #ft { padding: 0.5em 0 2.5em 0; font-size: ${styleObject.ftFontSize}; border-top: 1px solid #ccc; text-align: center; }
            #resume-template #ft p { margin-bottom: 0; text-align: center; }
            #resume-template #hd h1 { font-size: ${styleObject.hdH1FontSize}; text-transform: uppercase; letter-spacing: 3px; }
            #resume-template h2 { font-size: ${styleObject.h2FontSize} }
            #resume-template h3, #resume-template h4 { font-size: ${styleObject.h3FontSize}; }
            #resume-template h1, #resume-template h2, #resume-template h3, #resume-template h4 { color: ${styleObject.headerFontColor}; }
            #resume-template p { font-size: ${styleObject.paraFontSize};  }
            #resume-template a { color: ${styleObject.headerFontColor} }
            #resume-template a:hover { text-decoration: none; }
            #resume-template strong { font-weight: bold; }
            #resume-template li { line-height: 24px; border-bottom: 1px solid #ccc; }
            #resume-template p.enlarge { font-size: ${styleObject.enParaFontSize};   }
            #resume-template p.enlarge span { color: ${styleObject.paraFontColor} }
            #resume-template .contact-info { margin-top: 7px; }
            #resume-template .first h2 { font-style: italic; }
            #resume-template a#pdf { display: block; float: left; background: #666; color: white; padding: 6px 10px 6px 12px; margin-bottom: 6px; text-decoration: none; }
            #resume-template a#pdf:hover { background: #222; }
            #resume-template .job { position: relative; margin-bottom: 0.5em; padding-bottom: 0.5em; border-bottom: 1px solid #ccc; }
            #resume-template .job h4 { position: absolute; top: 0.35em; right: 0 }
            #resume-template .job p { margin: 0.75em 0 3em 0; }
            #resume-template .last { border: none; }
            #resume-template .skills-list { }
            #resume-template .skills-list ul { margin: 0; }
            #resume-template .skills-list li { margin: 3px 0; padding: 3px 0; }
            #resume-template .skills-list li span { font-size: ${styleObject.enParaFontSize}; display: block; margin-bottom: -2px; padding: 0 }
            #resume-template .talent { flex; float: left; padding:3px; }
            #resume-template .talent h2 { margin-bottom: 10px; }
            #resume-template #srt-ttab { margin-bottom: 100px; text-align: center; }
            #resume-template #srt-ttab img.last { margin-top: 20px }
            #resume-template .yui-gf { margin-bottom: 2px; padding-bottom: 2px; border-bottom: 1px solid #ccc; }
            #resume-template .yui-gf .yui-u{width:100%;}
            #resume-template .yui-gf div.first{width:12.3%;}
            #resume-template .yui-gf.last { border: none; }
            #resume-template .page-break { page-break-before: always; }
            `}
                </style>
                <div id="html_template_1" className="yui-t7">
                    <div id="inner">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeLayout;
