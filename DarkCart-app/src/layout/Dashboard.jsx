import React from 'react'
import UserMenue from '../components/UserMenue'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <section className='bg-white'>
      <div className="container mx-auto p-3 flex ">
        {/* Menu */}
        <div  className='py-4 sticky top-24 overflow-y-auto hidden lg:block border-r'>
          <UserMenue/>
        </div>

        {/* content */}
        <div className='bg-white flex-grow min-h[75vh] '>
          <Outlet/>
        </div>
      </div>
    </section>
  )
}

export default Dashboard