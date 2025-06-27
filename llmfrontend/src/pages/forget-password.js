import React, {useState, useRef} from 'react';
import CommonLayout from "../components/Layout/MainLayout";


const ForgetPassword = () => {

    const email = useRef("");
    const [emailReset, setEmailReset] = useState(false);
     function forgotPassword(userEmail) {
      //   console.log(userEmail)
         // const FORGOT_PASSWORD = gql`
         //     mutation forgotPassword($email: String!) {
         //         forgotPassword(email: $email) {
         //             message
         //         }
         //     }
         // `;
     }




    return (
        <CommonLayout parent="home"
                      title="Forgot Password"
                        meta_title="Forgot Password"
                        meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
                        ogType={"website"}
                        ogTitle={"Forgot Password"}
                        ogDescription={"Forgot Password"}
                        ogImage={"https://resumeguru.io/images/pages/forgot-password.png"}
        >
            <main className="flex-1">
                <div className="py-6">
                    <div className="mx-auto px-4 sm:px-6 md:px-8" style={{maxWidth:"600px"}}>



                        <div className="form-group">
                            <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                FORGOT PASSWORD    </h1>
                            <h2>
                                Enter your email address below and we'll send you a link to reset your password.
                            </h2>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        ref={email}
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="form-group">
                            {/*<div*/}
                            {/*    className="g-recaptcha"*/}
                            {/*    data-sitekey="_reCAPTCHA_site_key_"*/}
                            {/*    data-size="invisible"*/}
                            {/*></div>*/}
                            {emailReset ? (
                                <div href="#" style={{width: "100%"}} className="btn btn-solid" >Processing...</div>
                            ) :(
                                <div href="#" style={{width: "100%"}}
                                     className="mt-4 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

                                     onClick={()=>{
                                    setEmailReset(true);
                                    forgotPassword().then(r => {});
                                }}>Reset Password</div>
                            )}

                        </div>

                    </div>
                </div>
            </main>
        </CommonLayout>
    )
}

export default ForgetPassword;
