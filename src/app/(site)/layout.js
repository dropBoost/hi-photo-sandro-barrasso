import { getSettings } from "@/lib/setting";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default async function Layout({ children }) {

  const s = await getSettings();

  return (
  <>
  <div className="h-screen w-screen flex flex-col justify-between overflow-auto">
    <Header/>
    <div className="flex-1">
      {children}
    </div>
    <Footer/>
  </div>
  </>
  );
}
