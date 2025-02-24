"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Image from "next/image";
import Player from "next-video/player";
import { useState } from "react";
import MediaModal from "./MediaModal";

export default function MediaSwiper({ attachments }: { attachments: Attachment[] }) {
    const [showMediaModal, setShowMediaModal] = useState(false);
    return (
        <>
            {
                showMediaModal &&
                <MediaModal closeModal={() => setShowMediaModal(false)} attachments={attachments} />
            }
            <Swiper
                pagination={{
                dynamicBullets: true,
                }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                modules={[Pagination, Navigation]}
            >
            {
                attachments.map((attachment) => {
                    return (
                        <SwiperSlide onClick={() => setShowMediaModal(true)} className="relative my-auto" key={attachment.file}>
                            {
                            attachment.file_type === "image" ?
                                <Image
                                    src={attachment.file}
                                    alt="Post Image"
                                    width={300}
                                    height={300}
                                    className="max-h-96 h-96 rounded-lg"
                                />
                                :
                                <Player accentColor="#1771d7" className="max-h-96 h-96 rounded-lg overflow-hidden" src={attachment.file} />
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
        </>
    )
}