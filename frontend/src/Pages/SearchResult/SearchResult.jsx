import React from 'react'
import './SearchResult.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import SearchFeed from '../../components/SearchFeed/SearchFeed'

function SearchResult({sidebar}) {
  return (
    <>
      {/* <Sidebar sidebar={sidebar} /> */}
      <div className="container">
        <SearchFeed />
      </div>
    </>
  )
}

export default SearchResult
