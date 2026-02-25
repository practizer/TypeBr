import React, { useState, useEffect } from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import TypeSpeedTest from '../Pages/TypeSpeedTest.jsx'
import LoadingStarter from '../components/LoadingStarter.jsx'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingStarter />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TypeSpeedTest/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
