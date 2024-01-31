"use client"

import * as z from "zod"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

import { Loader2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Chapter, Course } from "@prisma/client"
import { Input } from "@/components/ui/input"
import ChaptersList from "./chapters-list"

interface ChapterFormProps {
    initialData : Course & { chapters : Chapter[] }
    courseId: string
}

const formSchema = z.object({
    title : z.string().min(1)
})

const ChapterForm = ({
    initialData,
    courseId
}: ChapterFormProps) => {

    const [isCreating , setIsCreating] = useState(false)
    const [isUpdating , setIsUpdating] = useState(false)

    const router = useRouter()

    const toggleCreating = () => {
        setIsCreating((current) => !current)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title : ""
        },
    })

    const { isSubmitting , isValid } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await axios.post(`/api/courses/${courseId}/chapters` , values)
            toast.success("Chapter created")
            toggleCreating()
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const onReorder = async (updateData : { id : string; position : number }[]) => {
        try {
            setIsUpdating(true)

            await axios.put(`/api/courses/${courseId}/chapters/reorder` , {
                list : updateData
            })
            toast.success("Chapters reordered")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsUpdating(false)
        }
    }

    const onEdit = (id : string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }

    return (
        <div className="relative mt-6 border bg-slate-100 p-4 rounded-md">
            {isUpdating && (
                <div className="absolute w-full h-full bg-slate-500/20 top-0 right-0
                rounded-md flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div className="flex justify-between items-center">
                Course chapters
                <Button variant="ghost" onClick={toggleCreating} className="mb-3">
                    {isCreating ? (
                        <>
                            <p className="text-sm">Cancel</p>
                        </>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            <p className="text-sm">Add a chapter</p>
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="e.g. 'Introduction to the course.'" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="flex items-center space-x-2">
                            <Button
                                className="text-sm"
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div
                 className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "italic text-slate-500"
                 )}
                >
                    {!initialData.chapters.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-sm text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    )
}

export default ChapterForm