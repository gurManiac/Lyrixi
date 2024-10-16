import SongCard from "../components/SongCard.jsx";
import { useContext } from "react";
import { SongSectionContext } from "../context/SongSectionContext.jsx";
import Controls from "../components/Controls.jsx";
import RhymeFinder from "../components/RhymeFinder.jsx";

const SongsPage = () => {
  const { songSections } = useContext(SongSectionContext);

  return (
    <div>
      {songSections.map((songSection) => (
        <SongCard key={songSection.$id} songSection={songSection} />
      ))}
              <RhymeFinder />
              <Controls />
    </div>
  );
};
export default SongsPage;
