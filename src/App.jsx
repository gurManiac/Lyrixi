import SongsPage from "./pages/SongsPage";
import SongSectionsProvider from "./context/SongSectionContext";
import MainHeader from "./components/MainHeader";

function App() {
  return (
    <div id="app">
      <MainHeader />
      <SongSectionsProvider>
        <SongsPage />
      </SongSectionsProvider>
    </div>
  );
}
export default App;
