import { useDropzone } from "react-dropzone";
import { FaCloudArrowUp } from "react-icons/fa6";
import Player from "next-video/player";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight, FaImage, FaTrash } from "react-icons/fa";
import Image from "next/image";

type Props = {
    onDrop: (files: File[]) => void,
    files?: File[],
    onRemove: (index: number) => void
}

export default function PostDropzone({ onDrop, files, onRemove }: Props) {
    console.log(files);
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'video/mp4': ['.mp4'],
            'video/webm': ['.webm'],
            'video/ogg': ['.ogg'],
        },
        maxFiles: 10,
        maxSize: 100 * 1024 * 1024,
    });

    return (
        <section className="mb-5 relative">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    !files || files?.length === 0 ? 
                    <div className="flex items-center justify-center gap-3 h-40 border-dashed border-2 border-secondary rounded-lg">
                        <span className="text-sm">
                            Drag and Drop or upload media
                        </span>
                        <div className="flex cursor-pointer items-center justify-center rounded-full w-8 h-8 bg-secondary hover:bg-ternary duration-200">
                            <FaCloudArrowUp className="text-xl text-primary" />
                        </div>
                    </div>
                    :
                    <div className="flex mb-5 w-fit bg-secondary cursor-pointer hover:bg-ternary duration-100 gap-2 items-center justify-center font-semibold rounded-2xl px-4 py-2">
                        <FaImage className="text-xl text-primary" />
                        <span className="text-sm">
                            Add
                        </span>
                    </div>
                }
            </div>
            {
                    files && files?.length > 0 &&
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
                            files.map((file, i) => {
                                return (
                                    <SwiperSlide className="relative my-auto" key={file.name}>
                                        {
                                            file.type === "image/jpeg" || file.type === "image/png" ?
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt="Post Image"
                                                width={300}
                                                height={300}
                                                className="max-h-96 h-96 rounded-lg"
                                            />
                                            :
                                            <Player accentColor="#1771d7" className="max-h-96 h-96 rounded-lg overflow-hidden" src={URL.createObjectURL(file)} />
                                        }
                                        <span className="absolute flex items-center justify-center top-4 right-4 w-10 h-10 bg-secondary hover:bg-ternary duration-100 rounded-full cursor-pointer" onClick={() => onRemove(i)}>
                                            <FaTrash className="text-lg text-red-600" />
                                        </span>
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
            }
    </section>
    )
}