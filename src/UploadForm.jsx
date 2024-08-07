import React, { useState } from 'react';

export function UploadForm({ handleUpload }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file && name && artist) {
      handleUpload({ file, name, artist });
    } else {
      alert('Please fill in all fields and select a file to upload.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div>
        <label htmlFor="nameInput">Name:</label>
        <input
          type="text"
          id="nameInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="artistInput">Artist:</label>
        <input
          type="text"
          id="artistInput"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="fileInput">Select a file:</label>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit">Upload to Pinata</button>
    </form>
  );
}
