import React from "react";
import Trash from "../icons/Trash";
import { db } from "../appwrite/databases";
import { useContext } from "react";
import { SongSectionContext } from "../context/SongSectionContext";

const DeleteButton = ({ songSectionId }) => {
  const { setSongSections } = useContext(SongSectionContext);
  const handleDelete = async (e) => {
    db.songSections.delete(songSectionId);
    setSongSections((prevState) =>
      prevState.filter((songSection) => songSection.$id !== songSectionId)
    );
  };

  return (
    <div onClick={handleDelete}>
      <Trash />
    </div>
  );
};

export default DeleteButton;
