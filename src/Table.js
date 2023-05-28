import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';

const TableApp = () => {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json'
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('editedData');
    if (savedData) {
      setEditedData(JSON.parse(savedData));
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('editedData', JSON.stringify(editedData));
  };

  const resetData = () => {
    setEditedData({});
    localStorage.removeItem('editedData');
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value, row }) => (
          <input
            type="number"
            value={editedData[row.id] || value}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              setEditedData((prevData) => ({
                ...prevData,
                [row.id]: newValue,
              }));
            }}
          />
        ),
      },
    ],
    [editedData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      <table {...getTableProps()} style={{ width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        <button onClick={saveData}>Save</button>
        <button onClick={resetData}>Reset</button>
      </div>
    </div>
  );
};

export default TableApp;
