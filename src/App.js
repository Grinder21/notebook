import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Button,
  TextField,
  Modal,
  Paper,
  IconButton,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/posts");
        const data = await response.json();
        setPosts(data);
        toast.info("Ваши записи успешно загружены");
      } catch (error) {
        console.error("Ошибка при загрузке записей", error);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSavePost = () => {
    fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, text, date }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Запись успешно добавлена");
        console.log(data);
        setTitle("");
        setText("");
        setDate("");
        setPosts([...posts, data]);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Ошибка при добавлении записи");
      });
    setShowModal(false);
  };

  function handleDeletePost(postId) {
    fetch(`http://localhost:5000/posts/${postId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка сервера");
        }
        return response.json();
      })
      .then(() => {
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success("Запись успешно удалена");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Ошибка при удалении записи");
      });
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleNewPost}>
        Новая запись
      </Button>

      {showModal && (
        <Modal open={showModal} onClose={handleModalClose}>
          <Paper
            style={{ padding: "1em", margin: "1em auto", maxWidth: "500px" }}
          >
            <Typography variant="h4">Новая запись</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              placeholder="Заголовок"
              value={title}
              maxLength="200"
              onChange={handleTitleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              placeholder="Текст"
              value={text}
              maxLength="2000"
              onChange={handleTextChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              type="date"
              value={date}
              onChange={handleDateChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePost}
              style={{ marginTop: "7px" }}
            >
              Сохранить запись
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleModalClose}
              style={{ marginLeft: "15px", marginTo: "7px" }}
            >
              Отмена
            </Button>
          </Paper>
        </Modal>
      )}

      <ToastContainer />

      <div>
        <Typography variant="h4">Список добавленных записей</Typography>
        {posts.map((post) => (
          <Paper style={{ padding: "1em", margin: "1em" }} key={post.id}>
            <Typography variant="h5">{post.title}</Typography>
            <Typography>{post.text}</Typography>
            <Typography>{post.date}</Typography>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeletePost(post.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))}
      </div>
    </div>
  );
}

export default App;
