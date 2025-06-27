import UserDashboardCommonLayout from "../../../components/Layout/UserDashboardLayout";
import {useSelector} from "react-redux";
import { useEffect } from 'react'
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import careerBuildingSteps from "../../../utils/staticObjects/dashboard/careerBuildingSteps";
import {handleBuildingSteps} from "../../../utils/buildingsteps";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";


const UserDashboard = () =>{

    const router = useRouter()
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.profile);
    const buildingSteps = useSelector(state => state.user.buildingSteps);


    useEffect(() => {
        const updateBuildingSteps = async() => {
            await handleBuildingSteps(dispatch, user.userId);
        }
        if ((!buildingSteps || buildingSteps.length === 0) && user && user.userId) {
            updateBuildingSteps();
        }
    }, [buildingSteps, user])

    const handleClick = async(step) => {
        window.location.replace(process.env.SITE_URL+step.route);
    }


    const handleChange = () => {
        return;
    }

    const getBuildingStepStatus = (id) => {
        const field = 'status';
        if (buildingSteps && buildingSteps.length > 0) {
            const step = buildingSteps.find(step => step.stepId === id);
            return step ? step[field] : false;
        } else {
            return false;
        }
    };

    return (
        <UserDashboardCommonLayout
            parent="home"
            title="User Dashboard - Resume Guru Welcome Page"
            meta_title="User Dashboard - Resume Guru Welcome Page"
            meta_desc="User Dashboard - Resume Guru Welcome Page"
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/user/dashboard/welcome"}
        >

            {user && user.userId ? (
                <div className="mx-4 my-8">
                    <div className="bg-slate-100 rounded-xl border-2 border-blue-400">
                        <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-2 p-4">
                            {/* Left Section: User Info */}
                            <div className="col-span-1 p-4">
        <span className="text-xl text-zinc-500">
          Welcome <i className="fas fa-sparkles ml-2"></i>
        </span>
                                <br />
                                <span className="text-2xl tracking-tight font-medium text-zinc-700">
          {user.firstName}!
        </span>
                                <p className="pt-4 text-zinc-500">
                                    Use our AI tools to craft a standout resume, practice live mock
                                    interviews with Hannah, and get ready for the job market with
                                    confidence!
                                </p>
                            </div>

                            {/* Right Section: Career Building Steps */}
                            <div className="col-span-2 p-2">
                                <ul className="space-y-4">
                                    {careerBuildingSteps.map((step) => (
                                        <li
                                            key={"welcome_steps_" + step.stepId}
                                            className="flex items-start cursor-pointer space-x-4 px-2 pt-2 rounded hover:bg-gray-200 border-2 border-transparent hover:border-blue-400"
                                            onClick={() => {
                                                handleClick(step);
                                            }}
                                        >
                                            <div className="flex-shrink-0 w-4 h-4">
                                                {getBuildingStepStatus(step.stepId) ? (
                                                    <FaCheckCircle className="text-green-500 w-5 h-5" />
                                                ) : (
                                                    <FaQuestionCircle className="text-gray-500 w-5 h-5" />
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor={`checkbox-${step.stepId}`}
                                                    className="font-medium text-gray-800"
                                                >
                                                    {step.label}
                                                </label>
                                                <p className="text-sm text-gray-500">{step.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


            ):(
                <div className="flex h-screen bg-gray-100">
                    <div className="flex flex-col flex-1 w-full">
                    Loading...
                    </div>

                </div>
            )}

        </UserDashboardCommonLayout>
    )
}
export default UserDashboard
