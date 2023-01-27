export default function Banner() {
  return (
    <div className="parallax-world-of-ugg">
      <section>
        <div className="title text-accentColor">
          <h3>unRavel the</h3>
          <h1>WORLD</h1>
        </div>
      </section>

      <section
        id="carouselDarkVariant"
        className="carousel slide carousel-fade carousel-dark relative"
      >
        {/* <!-- Indicators --> */}
        <div className="carousel-indicators absolute right-0 bottom-0 left-0 flex justify-center p-0 mb-4">
          <button
            data-bs-target="#carouselDarkVariant"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            data-bs-target="#carouselDarkVariant"
            data-bs-slide-to="1"
            aria-label="Slide 1"
          ></button>
          <button
            data-bs-target="#carouselDarkVariant"
            data-bs-slide-to="2"
            aria-label="Slide 1"
          ></button>
        </div>

        {/* <!-- Inner --> */}
        <div className="carousel-inner relative w-full overflow-hidden">
          {/* <!-- Single item--> */}
          <div className="carousel-item active relative float-left parallax-one bg-[url('https://images.unsplash.com/photo-1415018255745-0ec3f7aee47b?dpr=1&auto=format&fit=crop&w=1500&h=938&q=80&cs=tinysrgb&crop=')]">
            <h2>SOUTHERN CALIFORNIA</h2>
            <div className="carousel-caption hidden md:block absolute text-center">
              <h5 className="text-xl">First slide label</h5>
              <p>
                Some representative placeholder content for the first slide.
              </p>
            </div>
          </div>
          {/* <!-- Single item END--> */}
        </div>
        {/* <!-- Inner END -->*/}

        {/* <!-- Controls --> */}
        <button
          className="carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0"
          type="button"
          data-bs-target="#carouselDarkVariant"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon inline-block bg-no-repeat"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0"
          type="button"
          data-bs-target="#carouselDarkVariant"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon inline-block bg-no-repeat"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </section>

      <section>
        <div className="block"></div>
      </section>

      {/* <h2>NEW YORK</h2> */}
      <section className="parallax-two bg-[url('https://images.unsplash.com/photo-1432163230927-a32e4fd5a326?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=')] flex justify-around absolute overflow-auto">
        <div className="relative z-10 min-w-max bg-secondaryColor p-4 m-4">
          <img
            src="https://images.unsplash.com/photo-1432163230927-a32e4fd5a326?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop="
            alt="img"
            className="w-56 h-40"
          />
          <p className="text-accentColor">place name</p>
          <p className="text-accentColor">other details</p>
        </div>
        
        
      </section>

      <section>
        <div className="block"></div>
      </section>

      <section>
        <div className="parallax-three bg-[url('https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?dpr=1&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop=')]">
          <h2>ENCHANTED FOREST</h2>
        </div>
      </section>

      <section>
        <div className="block"></div>
      </section>
    </div>
  )
}
