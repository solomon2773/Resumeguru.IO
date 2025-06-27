import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
const s3CloudFlarePrivate = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_S3_API_URL_PRIVATE,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
});
const s3CloudFlarePublic = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_S3_API_URL_PUBLIC,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
});

export async function uploadFilePrivate(bucketName, file) {

    const params = {
        Bucket: bucketName,
        Key: file.userId+"/"+file.name,
        Body: file.data,
        ContentType: file.type,
    };
    try {
        const command = new PutObjectCommand(params);
        return await s3CloudFlarePrivate.send(command);

    } catch (err) {
        console.log(err, err.stack);
    }
}

export async function uploadFilePublic(bucketName, file) {
    const params = {
        Bucket: bucketName,
        Key: file.userId+"/"+file.name,
        Body: file.data,
        ContentType: file.type,
    };
    try {
        const command = new PutObjectCommand(params);
        return await s3CloudFlarePublic.send(command);

    } catch (err) {
        console.log(err, err.stack);
    }
}
export async function uploadMlUserSubmitIngredientPicture(bucketName, file) {
    const params = {
        Bucket: bucketName,
        Key: file.userId+"/"+file.ingredientName.toLowerCase()+"/"+file.name,
        Body: file.data,
        ContentType: file.type,
    };
    try {
        const command = new PutObjectCommand(params);
        return await s3CloudFlarePublic.send(command);

    } catch (err) {
        console.log(err, err.stack);
    }
}
