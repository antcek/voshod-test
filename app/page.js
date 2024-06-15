"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import styles from "./Home.module.css";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState({ brands: [], models: [], tariffs: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersData, setFiltersData] = useState({
    brands: [],
    models: {},
    tariffs: {},
  });
  const [tariffsArr, setTariffsArr] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFilters = async () => {
      const response = await fetch(
        "https://test.taxivoshod.ru/api/test/?w=catalog-filter"
      );
      const data = await response.json();
      setFiltersData(data);

      if (data.tarif && data.tarif.values) {
        const tariffs = Object.entries(data.tarif.values).map(
          ([key, value]) => ({
            id: key,
            name: value,
          })
        );
        setTariffsArr(tariffs);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      const brandQuery = filter.brands.map((b) => `brand[]=${b}`).join("&");
      const modelQuery = filter.models.map((m) => `model[]=${m}`).join("&");
      const tariffQuery = filter.tariffs.map((t) => `tarif[]=${t}`).join("&");

      const queryString = [`page=${page}`, brandQuery, modelQuery, tariffQuery]
        .filter(Boolean)
        .join("&");

      const response = await fetch(
        `https://test.taxivoshod.ru/api/test/?w=catalog-cars&${queryString}`
      );

      const data = await response.json();
      console.log("Cars Data:", data);
      setCars(data.list || []);
      setTotalPages(data.pages || 1);
    };

    fetchCars();
  }, [filter, page]);

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleCarClick = (id) => {
    router.push(`/${id}`);
  };

  const handleFilterChange = (type, value) => {
    let updatedFilter = { ...filter };

    if (type === "brands") {
      updatedFilter = {
        ...updatedFilter,
        brands: updatedFilter.brands.includes(value)
          ? updatedFilter.brands.filter((item) => item !== value)
          : [...updatedFilter.brands, value],
        models: [], 
      };
    } else {
      updatedFilter = {
        ...updatedFilter,
        [type]: updatedFilter[type].includes(value)
          ? updatedFilter[type].filter((item) => item !== value)
          : [...updatedFilter[type], value],
      };
    }

    setFilter(updatedFilter);
    setPage(1); 
  };

  const modelsByBrand = (brand) => filtersData.models?.[brand]?.models || [];
  const tariffs = tariffsArr || [];

  return (
    <div className={styles.container}>
      <h1>Список автомобилей</h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <h3>Фильтр по марке</h3>
          {filtersData.brands.values.length > 0 ? (
            filtersData.brands.values.map((brand) => (
              <div key={brand}>
                <label>
                  <input
                    type="checkbox"
                    value={brand}
                    checked={filter.brands.includes(brand)}
                    onChange={() => handleFilterChange("brands", brand)}
                  />
                  {brand}
                </label>
              </div>
            ))
          ) : (
            <p>Загрузка марок...</p>
          )}
        </div>
        <div className={styles.filterGroup}>
          <h3>Фильтр по модели</h3>
          {filter.brands.length > 0 ? (
            filter.brands.flatMap((brand) => modelsByBrand(brand)).length >
            0 ? (
              modelsByBrand(filter.brands[0]).map((model) => (
                <div key={model}>
                  <label>
                    <input
                      type="checkbox"
                      value={model}
                      checked={filter.models.includes(model)}
                      onChange={() => handleFilterChange("models", model)}
                    />
                    {model}
                  </label>
                </div>
              ))
            ) : (
              <p>Загрузка моделей...</p>
            )
          ) : (
            <p>Выберите марку</p>
          )}
        </div>
        <div className={styles.filterGroup}>
          <h3>Фильтр по тарифу</h3>
          {tariffs.length > 0 ? (
            tariffs.map((tariff) => (
              <div key={tariff.id}>
                <label>
                  <input
                    type="checkbox"
                    value={tariff.id}
                    checked={filter.tariffs.includes(tariff.id)}
                    onChange={() => handleFilterChange("tariffs", tariff.id)}
                  />
                  {tariff.name}
                </label>
              </div>
            ))
          ) : (
            <p>Загрузка тарифов...</p>
          )}
        </div>
      </div>

      <div className={styles.carList}>
        {cars.length > 0 ? (
          cars.map((car) => (
            <div key={car.id} className={styles.carItem}>
              <Link href={`/${car.id}`}>
                <img
                  src={car.image || "https://via.placeholder.com/275x150"}
                  alt={car.brand}
                />
                <h3>{`${car.brand} ${car.model}`}</h3>
                <p>Регистрационный номер: {car.number}</p>
                <p>Цена: {car.price}</p>
                <p>Тариф: {car.tarif.join(", ")}</p>
              </Link>
              <button onClick={() => handleCarClick(car.id)}>Подробнее</button>
            </div>
          ))
        ) : (
          <p>Загрузка автомобилей...</p>
        )}
      </div>

      <div className={styles.pagination}>
        <ReactPaginate
          previousLabel={"Предыдущая"}
          nextLabel={"Следующая"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default Home;
