export const setNewOffset = (card, mouseMoveDirection = { x: 0, y: 0 }) => {
  const offsetLeft = card.offsetLeft - mouseMoveDirection.x;
  const offsetTop = card.offsetTop - mouseMoveDirection.y;

  return {
    x: offsetLeft < 0 ? 0 : offsetLeft,
    y: offsetTop < 0 ? 0 : offsetTop,
  };
};

export const growAutomatically = (textAreaReference) => {
  const { current } = textAreaReference;
  current.style.height = "auto"; // This sets the style of the height to automatic
  current.style.height = current.scrollHeight + "px"; // This sets the new height in pixels
};

export const setZIndex = (selectedCard) => {
  selectedCard.style.zIndex = 999;

  Array.from(document.getElementsByClassName("card")).forEach((card) => {
    if (card !== selectedCard) {
      card.style.zIndex = selectedCard.style.zIndex - 1;
    }
  });
};

// Check and parse data from the database if needed 
export const bodyParser = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};
