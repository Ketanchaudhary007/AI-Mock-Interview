"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState(null);
    const router = useRouter();
    const { user } = useUser();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Depends on this information please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format. Give questions and answers as fields in JSON.`;

        try {
            const result = await chatSession.sendMessage(inputPrompt);
            const responseText = await result.response.text();
            const mockJsonResp = responseText
                .replace(/```json|```/g, ""); // Use regex to remove all code block markers

            try {
                const parsedJsonResp = JSON.parse(mockJsonResp);
                console.log("Parsed JSON Response:", parsedJsonResp);
                setJsonResponse(parsedJsonResp);

                if (parsedJsonResp) {
                    const resp = await db.insert(MockInterview)
                        .values({
                            mockId: uuidv4(),
                            jsonMockResp: JSON.stringify(parsedJsonResp),
                            jobPosition,
                            jobDesc,
                            jobExperience,
                            createdByWho: user?.primaryEmailAddress?.emailAddress,
                            createdAt: moment().format('DD-MM-YYYY'),
                        })
                        .returning({ mockId: MockInterview.mockId });

                    console.log("Inserted ID:", resp);
                    if (resp) {
                        setOpenDialog(false);
                        router.push(`/dashboard/interview/${resp[0]?.mockId}`);
                    }
                } else {
                    console.error("Error: Empty JSON response");
                }
            } catch (parseError) {
                console.error("Error parsing JSON response:", parseError);
                toast("Failed to parse response. Please try again.");
            }
        } catch (error) {
            console.error("Error generating interview questions:", error);
            toast("Error generating interview questions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}>
                <h1 className="text-lg text-center">+ Add New</h1>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-2xl">
                            Tell us more about your job Interviewing
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <form onSubmit={onSubmit}>
                            <div>
                                <p>
                                    Add details about your job position/role, job description, and
                                    years of experience
                                </p>
                                <div className="mt-7 my-3">
                                    <label>Job Role/Job Position</label>
                                    <Input
                                        placeholder="Ex. Full Stack Developer"
                                        required
                                        value={jobPosition}
                                        onChange={(event) => setJobPosition(event.target.value)}
                                    />
                                </div>
                                <div className="my-3">
                                    <label>Job Description/Tech Stack (In short)</label>
                                    <Textarea
                                        placeholder="Ex. React, Angular, NodeJs, MySql etc"
                                        required
                                        value={jobDesc}
                                        onChange={(event) => setJobDesc(event.target.value)}
                                    />
                                </div>
                                <div className="my-3">
                                    <label>Years of Experience</label>
                                    <Input
                                        placeholder="Ex. 5"
                                        type="number"
                                        min="1"
                                        max="70"
                                        required
                                        value={jobExperience}
                                        onChange={(event) => setJobExperience(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-5 justify-end">
                                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <LoaderCircle className="animate-spin" /> Generating from AI
                                        </>
                                    ) :
                                        'Start Interview'
                                    }
                                </Button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
