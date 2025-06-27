// components/ResumeLayout.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsClLayoutLoading } from "../../../../store/coverLetterReducer";

const CoverletterLayout = ({ children }) => {


    const dispatch = useDispatch();
    const selectedFontSize = useSelector(state => state.coverLetterEdit.clFontSize)
    const selectedColor = useSelector(state => state.coverLetterEdit.clFontColor)


    const colors = {
        '000000': '465870',
        '262626': '737373',
        '991b1b': 'ef4444',
        '9a3412': 'f97316',
        '854d0e': 'eab308',
        '166534': '22c55e',
        '1e40af': '3b82f6',
        '6b21a8': '8b5cf6',
        '9d174d': 'ec4899',
        '6b21a8': 'a855f7',
    };

    const[styleObject, setStyleObject] = useState({
        paraFontColor: '#' + selectedColor,
        titleFontColor: '#' + selectedColor,
        subTileFontColor: '#' + colors[selectedColor],
        titleFontSize: ((selectedFontSize/14)*48) + 'px',
        subTileFontSize: ((selectedFontSize/14)*48) + 'px',
        h2FontSize: ((selectedFontSize/14)*19) + 'px',
        h3FontSize: ((selectedFontSize/14)*19) + 'px',
        paraFontSize: ((selectedFontSize/14)*14) + 'px',
    })

    useEffect(() => {
        dispatch(setIsClLayoutLoading(false));
    }, []);

    useEffect(() => {
        setStyleObject({
            paraFontColor: '#' + selectedColor,
            titleFontColor: '#' + selectedColor,
            subTileFontColor: '#' + colors[selectedColor],
            titleFontSize: ((selectedFontSize/14)*48) + 'px',
            subTileFontSize: ((selectedFontSize/14)*48) + 'px',
            h2FontSize: ((selectedFontSize/14)*19) + 'px',
            h3FontSize: ((selectedFontSize/14)*19) + 'px',
            paraFontSize: ((selectedFontSize/14)*14) + 'px',
        })
    }, [selectedFontSize, selectedColor]);

    return (
        <div style={{ display: 'none' }} id="cl-layout-outerdiv" >
            <div style={{width: '800px', height: '1100px', color: styleObject.paraFontColor}}  id="resume-template">
                <style>
                    {`
                        h1, h2, h3, h4, h5, h6, p {
                            margin:0px
                        }
                        li, table {
                            margin-top:0px; margin-bottom:0px 
                        }
                        h1 {
                            margin-top:14px; margin-bottom:0px; page-break-inside:avoid; page-break-after:avoid; line-height:normal; font-family:'Source Sans Pro'; font-size:27px; font-weight:normal; text-transform:uppercase; color:#000000 
                        }
                        h2 {
                            margin-top:0px; margin-bottom:14px; page-break-inside:avoid; page-break-after:avoid; line-height:normal; font-family:'Bookman Old Style'; font-size:${styleObject.h3FontSize}; font-weight:normal; text-transform:uppercase; color:${styleObject.paraFontColor} 
                        }
                        h3 {
                            margin-top:0px; margin-bottom:0px; page-break-inside:avoid; page-break-after:avoid; line-height:normal; font-family:'Source Sans Pro'; font-size:${styleObject.h3FontSize}; font-weight:bold; color:${styleObject.paraFontColor} 
                        }
                        h4 {
                            margin-top:0px; margin-bottom:0px; page-break-inside:avoid; page-break-after:avoid; line-height:29px; font-family:'Source Sans Pro'; font-size:19px; font-weight:bold; font-style:normal; color:#718eb5 
                        }
                        h5 {
                            margin-top:3px; margin-bottom:0px; page-break-inside:avoid; page-break-after:avoid; line-height:normal; font-family:'Bookman Old Style'; font-size:14px; font-weight:normal; color:#465870 
                        }
                        h6 {
                            margin-top:3px; margin-bottom:0px; page-break-inside:avoid; page-break-after:avoid; line-height:normal; font-family:'Bookman Old Style'; font-size:14px; font-weight:normal; color:#2f3a4b 
                        }
                        .BalloonText {
                            margin-top:0px; margin-bottom:0px; line-height:normal; font-family:'Segoe UI'; font-size:14px; color:#000000; -aw-style-name:balloon-text 
                        }
                        .BodyText {
                            margin-top:0px; margin-bottom:8px; line-height:normal; font-size:14px; color:#000000; -aw-style-name:body-text 
                        }
                        .paraText {
                            font-size:${styleObject.paraFontSize}; color:${styleObject.paraFontColor}; -aw-style-name:body-text 
                        }
                        .Footer {
                            margin-top:0px; margin-bottom:0px; line-height:normal; font-size:14px; color:#000000; -aw-style-name:footer 
                        }
                        .Header { 
                            margin-top:0px; margin-bottom:0px; line-height:normal; font-size:14px; color:#000000; -aw-style-name:header 
                        }
                        .ListParagraph {
                            margin-top:0px; margin-left:24px; margin-bottom:4px; text-indent:-18pt; line-height:normal; font-size:14px; color:#000000; -aw-style-name:list-paragraph 
                        }
                        .NoSpacing {
                            margin-top:0px; margin-bottom:0px; line-height:75%; font-size:17px; color:#434343; -aw-style-name:no-spacing
                        }
                        .ProfilePicture {
                            margin-top:45px; margin-bottom:0px; line-height:normal; font-size:14px; color:#000000; -aw-style-name:'Profile Picture'
                        }
                        .Subtitle {
                            margin-top:0px; margin-bottom:4pt; line-height:normal; font-family:'Bookman Old Style'; font-size:${styleObject.subTileFontSize}; text-transform:uppercase; letter-spacing:4.5pt; color:${styleObject.subTileFontColor}; -aw-style-name:subtitle
                        }
                        .Title {
                            margin-top:32px; margin-bottom:0px; line-height:normal; font-family:'Bookman Old Style'; font-size:${styleObject.titleFontSize}; text-transform:uppercase; letter-spacing:4.5pt; color:${styleObject.titleFontColor}; -aw-style-name:title
                        }
                        span.BalloonTextChar {
                            font-family:'Segoe UI'; font-size:14px; color:#000000
                        }
                        span.BodyTextChar {
                            font-size:14px; color:#000000
                        }
                        span.FooterChar {
                            font-size:14px; color:#000000
                        }
                        span.HeaderChar {
                            font-size:14px; color:#000000
                        }
                        span.Heading1Char {
                            font-size:27px; text-transform:uppercase; color:#000000
                        }
                        span.Heading2Char {
                            font-family:'Bookman Old Style'; font-size:19px; text-transform:uppercase; color:#000000
                        }
                        span.Heading3Char {
                            font-size:14px; font-weight:bold; color:#000000 
                        }
                        span.Heading4Char {
                            font-size:19px; font-weight:bold; color:#718eb5
                        }
                        span.Heading5Char {
                            font-family:'Bookman Old Style'; color:#465870
                        }
                        span.Heading6Char {
                            font-family:'Bookman Old Style'; color:#2f3a4b
                        }
                        span.Hyperlink {
                            text-decoration:underline; color:#0563c1; -aw-style-name:hyperlink
                        }
                        span.PlaceholderText {
                            color:#808080; -aw-style-name:placeholder-text
                        }
                        span.Strong {
                            font-weight:bold; color:#5f483e; -aw-style-name:strong
                        }
                        span.SubtitleChar {
                            font-family:'Bookman Old Style'; font-size:48px; text-transform:uppercase; letter-spacing:4.5pt; color:#465870
                        }
                        span.TitleChar {
                            font-family:'Bookman Old Style'; font-size:48px; text-transform:uppercase; letter-spacing:4.5pt; color:#000000
                        }
                        span.UnresolvedMention1 {
                            color:#605e5c; background-color:#e1dfdd; -aw-style-name:'Unresolved Mention1'
                        }
                        .CurrentList1 {
                            margin-left:32.2pt; text-indent:-18pt; -aw-style-name:'Current List1'
                        }
                        .CurrentList2 { margin-left:32.2pt; text-indent:-18pt; -aw-style-name:'Current List2' }
                        .CurrentList3 { margin-left:24px; text-indent:-18pt; -aw-style-name:'Current List3' }
                    `}
                </style>
                <div id="html_cl_template_2" style={{ width: '800px', height: '1050px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ minHeight: '1050px', textAlign: 'center' }}>
                        <table
                        cellSpacing="0"
                        cellPadding="0"
                        style={{
                            width: '91.76%',
                            marginRight: 'auto',
                            marginLeft: '0px',
                            borderCollapse: 'collapse',
                            minHeight: '1100px',
                        }}
                        >
                        <tbody>
                            <tr>
                                {children}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverletterLayout;
