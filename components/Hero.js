import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import "font-awesome/css/font-awesome.min.css";
const style = {
  wrapper: `relative`,
  container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://s3.amazonaws.com/static.rogerebert.com/uploads/collection/primary_image/the-history-of-star-wars-movies/hero_the-history-of-star-wars-movies.jpg')] before:bg-cover before:bg-center before:opacity-30 before:blur`,
  contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
  copyContainer: `w-1/2`,
  title: `relative text-white text-[46px] font-semibold`,
  description: `text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
  ctaContainer: `flex`,
  accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  cardContainer: `rounded-[3rem]`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
};
const Hero = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
            <div className={style.title}>
              {" "}
              Discover, collect and sell extraordinary NFTs{" "}
            </div>
            <div className={style.description}>
              OpenThrone is the world's first digital asset marketplace that
              enables to create NFTs on any blockchain and trade through any
              cryptocurrency
            </div>
            <div className={style.ctaContainer}>
              <button
                className={style.accentedButton}
                disabled={isLoading}
                onClick={() => {
                  router.push("mint-item");
                }}
              >
                <span>Create</span>
              </button>
            </div>
          </div>
          <div className={style.cardContainer}>
            <img
              className="rounded-t-lg"
              src="https://www.cinemascomics.com/wp-content/uploads/2021/10/darth-vader-star-wars-Obi-Wan-Kenobi.jpg"
              width={600}
              height={1000}
              alt="V-2030"
            />
            <div className={style.infoContainer}>
              <img
                className="h-[2.25rem] rounded-full"
                src="https://cdn2.vectorstock.com/i/1000x1000/08/56/user-profile-login-or-access-authentication-icon-vector-28920856.jpg"
                alt="User : "
              />
              <div className={style.author}>
                <div className={style.name}> Kunal N. Verma </div>
                <a className="text-[#1868b7]">tlrx</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
