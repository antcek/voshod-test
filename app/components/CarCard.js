import React from "react";
import Link from "next/link";

const CarCard = ({ car }) => {
  return (
    <Link href={`/${car.id}`}>
      <a>
        <div>
          <img src={car.image} alt={car.brand} />
          <h3>
            {car.brand} {car.model}
          </h3>
          <p>Регистрационный номер: {car.reg_number}</p>
          <p>Цена: {car.price}</p>
          <p>Тариф: {car.tariff}</p>
        </div>
      </a>
    </Link>
  );
};

export default CarCard;
