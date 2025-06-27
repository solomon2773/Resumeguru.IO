import {  Drawer , Tabs, TabsRef} from "flowbite-react";
import React, {useState, useRef} from "react";
import { HiBars2, HiSquaresPlus, HiDocumentCheck } from "react-icons/hi2";
import { GrScorecard } from "react-icons/gr";
import {useSelector, useDispatch} from "react-redux";
import {setResumeEditRightDrawer} from "../../../store/resumeEditReducer";
import SelectTemplate from "./selectTemplate";
import ResumeScoreRadialChart from '../../mockinterview/apexcharts/resumeScoreRadialChart';

const  RightDrawer =()=> {

    const dispatch = useDispatch();
    const resumeEditRightDrawer = useSelector(state => state.resumeEdit.resumeEditRightDrawer)
    const resumeEditRightDrawerTab = useSelector(state => state.resumeEdit.resumeEditRightDrawerTab)




    return (
        <>

            <Drawer className="p-0 w-96 text-sm " edge={true}  open={resumeEditRightDrawer} onClose={()=>{dispatch(setResumeEditRightDrawer(false))}} position="right"
                   >
                {/*<Drawer.Header*/}
                {/*    closeIcon={HiBars2}*/}
                {/*    title="Templates"*/}
                {/*    titleIcon={HiSquaresPlus}*/}
                {/*    onClick={() => dispatch(setResumeEditRightDrawer(false))}*/}
                {/*    className="cursor-pointer px-4 pt-4 hover:bg-gray-50 dark:hover:bg-gray-700"*/}
                {/*/>*/}
                <Drawer.Items className="p-4">
                    {resumeEditRightDrawerTab === "score" ? (
                        <Tabs aria-label="Tabs with underline" variant="underline" >
                            <Tabs.Item active title="Score" icon={GrScorecard} className="text-sm">
                                <ResumeScoreRadialChart/>

                            </Tabs.Item>
                            <Tabs.Item title="Templates" icon={HiDocumentCheck} className="text-sm">
                                <div className="grid">
                                    <SelectTemplate  />
                                </div>
                            </Tabs.Item>



                        </Tabs>
                    ) : (
                        <Tabs aria-label="Tabs with underline" variant="underline" >
                            <Tabs.Item active title="Templates" icon={HiDocumentCheck}>
                                <div className="grid">
                                    <SelectTemplate  />
                                </div>
                            </Tabs.Item>
                            <Tabs.Item  title="Score" icon={GrScorecard} >
                                <ResumeScoreRadialChart/>

                            </Tabs.Item>



                        </Tabs>
                    )}



                </Drawer.Items>
            </Drawer>
        </>
    );
}
export default RightDrawer;
