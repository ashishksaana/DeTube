import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Video from './Pages/Video/Video'

import SearchResult from './Pages/SearchResult/SearchResult'

function App() {
  const [count, setCount] = useState(0)

    const [sidebar, setSidebar] = useState(true)

    return (
    <>
    <Navbar setSidebar={setSidebar} />
    <Routes>
      <Route path="/" element={<Home sidebar={sidebar} />} />
      <Route path="/video/:categoryId/:videoId" element={<Video />} />
      <Route path="/search/:searchQuery" element={<SearchResult sidebar={sidebar} />} />
    </Routes>   

    </>
  )
}

export default App