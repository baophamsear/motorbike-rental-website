import React, { useEffect, useState } from 'react';
import { FaCommentAlt, FaEllipsisV } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Footer from '../../components/Footer';
import { getAuthApi } from '../../config/authUtils';
import { endpoints } from '../../context/APIs';
import '../../assets/css/bikerequirements.css';

export default function BikeRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectedBikeIds, setSelectedBikeIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');

  const fetchRequirements = async () => {
    try {
      const api = await getAuthApi();
      const response = await api.get(endpoints['bikes']);
      const data = response.data || [
        {
          bikeId: 1,
          name: 'Honda Wave',
          brand: { name: 'Honda' },
          location: { name: 'TP.HCM' },
          status: 'Pending',
          owner: { avatar: 'https://via.placeholder.com/38' },
          note: 'Xe mới, bảo dưỡng đầy đủ',
          pricePerDay: '150,000 VND',
          imageUrl: ['https://via.placeholder.com/100'],
          licensePlate: ['https://via.placeholder.com/100'],
        },
        {
          bikeId: 2,
          name: 'Yamaha Sirius',
          brand: { name: 'Yamaha' },
          location: { name: 'Hà Nội' },
          status: 'Approved',
          owner: { avatar: 'https://via.placeholder.com/38' },
          note: 'Xe đã qua sử dụng',
          pricePerDay: '120,000 VND',
          imageUrl: ['https://via.placeholder.com/100'],
          licensePlate: ['https://via.placeholder.com/100'],
        },
        {
          bikeId: 3,
          name: 'Suzuki Viva',
          brand: { name: 'Suzuki' },
          location: { name: 'Đà Nẵng' },
          status: 'Rejected',
          owner: { avatar: 'https://via.placeholder.com/38' },
          note: 'Xe cần sửa chữa',
          pricePerDay: '100,000 VND',
          imageUrl: ['https://via.placeholder.com/100'],
          licensePlate: ['https://via.placeholder.com/100'],
        },
      ];
      setRequirements(data);
      setFilteredRequirements(data);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredRequirements(requirements);
    } else {
      setFilteredRequirements(
        requirements.filter(bike => bike.status?.toLowerCase() === filterStatus)
      );
    }
    setSelectedBikeIds([]); // Reset selected bikes when filter changes
  }, [filterStatus, requirements]);

  const handleToggleSelect = (bikeId) => {
    setSelectedBikeIds(prev =>
      prev.includes(bikeId)
        ? prev.filter(id => id !== bikeId)
        : [...prev, bikeId]
    );
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus) {
      alert('Vui lòng chọn trạng thái');
      return;
    }
    if (selectedBikeIds.length === 0) {
      alert('Vui lòng chọn xe để cập nhật trạng thái');
      return;
    }
    try {
      const api = await getAuthApi();
      await api.patch(endpoints['bikes_status'], {
        bikeIds: selectedBikeIds,
        status: bulkStatus,
      });

      await api.post(endpoints['init_multi'], {
        bikeIds: selectedBikeIds,
      });
      
      alert('Cập nhật trạng thái thành công');
      fetchRequirements();
      setSelectedBikeIds([]);
      setBulkStatus('');
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content">
          <div className="header">
            <h2 className="main-header">Yêu cầu đăng kí xe</h2>
            <p className="sub-header">Danh sách yêu cầu cần xử lý</p>
            <div className="filter-bar">
              <label className="filter-label">Hiển thị:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-status"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredRequirements.length === 0 && (
            <p className="empty-message">Không có yêu cầu nào.</p>
          )}

          {filterStatus === 'pending' && (
            <div className="bulk-action-bar">
              <span className="bulk-action-text">Đã chọn {selectedBikeIds.length} xe</span>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="dropdown-status"
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="approved">Duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
              <button className="action-button" onClick={handleBulkUpdate}>
                Cập nhật
              </button>
              <button className="action-button clear-button" onClick={() => setSelectedBikeIds([])}>
                Bỏ chọn
              </button>
            </div>
          )}

          <div className="requirements-grid">
            {filteredRequirements.map((bike, i) => (
              <div className="task-card" key={bike.bikeId || i}>
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={selectedBikeIds.includes(bike.bikeId)}
                    onChange={() => handleToggleSelect(bike.bikeId)}
                    className="checkbox"
                    disabled={filterStatus !== 'pending'}
                  />
                  <div className="task-info">
                    <div className="info-row">
                      <span className="label-info">Tên xe:</span>
                      <span className="info-value">{bike.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="label-info">Thông tin xe:</span>
                      <span className="info-value">
                        <span className="badge brand">{bike.brand?.name}</span>
                        <span className="dot">•</span>
                        <span className="badge location">{bike.location?.name}</span>
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label-info">Trạng thái:</span>
                      <span className="info-value">
                        <span className={`badge status ${bike.status?.toLowerCase()}`}>
                          {bike.status}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="task-right">
                  <img
                    src={bike.owner?.avatar || 'https://via.placeholder.com/38'}
                    alt="avatar"
                    className="avatar"
                  />
                  <FaCommentAlt className="icon-btn" />
                  <div className="menu-wrapper">
                    <FaEllipsisV
                      className="icon-btn"
                      onClick={() => setMenuVisibleId(menuVisibleId === bike.bikeId ? null : bike.bikeId)}
                    />
                    {menuVisibleId === bike.bikeId && (
                      <div className="dropdown-menu">
                        <div
                          className="menu-item"
                          onClick={() => {
                            setSelectedBike(bike);
                            setMenuVisibleId(null);
                          }}
                        >
                          Xem chi tiết
                        </div>
                        <div className="menu-item danger">Xóa</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedBike && (
            <div className="modal-overlay" onClick={() => setSelectedBike(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-header">{selectedBike.name}</h3>
                <p className="modal-text"><strong>Brand:</strong> {selectedBike.brand?.name}</p>
                <p className="modal-text"><strong>Location:</strong> {selectedBike.location?.name}</p>
                <p className="modal-text"><strong>Trạng thái:</strong> {selectedBike.status}</p>
                <p className="modal-text"><strong>Ghi chú:</strong> {selectedBike.note || 'Không có'}</p>
                <p className="modal-text"><strong>Giá thuê/ngày:</strong> {selectedBike.pricePerDay || 'Chưa cập nhật'}</p>

                <div>
                  <h4 className="modal-sub-header">Hình ảnh xe:</h4>
                  <div className="image-grid">
                    {selectedBike.imageUrl?.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`image-${index}`}
                        className="preview-image"
                        onClick={() => setZoomedImage(url)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="modal-sub-header">Ảnh biển số xe:</h4>
                  <div className="image-grid">
                    {selectedBike.licensePlate?.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`plate-${index}`}
                        className="preview-image"
                        onClick={() => setZoomedImage(url)}
                      />
                    ))}
                  </div>
                </div>

                <button className="close-button" onClick={() => setSelectedBike(null)}>
                  Đóng
                </button>
              </div>
            </div>
          )}

          {zoomedImage && (
            <div className="zoom-overlay" onClick={() => setZoomedImage(null)}>
              <img src={zoomedImage} alt="zoomed" className="zoomed-image" />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}