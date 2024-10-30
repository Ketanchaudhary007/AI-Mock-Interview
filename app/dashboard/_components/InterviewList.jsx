"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemcard.jsx"; // Ensure this import matches your file structure

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.createdByWho, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(MockInterview.id));

        console.log(result); // Debug: Check if results are coming back
        setInterviewList(result); // Update state with fetched data
    };

    const deleteInterview = async (id) => {
        await db.delete(MockInterview).where(eq(MockInterview.id, id)); // Delete the interview by id
        GetInterviewList(); // Refresh the interview list after deletion
    };

    return (
        <div>
            <h2 className="font-medium text-xl">Previous Mock Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {interviewList.length > 0 ? (
                    interviewList.map((interview, index) => (
                        <InterviewItemCard
                            interview={interview}
                            key={index} // index
                            onDelete={deleteInterview} // Pass the delete function
                        />
                    ))
                ) : (
                    <p>No interview experiences found.</p> // Message when there are no interviews
                )}
            </div>
        </div>
    );
}

export default InterviewList;
