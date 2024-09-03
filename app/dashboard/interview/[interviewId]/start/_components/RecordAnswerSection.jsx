"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModal';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import debounce from 'lodash/debounce';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (results.length > 0) {
            const transcript = results.map(result => result?.transcript).join(' ');
            setUserAnswer(prevAns => prevAns + transcript);
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            debounceUpdateUserAnswer();
        }
    }, [userAnswer, isRecording]);

    const StartStopRecording = useCallback(() => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    }, [isRecording, startSpeechToText, stopSpeechToText]);

    const UpdateUserAnswer = async () => {
        try {
            setLoading(true);
            const feedbackPrompt =
            "Question:" +
            mockInterviewQuestion[activeQuestionIndex]?.question +
            ", User Answer: " +
            userAnswer +
            " ,Depends on question and user answer for give interview question" +
            " please give us rating for answer and feedback as area of improvement if any" +
            "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field ";
            
            const result = await chatSession.sendMessage(feedbackPrompt);
            const mockJsonResp = result.response.text().replace(/```json|```/g, '');
            console.log("Raw Response from chatSession:", mockJsonResp);  // Log raw response
            
            const JsonFeedbackResp = JSON.parse(mockJsonResp);
            console.log("Parsed Feedback Response:", JsonFeedbackResp);  // Log parsed JSON response

            const resp = await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback,
                rating: JsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress.emailAddress,
                createdAt: moment().format("DD-MM-yyyy"),
            });

            if (resp) {
                toast("User Answer Recorded successfully.");
                setUserAnswer('');
                setResults([]);
            }
        } catch (error) {
            toast.error("Failed to record user answer.");
            console.error("Error in UpdateUserAnswer:", error);  // Log any error that occurs
        } finally {
            setLoading(false);
        }
    };

    const debounceUpdateUserAnswer = useCallback(debounce(UpdateUserAnswer, 1000), [userAnswer]);

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex flex-col justify-center items-center rounded-lg p-5 mt-20 bg-black gap-10">
                <Image
                    src={"/webcam3.png"}
                    alt="WebCAM"
                    width={140}
                    height={140}
                    className="absolute"
                />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: "100%",
                        zIndex: 10,
                    }}
                />
            </div>
            <Button
                disabled={loading}
                variant="outline"
                className="my-10"
                onClick={StartStopRecording}
            >
                {isRecording ? (
                    <h2 className="text-red-600 flex animate-pulse items-center gap-2">
                        <StopCircle />
                        Stop Recording...
                    </h2>
                ) : (
                    <h2 className="flex gap-2 items-center">
                        <Mic /> Record Answer
                    </h2>
                )}
            </Button>
        </div>
    );
}

export default RecordAnswerSection;
