"use client"

import * as z from "zod"
import toast from "react-hot-toast"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { Course } from "@prisma/client"

const formSchema = z.object({
    imageUrl: z.string().min(1 ,{
        message : "Description is required"
    })
})


interface ImageFormProps {
    initialData : Course
    courseId: string
}

const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {

    const [isEditing , setIsEditing] = useState(false)
    const router = useRouter()

    const toggleEdit = () => setIsEditing((current) => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl : initialData?.imageUrl || ""
        },
    })

    const { isSubmitting , isValid } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await axios.patch(`/api/courses/${courseId}` , values)
            toast.success("Description updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 p-4 rounded-md">
            <div className="flex justify-between items-center">
                Course image
                <Button variant="ghost" onClick={toggleEdit} className="mb-3">
                    {isEditing && (
                        <>
                            Cancel
                        </>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add an image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60
                    bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if(url) {
                                onSubmit({imageUrl : url})
                            }
                        }}
                    />
                    <div className="text-sm text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageForm