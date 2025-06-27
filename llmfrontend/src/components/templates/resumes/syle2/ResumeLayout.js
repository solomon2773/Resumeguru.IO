// components/ResumeLayout.js
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsResumeLayoutLoading } from "../../../../store/resumeEditReducer";
import Head from 'next/head';

const ResumeLayout = ({ children }) => {

    const containerRef = useRef(null);
    const dispatch = useDispatch();
    const selectedFontSize = useSelector(state => state.resumeEdit.resumeFontSize)
    const selectedColor = useSelector(state => state.resumeEdit.resumeFontColor)

    const colors = {
        '6A6A6A': '6A6A6A',
        '737373': '737373',
        'ef4444': 'ef4444',
        'f97316': 'f97316',
        'eab308': 'eab308',
        '22c55e': '22c55e',
        '3b82f6': '3b82f6',
        '8b5cf6': '8b5cf6',
        'ec4899': 'ec4899',
        'a855f7': 'a855f7'
    };

    const[styleObject, setStyleObject] = useState({
        contentFontSize: selectedFontSize + 'px',
        fontColor: '#000000',// + colors[selectedColor],
        backgroundColor: '#' + colors[selectedColor],
        secHeaderFontSize: ((selectedFontSize/15)*18) + 'px',
        hdH1FontSize: ((selectedFontSize/15)*36) + 'px',
        pPicFontSize: ((selectedFontSize/15)*16) + 'px',
        f24FontSize: ((selectedFontSize/15)*24) + 'px',
        f13FontSize: ((selectedFontSize/15)*13) + 'px',
        f14FontSize: ((selectedFontSize/15)*14) + 'px',

    })

    const[isLoadedCustomCSS, setIsLoadedCustomCSS] = useState(false);
    const[isLoadedFontsCSS, setIsLoadedFontsCSS] = useState(false);

    useEffect(() => {
        if (isLoadedCustomCSS && isLoadedFontsCSS) {
            dispatch(setIsResumeLayoutLoading(false));
        }
    }, [isLoadedCustomCSS, isLoadedFontsCSS]);

    useEffect(() => {
        setStyleObject({
            contentFontSize: selectedFontSize + 'px',
            fontColor: '#000000',// + colors[selectedColor],
            backgroundColor: '#' + colors[selectedColor],
            secHeaderFontSize: ((selectedFontSize/15)*18) + 'px',
            hdH1FontSize: ((selectedFontSize/15)*36) + 'px',
            pPicFontSize: ((selectedFontSize/15)*16) + 'px',
        })
    }, [selectedFontSize, selectedColor]);


    useEffect(() => {
        // Fetch the Font Awesome CSS file
        const applyCustomeStyles = () => {
            fetch(process.env.SITE_URL  + '/css/fontawesome-all.min.css')
            .then(response => response.text())
            .then(newStyles => {
                if (containerRef.current) {
                    // Find the existing <style> tag
                    const existingStyleTag = containerRef.current.querySelector('style');
                    if (existingStyleTag) {
                        // Append new styles to the existing <style> tag
                        existingStyleTag.innerHTML += newStyles;
                    } else {
                        // Create and append a new <style> tag if none exists
                        const styleTag = document.createElement('style');
                        styleTag.innerHTML = newStyles;
                        containerRef.current.appendChild(styleTag);
                    }
                }
                setIsLoadedCustomCSS(true);
            })
            .catch(error => console.error('Error fetching Font Awesome CSS:', error));
        }

        const applyFontAwesome = () => {
            fetch(process.env.SITE_URL  + '/css/style-template2.css')
            .then(response => response.text())
            .then(newStyles => {
                if (containerRef.current) {
                    // Find the existing <style> tag
                    const existingStyleTag = containerRef.current.querySelector('style');

                    if (existingStyleTag) {
                        // Append new styles to the existing <style> tag
                        existingStyleTag.innerHTML += newStyles;
                    } else {
                        // Create and append a new <style> tag if none exists
                        const styleTag = document.createElement('style');
                        styleTag.innerHTML = newStyles;
                        containerRef.current.appendChild(styleTag);
                    }
                }
                setIsLoadedFontsCSS(true);
            })
            .catch(error => console.error('Error fetching Font Awesome CSS:', error));
        }
        applyCustomeStyles();
        applyFontAwesome();
      }, [selectedFontSize, selectedColor]);

    return (
        <div style={{ display: 'none' }} id="resume-layout-outerdiv" >
            <div ref={containerRef} id="resume-template">
                <style>
                {`
                   body {
                        background-color: #ffffff !important;
                        font-family: "mouse-300", Arial, Helvetica, sans-serif;
                    }
                   .custom-container-fluid {
                        width: 97%;
                        padding: 0;
                        margin: 0;
                    }
                    .custom-container {
                        width: 100%;
                        max-width: 1140px;
                        padding: 0 15px;
                        margin:0;
                        color: ${styleObject.fontColor} !important; 
                    }
                    .custom-row {
                        display: flex;
                        flex-wrap: wrap;
                        margin-right: -15px;
                        margin-left: -15px;
                    }
                    .custom-col-4, .custom-col-6, .custom-col-8 {
                        padding-right: 15px;
                        padding-left: 15px;
                    }
                    .custom-col-4 {
                        flex: 0 0 30.3333%;
                        max-width: 30.3333%;
                    }
                    .custom-col-3 {
                        flex: 0 0 25%;
                        max-width: 25%;
                    }
                    .custom-col-6 {
                        flex: 0 0 45%;
                        max-width: 45%;
                    }

                    .custom-col-edu {
                        flex: 0 0 99%;
                        max-width: 99%;
                    }
                    .custom-col-8 {
                        flex: 0 0 60.6667%;
                        max-width: 60.6667%;
                    }
                    .no-margin {
                        margin: 0;
                    }
                    .pb0 {
                        padding-bottom: 0;
                    }
                    .profile-box {
                        background-color: ${styleObject.backgroundColor};
                        padding: 30px;
                        border-radius: 9999px;
                    }
                    .profile-box .left-side {
                        background-color:  ${styleObject.backgroundColor};
                        color: #FFF;
                        padding: 40px 20px; }
                    .profile-box .left-co {
                        background-color: ${styleObject.backgroundColor};
                      }
                    .contact-box {
                        display: flex;
                        align-items: center;
                       
                    }
                    .contact-box .icon {
                        margin-right: 10px;
                    }
                    .contact-box .detail {
                        font-size: ${styleObject.f14FontSize};
                      
                    }
                    .ltitle {
                        font-size: ${styleObject.secHeaderFontSize};
                        margin-bottom: 15px;
                        font-weight: bold;
                    }
                    .hoby li {
                        list-style: none;
                        text-align: center;
                        margin-bottom: 15px;
                    }
                    .social-link li {
                        display: inline-block;
                        margin-right: 10px;
                    }
                    .work-exp h6 {
                        font-size: ${styleObject.pPicFontSize};
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .work-exp ul {
                        padding-left: 20px;
                        margin-bottom: 20px;
                    }
                    .prog-row {
                        margin-bottom: 20px;
                    }
                   
                    .hotkey h1 {
                        font-size: ${styleObject.hdH1FontSize};
                        font-weight: bold;
                    }
                    .hotkey small {
                        font-size: ${styleObject.f14FontSize};
                        color: #6c757d;
                    }
                    .rit-titl {
                        font-size: ${styleObject.f24FontSize};
                        font-weight: bold;
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }

                    @media screen and (max-width: 767px) {
                        .left-co {
                            padding-right: 0px; }
                        .rt-div {
                            padding-left: 30px; } }
                        .rit-cover .hotkey {
                        text-align: right;
                        padding: 30px 20px; }
                        .rit-cover .hotkey h1 {
                            width: 100%;
                            text-align: right;
                            color: ${styleObject.fontColor}; }
                        .rit-cover .hotkey small {
                            font-size: ${styleObject.pPicFontSize};
                            color: #9c9898;
                            margin-top: -30px;
                            font-weight: 600; }
                        .rit-cover .rit-titl {
                        padding: 10px;
                        border-bottom: 2px solid #CCC;
                        font-size: ${styleObject.secHeaderFontSize}; }
                        .rit-cover .rit-titl i {
                            font-size: ${styleObject.secHeaderFontSize};
                            margin-right: 5px; }
                        .rit-cover .about {
                        font-size: ${styleObject.contentFontSize};
                        text-align: justify;
                        text-indent: 15px;
                        padding: 5px 0px; }
                        .rit-cover .about .btn-link li {
                            float: left;
                            margin-top: 15px;
                            padding: 5px 20px;
                            border-radius: 15px;
                            border: 1px solid #888;
                            margin-right: 10px;
                            margin-bottom: 10px;
                            color: #888; }
                            @media screen and (max-width: 483px) {
                            .rit-cover .about .btn-link li {
                                margin-right: 5px !important;
                                width: 100%;
                                margin-bottom: 10px; } }
                            .rit-cover .about .btn-link li i {
                            margin-top: 5px;
                            margin-left: -28px; }
                            .rit-cover .about .btn-link li a {
                            color: #888; }
                        .rit-cover .work-exp {
                        padding: 5px 0px; }
                        .rit-cover .work-exp h6 {
                            font-size: ${styleObject.contentFontSize};
                            margin-bottom: 0px; }
                            .rit-cover .work-exp h6 span {
                            float: right;
                            font-size: ${styleObject.f13FontSize}; }
                        .rit-cover .work-exp i {
                            font-size: ${styleObject.contentFontSize}; }
                        .rit-cover .work-exp ul {
                            padding: 5px 0px; }
                            .rit-cover .work-exp ul li {
                            font-size: ${styleObject.contentFontSize};
                            padding-left: 5px; }
                            .rit-cover .work-exp ul li i {
                                margin-right: 5px; }
                        .rit-cover .education {
                           padding: 5px 0px; 
                        }
                        .rit-cover .education ul li {

                            font-size: ${styleObject.contentFontSize}; }
                            .rit-cover .education ul li span {
                            font-size: ${styleObject.f13FontSize}; }
                        .rit-cover .profess-cover {
                        padding: 20px 0px; }
                        .rit-cover .profess-cover .prog-row {
                            width: 100%;
                            text-align: left;
                            padding: 8px 2px;
                            font-size: ${styleObject.contentFontSize}; }
                            .rit-cover .profess-cover .prog-row div {
                            padding: 0px; }
                        .rit-cover .profess-cover .progress-bar {
                            background-color:${styleObject.backgroundColor}; }
                `}
                </style>
                <div className="custom-container-fluid overcover">
                    <div id="html_template_2" className="custom-container profile-box">
                        <div className="custom-row">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeLayout;
