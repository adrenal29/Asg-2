import { useState ,useEffect} from 'react'
import './App.css'
import Table from './components/Table'

function App() {
  const [data, setData] = useState([]);
  useEffect(()=>{
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
    .then((response) => response.json())
    .then((apiData) => {
      console.log(apiData)
      setData(apiData);
    })
    .catch((error) => console.error('Error fetching data:', error));

  },[])

  const handleDelete = (id) => {
    const updatedData = data.filter((row) => !id.includes(row.id));
    setData(updatedData);
  };
  const handleUpdate=(editedData,id)=>{
    for (let row in data){
      if(data[row].id==id)
      data[row]={...data[row],...editedData};
    }
    

  }
  const handleBulkDelete=()=>{
    setData([]);
  }


  return (
    <>
     <Table data={data}  onDelete={handleDelete} onSave={handleUpdate} deleteAll={handleBulkDelete}/>
    </>
  )
}

export default App
