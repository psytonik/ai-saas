"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { AxiosError } from "axios";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const MusicPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [music, setMusic] = useState<string>();
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
            setMusic(undefined);
            const response = await axios.post("/api/music", values);
            setMusic(response.data.audio);
            form.reset();
        } catch (error: any) {
            if (
                error instanceof AxiosError &&
                error?.response?.status === 402
            ) {
                proModal.onOpen();
            } else {
                toast.error(`${error}`);
            }
        } finally {
            router.refresh();
        }
    };
    return (
        <div>
            <Heading
                description={"Turn your prompt in to music"}
                title={"Music Generation"}
                icon={Music}
                bgColor="bg-emerald-500/10"
                iconColor="text-emerald-500"
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
                                                placeholder="Piano Solo with beats 148 bpm"
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
                    {!music && !isLoading && (
                        <div>
                            <Empty label="No music generated" />
                        </div>
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {music && (
                            <audio className="w-full mt-8" controls>
                                <source src={music} />
                            </audio>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicPage;
