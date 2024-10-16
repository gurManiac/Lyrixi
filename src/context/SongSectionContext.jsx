import { createContext, useEffect, useState } from "react";
import { db } from "../appwrite/databases";

export const SongSectionContext = createContext();

const SongSectionsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [songSections, setSongSections] = useState([]);
  const [selectedSongSection, setSelectedSongSection] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const response = await db.songSections.list();
    setSongSections(response.documents);
    setLoading(false);
  };

  const contextData = { songSections, setSongSections, selectedSongSection, setSelectedSongSection  };

  return (
    <SongSectionContext.Provider value={contextData}>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <h2>Loading...</h2>
        </div>
      ) : (
        children
      )}
    </SongSectionContext.Provider>
  );
};
export default SongSectionsProvider;
