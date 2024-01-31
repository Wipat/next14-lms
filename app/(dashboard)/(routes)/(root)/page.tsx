import { db } from '@/lib/db'
import React from 'react'
import Categories from './_components/categories'
import { SearchInput } from '@/components/search-input'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getCourses } from '@/actions/get-courses'
import { CoursesList } from '@/components/courses-list'

interface DashboardPageProps {
  searchParams : {
    title : string
    categoryId : string
  }
}

const DashboardPage = async ({
  searchParams
} : DashboardPageProps ) => {

  const { userId } = auth()

  if(!userId) {
    return redirect('/')
  }

  const categorires = await db.category.findMany({
    orderBy : {
      name : "asc"
    }
  })

  const courses = await getCourses({
    userId,
    ...searchParams
  })

  return (

    <div className='p-4'>
      <div className='md:hidden block'>
        <SearchInput/>
      </div>
      <div>
        <Categories
          items={categorires}
        />
        <CoursesList
          items={courses}
        />
      </div>
    </div>
     
  )
}

export default DashboardPage