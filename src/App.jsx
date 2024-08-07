import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { ConnectWallet } from '@thirdweb-dev/react';
import { UploadForm } from './UploadForm';
import './App.css';

const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
const pinataSecretApiKey = import.meta.env.VITE_PINATA_API_SECRET;

const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; // Replace with your deployed contract address
const abi = [/* Your contract ABI here */];

export function App() {
  const [uploads, setUploads] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      provider.send("eth_requestAccounts", []).then(() => {
        const signer = provider.getSigner();
        setSigner(signer);

        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
      });
    }
  }, []);

  const handleUpload = async ({ file, name, artist }) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', file);
    data.append('pinataMetadata', JSON.stringify({
      name: name,
      keyvalues: {
        artist: artist
      }
    }));

    const headers = {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    };

    try {
      const response = await axios.post(url, data, { headers });
      console.log('File uploaded:', response.data);

      const newUpload = {
        name,
        artist,
        ipfsHash: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      };

      setUploads([...uploads, newUpload]);
      alert(`File uploaded successfully! IPFS Hash: ${response.data.IpfsHash}`);

      // Construct the metadata for the NFT
      const metadata = JSON.stringify({
        "name": name,
        "description": "This is a cool audio file uploaded to IPFS",
        "image": "Replace with an image URL (optional)", // Add an optional image
        "audio": newUpload.url // Link to the audio file on IPFS
      });

      // Mint the NFT using the contract function (modify based on your contract)
      await contract.mintAudioNFT(metadata);
      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  return (
    <>
      <ConnectWallet />
      <h1>4 bhai</h1>
      <UploadForm handleUpload={handleUpload} />
      <div className="uploads-container">
        {uploads.map((upload, index) => (
          <UploadCard key={index} upload={upload} />
        ))}
      </div>
    </>
  );
}

function UploadCard({ upload }) {
  return (
    <div className="upload-card">
      <h3>{upload.name}</h3>
      <p>Artist: {upload.artist}</p>
      <p>IPFS Hash: {upload.ipfsHash}</p>
      <a href={upload.url} target="_blank" rel="noopener noreferrer">View File</a>
    </div>
  );
}

export default App;
