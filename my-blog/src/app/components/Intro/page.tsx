import Image from "next/image";
import Link from "next/link";
import "./style.css";

const Intro = () => {
  return (
    <div className="intro-container">
      <div className="content-box">
        <div className="content">
          <h2>
            Welcome to Smith & Sons - Canada's Premier Renovation and Remodeling
            Company.
          </h2>
          <ul>
            <li>
              As a true ‘one-stop-shop’ for custom homes and home renovations,
              we take control of the process from day one, so there is minimal
              running around for you, allowing you to get on with life as we get
              building.
            </li>
            <li>
              As general contractors who truly understand the costs of
              construction, we customize each build to your lifestyle and
              budget, and make sure you don’t pay for plans or designs that are
              simply not practical or affordable.
            </li>
            <li>
              With a vast array of custom homes and renovations crafted for
              people just like you, we have the reputation of crafting unique
              spaces that you will be proud to call your own, both stylish and
              practical for you and those you love.
            </li>
          </ul>
          <Link href="/about" className="btn">
            Learn More
          </Link>
        </div>
        <div className="image">
          <Image
            src="/images/default-avatar.jpg"
            alt="Company About"
            width={500}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Intro;
