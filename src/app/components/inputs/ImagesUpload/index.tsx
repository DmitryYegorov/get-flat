'use client';

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AiFillDelete, AiFillFileImage, AiFillPlusCircle, AiFillSave, AiOutlineDelete, AiOutlineSave, AiOutlineUpload } from "react-icons/ai";
import { TbPhotoPlus } from "react-icons/tb";
import ReactImageUploading from "react-images-uploading";
import Button from "../../Button";
import { uploadBytes, ref, StorageReference, listAll, deleteObject, getDownloadURL } from 'firebase/storage';
import { storage } from "@get-flat/app/firebase";
import toast from "react-hot-toast";

interface Props {
    onChange: (url: string) => void;
    value: string;
}

const ImagesUpload: React.FC<Props> = ({
    onChange,
    value,
}: Props) => {

    const [image, setImage] = useState<string>();

    const uploadToFireBase = async (image) => {
        const date = Date.now();

        const imageRef = ref(storage, `${date}/${image.name}`);
        const result = await uploadBytes(imageRef, image);

        const url = await getDownloadURL(result.ref);
        onChange(url);
        setImage(url);
        return result;
    }

    return (
        <div className="flex flex-col items-center gap-8">
            <input
                type="file"
                onChange={(event) => {
                    console.log(event);
                    uploadToFireBase(event.target.files![0]);
                }}
            />
            {image && (
                <div style={{
                    maxWidth: 300,
                }}>
                    <img
                        src={image}
                    />
                </div>
            )}
        </div>
    );
}
 
export default ImagesUpload;