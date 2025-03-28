import React, { useState, useEffect } from "react";
import "../assets/Css/BusTicketSelection.css";
import { Link } from "react-router-dom";
import bus_image from "../assets/bus_image.png";
import icon_trash from "../assets/icon_trash.png";
import moment from "moment";

const BusTicketSelection = () => {
  const [tripType, setTripType] = useState("one-way");
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/trips");
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        setTrips(data); // Lấy dữ liệu chuyến xe từ database, bao gồm vehicle_number
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="bus-ticket-selection">
      <HeaderImage />
      <SearchBox tripType={tripType} setTripType={setTripType} />
      <div className="filter-and-results">
        <FilterBox />
        <TripResults trips={trips} />
      </div>
    </div>
  );
};

const HeaderImage = () => (
  <div className="header-image">
    <img src={bus_image} alt="Buses" />
  </div>
);

const SearchBox = ({ tripType, setTripType }) => (
  <div className="search-box">
    <div className="trip-type">
      <label>
        <input
          type="radio"
          name="tripType"
          checked={tripType === "one-way"}
          onChange={() => setTripType("one-way")}
        />
        Một chiều
      </label>
      <label>
        <input
          type="radio"
          name="tripType"
          checked={tripType === "round-trip"}
          onChange={() => setTripType("round-trip")}
        />
        Khứ hồi
      </label>
    </div>
    <div className="input-fields">
      <input type="text" placeholder="Điểm đi" />
      <input type="text" placeholder="Điểm đến" />
      <input type="date" placeholder="Ngày đi" />
      <input type="number" placeholder="Số vé" />
    </div>
    <button className="search-button">Tìm chuyến xe</button>
  </div>
);

const FilterBox = () => {
  const handleClearFilters = () => {
    document
      .querySelectorAll(".filter-box input[type='checkbox']")
      .forEach((checkbox) => {
        checkbox.checked = false;
      });
  };

  return (
    <div className="filter-box">
      <div className="filter-header">
        <h4>BỘ LỌC TÌM KIẾM</h4>
        <button onClick={handleClearFilters} className="clear-filters-button">
          Bỏ chọn lọc <img src={icon_trash} className="icontrash" />
        </button>
      </div>
      <div className="filter-options">
        <FilterGroup title="Giờ đi">
          <label>
            <input type="checkbox" /> Sáng sớm 00:00 - 06:00
          </label>
          <label>
            <input type="checkbox" /> Buổi sáng 06:00 - 12:00
          </label>
          <label>
            <input type="checkbox" /> Buổi chiều 12:00 - 18:00
          </label>
          <label>
            <input type="checkbox" /> Buổi tối 18:00 - 24:00
          </label>
        </FilterGroup>
        <FilterGroup title="Loại xe">
          <label>
            <input type="checkbox" /> Ghế
          </label>
          <label>
            <input type="checkbox" /> Giường
          </label>
          <label>
            <input type="checkbox" /> Limousine
          </label>
        </FilterGroup>
        <FilterGroup title="Hàng ghế">
          <label>
            <input type="checkbox" /> Hàng đầu
          </label>
          <label>
            <input type="checkbox" /> Hàng giữa
          </label>
          <label>
            <input type="checkbox" /> Hàng cuối
          </label>
        </FilterGroup>
        <FilterGroup title="Tầng">
          <label>
            <input type="checkbox" /> Tầng trên
          </label>
          <label>
            <input type="checkbox" /> Tầng dưới
          </label>
        </FilterGroup>
      </div>
    </div>
  );
};

const FilterGroup = ({ title, children }) => (
  <div className="filter-group">
    <label>{title}</label>
    {children}
  </div>
);

const TripResults = ({ trips }) => (
  <div className="results">
    <h4>TP. Hồ Chí Minh - Đồng Tháp</h4>
    <div className="sort-options">
      <button>Giá rẻ bất ngờ</button>
      <button>Giờ khởi hành</button>
      <button>Ghế trống</button>
    </div>
    {trips.map((trip, index) => (
      <Trip
        key={index}
        start={moment(trip.start).local().format("YYYY-MM-DD HH:mm:ss")}
        end={moment(trip.end).local().format("YYYY-MM-DD HH:mm:ss")}
        startPoint={trip.start_point}
        endPoint={trip.end_point}
        seatsAvailable={36}
        price={trip.price}
        vehicle_number={trip.vehicle_number} // Trường mới, lấy từ backend
        trip={trip}
      />
    ))}
  </div>
);

// Component Trip, sử dụng destructuring với "vehicle_number"
const Trip = ({
  start,
  end,
  startPoint,
  endPoint,
  seatsAvailable,
  price,
  trip,
  vehicle_number,
}) => (
  <div className="trip">
    <div className="trip-details">
      <div className="trip-row">
        <span className="trip-label">Bắt đầu</span>
        <span>{start}</span>
        <span>{startPoint}</span>
        <span>Giường 2 Tầng</span>
      </div>
      <div className="trip-row">
        <span className="trip-label">Kết thúc</span>
        <span>{end}</span>
        <span>{endPoint}</span>
        <span>{seatsAvailable} chỗ trống</span>
      </div>
      <div className="trip-row">
        <span className="trip-label">Biển số xe:</span>
        <span>{vehicle_number || "Không có thông tin"}</span>
      </div>
      <hr className="trip-divider" />
    </div>
    <div className="trip-bottom">
      <div className="trip-price">Giá vé: {price}₫</div>
      <Link
        to="/busticketform"
        state={{
          start,
          end,
          startPoint,
          endPoint,
          seatsAvailable,
          price,
          vehicle_number,
          trip,
        }}
      >
        <button className="select-trip-button">Chọn chuyến</button>
      </Link>
    </div>
  </div>
);

export { Trip };
export default BusTicketSelection;
