import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Footer from "../../components/Footer";
import mapboxgl from "mapbox-gl";
import "../../assets/css/contractStyles.css";
import { getAuthApi } from "../../config/authUtils";
import { endpoints } from "../../context/APIs";

// Mapbox Access Token
mapboxgl.accessToken = "pk.eyJ1IjoiYmFvcGhhbTAxMTAiLCJhIjoiY21leTc3dmdvMWVoNTJrcHlvY29xODZkYSJ9.vnT3usPvz6o6c-7X10sSmw"; // Thay bằng token Mapbox của bạn

export default function ContractCardMinimal() {
    const [contracts, setContracts] = useState([]);
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedContract, setSelectedContract] = useState(null);
    const [zoomedImage, setZoomedImage] = useState(null);
    const mapContainer = useRef(null);
    const map = useRef(null);

    const fetchContracts = async () => {
        try {
            const api = await getAuthApi();
            const response = await api.get(endpoints['contracts']);
            const data = response.data || [
                {
                    contractId: 2,
                    lessor: {
                        userId: 4,
                        fullName: "Nguyễn Văn A",
                        email: "bao1@gmail.com",
                        phone: null,
                        role: "lessor",
                        avatarUrl: null,
                    },
                    bike: {
                        bikeId: 9,
                        owner: { fullName: "Nguyễn Văn A" },
                        brand: { brandId: 1, name: "Honda" },
                        licensePlate: [
                            "https://res.cloudinary.com/pqbou11/image/upload/v1756030975/chscuhlnfgulgorxdosc.jpg",
                            "https://res.cloudinary.com/pqbou11/image/upload/v1756030976/nm1ademfahpcm1axew32.jpg"
                        ],
                        imageUrl: [
                            "https://res.cloudinary.com/pqbou11/image/upload/v1756030972/aultwhulzkrl8jofa7cv.jpg",
                            "https://res.cloudinary.com/pqbou11/image/upload/v1756030973/vjicmxglfp1fl4bgml6f.jpg"
                        ],
                        status: "available",
                        pricePerDay: 100000.0,
                        location: { locationId: 1, name: "Tp. Hồ Chí Minh" },
                        name: "Honda wave 2020",
                        note: null,
                    },
                    serviceFee: 20000.0,
                    paymentCycle: "weekly",
                    startDate: "2025-08-21",
                    endDate: "2025-08-31",
                    status: "pending",
                    cancelRequestedAt: null,
                    approvedBy: null,
                    approvedAt: null,
                    updatedAt: "2025-08-28T18:04:58.099924",
                    location: {
                        id: 1,
                        latitude: 10.710464850657948,
                        longitude: 106.70901413963713,
                        address: "Vị trí được chọn trên bản đồ"
                    }
                },
                {
                    contractId: 3,
                    lessor: { fullName: "Trần Thị B" },
                    bike: { bikeId: 10, name: "Yamaha Sirius", pricePerDay: 120000, brand: { name: "Yamaha" }, location: { name: "Hà Nội" } },
                    serviceFee: 15000.0,
                    paymentCycle: "daily",
                    startDate: "2025-09-01",
                    endDate: "2025-09-05",
                    status: "updated",
                    location: { id: 2, latitude: 21.0285, longitude: 105.8542, address: "456 Cầu Giấy, Hà Nội" }
                }
            ];
            setContracts(data);
            setFilteredContracts(data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        if (filterStatus === 'all') {
            setFilteredContracts(contracts);
        } else {
            setFilteredContracts(
                contracts.filter(contract => contract.status?.toLowerCase() === filterStatus)
            );
        }
    }, [filterStatus, contracts]);

    useEffect(() => {
        if (selectedContract && mapContainer.current && !map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [selectedContract.location.longitude, selectedContract.location.latitude],
                zoom: 15
            });

            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                    <h3>Vị trí hợp đồng</h3>
                    <p><strong>Địa chỉ:</strong> ${selectedContract.location.address}</p>
                    <p><strong>Tọa độ:</strong> Lat: ${selectedContract.location.latitude.toFixed(6)}, Lng: ${selectedContract.location.longitude.toFixed(6)}</p>
                `);

            new mapboxgl.Marker({
                color: '#7c3aed',
                scale: 1.5
            })
                .setLngLat([selectedContract.location.longitude, selectedContract.location.latitude])
                .setPopup(popup)
                .addTo(map.current);

            map.current.on('load', () => {
                popup.addTo(map.current);
            });

            return () => {
                if (map.current) map.current.remove();
            };
        }
    }, [selectedContract]);


    const updateActiveBike = async (bikeId) => {
        try {
            const api = await getAuthApi();
            await api.patch(endpoints['update_active_bike'](bikeId));
            fetchContracts();
        } catch (error) {
            console.error('Error updating bike activity:', error);
        }
    }

    const updateBikeAvailability = async (bikeId) => {
        try {
            const api = await getAuthApi();
            await api.patch(endpoints['update_available_bike'](bikeId));
            fetchContracts();
        } catch (error) {
            console.error('Error updating bike availability:', error);
        }
    };

    const handleApproveContract = async (bikeId, contractId) => {
        try {
            const api = await getAuthApi();
            console.log('Approving contract:', contractId, 'for bike:', bikeId);

            await api.patch(endpoints['update_active_contract'](contractId));
            await api.patch(endpoints['update_available_bike'](bikeId));
            console.log('Bike availability updated');
            console.log('Contract approved successfully');
            alert('Xét duyệt hợp đồng thành công');
            fetchContracts();
            setSelectedContract(null); // nếu đang trong modal thì đóng luôn
        } catch (error) {
            console.error('Lỗi xét duyệt hợp đồng:', error);
        }
    };


    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Topbar />
                <div className="page-content">
                    <div className="header">
                        <h2 className="main-header">Quản lý hợp đồng</h2>
                        <p className="sub-header">Danh sách hợp đồng cần xử lý</p>
                        <div className="filter-bar">
                            <label className="filter-label">Hiển thị:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="filter-status"
                            >
                                <option value="all">Tất cả</option>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="updated">Updated</option>
                            </select>
                        </div>
                    </div>

                    {filteredContracts.length === 0 && (
                        <p className="empty-message">Không có hợp đồng nào.</p>
                    )}

                    <div className="contract-grid">
                        {filteredContracts.map((contract) => (
                            <div className="card" key={contract.contractId}>
                                <div className="card-header">
                                    <div className="card-header-left">
                                        <strong className="bike-name">{contract.bike?.name}</strong>
                                    </div>
                                    <span className={`status-badge ${contract.status?.toLowerCase()}`}>
                                        {contract.status}
                                    </span>
                                </div>

                                <div className="card-subinfo">
                                    <div className="subinfo-item">
                                        <span className="label">Người cho thuê:</span>
                                        <span>{contract.lessor?.fullName}</span>
                                    </div>
                                    <div className="subinfo-item">
                                        <span className="label">Địa điểm:</span>
                                        <span>{contract.location?.address}</span>
                                    </div>
                                </div>

                                <div className="card-meta">
                                    <div className="meta-item">
                                        <span className="label">Bắt đầu:</span>
                                        <span>{contract.startDate}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="label">Kết thúc:</span>
                                        <span>{contract.endDate}</span>
                                    </div>
                                    <div className="meta-item price">
                                        <span className="label">Giá:</span>
                                        <span>{contract.bike?.pricePerDay?.toLocaleString()} VND/ngày</span>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button
                                        className="btn primary"
                                        onClick={() => setSelectedContract(contract)}
                                    >
                                        Chi tiết
                                    </button>
                                    {contract.status?.toLowerCase() === 'updated' && (
                                        <button
                                            className="btn approve"
                                            onClick={() => handleApproveContract(contract.bike.bikeId, contract.contractId)}
                                        >
                                            Xét duyệt
                                        </button>
                                    )}
                                    <button className="btn outline">Mời thuê</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedContract && (
                        <div className="modal-overlay" onClick={() => setSelectedContract(null)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h3 className="modal-header">{selectedContract.bike?.name}</h3>
                                <div className="modal-section">
                                    <h4 className="modal-sub-header">Thông tin hợp đồng</h4>
                                    <div className="modal-info-grid">
                                        <div className="modal-info-item">
                                            <span className="modal-label">ID hợp đồng:</span>
                                            <span>{selectedContract.contractId}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Trạng thái:</span>
                                            <span className={`status-badge ${selectedContract.status?.toLowerCase()}`}>
                                                {selectedContract.status}
                                            </span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Phí dịch vụ:</span>
                                            <span>{selectedContract.serviceFee?.toLocaleString()} VND</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Chu kỳ thanh toán:</span>
                                            <span>{selectedContract.paymentCycle}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Ngày bắt đầu:</span>
                                            <span>{selectedContract.startDate}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Ngày kết thúc:</span>
                                            <span>{selectedContract.endDate}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Cập nhật lúc:</span>
                                            <span>{selectedContract.updatedAt || 'Chưa cập nhật'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-section">
                                    <h4 className="modal-sub-header">Thông tin người cho thuê</h4>
                                    <div className="modal-info-grid">
                                        <div className="modal-info-item">
                                            <span className="modal-label">Họ tên:</span>
                                            <span>{selectedContract.lessor?.fullName}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Email:</span>
                                            <span>{selectedContract.lessor?.email}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Điện thoại:</span>
                                            <span>{selectedContract.lessor?.phone || 'Chưa cung cấp'}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Vai trò:</span>
                                            <span>{selectedContract.lessor?.role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-section">
                                    <h4 className="modal-sub-header">Thông tin xe</h4>
                                    <div className="modal-info-grid">
                                        <div className="modal-info-item">
                                            <span className="modal-label">Tên xe:</span>
                                            <span>{selectedContract.bike?.name}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Hãng xe:</span>
                                            <span>{selectedContract.bike?.brand?.name}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Giá thuê/ngày:</span>
                                            <span>{selectedContract.bike?.pricePerDay?.toLocaleString()} VND</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Địa điểm xe:</span>
                                            <span>{selectedContract.bike?.location?.name}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Trạng thái xe:</span>
                                            <span>{selectedContract.bike?.status}</span>
                                        </div>
                                        <div className="modal-info-item">
                                            <span className="modal-label">Ghi chú:</span>
                                            <span>{selectedContract.bike?.note || 'Không có'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-section">
                                    <h4 className="modal-sub-header">Hình ảnh xe</h4>
                                    <div className="image-grid">
                                        {selectedContract.bike?.imageUrl?.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`bike-image-${index}`}
                                                className="preview-image"
                                                onClick={() => setZoomedImage(url)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-section">
                                    <h4 className="modal-sub-header">Ảnh biển số xe</h4>
                                    <div className="image-grid">
                                        {selectedContract.bike?.licensePlate?.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`plate-image-${index}`}
                                                className="preview-image"
                                                onClick={() => setZoomedImage(url)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-section">
                                    <h4 className="modal-sub-header">Vị trí trên bản đồ</h4>
                                    <div ref={mapContainer} className="map-container" />
                                </div>
                                <div className="modal-actions">
                                    {selectedContract.status?.toLowerCase() === 'updated' && (
                                        <button
                                            className="btn approve"
                                            onClick={() => handleApproveContract(selectedContract.contractId)}
                                        >
                                            Xét duyệt
                                        </button>
                                    )}
                                    <button className="btn close" onClick={() => setSelectedContract(null)}>
                                        Đóng
                                    </button>
                                </div>
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