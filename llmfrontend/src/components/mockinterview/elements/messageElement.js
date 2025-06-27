import {useSelector} from "react-redux";
import {UserCircleIcon} from "@heroicons/react/24/solid";
import React,{useEffect, useRef} from "react";

const MessageElement = ({ messages, chatId}) => {
    const userDetail  = useSelector((state) => state.user.profile);
    const user = {
        name: userDetail && userDetail.firstName ? userDetail.firstName + " " + userDetail.lastName : 'Resume Guru User',
        email: userDetail && userDetail.email ? userDetail.email : "",
        imageUrl:
            userDetail && userDetail.profileImage && userDetail.profileImage.bucket ? process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/" + userDetail.profileImage.bucket+"/"+userDetail.profileImage.key : "/images/author-placeholder.jpg",
        imageAlt: userDetail && userDetail.firstName && userDetail.lastName ?  userDetail.firstName+" "+userDetail.lastName+" thumbnails" : "",
    }
    const messageEndRef = useRef(null);

// Automatically scroll to the bottom when messages change
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
  return (
      <div className="w-full h-1/2 px-2 py-2 bg-white border border-[rgba(0,150,149,0.8)] rounded-[30px] flex justify-center items-center gap-2 overflow-auto relative">
          <div className="w-full h-full flex-column justify-start items-end gap-2 -ml-2 overflow-auto">
            {messages.map( (msg, msgIndex) =>{

                if (msg.msg_from === "user") {
                    return (
                        <div key={chatId + "_"+msg.id} className="col-start-1 col-end-13 p-2 rounded-lg">
                            <div className="p-1 bg-[rgba(255,255,255,0.5)] flex justify-center items-center">

                                <div className="w-full shadow-[0px_4px_4px_rgba(0,150,149,0.80)] rounded-[15px] text-right text-black text-xs font-normal leading-4 tracking-wide">
                                    <div className="w-full text-black text-xs font-normal leading-4 tracking-wide p-2">
                                    {msg.message}
                                    </div>
                                </div>
                                <div className=" p-2 rounded-full flex justify-center items-center">
                                    <div className=" rounded-full flex flex-col justify-start items-start">
                                        {userDetail && userDetail.firstName ? (
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={user.imageUrl}

                                                alt={userDetail.firstName ? userDetail.firstName : "" + " " + userDetail.lastName ? userDetail.lastName : ""} />
                                        ) : (
                                            <UserCircleIcon
                                                className="w-8 h-8 rounded-full"

                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div key={chatId + "_"+msg.id} className="col-start-1 col-end-13 p-2 rounded-lg p-1">
                            <div className="p-1 bg-[rgba(255,255,255,0.5)] flex justify-center items-center">
                                <div className="p-2 rounded-full flex justify-center items-center">
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src={process.env.SITE_URL+"/images/logos/rg/icons/ResumeGuru_Icon_ResumeGuru_Icon-04.svg"}
                                        alt="ResumeGuru.IO Icon"
                                    />
                                </div>
                                <div className="w-full shadow-[0px_4px_4px_rgba(3,42,245,0.60)] rounded-[15px] flex justify-center items-center">
                                    <div className="w-full text-black text-xs font-normal leading-4 tracking-wide p-2">
                                        {msg.message}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                }
            })}
              {/* Reference element to scroll into view */}
              <div ref={messageEndRef}></div>
          </div>
    </div>
  )
}

export default MessageElement;
