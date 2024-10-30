import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import React from "react";

const InterviewItemCard = ({ interview, onDelete }) => {
    const router = useRouter();

    const onStart = () => {
        router.push('/dashboard/interview/' + interview?.mockId);
    };

    const onFeedbackPress = () => {
        router.push('dashboard/interview/' + interview.mockId + "/feedback");
    };

    const onDeletePress = async () => {
        if (confirm("Are you sure you want to delete this interview?")) {
            await onDelete(interview.id);
        }
    };

    return (
        <div className="border shadow-sm rounded-sm p-3 relative">
            {/* Dropdown Menu for actions */}
            <div className="absolute top-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center cursor-pointer">
                            {/* Vertical Ellipsis Icon */}
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" className="h-5 w-5 bi bi-three-dots-vertical">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                            </svg>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-4">
                        <DropdownMenuItem onClick={onDeletePress} className="text-red-600 hover:bg-red-100 flex justify-center text-md p-0.2 rounded">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <h2 className="font-bold text-cyan-500">{interview?.jobPosition}</h2>
            <h2 className="text-sm text-gray-500">{interview?.jobExperience}</h2>
            <h2 className="text-xs text-gray-400">
                Created At: {interview?.createdAt}
            </h2>
            <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="w-full" onClick={onFeedbackPress}>
                        Feedback
                    </Button>
                    <Button className="w-full" size="sm" onClick={onStart}>Start</Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewItemCard;
