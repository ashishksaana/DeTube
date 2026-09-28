import { useState } from 'react' 
import './Home.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import CategoriesBar from '../../components/CategoriesBar/CategoriesBar'
import Feed from '../../components/Sidebar/Feed/Feed'


function Home({sidebar}) {
  const [category, setCategory] = useState(0)

  return (
    <>
      {/* <Sidebar sidebar={sidebar} category={category} setCategory={setCategory} /> */}
      <div className="container">
        <CategoriesBar category={category} setCategory={setCategory} />
        <Feed category={category} />
      </div>
    </>
  )
}

export default Home
