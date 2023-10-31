import Banner from "./components/Banner";
import Products from "./components/Products";

export default function Home() {
  return (
    <div style={{ marginTop: "100px" }} className=" px-2 md:px-10 ">
      <Banner />
      <Products />
    </div>
  );
}
