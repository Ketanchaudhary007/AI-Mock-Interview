"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
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
    if (results.length) {
      setUserAnswer(prevAns => prevAns + results.map(result => result?.transcript).join(''));
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      console.log("Stopping recording and updating answer:", userAnswer);
      UpdateUserAnswer();
    }
  }, [isRecording]);

  const StartStopRecording = () => {
    console.log("Current recording state:", isRecording);
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer.length < 10) {
        setLoading(false);
        console.log("Answer too short, not saving");
      }
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log("Updating user answer:", userAnswer);
    setLoading(true);

    const feedbackPrompt =
      `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, ` +
      `User Answer: ${userAnswer}, ` +
      "Depends on question and user answer for given interview question " +
      "please give a rating as number out of 10 for the answer and feedback as area of improvement if any " +
      "in just 3 to 5 lines in JSON format with rating field and feedback field.";


 


    console.log("Feedback Prompt:", feedbackPrompt);

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = await result.response.text();
      console.log("API Response:", mockJsonResp);

      const formattedJsonResp = mockJsonResp
        .replace("```json", "")
        .replace("```", "");

      console.log("Formatted JSON Response:", formattedJsonResp);

      const JsonfeedbackResp = JSON.parse(formattedJsonResp);

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonfeedbackResp?.feedback,
        rating: JsonfeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      toast("User Answer recorded successfully");
      setUserAnswer("");
      setResults([]);
    } catch (err) {
      console.error("Error updating user answer:", err);
      toast("Error while saving your answer, please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src="/webcam3.png"
          width={200}
          height={200}
          className="absolute"
          alt="webcam"
          priority
        />
        <Webcam
          style={{ height: 300, width: "100%", zIndex: 10 }}
          mirrored={true}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 items-center animate-pulse flex gap-2">
            <StopCircle /> Stop Recording...
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
      {/* Uncomment below line to show the user answer */}
      {/*<Button onClick={() => console.log("User Answer:", userAnswer)}>Show User Answer</Button>*/ }
    </div>
  );
};

export default RecordAnswerSection;
