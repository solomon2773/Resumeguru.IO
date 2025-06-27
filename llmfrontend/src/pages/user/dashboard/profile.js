import React, {  useEffect, useState, useRef, Suspense } from "react";
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {useAuth} from "../../../context/AuthContext";
import { Dropdown } from "flowbite-react";
import { toast } from 'react-toastify';
import UserDashboardCommonLayout from "../../../components/Layout/UserDashboardLayout";

import {uploadFilePublic} from "../../../helpers/s3/s3client";
import Image from 'next/image'
import {useSelector} from "react-redux";
import countryList from "../../../utils/staticObjects/countryList";

const validationSchema = Yup.object().shape({
    firstName: Yup.lazy(() =>
      Yup.string()
        .required('First Name is required')
    ),
    lastName: Yup.lazy(() =>
      Yup.string()
        .required('Last Name is required')
    ),
    email: Yup.lazy(() =>
        Yup.string()
            .email('Invalid email')
            .required('Email is required')
    ),
    about: Yup.lazy(() =>
        Yup.string()
            .test('no-code', 'No HTML tags or JavaScript code allowed', value => {
                // Regular expression to check for <tag>, </tag>, <tag/>, <tag attribute="value">
                const htmlRegex = /<\/?[a-z][\s\S]*>/i;
                // Regular expression to check for function, var, let, const, for, while
                const jsRegex = /\b(function|var|let|const|for|while)\b/i;

                // If it matches either regex, return false (invalid), else return true (valid)
                return !(htmlRegex.test(value) || jsRegex.test(value));
            })
        ),
    // website: Yup.lazy(() =>
    //     Yup.string()
    //         .url('Must be a valid URL')
    //     ),
});


