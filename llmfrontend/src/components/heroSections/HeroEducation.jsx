import {useState, useRef, useEffect} from 'react'
import { Container } from '../Container'
import {useSelector} from "react-redux";

export function HeroEducation() {

    const user = useSelector(state => state.user.profile);




  return (
    <Container className="text-center mt-6 mb-6" >
        <main className="mx-auto mt-2 max-w-7xl px-4 px-6 sm:mt-24 lg:mt-32 sm:mb-24 lg:mb-32">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
                    <div>

                        <span className="mt-1 block text-4xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
                  <span className="block text-gray-900 mt-6 mb-6">Train Smarter, Succeed Faster</span>
                  <span className="block bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text mt-6 mb-6">
                          AI-Powered<br/> Career Advancement
                        </span>
                </span>
                    </div>

                    <div className="mt-4 flex justify-center gap-x-6">
                        <div className="p-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-[30px] flex justify-center items-center">
                            <button className="w-[228px] h-9 text-white text-[20px] font-bold font-gotham flex items-center justify-center">
                                Request Demo
                            </button>
                        </div>
                    </div>

                </div>
                <div className="inline-flex flex-col justify-start items-start gap-2">
                    <div className="w-[667.96px] h-96 relative">
                        <div className="w-[574.95px] h-96 left-[18.60px] top-0 absolute bg-white rounded-[34.45px] shadow-[0px_26.786399841308594px_117.19049835205078px_0px_rgba(32,36,138,0.06)]" />
                        <div className="w-44 h-32 left-[472.65px] top-[72.07px] absolute">
                            <div className="w-44 h-32 left-0 top-0 absolute bg-red-600/0 rounded-3xl shadow-[0px_38.755340576171875px_98.58203125px_0px_rgba(32,36,138,0.09)]" />
                            <div className="w-44 h-32 left-0 top-0 absolute bg-white rounded-[28.53px]" />
                            <div className="w-36 left-[17.69px] top-[19.97px] absolute inline-flex flex-col justify-start items-start gap-3.5">
                                <div className="self-stretch inline-flex justify-start items-start gap-1">
                                    <div className="w-5 h-5 relative">
                                        <div className="w-5 h-5 left-0 top-0 absolute bg-blue-700/60" />
                                    </div>
                                    <div className="w-24 h-5 bg-zinc-200 rounded-2xl" />
                                </div>
                                <div className="self-stretch pl-5 inline-flex justify-start items-start gap-1">
                                    <div className="w-24 h-7 opacity-40 bg-zinc-200 rounded-[20px]" />
                                    <div className="w-5 h-5 relative">
                                        <div className="w-5 h-5 left-0 top-0 absolute opacity-40 bg-blue-700/10" />
                                    </div>
                                </div>
                                <div className="inline-flex justify-start items-center gap-1">
                                    <div className="w-5 h-5 relative">
                                        <div className="w-5 h-5 left-0 top-0 absolute bg-blue-700/60" />
                                    </div>
                                    <div className="w-9 h-2.5 relative">
                                        <div className="w-2.5 h-2.5 left-0 top-0 absolute opacity-40 bg-slate-400" />
                                        <div className="w-2.5 h-2.5 left-[13px] top-0 absolute opacity-40 bg-slate-400" />
                                        <div className="w-2.5 h-2.5 left-[26px] top-0 absolute opacity-40 bg-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-56 h-24 left-[217.30px] top-[264.84px] absolute">
                            <div className="w-56 h-24 left-0 top-0 absolute">
                                <div className="w-56 h-24 left-0 top-0 absolute">
                                    <div className="w-52 h-24 left-[7.41px] top-[3.89px] absolute bg-red-600/0 rounded-3xl shadow-[0px_38.755340576171875px_98.58203125px_0px_rgba(32,36,138,0.09)]" />
                                    <div className="w-56 h-24 left-0 top-0 absolute bg-white rounded-[28.53px]" />
                                </div>
                                <div className="w-24 h-[3.41px] left-[14.37px] top-[14.73px] absolute">
                                    <div className="w-24 h-[3.41px] left-0 top-0 absolute bg-slate-400 rounded-[33.48px]" />
                                </div>
                                <div className="w-36 h-[3.41px] left-[14.37px] top-[24.03px] absolute">
                                    <div className="w-36 h-[3.41px] left-0 top-0 absolute bg-slate-400 rounded-[33.48px]" />
                                </div>
                                <div className="w-24 h-[3.41px] left-[14.37px] top-[33.34px] absolute">
                                    <div className="w-24 h-[3.41px] left-0 top-0 absolute bg-slate-400 rounded-[33.48px]" />
                                </div>
                                <div className="w-36 h-3 left-[14.37px] top-[42.64px] absolute">
                                    <div className="w-24 h-[3.41px] left-0 top-0 absolute bg-slate-400 rounded-[33.48px]" />
                                    <div className="w-36 h-[3.41px] left-0 top-[9.30px] absolute">
                                        <div className="w-36 h-[3.41px] left-0 top-0 absolute bg-slate-400 rounded-[33.48px]" />
                                    </div>
                                </div>
                                <div className="w-52 h-4 left-[10.15px] top-[75.54px] absolute">
                                    <div className="w-52 h-4 left-0 top-0 absolute">
                                        <div className="w-52 h-4 left-0 top-0 absolute bg-neutral-300/40 rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-48 h-14 left-0 top-[17.37px] absolute">
                            <div className="w-48 h-14 left-0 top-0 absolute bg-slate-100/70 rounded-[30.48px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-[0.50px] border-white/70" />
                            <div className="w-36 h-11 left-[27.90px] top-[6.08px] absolute text-center justify-center text-blue-700/40 text-lg font-bold font-['Rethink_Sans'] leading-[48px]">Mock Interview</div>
                        </div>
                        <div className="w-48 h-14 left-0 top-[90.30px] absolute">
                            <div className="w-48 h-14 left-0 top-0 absolute bg-slate-100/70 rounded-[30.48px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-[0.50px] border-white/70" />
                            <div className="w-40 h-11 left-[18.60px] top-[6.08px] absolute text-center justify-center text-blue-700/40 text-base font-bold font-['Rethink_Sans'] leading-[48px]">Scenario Interview</div>
                        </div>
                        <div className="w-32 h-3.5 left-[38.48px] top-[64.55px] absolute">
                            <div className="w-32 h-3.5 left-0 top-0 absolute rounded-[30px]" />
                        </div>
                        <div className="w-60 h-44 left-[217.30px] top-[72.94px] absolute">
                            <div className="w-60 h-44 left-0 top-0 absolute bg-violet-50 rounded-[30.48px]" />
                            <div className="w-24 h-4 left-[14.44px] top-[14.32px] absolute">
                                <div className="w-20 h-2.5 left-[21.59px] top-[3.36px] absolute bg-slate-300 rounded-[30px]" />
                                <div className="w-4 h-4 left-0 top-0 absolute bg-blue-700/60 rounded-full" />
                            </div>
                            <div className="w-14 h-14 left-[91.34px] top-[67.59px] absolute">
                                <div className="w-14 h-14 left-0 top-0 absolute">
                                    <div className="w-6 h-8 left-[17.78px] top-[11.41px] absolute bg-slate-500/20" />
                                </div>
                                <div className="w-14 h-14 left-0 top-0 absolute">
                                    <div className="w-14 h-14 left-0 top-0 absolute rounded-full border border-slate-300" />
                                </div>
                            </div>
                        </div>
                        <div className="w-14 h-2 left-[452.96px] top-[35.67px] absolute bg-zinc-200 rounded-[33.48px]" />
                        <div className="w-10 h-10 left-[521.69px] top-[19.97px] absolute bg-violet-200 rounded-[34.08px]" />
                        <div className="w-10 h-10 left-[521.69px] top-[19.97px] absolute">
                            <div className="w-10 h-10 left-0 top-0 absolute bg-sky-100 rounded-[41.95px]" />
                            <div className="w-14 h-14 left-[-5.47px] top-[0.58px] absolute" />
                        </div>
                        <div className="w-48 h-48 left-[472.65px] top-[211px] absolute">
                            <div className="w-48 h-48 left-0 top-0 absolute">
                                <div className="w-44 h-44 left-[6.28px] top-[7.41px] absolute bg-red-600/0 rounded-3xl shadow-[0px_38.755340576171875px_98.58203125px_0px_rgba(32,36,138,0.09)] border-1 border-white" />
                                <div className="w-48 h-48 left-0 top-0 absolute bg-white rounded-[28.53px] border-[1.19px] border-white" />
                            </div>
                            <div className="w-44 h-44 left-[5.60px] top-[4.44px] absolute">
                                <div className="w-4 h-40 left-[156.98px] top-[19.86px] absolute bg-gradient-to-b from-indigo-200 to-indigo-50 shadow-[3px_6px_15px_0px_rgba(118,142,176,0.25)] border border-white" />
                                <div className="w-4 h-24 left-[133.25px] top-[91.85px] absolute bg-indigo-50 shadow-[3px_6px_15px_0px_rgba(118,142,176,0.25)] border border-white" />
                                <div className="w-4 h-11 left-[109.52px] top-[135.92px] absolute bg-gradient-to-b from-slate-200 to-sky-50 shadow-[3px_6px_15px_0px_rgba(118,142,176,0.25)] border border-white" />
                                <div className="w-4 h-16 left-[85.79px] top-[112.33px] absolute bg-gradient-to-b from-violet-100 to-indigo-50 shadow-[3px_6px_15px_0px_rgba(118,142,176,0.25)] border border-white" />
                                <div className="w-4 h-7 left-[62.06px] top-[153.92px] absolute bg-indigo-50 shadow-[3px_6px_15px_0px_rgba(118,142,176,0.25)] border border-white" />
                                <div className="w-24 h-24 left-0 top-[16.76px] absolute bg-blue-700/30 rounded-full shadow-[0px_10px_20px_0px_rgba(118,142,176,0.25)] border border-white" />
                                <div className="w-16 h-16 left-[48.07px] top-0 absolute bg-indigo-200 shadow-[-1px_3px_15px_0px_rgba(24,35,66,0.10)] border border-white" />
                            </div>
                        </div>
                        <div className="w-52 h-7 left-[227.45px] top-[26.92px] absolute">
                            <div className="w-52 h-7 left-0 top-0 absolute">
                                <div className="w-6 h-7 left-0 top-0 absolute">
                                    <div className="w-6 h-7 left-0 top-0 absolute bg-indigo-200 rounded-full" />
                                    <div data-size="48" className="w-4 h-5 left-[4.23px] top-[3.47px] absolute overflow-hidden">
                                        <div className="w-3.5 h-4 left-[2.22px] top-[1.52px] absolute outline outline-[1.60px] outline-offset-[-0.80px] outline-white" />
                                    </div>
                                </div>
                                <div className="w-5 h-0 left-[25.37px] top-[13.89px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
                                <div className="w-6 h-7 left-[44.81px] top-0 absolute">
                                    <div className="w-6 h-7 left-0 top-0 absolute">
                                        <div className="w-6 h-7 left-0 top-0 absolute">
                                            <div className="w-6 h-7 left-0 top-0 absolute bg-blue-700/30 rounded-full" />
                                        </div>
                                        <div className="w-5 h-5 left-[2.40px] top-[1.86px] absolute">
                                            <div className="w-5 h-5 left-0 top-0 absolute bg-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-6 h-7 left-[134.44px] top-0 absolute">
                                    <div className="w-6 h-7 left-0 top-0 absolute">
                                        <div className="w-6 h-7 left-0 top-0 absolute bg-blue-700/60 rounded-full" />
                                    </div>
                                    <div className="w-3 h-4 left-[7.54px] top-[5.31px] absolute">
                                        <div className="w-3 h-4 left-0 top-0 absolute bg-white" />
                                    </div>
                                </div>
                                <div className="w-6 h-7 left-[89.63px] top-0 absolute">
                                    <div className="w-6 h-7 left-0 top-0 absolute">
                                        <div className="w-6 h-7 left-0 top-0 absolute bg-blue-700/50 rounded-full" />
                                    </div>
                                    <div className="w-3.5 h-4 left-[5.83px] top-[4.45px] absolute">
                                        <div className="w-3.5 h-4 left-0 top-0 absolute bg-white" />
                                    </div>
                                </div>
                                <div className="w-6 h-7 left-[179.25px] top-0 absolute">
                                    <div className="w-6 h-7 left-0 top-0 absolute">
                                        <div className="w-6 h-7 left-0 top-0 absolute bg-blue-700/70 rounded-full" />
                                    </div>
                                    <div className="w-4 h-3.5 left-[4.11px] top-[6.17px] absolute">
                                        <div className="w-4 h-3.5 left-0 top-0 absolute bg-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-5 h-0 left-[70.18px] top-[13.89px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
                            <div className="w-5 h-0 left-[114.99px] top-[13.89px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
                            <div className="w-5 h-0 left-[159.80px] top-[13.89px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
                        </div>
                        <div className="w-40 h-48 left-[33.82px] top-[168.45px] absolute">
                            <div className="w-40 h-48 left-0 top-0 absolute">
                                <div className="w-40 h-48 left-0 top-0 absolute">
                                    <div className="w-40 h-44 left-[5.28px] top-[7.41px] absolute bg-red-600/0 rounded-3xl shadow-[0px_38.755340576171875px_98.58203125px_0px_rgba(32,36,138,0.09)] border-1 border-white" />
                                    <div className="w-40 h-48 left-0 top-0 absolute bg-violet-50 rounded-[28.53px] border-[1.19px] border-white" />
                                </div>
                                <div className="w-28 h-28 left-[26.21px] top-[7.81px] absolute">
                                    <div className="w-28 h-28 left-0 top-0 absolute bg-blue-700/50 rounded-full" />
                                    <img className="w-16 h-24 left-[20.61px] top-[6.63px] absolute" src="https://placehold.co/71x102" />
                                </div>
                            </div>
                            <div className="w-8 h-11 left-[63.41px] top-[131.98px] absolute">
                                <div className="w-11 h-1 left-[15.56px] top-[0.01px] absolute origin-top-left rotate-[-90.08deg] bg-slate-300 rounded-[30px]" />
                                <div className="w-8 h-1 left-[9.62px] top-[6.95px] absolute origin-top-left rotate-[-90.08deg] bg-slate-300 rounded-[30px]" />
                                <div className="w-4 h-1 left-[3.69px] top-[14.77px] absolute origin-top-left rotate-[-90.08deg] bg-slate-300 rounded-[30px]" />
                                <div className="w-4 h-1 left-[33.28px] top-[14.77px] absolute origin-top-left rotate-[-90.08deg] bg-slate-300 rounded-[30px]" />
                                <div className="w-8 h-1 left-[27.38px] top-[6.95px] absolute origin-top-left rotate-[-90.08deg] bg-slate-300 rounded-[30px]" />
                                <div className="w-11 h-1 left-[21.48px] top-[0.01px] absolute origin-top-left rotate-[-90.08deg] bg-slate-300 rounded-[30px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>


    </Container>
  )
}
