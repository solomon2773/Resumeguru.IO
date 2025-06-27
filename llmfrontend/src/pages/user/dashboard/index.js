import React, { Fragment, useState, useEffect } from 'react'
import UserDashboardCommonLayout from "../../../components/Layout/UserDashboardLayout";
import {dashboardSideBarNav} from "../../../utils/staticObjects/dashboard/dashboardNav";
import {useSelector} from "react-redux";


const UserDashboard = () =>{
    const user = useSelector(state => state.user.profile);


    return (
        <UserDashboardCommonLayout
            parent="home"
            title="User Dashboard - Resume Guru"
            meta_title="User Dashboard - Resume Guru"
            meta_desc="User Dashboard - Resume Guru"
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/dashboard/"}
        >

                <div className="bg-gray-100 py-8">
                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-5">
                        {dashboardSideBarNav.map((dashboard,dashboardIndex) => (
                            <React.Fragment key={"dashboard_index_block_"+dashboardIndex}>
                                <li
                                    key={dashboard.id}
                                    className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
                                >
                                    <div className="flex flex-1 flex-col p-8">
                                        <img className="mx-auto h-48 w-auto flex-shrink-0 " src={dashboard.imgUrl} alt={dashboard.imgAlt} />
                                        <dl className="mt-1 flex flex-grow flex-col justify-between">
                                            <dt className="sr-only">Description</dt>
                                            <dd className="text-sm text-gray-500">  {dashboard.description}</dd>


                                        </dl>
                                    </div>
                                    <div>
                                        <div className="-mt-px flex divide-x divide-gray-200">
                                            <div className="flex w-0 flex-1">
                                                <a
                                                    href={dashboard.href}
                                                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                                >
                                                    {/*{dashboard.icon}<EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />*/}
                                                    <h3 className="text-sm font-medium text-gray-900"> {dashboard.name}</h3>
                                                </a>
                                            </div>

                                        </div>
                                    </div>
                                </li>
                            </React.Fragment>

                        ))}
                    </ul>

                </div>
           

        </UserDashboardCommonLayout>
    )
}
export default UserDashboard
