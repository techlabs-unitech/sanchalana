import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFab from "./WhatsAppFab";

// Shared page chrome. `locked` is passed straight through to Header to
// hide the theme toggle on newsletter reader pages.
export default function PageShell({ children, locked = false, bodyClassName }) {
  return (
    <div className={bodyClassName}>
      <Header locked={locked} />
      {children}
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
