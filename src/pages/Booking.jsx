import { useEffect, useState, useContext } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import NavBar from '../components/NavBar';

export default function Booking() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [num, setNum] = useState('');
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  console.log(data);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const getData = async () => {
        try {
          const url =
            user.email === 'admin@gmail.com'
              ? 'https://backend-six-puce.vercel.app/bookings'
              : `https://backend-six-puce.vercel.app/bookings/user/${user.uid}`;
          const response = await fetch(url);
          const data = await response.json();
          console.log(data);
          setData(data);
        } catch (error) {
          console.error(error.message);
        }
      };
      getData();
    }
  }, [user]);

  const handleSubmit = async () => {
    const obj = {
      title,
      description,
      date,
      time,
      num,
      email: user.email,
      uid: user.uid,
    };

    try {
      const response = await fetch(
        'https://backend-six-puce.vercel.app/booking',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setData((prevData) => [...prevData, data]);
      handleClose();
      resetForm(); 
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (index) => {
    const id = data[index].id;
    try {
      const response = await fetch(
        `https://backend-six-puce.vercel.app/booking/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    const booking = data.find((booking) => booking.id === id);

    if (!booking) {
      console.error(`Booking with id ${id} not found.`);
      return;
    }

    try {
      const updatedBooking = {
        ...booking,
        status,
      };

      const response = await fetch(
        `https://backend-six-puce.vercel.app/booking/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBooking), 
        }
      );

      const result = await response.json();
      console.log(result);

      setData((prevData) =>
        prevData.map((item) => (item.id === id ? result : item))
      ); 
    } catch (error) {
      console.error(error.message);
    }
  };

  const navToEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setNum('');
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <div>
          <Button
            type="button"
            variant="outline-primary"
            onClick={handleShow}
            style={{ marginBlock: '10px' }}
          >
            Add
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTime">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoneNum">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={user?.email || ''}
                    disabled
                    readOnly
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Add
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Time</th>
                <th>Phone number</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.title}</td>
                  <td>{booking.description}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.num}</td>
                  <td>{booking.email}</td>
                  <td>
                    {user.email === 'admin@gmail.com' ? (
                      <select
                        class="form-select"
                        aria-label="Default select example"
                        value={booking.status || 'Pending'}
                        onChange={(e) =>
                          handleStatusChange(booking.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      //becayse booking.status is undefined
                      booking.status || 'pending'
                    )}
                  </td>
                  {/* <td>{booking.uid}</td> */}
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(index)}
                      style={{ marginRight: '10px' }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline-info"
                      onClick={() => navToEdit(booking.id)}
                    >
                      Edit
                    </Button>{' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
