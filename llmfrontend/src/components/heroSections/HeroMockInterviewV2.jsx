import {useState, useRef, useEffect} from 'react'
import { Container } from '../Container'
import {useSelector} from "react-redux";
import {
    Briefcase,
    FileText,
    Mail,
    Mic,
    Gauge,
} from "lucide-react";

export function HeroMockInterviewV2() {
    const videoRef = useRef(null);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const user = useSelector(state => state.user.profile);

    useEffect(() => {

        const handleCanPlay = () => {
           // setVideoPlaying(true);
           /// videoRef.current.play();

        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('canplay', handleCanPlay);
        }

        // Cleanup the event listener on component unmount
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('canplay', handleCanPlay);
            }
        };
    }, []);

    const playVideo = () => {
        const video = document.querySelector('video');
        if (videoPlaying) {
            video.pause();
            setVideoPlaying(false);
            return;
        } else {
            setVideoPlaying(true);
            video.play().then(r => {
                console.log(r);
            }).catch(e => {
                console.log(e);
            });
        }

    };
    const handleVideoEnd = () => {
        setVideoPlaying(false);
    };
  return (
    <Container className="text-center mt-6 mb-6" >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 px-4 py-4 max-w-7xl mx-auto lg:py-20">
            {/* Left: Headline and Button */}
            <div className="flex flex-col items-start gap-8 max-w-xl text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                    From Job Search to Offer
                </h1>
                <p className="text-3xl md:text-4xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
            One AI Assistant
          </span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-500">
            Zero Stress
          </span>
                </p>
                <a
                    href={user && user.userId ? process.env.SITE_URL+"/jobs/search" : process.env.SITE_URL+"/freecredit/startfree"}
                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold text-lg rounded-full shadow hover:opacity-90 transition">
                    Try Free
                </a>
            </div>

            {/* Right: Icon + Content row */}
            <div className="flex items-column gap-4 w-full max-w-lg">
                {/* Vertical Icon Stack with Line */}
                <div className="relative flex flex-col  pt-1 grid">
                    <div className="absolute top-0 bottom-0 w-[2px] bg-dotted-pattern bg-repeat-y bg-center bg-[length:2px_12px] opacity-40" />
                    {[Briefcase, FileText, Mail, Mic, Gauge].map((Icon, index) => (
                        <div key={index} className="w-10 h-10 bg-blue-500/80 rounded-full flex items-center justify-center mb-8 last:mb-0 z-10 text-white shadow">
                            <Icon size={20} />
                        </div>
                    ))}
                </div>

                {/* Matching Feature Cards */}
                <div className="flex flex-col gap-6 w-full">
                    {/* Frontend Engineer Card */}
                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm text-slate-800">Frontend Engineer</span>
                            <span className="text-xs px-2 py-1 rounded border border-blue-500 text-blue-500">Full-time</span>
                        </div>
                        <div className="space-y-1 mb-3">
                            <div className="w-3/4 h-1 bg-gray-300 rounded-full"></div>
                            <div className="w-1/2 h-1 bg-gray-300 rounded-full"></div>
                            <div className="w-full h-1 bg-gray-300 rounded-full"></div>
                        </div>
                        <p className="text-[11px] text-slate-600">Also posted on:</p>
                        <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 border border-blue-500 text-[10px] text-blue-500 rounded">LinkedIn</span>
                            <span className="px-2 py-0.5 border border-blue-500 text-[10px] text-blue-500 rounded">Indeed</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <a
                        href={user && user.userId ? process.env.SITE_URL+"/user/dashboard" : process.env.SITE_URL+"/freecredit/startfree"}
                        className="bg-blue-700 text-white text-sm px-4 py-2 rounded shadow-md text-left hover:opacity-90 transition">
                        Customize Resume
                    </a>
                    <a
                        href={user && user.userId ? process.env.SITE_URL+"/user/dashboard" : process.env.SITE_URL+"/freecredit/startfree"}
                        className="border border-blue-600 text-blue-600 text-sm px-4 py-2 rounded shadow text-left hover:bg-blue-50 transition">
                        Generate Cover Letter
                    </a>
                    <a
                        href={user && user.userId ? process.env.SITE_URL+"/user/dashboard" : process.env.SITE_URL+"/freecredit/startfree"}
                        className="bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm px-4 py-2 rounded shadow-md text-left font-semibold hover:opacity-90 transition"
                        >
                        Mock Interview
                    </a>
                    <a
                        href={user && user.userId ? process.env.SITE_URL+"/user/dashboard" : process.env.SITE_URL+"/freecredit/startfree"}
                        className="border border-blue-600 text-blue-600 text-sm px-4 py-2 rounded shadow text-left hover:bg-blue-50 transition">
                        Performance Analysis
                    </a>
                </div>
            </div>
        </div>
    </Container>
  )
}
