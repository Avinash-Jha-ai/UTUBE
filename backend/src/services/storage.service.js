import ImageKit from "imagekit"
import {config} from "../configs/config.js"


const imagekit = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});


export async function uploadFile({buffer,fileName ,folder ="youtube"}) {
    const result = await imagekit.upload({
        file: buffer,
        fileName,
        folder
    })

    return result
} 

