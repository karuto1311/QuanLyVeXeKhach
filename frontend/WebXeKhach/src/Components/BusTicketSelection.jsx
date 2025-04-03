import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "../assets/Css/BusTicketSelection.css";
import bus_image from "../assets/bus_image.png";
import icon_trash from "../assets/icon_trash.png";

const BusTicketSelection = () => {
  const [tripType, setTripType] = useState("one-way");
  const [trips, setTrips] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    startPoint: "",
    endPoint: "",
  });
  const [showTransit, setShowTransit] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/trips");
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data = await response.json();

        // Tạo dữ liệu chuyến có và không có trung chuyển
        const tripsWithTransit = data.map((trip, index) => {
          if (index % 2 === 0) {
            return {
              ...trip,
              transit_points: [
                {
                  location: "Thanh Hóa",
                  arrival: "2025-02-22T11:30:00",
                  departure: "2025-02-22T12:00:00",
                },
              ],
            };
          } else {
            return {
              ...trip,
              transit_points: [],
            };
          }
        });

        setTrips(tripsWithTransit);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearchCriteria =
      trip.start_point
        .toLowerCase()
        .includes(searchCriteria.startPoint.toLowerCase()) &&
      trip.end_point
        .toLowerCase()
        .includes(searchCriteria.endPoint.toLowerCase());

    if (!matchesSearchCriteria) return false;

    if (selectedTimes.length > 0) {
      const tripHour = moment(trip.start).hour();
      const matchesTimeFilter = selectedTimes.some((range) => {
        const [start, end] = range
          .split(" - ")
          .map((time) => parseInt(time.split(":")[0], 10));
        return tripHour >= start && tripHour < end;
      });
      if (!matchesTimeFilter) return false;
    }

    if (showTransit && trip.transit_points.length === 0) {
      return false; // chỉ hiển thị chuyến có trung chuyển nếu được chọn
    }

    return true;
  });

  return (
    <div className="bus-ticket-selection">
      <HeaderImage />
      <SearchBox
        tripType={tripType}
        setTripType={setTripType}
        setSearchCriteria={setSearchCriteria}
      />
      <div className="filter-and-results">
        <FilterBox
          setSelectedTimes={setSelectedTimes}
          setShowTransit={setShowTransit}
          showTransit={showTransit}
        />
        <TripResults
          trips={filteredTrips}
          selectedTimes={selectedTimes}
          showTransit={showTransit}
        />
      </div>
    </div>
  );
};

const HeaderImage = () => (
  <div className="header-image">
    <img src={bus_image} alt="Buses" />
  </div>
);

