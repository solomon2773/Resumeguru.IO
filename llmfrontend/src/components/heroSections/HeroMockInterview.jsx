import {useState, useRef, useEffect} from 'react'
import { Container } from '../Container'
import {useSelector} from "react-redux";

export function HeroMockInterview() {
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
        <main className="mx-auto mt-2 max-w-7xl px-4 px-6 sm:mt-24 lg:mt-32 sm:mb-24 lg:mb-32">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
                    <h1>
                <span className="block text-base font-semibold text-gray-500 sm:text-lg lg:text-base xl:text-lg">
                  AI mock interviews
                </span>
                        <span className="mt-1 block text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Enhance Your Interview Skills</span>
                  <span className="block text-blue-600">with AI-Powered Mock Interviews</span>
                </span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl p-1">
                        Prepare for your next job interview with AI agent Hannah. Get real-time feedback on content and pronunciation. Practice technical and behavioral questions with ResumeGuru.IO. Get ready for your next job interview with confidence.
                    </p>
                            <div className="mt-4 flex justify-center gap-x-6">

                                <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
                                   href={user && user.userId ? process.env.SITE_URL+"/user/dashboard/mockInterview" : process.env.SITE_URL+"/freecredit/startfree"}>
                                    Start practicing today!
                                </a>

                            </div>
                </div>
                <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
                    <svg
                        fill="none"
                        width={640}
                        height={784}
                        viewBox="0 0 640 784"
                        aria-hidden="true"
                        className="absolute left-1/2 top-0 origin-top -translate-x-1/2 -translate-y-8 scale-75 transform sm:scale-100 "
                    >
                        <defs>
                            <pattern
                                x={118}
                                y={0}
                                id="4f4f415c-a0e9-44c2-9601-6ded5a34a13e"
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect x={0} y={0} fill="currentColor" width={4} height={4} className="text-gray-200" />
                            </pattern>
                        </defs>
                        <rect y={0} fill="currentColor" width={640} height={640} className="text-gray-50" />
                        <rect x={118} fill="url(#4f4f415c-a0e9-44c2-9601-6ded5a34a13e)" width={404} height={640} />
                    </svg>
                    <div className="relative mx-auto w-full rounded-lg shadow-lg ">
                        <button
                            type="button"
                            onClick={() => {
                                playVideo();
                            }}
                            className="relative block w-full overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="sr-only">Watch our AI mock interview sample video to learn more</span>
                            <video
                                src={process.env.SITE_URL+"/videos/frontpage/mockInterviewSample.mp4"}
                                className=" w-full h-full "
                                playsInline
                                onEnded={handleVideoEnd}
                                ref={videoRef}
                            />
                            <span aria-hidden="true" className="absolute inset-0 flex h-full w-full items-center justify-center">
                                {videoPlaying ? (
                                    <></>
                                ) :(
                                    <svg fill="currentColor" viewBox="0 0 84 84" className="h-20 w-20 text-blue-600" >
                                        <circle r={42} cx={42} cy={42} fill="white" opacity="0.9" />
                                        <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z" />
                                    </svg>
                                )}

                  </span>
                        </button>
                    </div>
                </div>
            </div>
        </main>

    </Container>
  )
}
