import Plus from "../icons/Plus";
import colors from "../assets/colors.json";
import { useRef } from "react";
import { db } from "../appwrite/databases";
import { useContext } from "react";
import { SongSectionContext } from "../context/SongSectionContext";

const AddButton = () => {
  const { setSongSections } = useContext(SongSectionContext);
  const startingPos = useRef(10);

  const addSongSection = async () => {
    const payload = {
      position: JSON.stringify({
        x: startingPos.current,
        y: startingPos.current,
      }),
      colors: JSON.stringify(colors[0]),
    };
    startingPos.current += 10;
    const response = await db.songSections.create(payload);
    setSongSections((prevState) => [response, ...prevState]);
  };

  return (
    <div id="add-btn" onClick={addSongSection}>
      <Plus />
    </div>
  );
};
export default AddButton;
