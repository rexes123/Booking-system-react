import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useState, useEffect, useContext } from 'react';
import {
  uploadBytes,
  ref,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import NavBar from '../components/NavBar';
import { AuthContext } from '../components/AuthProvider';

export default function Post() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  console.log(posts);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const getData = async () => {
        try {
          const querySnapShot = await getDocs(collection(db, 'posts'));
          const fetchPosts = querySnapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchPosts);
          console.log('Fetched posts:', fetchPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
      getData();
    }
    //Re-render user whenever it change
  }, [user]);

  const addData = async () => {
    if (file && user) {
      setUploading(true);
      const storageRef = ref(storage, `post/${file.name}`);
      try {
        const uploadResult = await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(uploadResult.ref);
        setFileUrl(fileUrl);

        const docRef = await addDoc(collection(db, 'posts'), {
          post: content,
          fileUrl: fileUrl,
        });
        console.log('Document written with ID: ', docRef.id);

        setPosts((prevPosts) => [
          ...prevPosts,
          {
            id: docRef.id,
            post: content,
            fileUrl: fileUrl,
          },
        ]);

        // Reset state
        setContent('');
        setFile(null);
        setFileUrl('');
      } catch (e) {
        console.error('Error adding document:', e);
      } finally {
        setUploading(false);
      }
    }
  };

  const deleteData = async (postId, fileUrl) => {
    if (user?.email === 'admin@gmail.com')
      try {
        if (fileUrl) {
          const fileRef = ref(storage, fileUrl);
          await deleteObject(fileRef);
        }


        await deleteDoc(doc(db, 'posts', postId));
        console.log('Document is deleted');

        setPosts(posts.filter((post) => post.id !== postId));
      } catch (e) {
        console.error('Error deleting document');
      }
  };

  const handleContent = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        {user?.email === 'admin@gmail.com' && (
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            class="btn btn-outline-primary"
            style={{ marginTop: '10px' }}
          >
            Add post
          </button>
        )}

        <div
          className="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Modal title
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    onChange={handleContent}
                  />
                </div>

                <div className="mb-3">

                  <input
                    type="file"
                    className="form-control"
                    id="exampleFormControlInput1"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={addData}
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          posts.map((post) => (
            <div className="card" key={post.id} style={{ marginTop: '10px' }}>
              <div className="card-body">
                <p className="card-text">{post.post}</p>
                {post.fileUrl && (
                  <div>
                    <img
                      class="img-thumbnail"
                      src={post.fileUrl}
                      alt="Post"
                      style={{
                        width: '100px',
                        height: '100px',
                      }}
                    />
                  </div>
                )}

                <div
                  style={{ marginTop: '10px', display: 'flex', gap: '10px' }}
                >
                  <a href={post.fileUrl} class="btn btn-outline-dark">
                    <i className="bi bi-eye"></i>
                  </a>

                  {user?.email == 'admin@gmail.com' && (
                    <button
                      class="btn btn-outline-danger"
                      onClick={() => deleteData(post.id, post.fileUrl)}
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
