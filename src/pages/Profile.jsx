import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/AuthProvider';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage, db, auth } from '../firebase';
import { collection, setDoc, doc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import NavBar from '../components/NavBar';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [fileUrl, setFileUrl] = useState('');
  console.log(fileUrl)
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); //state for showing uploading status
  const [userData, setUserData] = useState(null);

  // const authentication = auth.currentUser;
  // console.log(authentication);


  console.log(user.uid);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const uid = user.uid;
          const userDoc = doc(db, 'users', uid);
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No user is signed in');
        }
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    }
    fetchUserData()
  }, [])




  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);

    if (selectedFile && user) {
      setUploading(true);
      try {
        //Upload file to firebase storage
        const imageRef = ref(storage, `post/${selectedFile.name}`);
        const response = await uploadBytes(imageRef, selectedFile);
        const newFileUrl = await getDownloadURL(response.ref);

        //Create a reference to user's posts subcollection
        const postsRef = collection(db, `users/${user.uid}/posts`);
        const newPostsRef = doc(postsRef);

        //Add the fileUrl to the new document
        await setDoc(newPostsRef, { fileUrl: newFileUrl, timestamp: new Date() });

        //Update the local state to reflect the image URL
        setFileUrl(newFileUrl);

        //Add or update the fileUrl in the user's document
        console.log('New post added', { id: newPostsRef.id, fileUrl: newFileUrl });

      } catch (e) {
        console.error('Error adding document:', e);
      } finally {
        setUploading(false);
      }
    }
  };


  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        try {
          // Reference to user's posts subcollection
          const postsRef = collection(db, `users/${user.uid}/posts`);
          //Query to get the latest post
          const q = query(postsRef, orderBy("timestamp", "desc"), limit(1));
          const querySnapShot = await getDocs(q);

          if (!querySnapShot.empty) {
            const latestPostDoc = querySnapShot.docs[0];
            const latestPostData = latestPostDoc.data();
            setFileUrl(latestPostData.fileUrl || '');
          }
        } catch (e) {
          console.error('Error fetching document:', e);
        }
      };
    }
    fetchProfileImage();
  }, [user])



  return (
    <div>

      <NavBar />
      <div className='container user-data'>
        <div style={{ position: 'relative', display: 'inline-block', marginTop: '10px' }}>
          <img
            src={fileUrl || 'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png'} // Use a default image if no profile picture is uploaded
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }}
            onClick={() => fileUrl && window.open(fileUrl, '_blank')}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="fileInput"
            style={{ display: "none" }}
          />
          <label htmlFor="fileInput">
            <i
              className="bi bi-camera"
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: 'white',
                borderRadius: '50%',
                padding: '5px',
                cursor: 'pointer',
              }}
            />
          </label>
          {uploading && <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>}


        </div>

        {userData ? (
          <div style={{ marginTop: "20px" }}>
            <form>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Name</label>
                <input type="email" class="form-control" id="exampleInputEmail1" placeholder={userData.name} disabled />
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Email</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder={userData.email} disabled />
              </div>
            </form>
          </div>



        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
};
