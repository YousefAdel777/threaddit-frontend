"use client";

import { useDropzone } from "react-dropzone"
import { FaImage } from "react-icons/fa";

type Props = { 
    onDrop: (acceptedFiles: File[]) => void, 
    onError: () => void, 
    fieldName: string
}

export default function CommunityImageDropzone({ onDrop, onError, fieldName }: Props) {
    const {
        getRootProps,
        getInputProps,
    } = useDropzone({
        accept: {
            'image/jpeg': ['.jpeg', '.png', '.jpg'],
        },
        onDropRejected: onError,
        onDrop,
        maxFiles: 1,
        maxSize: 3 * 1024 * 1024,
    });
    return (
        <section>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="hover:bg-gray-50 duration-100 cursor-pointer p-2 rounded-lg flex items-center justify-between">
                    <span>
                        {fieldName}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-2 bg-ternary rounded-3xl">
                        <FaImage className="text-lg text-primary" />
                        <span className="text-xs">
                            Add
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

// import { Controller, useFormContext } from "react-hook-form";
// import { useDropzone } from "react-dropzone";
// import { ChangeEventHandler, FC } from "react";

// export const DropzoneField: FC<{ name: string; multiple?: boolean }> = ({
//     name,
//     multiple,
//     ...rest
// }) => {
//     const { control } = useFormContext();

//     return (
//         <Controller
//             render={({ field: { onChange } }) => (
//                 <Dropzone
//                     multiple={multiple}
//                     onChange={(e) =>
//                         onChange(
//                             multiple
//                                 ? e.target.files
//                                 : e.target.files?.[0] ?? null
//                         )
//                     }
//                     {...rest}
//                 />
//             )}
//             name={name}
//             control={control}
//             defaultValue=""
//         />
//     );
// };

// const Dropzone: FC<{
//     multiple?: boolean;
//     onChange?: ChangeEventHandler<HTMLInputElement>;
// }> = ({ multiple, onChange, ...rest }) => {
//     const { getRootProps, getInputProps } = useDropzone({
//         multiple,
//         ...rest,
//     });

//     return (
//         <div {...getRootProps()}>
//             <input {...getInputProps({ onChange })} />
//         </div>
//     );
// };