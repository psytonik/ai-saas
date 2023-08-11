"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Video } from "lucide-react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const VideoPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [video, setVideo] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    const isLoading = form.formState.isSubmitting;

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setVideo(undefined);
            const response = await axios.post("/api/video", values);
            setVideo(response.data[0]);
            form.reset();
        } catch (error: unknown) {
            if (
                error instanceof AxiosError &&
                error?.response?.status === 402
            ) {
                proModal.onOpen();
            } else {
                console.log(error);
                toast.error(`${error}`);
            }
        } finally {
            router.refresh();
        }
    };
    return (
        <div>
            <Heading
                description={"Turn your prompt in to video"}
                title={"Video Generation"}
                icon={Video}
                bgColor="bg-orange-700/10"
                iconColor="text-orange-700"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shodow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0 ">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="A blood covered tibetian shaman with big metal axe and black background"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="col-span-12 lg:col-span-2 w-full"
                                type="submit"
                                disabled={isLoading}
                            >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {!video && !isLoading && (
                        <div>
                            <Empty label="No video generated" />
                        </div>
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {video && (
                            <video
                                className="w-full aspect-video mt-8 rounded-lg border bg-black"
                                controls
                            >
                                <source src={video} />
                            </video>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPage;
