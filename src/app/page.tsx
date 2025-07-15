import MainHero from '../app/Home/MainHero/page';
import AppBar from '../components/AppBar/AppBar';
import PaperBagsPage from '../app/Home/ProductCategories/PaperBags/page';

export default function Page() {
  return (
    <>
      {/* <AppBar /> */}
      <MainHero />
      <PaperBagsPage />
    </>
  );
}