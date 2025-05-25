import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './PendingArtisans.css';

const PendingArtisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/artisans/pending')
      .then(res => setArtisans(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAction = (id, action) => {
    const endpoint = action === "approve"
      ? `http://localhost:5000/api/admin/artisans/approve/${id}`
      : `http://localhost:5000/api/admin/artisans/reject/${id}`;

    axios.post(endpoint)
      .then(() => setArtisans(prev => prev.filter(a => a._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <Navbar />
      <div className="pending-artisans-container">
        <h2>Pending Artisan Approvals</h2>

        {artisans.length === 0 ? (
          <p className="no-pending">No pending artisans</p>
        ) : (
          <table className="artisans-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artisans.map(artisan => (
                <tr key={artisan._id}>
                  <td>{artisan.name}</td>
                  <td>{artisan.email}</td>
                  <td>
                    <button
                      className="action-button view-button"
                      onClick={() => setSelectedArtisan(artisan)}
                    >
                      View
                    </button>
                    <button
                      className="action-button approve-button"
                      onClick={() => handleAction(artisan._id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="action-button reject-button"
                      onClick={() => handleAction(artisan._id, "reject")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedArtisan && (
          <div className="artisan-modal">
            <h3>Artisan Details</h3>
            <p><strong>Name:</strong> {selectedArtisan.name}</p>
            <p><strong>Email:</strong> {selectedArtisan.email}</p>
            <p><strong>Phone:</strong> {selectedArtisan.phone}</p>
            <p><strong>Address:</strong> {selectedArtisan.address}</p>
            {/* Add more fields as needed */}
            <button
              className="close-button"
              onClick={() => setSelectedArtisan(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingArtisans;
