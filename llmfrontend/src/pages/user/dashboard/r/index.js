import React, { useEffect, useRef, useState} from 'react'
import UserDashboardCommonLayout from "../../../../components/Layout/UserDashboardLayout";
import {convertToLocalTime} from "../../../../utils/timeConvert";
import {
    mongodbInsertReferralCode,
    uniqueReferralCode,
    mongodbGetUserReferralCodes,
    mongodbCheckUniqueReferralCode
} from "../../../../helpers/mongodb/pages/user/referralLink";
import {toast} from "react-toastify";
import ShareLinkModal from "./modals/shareLinkModal";
import DeleteLinkModal from "./modals/deleteLinkModal";
import {
     TrashIcon, AtSymbolIcon, DocumentDuplicateIcon
} from "@heroicons/react/24/outline";
import {useSelector} from "react-redux";

const UserDashboardReferralLink = () =>{

    const user = useSelector(state => state.user.profile);
    const [codeInputStyle, setCodeInputStyle] = useState('border-0');
    const [userReferralCode, setUserReferralCode] = useState("");
    const [referralCodeToShare, setReferralCodeToShare] = useState("");
    const [userReferralCodes, setUserReferralCodes] = useState({});
    const [loading, setLoading] = useState(false);
    const [tloading, setTLoading] = useState(true);
    const [openShreLinkModal, setOpenShreLinkModal] = useState(false);
    const [openDeleteLinkModal, setDeleteLinkModal] = useState(false);
    const [rcObjectId, setRcObjectId] = useState("");



    useEffect(() => {
        if (user && user.userId) {
            getUserReferralCode();
        }
        setUserReferralCode(uniqueReferralCode());
    },[user]);


    const getUserReferralCode = async () => {
        setTLoading(true);
        if (user && user.userId) {
            mongodbGetUserReferralCodes(user.userId).then((res) => {
                //console.log(res);
                if (res && res.length > 0) {
                    setUserReferralCodes(res);
                }
                setTLoading(false);
            }).catch((err) => {
               // console.log(err);
                setTLoading(false);
            });
        }
    }

    const saveUserReferralCode = async () => {
        if (userReferralCode === null || userReferralCode === undefined || userReferralCode === '') {
            setCodeInputStyle('border-1');
            return toast.error("Referral Code is required field")
        } else {
            setCodeInputStyle('border-0');
            setLoading(true);
           // console.log(userReferralCode);
            await mongodbCheckUniqueReferralCode(userReferralCode).then((res) => {
               // console.log(res);
                setLoading(false);
                if (res) {
                    return toast.error("The entered referral code already exists. Please try a different code.")
                } else  {
                    const insertResp = mongodbInsertReferralCode(userReferralCode, user.userId);
                    if (!insertResp) {
                        return toast.error("System Error .. Please try again later.")
                    }
                    getUserReferralCode();
                    setUserReferralCode(uniqueReferralCode());
                }
            }).catch((err) => {
              //  console.log(err);
                setLoading(false);
                return toast.error("System Error .. Please try again later.")
            });
        }
    }

    const handleChange = (event) => {
        setUserReferralCode(event.target.value);
    }

    const openShareLinkModal = async (event) => {
        const rCode = event.currentTarget.getAttribute('data-rcode');
        setReferralCodeToShare(rCode);
        setOpenShreLinkModal(true);
    }
    const copyLink = async (event) => {
        const rCode = event.currentTarget.getAttribute('data-rcode');

        await navigator.clipboard.writeText(process.env.SITE_URL+"/r/"+rCode);

        toast.success("Link Copied" );
    }



    const openDeleteModal = async (event) => {
        const rCode = event.currentTarget.getAttribute('data-rcode');
        const rCodeObjId = event.currentTarget.getAttribute('data-rid');
        setReferralCodeToShare(rCode);
        setRcObjectId(rCodeObjId);
        setDeleteLinkModal(true);
    }

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
            <div className="max-w-full py-2 sm:px-2 lg:px-4 lg:py-4 mx-auto">
                {/* Card */}
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                                {/* Header */}
                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                                    <div >
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                            Create Referral Link
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Refer your friend and earn AI credits for every successful referral. Share your unique link, <br/>and when your friend signs up, you get rewarded with 3000 AI credits and your friend will get rewarded with 5000 AI credits. Start referring now and enjoy the benefits!
                                        </p>

                                    </div>

                                </div>
                                {/* End Header */}

                                <div className="px-6 py-4 grid grid-cols-4 gap-3 md:flex md:items-center ">
                                    <div>
                                        <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                                            Referral Code:
                                        </label>
                                    </div>
                                    <div className="col-span-3">

                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                            <input
                                                type="text"
                                                name="newReferralCode"
                                                id="newReferralCode"
                                                value={userReferralCode}
                                                className={`${codeInputStyle} border-red-800 p-2 block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                                aria-describedby="newReferralCode"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 grid gap-3 md:flex md:items-center">
                                    <div>
                                        <div className="inline-flex gap-x-2">
                                        {
                                            loading  ? (
                                            <div className="flex justify-center items-center">
                                                <svg aria-hidden="true"
                                                    className="w-20 h-20 mx-auto animate-spin text-gray-200 dark:text-gray-600 fill-blue-600"
                                                    viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"/>
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"/>
                                                </svg>
                                            </div>
                                            ):(
                                                <div
                                                onClick={saveUserReferralCode}
                                                className="cursor-pointer py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">
                                                + Add New Referral Code
                                                </div>
                                            )
                                        }






                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-slate-900">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                                    Referral Code
                                                </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-6 py-3 text-start">
                                            <div className="flex items-center gap-x-2">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                                    Created
                                                </span>
                                            </div>
                                        </th>

                                        <th scope="col" className="px-6 py-3 text-end"></th>
                                        <th scope="col" className="px-6 py-3 text-end"></th>
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {tloading && (
                                        <tr>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center" colSpan={6}>
                                                <div className=" block mt-10 animate-spin center inline-block w-20 h-20 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>


                                    )}
                                    {userReferralCodes.length > 0 ? userReferralCodes.map((userReferralCode, rcIndex) => (
                                        <tr className="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                                        key={"rc"+rcIndex}>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <span className="block px-6 py-2">
                                                  <span className="font-mono text-sm text-blue-600 dark:text-blue-500">{userReferralCode && userReferralCode.referralCode}</span>
                                                </span>
                                            </td>
                                            <td className="h-px w-px whitespace-nowrap">
                                                <span className="block px-6 py-2">
                                                  <span className="text-sm text-gray-600 dark:text-gray-400">{convertToLocalTime(userReferralCode.createdAt)}</span>
                                                </span>
                                            </td>

                                            <td className="h-px w-px whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    className="block m-2" onClick={copyLink} data-rcode={userReferralCode.referralCode}
                                                >
                                                <span className="px-6 py-1.5">
                                                  <span className="py-1 px-2 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                                                    <DocumentDuplicateIcon className="w-5 h-5"/>
                                                    Copy Link
                                                  </span>
                                                </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="block  m-2" onClick={openShareLinkModal} data-rcode={userReferralCode.referralCode}
                                                >
                                                <span className="px-6 py-1.5">
                                                  <span className="py-1 px-2 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                                                    <AtSymbolIcon className="w-5 h-5"/>
                                                    E-mail Link
                                                  </span>
                                                </span>
                                                </button>


                                            </td>

                                            <td className="h-px w-px whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    className="block"
                                                    onClick={openDeleteModal}
                                                    data-rid={userReferralCode._id}
                                                    data-rcode={userReferralCode.referralCode}
                                                >
                                                <span className="px-6 py-1.5">
                                                  <span className="py-1 px-2 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                                                    <TrashIcon className="w-5 h-5"/>
                                                    Delete
                                                  </span>
                                                </span>
                                                </button>
                                            </td>
                                        </tr>

                                    )) :(
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                No Referral Codes Found
                                            </td>
                                        </tr>
                                        )}

                                    </tbody>
                                </table>
                                {/* End Table */}




                                {/* Footer */}

                                {/* End Footer */}
                            </div>
                        </div>
                    </div>
                </div>
                <ShareLinkModal
                    openShreLinkModal={openShreLinkModal}
                    setOpenShreLinkModal={setOpenShreLinkModal}
                    referralLink={process.env.SITE_URL + "/r/" + referralCodeToShare}
                />
                <DeleteLinkModal
                    openDeleteLinkModal={openDeleteLinkModal}
                    setDeleteLinkModal={setDeleteLinkModal}
                    referralCode={referralCodeToShare}
                    rcObjectId={rcObjectId}
                    getUserReferralCode={getUserReferralCode}
                />
            </div>
        </UserDashboardCommonLayout>
    )
}
export default UserDashboardReferralLink;