const Profile =  ({authorId}) => {


    // const router = useRouter()
    const user = useSelector(state => state.user.profile)
    const {   updateMergeUserData, updateCredits } = useAuth()
    const [selectedCountry, setSelectedCountry] = useState( {
        id: 0,
        countryName: "NA",
        countryDisplayName: "Please select a country",
        country2LetterName: "NA",
        countryCode: ""
    });

    useEffect(() => {
        if (user && user.country){
            setSelectedCountry(user.country)
        }
        if (user && user.profileImage && user.profileImage.key) {
            setProfileImage(process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/" + user.profileImage.bucket+"/"+user.profileImage.key)
        }
        // else if ( user && user.bannerImage && user.bannerImage.key) {
        //        setBannerImage(process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/" + user.bannerImage.bucket+"/"+user.bannerImage.key)
        // }

    },[user]);



    const initialValues = {
        firstName: user && user.firstName ? user.firstName : '',
        lastName: user && user.lastName ? user.lastName : '',
        phoneNumber: user && user.phoneNumber ? user.phoneNumber : '',
        country: user && user.country ? user.country : '',
        city: user && user.city ? user.city : '',
        region: user && user.region ? user.region : '',
        about: user && user.about ? user.about : '',
        website: user && user.website ? user.website : '',
        linkedin: user && user.linkedin ? user.linkedin : '',
        email : user && user.emailHistory && user.emailHistory.length > 0 ? user.emailHistory[user.emailHistory.length - 1] : user.email,
        registeredEmail : user && user.email ? user.email : '',
    };
    // console.log(initialValues)
    const [profileImage , setProfileImage] = useState( '');
    const [bannerImage , setBannerImage] = useState(  '');

    const handleSubmitForm = async (data) => {

        updateMergeUserData(user.userId,
            {
                firstName:data.firstName,
                lastName:data.lastName,
                phoneNumber:data.phoneNumber ? data.phoneNumber : '',
                country:selectedCountry,
                city:data.city ? data.city : '',
                email:data.email,
                region:data.region ? data.region : '',
                about:data.about ? data.about : '',
                website:data.website ? data.website : '',
                linkedin:data.linkedin ? data.linkedin : '',
            }).then((result) => {
            //    console.log(result)
           //reloadRealmUser().then(() => {
                toast.success('Profile updated successfully');
          // })

        })

    }






    const handleSubmitProfilePicture = async () => {

        const files = document.getElementById("upload_profile_img").files;
        if (!files.length) {
            return alert("Please choose a file to upload first.");
        }

        const file = files[0];
        // Check if the file type is either jpg or png
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.error('Only JPG and PNG files are allowed.');
            files.value = ''; // Reset the file input for new selection
            return ;
        }
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
        }

        reader.onloadend = () => {
            const base64String = reader.result;
            const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const fileNameBuffer = encodeURIComponent(file.name.replace(/ /g, '-'));
            // setProfileImage(process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/" + userImage.bucket+"/"+user.userId+"/"+fileNameBuffer);
            uploadFilePublic('userProfileImages', {
                data: buffer,
                userId: user.userId,
                type: file.type,
                size: file.size,
                name: fileNameBuffer,

            })
                .then((data) => {
                    // console.log(data.$metadata)
                    updateMergeUserData(user.userId,
                        {
                            profileImage:{
                                // location:data.Location,
                                key:user.userId+"/"+fileNameBuffer,
                                bucket:"userProfileImages",
                                size:file.size,
                                type:file.type,
                            },
                        }).then((data) =>{
                   //     reloadRealmUser().then(() => {
                           // console.log(user)
                            toast.success('Profile picture updated successfully');
                     //   })


                    })

                })
        };


    }

    // const handleSubmitBannerPicture = async () => {
    //
    //         const files = document.getElementById("upload_banner_img").files;
    //         if (!files.length) {
    //             return alert("Please choose a file to upload first.");
    //         }
    //         const file = files[0];
    //     // Check if the file type is either jpg or png
    //     if (!['image/jpeg', 'image/png'].includes(file.type)) {
    //         return alert('Only JPG and PNG files are allowed.');
    //     }
    //     const reader = new FileReader();
    //     if (file) {
    //         reader.readAsDataURL(file);
    //     }
    //
    //     reader.onloadend = () => {
    //         const base64String = reader.result;
    //         const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    //         const fileNameBuffer = encodeURIComponent(file.name.replace(/ /g, '-'));
    //
    //         uploadFilePublic('userProfileBanners', {
    //             data: buffer,
    //             userId: user.userId,
    //             type: file.type,
    //             size: file.size,
    //             name: fileNameBuffer,
    //
    //         }).then((data) => {
    //             // console.log(data.$metadata)
    //             updateMergeUserData(user.userId,
    //                 {
    //                     bannerImage:{
    //                         // location:data.Location,
    //                         key:user.userId+"/"+fileNameBuffer,
    //                         bucket:"userProfileBanners",
    //                         size:file.size,
    //                         type:file.type,
    //                     },
    //                 }).then((data) =>{
    //                 reloadRealmUser().then(() => {
    //                     // console.log(user)
    //                     toast.success('Profile picture updated successfully');
    //                 })
    //             })
    //
    //         })
    //     }
    //
    // }
    const handleCountrySelect = (country) => {
       // console.log(country)
        setSelectedCountry(country);
    };
    return (
        <UserDashboardCommonLayout
            parent="home"
            title="User Dashboard - User Profile"
            meta_title="User Dashboard - User Profile"
            meta_desc="User Dashboard - User Profile"
            ogType={"website"}
            ogUrl={process.env.SITE_URL+"/dashboard/profile/"}
            ogImage={user && user.profileImage ? user.profileImage.url : ''}

        >

            <h1 className="sr-only">User Profile</h1>
            {user && user.userId && (
                <div className="mx-auto max-w-7xl px-6 pb-6 pt-20 sm:pt-6 lg:px-3 lg:pt-6">
                    <Formik
                        enableReinitialize
                        validationSchema={validationSchema}
                        initialValues={initialValues}
                        // validateOnMount={validationSchema.isValidSync(initialValues)}
                        onSubmit={async (values, {setSubmitting, resetForm}) => {
                            // console.log(values)

                            setSubmitting(true);
                            await handleSubmitForm(values);
                            setSubmitting(false);
                            // resetForm();
                        }}
                    >
                        {
                            ({values, isSubmitting, isValid}) => {
                                return (
                                    <Form className="form-border w-100">
                                        <div className="space-y-12">
                                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                                <div>
                                                    <h2 className="text-base font-semibold leading-7 text-gray-900">Account Information</h2>
                                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                                        This is your registration information. You can not change this email address.
                                                    </p>
                                                </div>

                                                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                                    <div className="sm:col-span-4">
                                                        <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Registered Email
                                                        </label>
                                                        <div className="mt-2">
                                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                                <Field
                                                                    type="text"
                                                                    name="registeredEmail"
                                                                    id="registeredEmail"
                                                                    disabled
                                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                                <div>
                                                    <h2 className="text-base font-semibold leading-7 text-gray-900">Public Information</h2>
                                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                                        This information will be displayed publicly. So, more people can know about you and contact you for networking. You can also update your profile picture which will be used for your resume and cover letter.
                                                    </p>
                                                </div>

                                                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                                    <div className="sm:col-span-4">
                                                        <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Website
                                                        </label>
                                                        <div className="mt-2">
                                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                                <Field
                                                                    type="text"
                                                                    name="website"
                                                                    id="website"
                                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                    placeholder="www.example.com"
                                                                />
                                                                <ErrorMessage name="website" component="div" style={{color:"red"}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-4">
                                                        <label htmlFor="linkedin" className="block text-sm font-medium leading-6 text-gray-900">
                                                            LinkedIn
                                                        </label>
                                                        <div className="mt-2">
                                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                                <Field
                                                                    type="text"
                                                                    name="linkedin"
                                                                    id="linkedin"
                                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                    placeholder="https://www.linkedin.com/in/Steve-Jobs-52596119/"
                                                                />
                                                                <ErrorMessage name="linkedin" component="div" style={{color:"red"}}/>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="col-span-full">
                                                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                                            About
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                component="textarea" name="about"
                                                                id="about"
                                                                rows={4}
                                                                className="p-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                                                            />
                                                            <ErrorMessage name="about" component="div" style={{color:"red"}}/>

                                                        </div>
                                                        <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                                                    </div>

                                                    <div className="col-span-full">
                                                        <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Photo
                                                        </label>
                                                        <div className="mt-2 flex items-center gap-x-3">
                                                            {user && user.profileImage && user.profileImage.key && profileImage ? (
                                                                <img
                                                                    src={profileImage }
                                                                    width={120}
                                                                    height={120}
                                                                    id="click_profile_img"
                                                                    className="d-profile-img-edit img-fluid"
                                                                    alt={"User "+user.firstName+" "+user.lastName+" thumbnails"}
                                                                    style={{width: '120px', height: '120px', objectFit: 'cover', marginLeft: "auto",marginRight: "auto"}}
                                                                />
                                                            ) : (

                                                                <Image
                                                                    src={"/images/author-placeholder.jpg"}
                                                                    id="click_profile_img_default"
                                                                    width={120}
                                                                    height={120}
                                                                    className="d-profile-img-edit img-fluid"
                                                                    alt="default profile image"
                                                                    style={{width: '120px', height: '120px', objectFit: 'cover', marginLeft: "auto",marginRight: "auto"}}
                                                                />
                                                            )}

                                                            <input name="profile_image" type="file" id="upload_profile_img" className="mx-auto block"
                                                                   onChange={handleSubmitProfilePicture}/>
                                                        </div>
                                                    </div>

                                                    {/*<div className="col-span-full">*/}
                                                    {/*    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                    {/*        Banner Photo*/}
                                                    {/*    </label>*/}
                                                    {/*    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">*/}
                                                    {/*        <div className="text-center">*/}
                                                    {/*            /!*<PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />*!/*/}

                                                    {/*            <div className="mt-4 flex text-sm leading-6 text-gray-600">*/}
                                                    {/*                <label*/}
                                                    {/*                    htmlFor="upload_banner_img"*/}
                                                    {/*                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"*/}
                                                    {/*                >*/}
                                                    {/*                    <span>Upload a file</span>*/}
                                                    {/*                    <input id="upload_banner_img" name="upload_banner_img" onChange={handleSubmitBannerPicture} type="file" className="sr-only" />*/}
                                                    {/*                </label>*/}
                                                    {/*                <p className="pl-1">or drag and drop</p>*/}
                                                    {/*            </div>*/}
                                                    {/*            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>*/}
                                                    {/*        </div>*/}
                                                    {/*    </div>*/}
                                                    {/*</div>*/}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                                                <div>
                                                    <h2 className="text-base font-semibold leading-7 text-gray-900">Resume Information</h2>
                                                    <p className="mt-1 text-sm leading-6 text-gray-600">Resume information will be used to popular your resume, cover letter, linkedIn message and any related document.</p>
                                                    <p className="mt-1 text-sm leading-6 text-gray-600"> Update all fields here and get bonus AI credits.</p>
                                                </div>

                                                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                                            First name
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                type="text"
                                                                name="firstName"
                                                                id="firstName"
                                                                placeholder="First Name"
                                                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                            <ErrorMessage name="firstName" component="div" style={{color:"red"}}/>
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Last name
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                type="text"
                                                                name="lastName"
                                                                id="lastName"
                                                                placeholder="Last Name"
                                                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                            <ErrorMessage name="lastName" component="div" style={{color:"red"}}/>
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-4">
                                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Email address
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                autoComplete="email"
                                                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-4">
                                                        <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Phone Number
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                id="phoneNumber"
                                                                name="phoneNumber"
                                                                type="phoneNumber"
                                                                autoComplete="phoneNumber"
                                                                placeholder="123-123-1234"
                                                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>


                                                    {/*<div className="col-span-full">*/}
                                                    {/*    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                    {/*        Street address*/}
                                                    {/*    </label>*/}
                                                    {/*    <div className="mt-2">*/}
                                                    {/*        <input*/}
                                                    {/*            type="text"*/}
                                                    {/*            name="street-address"*/}
                                                    {/*            id="street-address"*/}
                                                    {/*            autoComplete="street-address"*/}
                                                    {/*            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                    {/*        />*/}
                                                    {/*    </div>*/}
                                                    {/*</div>*/}

                                                    <div className="sm:col-span-2 sm:col-start-1">
                                                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                                            City
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                type="text"
                                                                name="city"
                                                                id="city"

                                                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                                            State / Province
                                                        </label>
                                                        <div className="mt-2">
                                                            <Field
                                                                type="text"
                                                                name="region"
                                                                id="region"

                                                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-3">

                                                        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Country
                                                        </label>

                                                        <div className="mt-2">
                                                            <Dropdown  id="country"
                                                                       name="country"
                                                                       placement="bottom"
                                                                       label={selectedCountry.countryDisplayName}

                                                                       color="white" style={{ borderColor: '#D1D5DB', borderWidth:"1px"}}>
                                                                <div className="max-h-60 overflow-auto">
                                                                    {countryList.map((country, index) => (
                                                                        <Dropdown.Item key={"country-"+index} onClick={() => handleCountrySelect(country)}>
                                                                            {country.countryDisplayName}
                                                                        </Dropdown.Item>
                                                                    ))}
                                                                </div>
                                                            </Dropdown>

                                                        </div>
                                                    </div>
                                                    {/*<div className="sm:col-span-2">*/}
                                                    {/*    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">*/}
                                                    {/*        ZIP / Postal code*/}
                                                    {/*    </label>*/}
                                                    {/*    <div className="mt-2">*/}
                                                    {/*        <input*/}
                                                    {/*            type="text"*/}
                                                    {/*            name="postal-code"*/}
                                                    {/*            id="postal-code"*/}
                                                    {/*            autoComplete="postal-code"*/}
                                                    {/*            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"*/}
                                                    {/*        />*/}
                                                    {/*    </div>*/}
                                                    {/*</div>*/}
                                                </div>
                                            </div>


                                        </div>

                                        <div className="mt-6 flex items-center justify-end gap-x-6">

                                            <button
                                                type="submit"

                                                className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                            >
                                                Save
                                            </button>

                                        </div>

                                    </Form>
                                )
                            }
                        }


                    </Formik>


                </div>
            )}

        </UserDashboardCommonLayout>
    )
}

export default Profile;


