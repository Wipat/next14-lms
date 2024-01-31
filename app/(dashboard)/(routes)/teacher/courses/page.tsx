import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'


const CoursePage = async () => {
  
  const { userId } = auth()

  if(!userId) {
    return redirect('/')
  }

  const courses = await db.course.findMany({
    where : {
      userId
    },
    orderBy : {
      createdAt : "desc"
    }
  })
 
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursePage