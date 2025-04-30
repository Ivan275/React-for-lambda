
import { useState, useEffect } from 'react'
import './App.css'
interface Data {
  Email: string,
  Friends: number,
  Follower: number,
  Name: string
}

interface FormProps {
  name: string,
  email: string
}

function App() {

  const [user, setUser] = useState<Data[]>()
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [success])

  const fetchUser = async () => {
    try {
      const res = await fetch("https://2nfu6aftk1.execute-api.us-east-1.amazonaws.com/dev/data")
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.log("Failed to fetch! ")
    }

  }

  const handleDelet = async (email: string) => {
    console.log("handle delete", email)
    const res = await fetch("https://2nfu6aftk1.execute-api.us-east-1.amazonaws.com/dev/data?email=" + email, { method: "DELETE" })
    const data = await res.json()
    console.log("data: ", data)
    setSuccess(!success)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    console.log('Form submitted:', formData);
    const res = await fetch("https://2nfu6aftk1.execute-api.us-east-1.amazonaws.com/dev/data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Email: formData.email,
          Name: formData.name
        })
      })
    const data = await res.json()
    console.log("data: ", data)
    // You can also send the form data to an API here using fetch()
  };
  // if (user?.success === false) console.log("failed to fetch")

  return (
    <>
      <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '20px auto' }}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '15px' }}>Submit</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Friends</th>
            <th>Follower</th>
            <th>operation</th>
          </tr>
        </thead>
        <tbody>
          {user?.map((u, index) => (
            <tr key={index}>
              <td>{u.Email}</td>
              <td>{u.Name}</td>
              <td>{u.Friends ?? "-"}</td>
              <td>{u.Follower ?? "-"}</td>
              <td><button onClick={() => handleDelet(u.Email)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>

  )
}

export default App
