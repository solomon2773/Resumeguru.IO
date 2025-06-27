// components/SpeechRecognitionForm.js

import React, { useState } from 'react';
// import { BlobServiceClient } from '@azure/storage-blob';
import { useDispatch, useSelector } from 'react-redux';
import {setPronunciationAssessment} from '../../store/mockInterview/chatSlice';

const SpeechRecognitionForm = () => {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [topic, setTopic] = useState('');
    const user = useSelector(state => state.user.profile);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const blobUrl = "https://pub-315fe646e90e4b68bfedfadb01e196cd.r2.dev/36513541.wav";//await uploadToBlobStorage(file);
        await sendToBackend(blobUrl, topic);
    };

    const uploadToCloudflareStorage = async (fileUrl) => {
        // Fetch the file from the URL
        const response = await fetch(fileUrl);;
        const file = await response.blob();

        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
        }

        reader.onloadend = () => {
            const base64String = reader.result;
            const buffer = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const fileNameBuffer = file.name ? encodeURIComponent(file.name.replace(/ /g, '-')) : 'file' + Date.now() + '.wav'
            uploadFilePublic('userSpeeches', {
                data: buffer,
                userId: user.userId,
                type: file.type,
                size: file.size,
                name: fileNameBuffer,

            })
                .then((data) => {
                    // console.log(data)
                    sendSpeechFileUrlToBackend(process.env.CLOUDFLARE_S3_BUCKET_URL_PUBLIC+"/userSpeeches/"+user.userId+"/"+fileNameBuffer, 'a good day');
                })
        };


    };

    const sendToBackend = async (blobUrl, topic) => {
        const response = await fetch('/api/azure/speech/recognize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blobUrl, topic }),
        });

        const data = await response.json();
        dispatch(setPronunciationAssessment(data));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".wav" onChange={handleFileChange} required />
                <input
                    type="text"
                    placeholder="Enter topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                />
                <button type="submit">Upload and Recognize</button>
            </form>

        </div>
    );
};

export default SpeechRecognitionForm;
