export default function Banner() {
  return (
    <div className="shadow-black/20 shadow-inner py-3 mb-14 overflow-clip relative h-screen my-banner-image">
      <div className="w-96">
        <div className="mt-16 mx-4 bg-white bg-opacity-50 backdrop-blur-sm rounded p-5">
          <h4 className="text-3xl">
            32 <span className="text-lg">Groups are planning to go here</span>
          </h4>
          <h4 className="text-lg text-blue-800">Join them now</h4>
        </div>

        <div className="mt-6 mx-4 bg-white bg-opacity-50 backdrop-blur-sm rounded p-5">
          <h4 className="text-3xl">
            23 <span className="text-lg">Groups went here</span>
          </h4>
          <h4 className="text-lg text-blue-800">Checkout there experience</h4>
        </div>
      </div>
      <div className="absolute bottom-0 mt-6 mx-4 mb-9 text-center text-black p-5 rounded bg-opacity-50 w-96 backdrop-blur-sm bg-white">
        <h1 className="text-3xl">Maldives</h1>
        <p>Nothing screams "paradise" quite like the Maldives, a 26-atoll chain of islands with powdery beaches, turquoise waters, and dreamy overwater bungalow resorts.</p>
      </div>
    </div>
  );
}
