import Navbar from "../Navbar/Navbar";

export default function Error404({ login }) {
  return (
    <>
      <Navbar />
      <div className="unravel_404">
        <img src="/error-404.gif" alt="Error 404" />
      </div>
    </>
  );
}
