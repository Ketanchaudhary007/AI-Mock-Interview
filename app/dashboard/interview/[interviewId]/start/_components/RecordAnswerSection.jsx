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
import _ from "lodash"; // for throttling

const MIN_ANSWER_LENGTH = 3; // Minimum answer length for saving

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state variable to track saving status

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

  // Use the final result to update userAnswer
  useEffect(() => {
    if (results.length) {
      const latestResult = results[results.length - 1].transcript;
      setUserAnswer(latestResult);
    }
  }, [results]);

  // Display interim results temporarily
  useEffect(() => {
    if (isRecording && interimResult) {
      setUserAnswer(interimResult); // Show interim result while recording
    }
  }, [interimResult, isRecording]);

  // Function to update user answer
  const UpdateUserAnswer = async () => {
    if (isSaving) return; // Prevent multiple submissions
    setIsSaving(true); // Set saving status

    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt =
      "Question: " +
      mockInterviewQuestion[activeQuestionIndex]?.question +
      ", User Answer: " +
      userAnswer +
      " ,Depends on question and user answer for give interview question" +
      " please give us rating for answer and feedback as area of improvement" +
      " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field ";

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = await result.response.text().replace("```json", "").replace("```", "");
      console.log(mockJsonResp);
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      toast("User Answer Recorded successfully.");
      setUserAnswer("");
      setResults([]);
    } catch (error) {
      console.error("Error updating user answer:", error);
      toast("Error while saving your answer, please try again.");
    } finally {
      setLoading(false);
      setIsSaving(false); // Reset saving status
    }
  };

  // Stop recording and update answer if recording is off and answer is sufficient
  useEffect(() => {
    if (!isRecording && userAnswer.length > MIN_ANSWER_LENGTH) {
      UpdateUserAnswer();
    }
  }, [isRecording, userAnswer]); // Remove isSaving from dependencies to prevent re-triggering

  // Function to start/stop recording
  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer.length < MIN_ANSWER_LENGTH) {
        setLoading(false);
        console.log("Answer too short, not saving");
      }
    } else {
      startSpeechToText();
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
        className="my-0.1" // Adjusted spacing
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

      {userAnswer && (
        <div className="mt-2 text-center">
          <h3>Your Answer:</h3>
          <p>{userAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default RecordAnswerSection;
