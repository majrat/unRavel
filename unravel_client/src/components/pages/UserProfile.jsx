import Navbar from "../Navbar/Navbar";

export default function UserProfile() {
  return (
    <>
      <Navbar />
      <div className="md:m-24 mt-24 mx-2 grid grid-cols-12">
        <div className="p-4 md:col-span-4 col-span-12 bg-accentColor">
          <div className="flex justify-center">
            <img
              className="rounded-full w-32 m-6"
              src="/profile-setup.gif"
              alt=""
            />
          </div>
          <div className="text-center">
            <p className="text-lightColor font-semibold text-lg">
              Mohammed Jauhar
            </p>
            <p className="text-lightColor">Kerala, India</p>
          </div>
          <div class="btn_wrap">
            <span>Share</span>
            <div class="container">
              <img src="/twitter-svgrepo-com.svg" alt="twitter" />
              <img src="/facebook-svgrepo-com.svg" alt="facebook" />
              <img src="/instagram-svgrepo-com.svg" alt="instagram" />
            </div>
          </div>

          <a
            href="https://dribbble.com/YancyMin"
            class="dr-url"
            target="_blank"
          >
            <img
              class="dr"
              src="https://cdn.dribbble.com/assets/logo-footer-hd-a05db77841b4b27c0bf23ec1378e97c988190dfe7d26e32e1faea7269f9e001b.png"
              alt=""
            />
          </a>
        </div>
        <div className="md:col-span-8 col-span-12 bg-primaryColor">asd</div>
      </div>
    </>
  );
}
