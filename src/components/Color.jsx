import React from "react";
import { useContext } from "react";
import { SongSectionContext } from "../context/SongSectionContext";
import { db } from "../appwrite/databases";

const Color = ({ color }) => {
  const { selectedSongSection, songSections, setSongSections } =
    useContext(SongSectionContext);

  const changeColor = () => {
    try {
      const currentSongSectionIndex = songSections.findIndex(
        (songSection) => songSection.$id === selectedSongSection.$id
      );

      const updatedSongSection = {
        ...songSections[currentSongSectionIndex],
        colors: JSON.stringify(color),
      };

      const newSongSections = [...songSections];
      newSongSections[currentSongSectionIndex] = updatedSongSection;
      setSongSections(newSongSections);

      db.songSections.update(selectedSongSection.$id, {
        colors: JSON.stringify(color),
      });
    } catch (error) {
      alert("You need to select a song section before changing colors");
    }
  };

  return (
    <div
      className="color"
      onClick={changeColor}
      style={{ backgroundColor: color.colorHeader }}
    ></div>
  );
};

export default Color;
