import { useState, useEffect, useRef, useContext } from "react";
import { db } from "../appwrite/databases";
import DeleteButton from "./DeleteButton";
import {
  growAutomatically,
  setNewOffset,
  setZIndex,
  bodyParser,
} from "../utils";
import { SongSectionContext } from "../context/SongSectionContext";

const SongCard = ({ songSection }) => {
  const [saving, setSaving] = useState(false);
  const keyUpTimer = useRef(null);

  const body = bodyParser(songSection.body);
  const [position, setPosition] = useState(JSON.parse(songSection.position));
  const colors = JSON.parse(songSection.colors);

  let mouseStartPosition = { x: 0, y: 0 };

  const cardReference = useRef(null);

  const textAreaReference = useRef(null);

  useEffect(() => {
    growAutomatically(textAreaReference);
    setZIndex(cardReference.current);
  }, []);

  const { setSelectedSongSection } = useContext(SongSectionContext);
  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      setZIndex(cardReference.current);

      mouseStartPosition.x = e.clientX;
      mouseStartPosition.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      setZIndex(cardReference.current);
      setSelectedSongSection(songSection);
    }
  };

  const mouseMove = (e) => {
    //This calculates move direction.
    let mouseMoveDirection = {
      x: mouseStartPosition.x - e.clientX,
      y: mouseStartPosition.y - e.clientY,
    };

    //This updates the start position for next move.
    mouseStartPosition.x = e.clientX;
    mouseStartPosition.y = e.clientY;

    const newPosition = setNewOffset(cardReference.current, mouseMoveDirection);

    //3 - This updates the top and left position of the card while preventing from going too far.
    setPosition(newPosition);
  };

  //This removes the event listener to prevent the songCards from always following the cursor.
  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardReference.current);
    saveData("position", newPosition);
  };

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };
    try {
      await db.songSections.update(songSection.$id, payload);
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  const handleKeyUp = () => {
    // Initiate "saving" state
    setSaving(true);

    //If we have a timer id, clear it so we can add another 2 seconds
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    //Set timer to trigger save in 2 seconds
    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaReference.current.value);
    }, 2000);
  };

  return (
    <div
      ref={cardReference}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={mouseDown}
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton songSectionId={songSection.$id} />

        {saving && (
          <div className="card-saving">
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <textarea
          onKeyUp={handleKeyUp}
          ref={textAreaReference}
          style={{ color: colors.colorText }}
          defaultValue={body}
          onInput={() => {
            growAutomatically(textAreaReference);
          }}
          onFocus={() => {
            setZIndex(cardReference.current);
            setSelectedSongSection(songSection);
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default SongCard;
