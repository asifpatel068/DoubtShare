import React, { useState, useEffect } from 'react';
import "./DoubtHistory.css"
export default function DoubtHistory() {
  const [doubtHistory, setDoubtHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoubtHistory = async () => {
      try {
        const token = sessionStorage.getItem('token'); 

        const response = await fetch('https://doubtshare-smlr.onrender.com/doubt/history', {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doubt history');
        }

        const data = await response.json();
        setDoubtHistory(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDoubtHistory();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='queries'>
      <h2>Doubt History</h2>
      {doubtHistory.length === 0 ? (
        <p>No doubt history available.</p>
      ) : (
        <ul>
          {doubtHistory.map((doubt) => (
            <li key={doubt._id}>
              <strong>Question:</strong> {doubt.question}<br />
              {doubt.answer && (
                <>
                  <strong>Answer:</strong> {doubt.answer}<br />
                </>
              )}
              <strong>Created At:</strong> {new Date(doubt.createdAt).toLocaleString()}<br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
