import Image from "next/image";
import Link from "next/link";
import "./style.css";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Logo & Social Icons */}
      <div className="footer__content">
        <Image
          src="/images/default-avatar.jpg"
          alt="Logo Company"
          width={100}
          height={100}
        />
        <p>Write description here</p>
        <div className="icons">
          <a
            href="https://www.facebook.com/TriluxGroup"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="ri-facebook-fill"></i>
          </a>
          <a href="#">
            <i className="ri-twitter-x-line"></i>
          </a>
        </div>
      </div>

      {/* Info Section */}
      <div className="footer__content">
        <h4>Info</h4>
        <ul>
          <li>
            <i className="ri-map-pin-add-line"></i>&nbsp;Ottawa, ON, Canada,
            Ontario
          </li>
          <li>
            <i className="ri-phone-line"></i>&nbsp;+1 613-712-5368
          </li>
          <li>
            <i className="ri-link"></i>&nbsp;Triluxury.com
          </li>
          <li>
            <i className="ri-mail-line"></i>&nbsp;Email
          </li>
        </ul>
      </div>

      {/* Pages Section */}
      <div className="footer__content">
        <h4>Pages</h4>
        <ul>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <a href="#">Projects</a>
          </li>
          <li>
            <Link href="/news">News</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Services Section */}
      <div className="footer__content">
        <h4>Service</h4>
        <ul>
          <li>
            <a href="#">Landscaping</a>
          </li>
          <li>
            <a href="#">Home Renovation</a>
          </li>
          <li>
            <a href="#">Staging</a>
          </li>
          <li>
            <a href="#">Cleaning</a>
          </li>
          <li>
            <a href="#">Property Maintenance</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
