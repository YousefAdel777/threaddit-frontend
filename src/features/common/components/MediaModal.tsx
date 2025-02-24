"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Player from "next-video/player";
import { FaX, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import 'swiper/css';
import 'swiper/css/navigation';

type Props = {
    attachments: Attachment[];
    closeModal: () => void;
}

export default function MediaModal({ attachments, closeModal }: Props) {
    return (
        <div className="fixed z-30 bg-black left-0 top-0 w-full h-full flex items-center justify-center">
            <span onClick={closeModal} className="cursor-pointer z-50 absolute right-4 top-4 text-xl text-gray-500 p-4 rounded-full hover:bg-secondary hover:bg-opacity-30 duration-200">
                <FaX className="tex-2xl" />
            </span>
            <div className="w-full">
                <Swiper
                    pagination={{
                    dynamicBullets: true,
                    }}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    modules={[Navigation]}
                >
                {
                    attachments.map((attachment) => {
                        return (
                            <SwiperSlide className="relative my-auto" key={attachment.file}>
                                {
                                attachment.file_type === "image" ?
                                    <Image
                                        src={attachment.file}
                                        alt="Post Image"
                                        width={1000}
                                        height={1000}
                                    />
                                    :
                                    <Player accentColor="#1771d7" className="overflow-hidden" src={attachment.file} />
                                }
                            </SwiperSlide>
                        )
                    })
                }
                <div style={{ width: "2rem", height: "2rem" }} className="swiper-button-next">
                    <FaChevronRight style={{ width: "1rem", height: "1rem" }} className="text-white size-6" />
                </div>
                <div style={{ width: "2rem", height: "2rem" }} className="swiper-button-prev">
                    <FaChevronLeft style={{ width: "1rem", height: "1rem" }} className="text-white size-6" />
                </div>
            </Swiper>
            </div>
        </div>
    )
}