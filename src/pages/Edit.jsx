import { Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Edit() {
  const [editItem, setEditItem] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    num: '',
    email: '',
  });
  console.log(editItem);

  const { id } = useParams();
  console.log(id);

  const navigate = useNavigate();

  useEffect(() => {
    const data = async () => {
      try {
        const response = await fetch(
          `https://backend-six-puce.vercel.app/booking/${id}`
        );
        const data = await response.json();
        setEditItem(data[0]);
        console.log(editItem);
      } catch (error) {
        console.error(error.message);
      }
    };
    data();
  }, [id]);

  const handleTitle = (e) => {
    setEditItem({
      ...editItem,
      title: e.target.value,
    });
  };

  const handleDescription = (e) => {
    setEditItem({
      ...editItem,
      description: e.target.value,
    });
  };

  const handleDate = (e) => {
    setEditItem({
      ...editItem,
      date: e.target.value,
    });
  };

  const handleTime = (e) => {
    setEditItem({
      ...editItem,
      time: e.target.value,
    });
  };

  const handlePhoneNum = (e) => {
    setEditItem({
      ...editItem,
      num: e.target.value,
    });
  };

  const handleEmail = (e) => {
    setEditItem({
      ...editItem,
      email: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://backend-six-puce.vercel.app/booking/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editItem),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEditItem(data);
        alert('Update successfully');
      } else {
        console.log('response is not ok', response.status);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const navTobooking = () => {
    console.log('Booking');
    navigate('/booking');
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={editItem.title}
            onChange={handleTitle}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={1}
            value={editItem.description}
            onChange={handleDescription}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={editItem.date}
            onChange={handleDate}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            placeholder="name@example.com"
            value={editItem.time}
            onChange={handleTime}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            value={editItem.num}
            onChange={handlePhoneNum}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={editItem.email}
            onChange={handleEmail}
            disabled
          />
        </Form.Group>
        <Button type="submit" variant="outline-success">
          Update
        </Button>{' '}
        <Button variant="outline-secondary" onClick={navTobooking}>
          Back
        </Button>
      </Form>
    </div>
  );
}
