"use client";
import Link from "next/link";
import { useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./style.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="nav container">
      <div className="nav__data">
        <Link href="/" className="nav__logo">
          <i className="ri-building-2-line"></i> TRILUX
        </Link>

        {/* Nút menu mobile */}
        <div className="nav__toggle" onClick={() => setIsOpen(!isOpen)}>
          <i
            className={`ri-menu-line nav__burger ${isOpen ? "hidden" : ""}`}
          ></i>
          <i
            className={`ri-arrow-down-s-line nav__close ${
              isOpen ? "" : "hidden"
            }`}
          ></i>
        </div>

        {/* Nút đăng xuất (nếu có auth) */}
        {/* Giả sử bạn có trạng thái đăng nhập, thay thế `isAuthenticated` bằng logic thực tế */}
        {/* {true && (
          <form action="/logout" method="post" className="logout__form">
            &emsp;<button type="submit">Đăng xuất</button>
          </form>
        )} */}
      </div>

      {/* Menu điều hướng */}
      <div className={`nav__menu ${isOpen ? "show-menu" : ""}`} id="nav-menu">
        <ul className="nav__list">
          <li>
            <Link href="/" className="nav__link">
              HOME
            </Link>
          </li>
          <li>
            <Link href="/about" className="nav__link">
              ABOUT
            </Link>
          </li>

          {/* Dropdown */}
          <li className="dropdown__item">
            <div
              className="nav__link"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              SERVICE{" "}
              <i className="ri-arrow-down-wide-line dropdown__arrow"></i>
            </div>
            {isDropdownOpen && (
              <ul className="dropdown__menu">
                <li>
                  <Link href="/landscaping" className="dropdown__link">
                    <i className="ri-building-2-line"></i> LANDSCAPING
                  </Link>
                </li>
                <li>
                  <Link href="/homerenovation" className="dropdown__link">
                    <i className="ri-home-4-line"></i> HOME RENOVATION
                  </Link>
                </li>
                <li>
                  <Link href="/staging" className="dropdown__link">
                    <i className="ri-stack-line"></i> STAGING
                  </Link>
                </li>
                <li>
                  <Link href="/cleaning" className="dropdown__link">
                    <i className="ri-paint-brush-line"></i> CLEANING
                  </Link>
                </li>
                <li>
                  <Link href="/propertymaintenance" className="dropdown__link">
                    <i className="ri-hammer-line"></i> PROPERTY MAINTENANCE
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link href="/news" className="nav__link">
              NEWS
            </Link>
          </li>
          <li>
            <Link href="/contact" className="nav__link">
              CONTACT
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
