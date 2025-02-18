import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function HeroSection() {
  return (
    <div className='relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center'>
        <div className='max-w-3xl mx-auto'>

            <h1 className='text-white text-4xl font-bold mb-4'>Find the Best Courses for You</h1>
            <p className='text-gray-200 dark:text-gray-400 mb-8'>Discover, Learn and Upskill with our wide range of courses</p>

            <form action='' className='flex items-center rounded-full overflow-hidden bg-white shadow-lg dark:bg-gray-800 max-w-xl mx-auto mb-6'>
                <Input type='text' placeholder="Search courses" className="focus-visible:ring-0 border-none px-6 py-3 bg-white dark:text-gray-900 shadow-lg overflow-hidden flex-grow text-black dark:placeholder-gray-500"/>
                <Button className = "bg-blue-600 dark:bg-blue-800 text-white px-6 py-3 rounded-r-full hover:bg-blue-700">Search</Button>

            </form>

            <Button className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200">Explore Courses</Button>

        </div>

    </div>
  )
}
