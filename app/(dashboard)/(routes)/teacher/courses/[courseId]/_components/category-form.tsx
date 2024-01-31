"use client"

import * as z from "zod"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Course } from "@prisma/client"
import { Combobox } from "@/components/ui/combobox"

interface CategoryFormProps {
    initialData : Course
    courseId: string
    options : { label : string; value : string }[]
}
const formSchema = z.object({
    categoryId : z.string().min(1),
})



const CategoryForm = ({
    initialData,
    courseId,
    options
}: CategoryFormProps) => {

    const [isEditing , setIsEditing] = useState(false)
    const router = useRouter()

    const toggleEdit = () => setIsEditing((current) => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
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

    const selectedOptions = options.find((option) => option.value === initialData.categoryId)

    return (
        <div className="mt-6 border bg-slate-100 p-4 rounded-md">
            <div className="flex justify-between items-center">
                Course category
                <Button variant="ghost" onClick={toggleEdit} className="mb-3">
                    {isEditing ? (
                        <>
                            <p className="text-sm">Cancel</p>
                        </>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            <p className="text-sm">Edit category</p>
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.categoryId && "text-slate-500 italic"
                )}>
                    {selectedOptions?.label || "No description"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox
                                        options={[...options]}
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
        </div>
    )
}

export default CategoryForm