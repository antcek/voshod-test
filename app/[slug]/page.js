"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CarDetail.module.css";

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);

  const id =
    typeof window !== "undefined" ? window.location.pathname.slice(1) : "";

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(
          `https://test.taxivoshod.ru/api/test/?w=catalog-car&id=${id}`
        );
        if (response.data.result === 1 && response.data.item) {
          setCar(response.data.item);
        } else {
          setError(`Car with id ${id} not found.`);
        }
      } catch (error) {
        setError(`Failed to fetch car with id ${id}: ${error.message}`);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  if (!id) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Информация об автомобиле</h1>
      <div className={styles.carInfo}>
        <p>Бренд: {car.brand}</p>
        <p>Модель: {car.model}</p>
        <p>Регистрационный номер: {car.id}</p>
        <p>Цена: {car.price}</p>
        <p>Тариф: {car.tarif.join(", ") || "Нет данных"}</p>
      </div>
      {car.images && (
        <div className={styles.images}>
          <h2>Изображения</h2>
          {car.images.map((image, index) => (
            <img
              key={image.id}
              src={image.image}
              alt={`Car ${index}`}
              style={{ width: "300px", height: "auto" }}
              className={styles.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarDetail;
