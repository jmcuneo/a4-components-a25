import {useState} from 'react'
import{BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import DataTable from './DataTable';
import Login from './Login';

function App(){
  const [page, setPage] = useState("main")
  return (
    <>
    <Router>
      <Routes>
        <Route path = '/' element = {<Login />}/>
        <Route path='/data' element={<DataTable />} />
      </Routes>
    </Router>
    </>
  )
}

export default App;