const SearchBox = ({ tripType, setTripType, setSearchCriteria }) => {
  const [searchParams, setSearchParams] = useState({
    startPoint: "",
    endPoint: "",
    date: "",
    seats: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setSearchCriteria({
      startPoint: searchParams.startPoint,
      endPoint: searchParams.endPoint,
    });
  };

  return (
    <div className="search-box">
      <div className="trip-type">
        {["one-way", "round-trip"].map((type) => (
          <label key={type}>
            <input
              type="radio"
              name="tripType"
              checked={tripType === type}
              onChange={() => setTripType(type)}
            />
            {type === "one-way" ? "Một chiều" : "Khứ hồi"}
          </label>
        ))}
      </div>

      <div className="input-fields">
        <input
          type="text"
          name="startPoint"
          placeholder="Điểm đi"
          value={searchParams.startPoint}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="endPoint"
          placeholder="Điểm đến"
          value={searchParams.endPoint}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          value={searchParams.date}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="seats"
          placeholder="Số vé"
          value={searchParams.seats}
          onChange={handleInputChange}
        />
      </div>

      <button className="search-button" onClick={handleSearch}>
        Tìm chuyến xe
      </button>
    </div>
  );
};

const FilterBox = ({
  setSelectedTimes,
  setShowTransit,
  showTransit,
  setSelectedVehicleTypes,
}) => {
  const handleTimeFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedTimes((prev) =>
      checked ? [...prev, value] : prev.filter((time) => time !== value)
    );
  };

  const handleVehicleTypeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedVehicleTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const handleClearFilters = () => {
    setSelectedTimes([]);
    setSelectedVehicleTypes([]);
    document
      .querySelectorAll(".filter-box input[type='checkbox']")
      .forEach((checkbox) => {
        checkbox.checked = false;
      });
    setShowTransit(false); // Reset bộ lọc chuyến có trung chuyển
  };

  return (
    <div className="filter-box">
      <div className="filter-header">
        <h4>BỘ LỌC TÌM KIẾM</h4>
        <button onClick={handleClearFilters} className="clear-filters-button">
          Bỏ chọn lọc <img src={icon_trash} className="icontrash" alt="clear" />
        </button>
      </div>
      <div className="filter-options">
        <div className="filter-group">
          <label>Giờ đi</label>
          {[
            "00:00 - 06:00",
            "06:00 - 12:00",
            "12:00 - 18:00",
            "18:00 - 24:00",
          ].map((range) => (
            <label key={range}>
              <input
                type="checkbox"
                value={range}
                onChange={handleTimeFilterChange}
              />{" "}
              {range}
            </label>
          ))}

          {/* Checkbox lọc chuyến có trung chuyển */}
          <label>
            <input
              type="checkbox"
              checked={showTransit}
              onChange={() => setShowTransit(!showTransit)}
            />
            Chuyến có trung chuyển
          </label>

          <label>Loại xe</label>
          {["Ghế", "Giường 1 tầng", "Giường 2 tầng"].map((range) => (
            <label key={range}>
              <input
                type="checkbox"
                value={range}
                onChange={handleVehicleTypeChange}
              />{" "}
              {range}
            </label>
          ))}

          <label>Tầng</label>
          {["Tầng trên", "Tầng dưới"].map((range) => (
            <label key={range}>
              <input type="checkbox" value={range} /> {range}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const TripResults = ({ trips, selectedTimes, showTransit }) => {
  return (
    <div className="results">
      <h4>DANH SÁCH CHUYẾN ĐI</h4>
      <div className="sort-options">
        {["Giá rẻ bất ngờ", "Giờ khởi hành", "Ghế trống"].map(
          (sortType, index) => (
            <button key={index}>{sortType}</button>
          )
        )}
      </div>
      {trips.map((trip, index) => (
        <Trip key={index} trip={trip} />
      ))}
    </div>
  );
};

const Trip = ({ trip }) => {
  const {
    start,
    end,
    start_point,
    end_point,
    price,
    vehicle_number,
    transit_points,
  } = trip;

  return (
    <div className="trip">
      <div className="trip-details">
        {[
          {
            label: "Bắt đầu",
            value: moment(start).local().format("YYYY-MM-DD HH:mm:ss"),
            location: start_point,
            extra: "Giường 2 Tầng",
          },
          {
            label: "Kết thúc",
            value: moment(end).local().format("YYYY-MM-DD HH:mm:ss"),
            location: end_point,
            extra: "36 chỗ trống",
          },
        ].map(({ label, value, location, extra }, index) => (
          <div className="trip-row" key={index}>
            <span className="trip-label">{label}</span>
            <span className="trip-value">{value}</span>
            <span className="trip-location">{location}</span>
            <span className="trip-extra">{extra}</span>
          </div>
        ))}

        {transit_points && transit_points.length > 0 && (
          <div className="trip-transits">
            <h5>Điểm trung chuyển:</h5>
            {transit_points.map((transit, index) => (
              <div className="trip-transit" key={index}>
                <span className="transit-location">
                  Điểm dừng: {transit.location}
                </span>
                <span className="transit-arrival">
                  Đến:{" "}
                  {moment(transit.arrival)
                    .local()
                    .format("YYYY-MM-DD HH:mm:ss")}
                </span>
                <span className="transit-departure">
                  Rời đi:{" "}
                  {moment(transit.departure)
                    .local()
                    .format("YYYY-MM-DD HH:mm:ss")}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="trip-row">
          <span className="trip-label">Biển số xe:</span>
          <span className="trip-value">
            {vehicle_number || "Không có thông tin"}
          </span>
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
            startPoint: start_point,
            endPoint: end_point,
            vehicle_number,
            price,
            trip,
          }}
        >
          <button className="select-trip-button">Chọn chuyến</button>
        </Link>
      </div>
    </div>
  );
};

export { Trip };
export default BusTicketSelection;
