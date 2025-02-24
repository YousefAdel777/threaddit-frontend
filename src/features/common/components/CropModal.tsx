"use client"

import Cropper, { Area } from "react-easy-crop";
import React, { useState, useCallback } from "react";
import getCroppedImage from "@/lib/cropImage";
import Button from "./Button";
import { FaX } from "react-icons/fa6";

type Props = {
    image: string;
    aspect: number;
    onCrop: (file: File) => void;
    closeModal: () => void;
    heading?: string;
    cropShape?: "round" | "rect"
}

export default function CropModal({ image, aspect, closeModal, onCrop, heading, cropShape }: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImage(
                image,
                croppedAreaPixels,
            )
            onCrop(croppedImage as File)
            closeModal()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="fixed z-30 left-0 top-0 w-full h-full flex items-center justify-center">
            <div className="container">
                <div className="bg-white p-5 pt-8 rounded-xl relative">
                    <h1 className="text-2xl font-bold mb-4">{heading}</h1>
                    <span onClick={closeModal} className="cursor-pointer absolute right-4 top-4 text-xl text-gray-500 p-4 rounded-full hover:bg-secondary hover:bg-opacity-30 duration-200">
                        <FaX />
                    </span>
                    <div className="relative w-full bg-slate-900 h-80 mb-6">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            cropShape={cropShape || "rect"}
                        />
                    </div>
                    <Button className="ml-auto" onClick={showCroppedImage}>
                        Crop
                    </Button>
                </div>
            </div>
        </div>
    )
}