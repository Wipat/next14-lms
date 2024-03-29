import { auth } from "@clerk/nextjs"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation"
import CourseSidebarItem from "./course-sidebar-item";

interface CourseSidebarProps {
    course: Course & {
      chapters: (Chapter & {
        userProgress: UserProgress[] | null;
      })[]
    };
    progressCount: number;
  };

const CourseSidebar = ({
    course,
    progressCount
} : CourseSidebarProps ) => {

    const { userId } = auth()

    if(!userId) {
        redirect("/")
    }

  return (
    <div className="h-full border-r flex flex-col 
    overflow-y-auto shadow-md">
        <div className="p-8 flex flex-col border-b">
            <h1 className="font-semibold">
                {course.title}
            </h1>
        </div>
        <div className="flex flex-col w-full">
            {course.chapters.map((chapter) => (
                <CourseSidebarItem
                    key={chapter.id}
                    id={chapter.id}
                    label={chapter.title}
                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    courseId={course.id}
                />
            ))}
        </div>
    </div>
  )
}

export default CourseSidebar