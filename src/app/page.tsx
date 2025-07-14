
// import HeroSection from '../../src/app/Home/HeroSection/page';
import AppBar from "@/components/AppBar/AppBar";
import MainHero from '../../src/app/Home/MainHero/page';
import WhyItMatters from './Home/WhyItMatters/page';
import ProductCategories from './Home/ProductCategories/page';


export default function Page() {
  return (
    <main>
      {/* <AppBar /> */}
      <MainHero />
      <WhyItMatters />
      <ProductCategories />
      {/* Uncomment the line below if you want to include the HeroSection */}
      {/* <HeroSection /> */}
      {/* <HeroSection /> */}
   
    </main>
  );
}