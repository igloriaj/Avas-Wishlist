import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

const Record = (props) => {
  <tr>
    <td>{props.record.name}</td>
    <td><a href={props.record.link} target="_blank" rel="noreferrer">{props.record.link}</a></td>
    <td>{props.record.claimed ? `Claimed by ${props.record.claimedBy}` : 'Available'}</td>
    <td>
      <div>
        <Link to={`/record/${props.record._id}`}>Edit</Link>
        <button type="button" 
        onClick={() => {
          props.deleteRecord(props.record._id)}}>
          Delete</button>
        <button type="button"
        onClick={() => {
          props.claimRecord(props.record._id)}}>
          Claim</button>
      </div>
    </td>
  </tr>
}

export default function RecordList() {
  const [records, setRecords] = useState([]);

  //Fetch all records from backend database
  useEffect(() => {
    async function getRecords() {
      const response = await fetch('http://localhost:3000/records/');
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
  }, [records.length]);

  //Delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:3000/records/${id}`, {
      method: 'DELETE',
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  //Claim a record
  async function claimRecord(id) {
    await fetch(`http://localhost:3000/records/claim/${id}`, {
      method: 'POST',
    });
    const newRecords = records.map((el) => {
      if (el._id === id) {
        return {...el, claimed: true, claimedBy: 'Someone'};
      }
      return el;
    });
    setRecords(newRecords);
  }

  //Map out records to table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={deleteRecord}
          key={record._id}
        />
      );
    });
  }

  //Display the table with each record
  return (
    <>
      <h3>Wishlist Items</h3>
      <div>
        <table className="record-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{recordList()}</tbody>
        </table>
      </div>
    </>
  )

}
