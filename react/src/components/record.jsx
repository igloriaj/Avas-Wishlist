import { set } from 'mongoose';
import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

export default function Record() {
  const [form, setForm] = useState({
    name: '',
    link: '',
    claimed: false,
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return; //If not id, then it's a new record
      setIsNew(false); //If there is an id, then it is not new

      //Get data for existing record
      const response = await fetch(`http://localhost:3000/records/${params.id.toString()}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate('/');
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
}, [params.id, navigate]);

  //Update state properties
  function updateForm(value) {
    return setForm((prev) => {
      return {...prev, ...value};
    });
  }

  //Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    const item = {...form};

    try {
      let response;
      if (isNew) { //If the record is new, use POST to /record
        response = await fetch('http://localhost:3000/record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });
      } else { //If the record exists, use PATCH to /record/:id
        response = await fetch(`http://localhost:3000/record/${params.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error, status: ${response.status}`);
      }
    } catch (error) {
      console.error(`A problem occurred: `, error);
    } finally {
      setForm({ name: '', link: '', claimed: false });
      navigate('/');
    }
  }

  //Display the form for creating or editing a record
  return (
    <>
      <h3>Create/Update Wishlist Item</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <div><input type="text" id="name" value={form.name} onChange={(e) => updateForm({ name: e.target.value })} /></div>
        </div>
        <div className="form-group">
          <label htmlFor="link">Link: </label>
          <div><input type="text" id="link" value={form.link} onChange={(e) => updateForm({ link: e.target.value })} /></div>
        </div>
        <div className="form-group">
          <label htmlFor="claimed">Claimed: </label>
          <div><input type="checkbox" id="claimed" checked={form.claimed} onChange={(e) => updateForm({ claimed: e.target.checked })} /></div>
        </div>
        <input type="submit" value={isNew ? "Create Item" : "Update Item"} />
      </form>
    </>
  )
}