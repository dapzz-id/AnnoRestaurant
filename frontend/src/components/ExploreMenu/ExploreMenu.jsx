import React from "react";
import "./ExploreMenu.css";
import { menu_list, assets } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  // Tambahkan kategori minuman ke dalam menu_list
  const updatedMenuList = [
    ...menu_list,
    { menu_name: "Minuman", menu_image: assets.drinks_icon },
  ];

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Eksplorasi menu - menu kami </h1>
      <p className="explore-menu-text">
        Jelajahi menu kami dan temukan kombinasi rasa yang unik dan hidangan
        istimewa yang dirancang untuk memberikan pengalaman makan yang tak
        terlupakan. Selamat menikmati!
      </p>
      <div className="explore-menu-list">
        {updatedMenuList.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
