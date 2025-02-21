import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const searchHandler = (e) =>{
    e.preventDefault()
    if(searchQuery.trim() !== ""){
      navigate(`/course/search?query=${searchQuery}`)

    }
    //Set search query after searching to empty string
    setSearchQuery('')
    
    

  }
  return (
    <div className='relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center'>
        <div className='max-w-3xl mx-auto'>

            <h1 className='text-white text-4xl font-bold mb-4'>Find the Best Courses for You</h1>
            <p className='text-gray-200 dark:text-gray-400 mb-8'>Discover, Learn and Upskill with our wide range of courses</p>

            <form onSubmit={searchHandler} className='flex items-center rounded-full overflow-hidden bg-white shadow-lg dark:bg-gray-800 max-w-xl mx-auto mb-6'>
                <Input type='text' value = {searchQuery} onChange = {(e)=>setSearchQuery(e.target.value)} placeholder="Search courses" className="focus-visible:ring-0 border-none px-6 py-3 bg-white dark:text-gray-900 shadow-lg overflow-hidden flex-grow text-black dark:placeholder-gray-500"/>
                <Button type = "submit" className = "bg-blue-600 dark:bg-blue-800 text-white px-6 py-3 rounded-r-full hover:bg-blue-700">Search</Button>

            </form>

            <Button className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200" onClick = {()=> navigate(`/course/search?query`)}>Explore Courses</Button>

        </div>

    </div>
  )
}
