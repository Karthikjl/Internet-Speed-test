import React, { useState } from 'react';
import { FaArrowDown, FaArrowUp, FaSignal } from 'react-icons/fa'; // Use FaSignal for ping

const SpeedMeter = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState(null);

  // Measure Download Speed
  const measureDownloadSpeed = async () => {
    try {
      const startTime = performance.now();
      const blob = await fetch(
        'https://plus.unsplash.com/premium_photo-1687509673996-0b9e35d58168?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhlbGxvfGVufDB8fDB8fHww', // Test file
        { cache: 'no-store' }
      ).then(response => response.blob()); // Directly get the blob from the fetch response

      const endTime = performance.now();
      const fileSizeInBits = blob.size * 8; // Convert bytes to bits
      const timeTakenInSeconds = (endTime - startTime) / 1000; // Convert ms to seconds
      return (fileSizeInBits / timeTakenInSeconds / 1_000_000).toFixed(2); // Mbps
    } catch (err) {
      setError('Failed to measure download speed. Please try again.');
      return null;
    }
  };

  // Measure Upload Speed
  const measureUploadSpeed = async () => {
    try {
      const data = new Uint8Array(5 * 1024 * 1024); // 5MB of data (smaller file for faster testing)
      const startTime = performance.now();
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: data,
      });
      const endTime = performance.now();
      const fileSizeInBits = data.length * 8;
      const timeTakenInSeconds = (endTime - startTime) / 1000;
      return (fileSizeInBits / timeTakenInSeconds / 1_000_000).toFixed(2); // Mbps
    } catch (err) {
      setError('Failed to measure upload speed. Please try again.');
      return null;
    }
  };

  // Measure Ping (using XMLHttpRequest for a more reliable ping)
  const measurePing = async () => {
    try {
      const startTime = performance.now();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.google.com', true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const endTime = performance.now();
          setPing((endTime - startTime).toFixed(2)); // ms
        }
      };
      xhr.send();
    } catch (err) {
      setError('Failed to measure ping. Please try again.');
      return null;
    }
  };

  // Start Speed Test
  const startTest = async () => {
    setIsTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setError(null);

    const download = await measureDownloadSpeed();
    setDownloadSpeed(download);

    const upload = await measureUploadSpeed();
    setUploadSpeed(upload);

    await measurePing();

    setIsTesting(false);
  };

  // Reset Test
  const resetTest = () => {
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setError(null);
  };

  return (
    <div style={styles.container}>
      <h1>Internet Speed Meter</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.results}>
        <div style={styles.resultItem}>
          <FaArrowDown style={styles.icon} />
          <h3>Download Speed</h3>
          <p>{downloadSpeed ? `${downloadSpeed} Mbps` : 'Testing...'}</p>
        </div>
        <div style={styles.resultItem}>
          <FaArrowUp style={styles.icon} />
          <h3>Upload Speed</h3>
          <p>{uploadSpeed ? `${uploadSpeed} Mbps` : 'Testing...'}</p>
        </div>
        <div style={styles.resultItem}>
          <FaSignal style={styles.icon} />
          <h3>Ping</h3>
          <p>{ping ? `${ping} ms` : 'Testing...'}</p>
        </div>
      </div>
      <div style={styles.buttons}>
        <button
          onClick={startTest}
          disabled={isTesting}
          style={styles.button}
        >
          {isTesting ? 'Testing...' : 'Start Test'}
        </button>
        <button
          onClick={resetTest}
          style={styles.resetButton}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// Styles for better UI
const styles = {
  container: {
    textAlign: 'center',
    padding: '30px',
    margin: '20px auto',
    width: '400px',
    backgroundColor: '#f9f9f9',
    borderRadius: '15px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  results: {
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  resultItem: {
    width: '120px',
    margin: '10px',
    textAlign: 'center',
  },
  icon: {
    fontSize: '40px',
    color: '#4caf50',
    marginBottom: '10px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    transition: 'background-color 0.3s ease',
  },
  resetButton: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    transition: 'background-color 0.3s ease',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default SpeedMeter;
