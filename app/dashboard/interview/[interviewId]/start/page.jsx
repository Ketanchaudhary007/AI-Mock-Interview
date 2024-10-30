"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import Link from "next/link";
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [allUserAnswers, setAllUserAnswers] = useState([]); // Track all user answers

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  // Used to get interview details by MockID/Interview ID
  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      console.log(jsonMockResp);
      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  // Function to handle recording stop and save the user's answer
  const handleRecordingStop = (transcript) => {
    const newAnswers = [...allUserAnswers];
    newAnswers[activeQuestionIndex] = transcript; // Save the answer at the current index
    setAllUserAnswers(newAnswers); // Update the state
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Questions */}
          <QuestionsSection
            mockInterviewQuestion={mockInterviewQuestion} // Ensure it's an empty array if undefined
            activeQuestionIndex={activeQuestionIndex}
          />

          {/* Video / Audio Recording */}
          <RecordAnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            onRecordingStop={handleRecordingStop} // Pass down the function to record answer
          />
        </div>

        {/* Display Recorded Answers */}
        

        <div className="flex justify-end gap-6 mt-4">
          {activeQuestionIndex > 0 && (
            <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
              Previous Question
            </Button>
          )}
          {activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
            <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
              Next Question
            </Button>
          )}
          {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
            <Link
              href={`/dashboard/interview/${interviewData?.mockId}/feedback`}
            >
              <Button>End Interview</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default StartInterview;
