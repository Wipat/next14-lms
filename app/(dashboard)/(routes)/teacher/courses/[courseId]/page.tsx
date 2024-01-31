import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Coins, File, LayoutDashboard, ListTodo } from 'lucide-react'

import { IconBadge } from '@/components/icon-badge'
import { db } from '@/lib/db'
import { Banner } from '@/components/banner'

import TitleForm from './_components/title-form'
import DescriptionForm from './_components/description-form'
import ImageForm from './_components/image-form'
import CategoryForm from './_components/category-form'
import PriceForm from './_components/price-form'
import AttachmentForm from './_components/attachment-form'
import ChapterForm from './_components/chapter-form'
import Actions from './_components/actions'

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {

  const { userId } = auth()

  if (!userId) {
    redirect("/")
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc"
        }
      },
      attachments: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  if (!course) {
    return redirect("/")
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.price,
    course.chapters.some(chapter => chapter.isPublished)
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && (
          <Banner
              variant="warning"
              label="This chapter is unpublished. It will not be visible in the course"
          />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-medium'>Course setup</h1>
            <p className='text-slate-700'>Complete all fields {completionText}</p>
          </div>
          <div>
            <Actions
              disabled={!isComplete}
              courseId={params.courseId}
              isPublished={course.isPublished}
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div>
            <div className='flex items-center space-x-2'>
              <IconBadge
                icon={LayoutDashboard}
                size="default"
              />
              <h1 className='text-xl'>
                Customize your course
              </h1>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescriptionForm
              initialData={course}
              courseId={course.id}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
            />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id
              }))}
            />
          </div>
          <div>
            <div className='flex items-center space-x-2'>
              <IconBadge
                icon={ListTodo}
                size="default"
              />
              <h1 className='text-xl'>
                Course chapters
              </h1>
            </div>
            <ChapterForm
              initialData={course}
              courseId={course.id}
            />
            <div>
              <div>
                <div className='flex items-center space-x-2 mt-3'>
                  <IconBadge
                    icon={Coins}
                    size="default"
                  />
                  <h1 className='text-xl'>
                    Sell your course
                  </h1>
                </div>
                <PriceForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
              <div>
                <div className='flex items-center space-x-2 mt-3'>
                  <IconBadge
                    icon={File}
                    size="default"
                  />
                  <h1 className='text-xl'>
                    Resources & Attachments
                  </h1>
                </div>
                <AttachmentForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage