import React from 'react'
import { Upload } from 'lucide-react';

const UploadImg = ({ImageState, setImageState}) => {

  return (
    <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-sm font-medium text-gray-400">
            Upload Image
        </span>
        <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageState(ImageState.i, {...ImageState, imgUrl:e.target.files[0], current: "CROPPING"})}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
    </div>
  )
}

export default UploadImg
