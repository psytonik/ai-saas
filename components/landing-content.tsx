"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const testimonials = [
    {
        id: 1,
        name: "Anthony",
        avatar: "A",
        title: "Software engineer",
        description: "This is the best application I've used!"
    },
    {
        id: 2,
        name: "Bella",
        avatar: "B",
        title: "Backend Developer",
        description: "The platform's performance is unmatched!"
    },
    {
        id: 3,
        name: "Charlie",
        avatar: "C",
        title: "Frontend Developer",
        description: "I love how intuitive the interface is!"
    },
    {
        id: 4,
        name: "Danielle",
        avatar: "D",
        title: "Full-Stack Developer",
        description: "Integration with other tools was seamless!"
    },
    {
        id: 5,
        name: "Edward",
        avatar: "E",
        title: "DevOps Engineer",
        description: "The deployment process is incredibly efficient!"
    },
    {
        id: 6,
        name: "Fiona",
        avatar: "F",
        title: "Quality Assurance",
        description: "Bug reporting has never been easier!"
    },
    {
        id: 7,
        name: "George",
        avatar: "G",
        title: "UI/UX Designer",
        description: "The design principles adopted are top-notch!"
    },
    {
        id: 8,
        name: "Hannah",
        avatar: "H",
        title: "Database Administrator",
        description: "Data retrieval is super fast and efficient!"
    },
    {
        id: 9,
        name: "Irina",
        avatar: "I",
        title: "Security Specialist",
        description: "The security measures in this app are robust!"
    },
    {
        id: 10,
        name: "Jacob",
        avatar: "J",
        title: "Product Manager",
        description:
            "Managing the product lifecycle is a breeze with this tool!"
    },
    {
        id: 11,
        name: "Ksenia",
        avatar: "K",
        title: "Data Scientist",
        description: "Data analysis is straightforward with this application!"
    },
    {
        id: 12,
        name: "Leonid",
        avatar: "L",
        title: "System Architect",
        description: "The app's architecture is both scalable and robust!"
    }
];

const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((testy) => (
                    <Card
                        key={testy.id}
                        className="bg-[#192339] border-none text-white"
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">{testy.name}</p>
                                    <p className="text-zinc-400 text-sm">
                                        {testy.title}
                                    </p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {testy.description}
                            </CardContent>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default LandingContent;
