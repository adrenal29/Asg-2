// Table.js
import React, { useState } from 'react';
import '../styles/Table.css'; // Import your CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';


const Table = ({ data,onDelete ,onSave,deleteAll}) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState({});
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [editingRowId, setEditingRowId] = useState(null);
  
  
  const filteredData = data.filter((row) =>
    columns.some((column) =>
      row[column].toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const toggleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === currentData.length) {
      // If all rows are selected, unselect all
      setSelectedRows([]);
    } else {
      // Otherwise, select all current page elements
      const pageElementIds = currentData.map((row) => row.id);
      setSelectedRows(pageElementIds);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (column, value) => {
    setEditedData((prevData) => ({ ...prevData, [column]: value }));
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };


  const handleSave = (id) => {
    // Implement the logic to save the edited row locally
    console.log(editedData)
    onSave(editedData,id);
    setEditingRowId(null); // Clear editingRowId
  };

  const deleteSelectedRows = () => {
    // Implement the logic to delete selected rows locally
    // const updatedData = data.filter((row) => !selectedRows.includes(row.id));
    onDelete(selectedRows)
    // You can use the updatedData as needed, e.g., update state or trigger further actions
    console.log('Deleted rows:', selectedRows);
    setSelectedRows([]); // Clear selected rows after deletion
  };
  
  return (
    <div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by any column..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon  className='deleteAll'  icon={faTrash}  onClick={deleteAll}/>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th><input
                  type="checkbox"
                  checked={selectedRows.length === currentData.length}
                  onChange={() => toggleSelectAll()}
                /></th>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index}  className={selectedRows.includes(row.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleRowSelection(row.id)}
                  />
                </td>
                {columns.map((column) => (
                   <td key={column}>
                   {editingRowId === row.id && column!='id'? (
                      <input
                      type="text"
                      value={editedData[column] !== undefined ? editedData[column] : row[column]}
                      onChange={(e) => handleInputChange(column, e.target.value)}
                    />
                   ) : (
                     row[column]
                   )}
                 </td>
                ))}
                 <td>
                {editingRowId === row.id ? (
                  <>
                    <button className='save' onClick={() => handleSave(row.id)}>Save</button>
                    <button  className='cancel' onClick={() => setEditingRowId(null)}>Cancel</button>
                  </>
                ) : (
                  < >
                    <FontAwesomeIcon className='editIcon' icon={faEdit} style={{cursor:'pointer'}} onClick={() => setEditingRowId(row.id)}/>
                    <FontAwesomeIcon  className='deleteIcon'  icon={faTrash} style={{cursor:'pointer'}} onClick={() => onDelete(row.id)}/>
                  </>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className='first-page'>{'<<'}</button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='previous-page'>{'<'}</button>
        {generatePageNumbers()}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='next-page'>{'>'}</button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className='last-page'>{'>>'}</button>
      </div>
      <div className='selectedDel'>
      <h4>{selectedRows.length} of {data.length} selected</h4>
      <button onClick={deleteSelectedRows}>Delete Selected </button>
      </div>
     
    </div>
  );
};

export default Table;
