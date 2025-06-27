import React, { useEffect, useRef, useState} from 'react'
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import Avatar from "../../../../components/mockint/Avatar";

const MockInterview = () =>{



    return (
        <UserDashboardCommonLayout
            parent="home"
            title="User Dashboard - Resume Guru"
            meta_title="User Dashboard - Resume Guru"
            meta_desc="User Dashboard - Resume Guru"
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/dashboard/"}
        >
            {/* Table Section */}

            <div className="relative p-4 w-full max-w-7xl h-full ">

                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <div className="flex justify-between items-center pb-4  rounded-t border-b dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Mock Interview
                        </h3>
                    </div>

                    <Avatar />
                </div>
            </div>
        </UserDashboardCommonLayout>
    )
}
export default MockInterview;
