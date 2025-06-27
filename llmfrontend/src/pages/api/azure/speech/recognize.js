// pages/api/recognize.js
// pages/api/recognize.js

import {
    SpeechConfig,
    AudioConfig,
    SpeechRecognizer,
    PronunciationAssessmentConfig,
    PropertyId,
    CancellationReason,
    PronunciationAssessmentGradingSystem, PronunciationAssessmentGranularity
} from 'microsoft-cognitiveservices-speech-sdk';

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { Url, topic } = req.body;
    console.log('Url:', Url);
    console.log('topic:', topic);
    try {
        // Fetch the file from Azure Blob Storage
        const response = await fetch(Url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Save the file temporarily
        const tempFilePath = path.join('/tmp', path.basename(Url));
        fs.writeFileSync(tempFilePath, buffer);

        // Process the file with Azure Cognitive Services
        const audioConfig = AudioConfig.fromWavFileInput(fs.readFileSync(tempFilePath));
        const speechConfig = SpeechConfig.fromSubscription(process.env.MS_AZURE_SPEECH_SERVICE_KEY, process.env.MS_AZURE_SPEECH_SERVICE_REGION);
        speechConfig.speechRecognitionLanguage = 'en-US';

        const pronunciationAssessmentConfig = new PronunciationAssessmentConfig(
            '',
            PronunciationAssessmentGradingSystem.HundredMark,
            PronunciationAssessmentGranularity.Phoneme,
            false
        );
        pronunciationAssessmentConfig.enableProsodyAssessment = true;
        pronunciationAssessmentConfig.enableContentAssessmentWithTopic(topic);

        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        pronunciationAssessmentConfig.applyTo(recognizer);

        let recognizedText = '';
        const results = [];

        recognizer.recognized = (s, e) => {
            const jo = JSON.parse(e.result.properties.getProperty(PropertyId.SpeechServiceResponse_JsonResult));
            if (jo.DisplayText !== '.') {
                recognizedText += jo.DisplayText + ' ';
            }
            results.push(jo);
        };

        recognizer.canceled = (s, e) => {
            if (e.reason === CancellationReason.Error) {
                console.error(`(cancel) Reason: ${CancellationReason[e.reason]}: ${e.errorDetails}`);
            }
            recognizer.stopContinuousRecognitionAsync();
        };

        recognizer.sessionStopped = async (s, e) => {
            await recognizer.stopContinuousRecognitionAsync();
            recognizer.close();
            const contentResult = results[results.length - 1].NBest[0].ContentAssessment;
            const pronunciationAssessmentResult = results[0].NBest[0].PronunciationAssessment;

            res.status(200).json({
                contentAssessmentResult: {
                    recognizedText: recognizedText.trim(),
                    vocabularyScore: Number(contentResult.VocabularyScore.toFixed(1)),
                    grammarScore: Number(contentResult.GrammarScore.toFixed(1)),
                    topicScore: Number(contentResult.TopicScore.toFixed(1))
                },
                pronunciationAssessmentResult: {
                    AccuracyScore: Number(pronunciationAssessmentResult.AccuracyScore.toFixed(1)),
                    FluencyScore: Number(pronunciationAssessmentResult.FluencyScore.toFixed(1)),
                    ProsodyScore: Number(pronunciationAssessmentResult.ProsodyScore.toFixed(1)),
                    CompletenessScore: Number(pronunciationAssessmentResult.CompletenessScore.toFixed(1)),
                    PronScore: Number(pronunciationAssessmentResult.PronScore.toFixed(1)),

                },

            });
            // Clean up the temporary file
            fs.unlinkSync(tempFilePath);
        };

        await recognizer.startContinuousRecognitionAsync();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
