import React, { useEffect, useState } from 'react'
import About from './Component/About'
import Footer from './Component/Footer'
import Header from './Component/Header'
import NewPost from './Component/NewPost'
import PostPage from './Component/PostPage'
import Nav from './Component/Nav'
import Missing from './Component/Missing'
import Home from './Component/Home'
import { Route, Routes } from 'react-router-dom'
import EditPost from './Component/EditPost'
import { DataProvider } from './context/DataContext'

const App = () => {
  return (
    <div className='App'>
      <DataProvider>
        <Header title="Social Media" />
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='post'>
            <Route index
              element={
                <NewPost />
              } />
            <Route path=':id' element={<PostPage />} />
          </Route>
          <Route path='/edit/:id' element={
            <EditPost />
          } />
          <Route path='about' element={<About />} />
          <Route path='*' element={<Missing />} />
        </Routes>
        <Footer />
      </DataProvider>
    </div>
  )
}

export default App