import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionSection({ mockInterviewQuestion = [], activeQuestionIndex = 0 }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry! Your browser does not support text-to-speech.");
    }
  };

  return (
    Array.isArray(mockInterviewQuestion) && mockInterviewQuestion.length > 0 && (
      <div className="p-5 border rounded-lg bg-white my-8">
        {/* Display questions in a grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQuestion.map((question, index) => (
            <h2
              key={index} // Add a key prop to help React identify items
              className={`p-2 border border-gray-400 rounded-full cursor-pointer text-xs md:text-sm text-center 
                ${
                  activeQuestionIndex === index &&
                  "bg-cyan-600 text-white border border-cyan-700"
                }`}
            >
              Question #{index + 1}
            </h2>
          ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question || "No question available"}
        </h2>
        <Volume2
          className="cursor-pointer"
          onClick={() =>
            textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question || "No question available")
          }
        />
        <div className="border rounded-lg p-5 bg-blue-100 mt-10">
          <h2 className="flex gap-2 items-center text-blue-700">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-blue-700 my-2">
            {process.env.NEXT_PUBLIC_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionSection;
