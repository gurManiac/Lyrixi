import React, { useEffect, useState } from "react";

const RhymeFinder = () => {
  const [words, setWords] = useState([]); // State to store the dictionary loaded from the text file
  const [rhyme, setRhyme] = useState([]); // State to store the rhymes found for the input word
  const [showAll, setShowAll] = useState(false); // State to control if the "Show more" button has been clicked
  const [error, setError] = useState(null); // State to store any error messages

  // Load the dictionary when the component mounts
  useEffect(() => {
    fetch("/cz-utf8.txt")
      .then((response) => {
        // Check if an external dictionary has loaded
        if (!response.ok) {
          throw new Error("Error loading the dictionary");
        }
        return response.text();
      })
      .then((data) => {
        const wordArray = data.split("\n").map((word) => word.trim()); // Split into an array of words
        if (wordArray.length === 0) {
          throw new Error("Dictionary is empty.");
        }
        setWords(wordArray); // Save the words to state
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        // Handle the error by setting an error message in the state
        setError(error.message);
        console.error("Error loading the dictionary:", error);
      });
  }, []);

  // Function to replace vowels and treat "i" and "y" the same way
  const normalizeVowels = (word) => {
    return word
      .replace(/[áä]/g, "a")
      .replace(/[éě]/g, "e")
      .replace(/[íý]/g, "i")
      .replace(/[ó]/g, "o")
      .replace(/[úů]/g, "u")
      .replace(/[ý]/g, "i"); // Treat "i" and "y" the same
  };

  // Helper function to count how many letters match from the end of two words
  const getMatchingSuffixLength = (word1, word2) => {
    let i = word1.length - 1; // Start from the last letter of word1
    let j = word2.length - 1; // Start from the last letter of word2
    let matchCount = 0; // Counter for how many matching letters

    while (i >= 0 && j >= 0 && word1[i] === word2[j]) {
      matchCount++; // Increase count if letters match
      i--;
      j--;
    }

    return matchCount; // Return how many letters match
  };

  // Function to find and sort rhymes based on the input word
  function findRhymes(inputWord, dictionary) {
    const normalizedInput = normalizeVowels(inputWord); // Normalize input for vowel flexibility

    // Check for "ch" ending and adjust search to 3-letter endings if true
    const endsWithCh = inputWord.endsWith("ch");

    // Filter dictionary for potential rhymes
    const rhymingWords = dictionary.filter((dictWord) => {
      const normalizedDictWord = normalizeVowels(dictWord); // Normalize dictionary words too

      // If input ends with "ch", we look for at least a 3-letter match
      if (endsWithCh) {
        return (
          getMatchingSuffixLength(inputWord.slice(-3), dictWord.slice(-3)) === 3
        );
      }

      // Otherwise, search for words with matching last 2 or 3 letters
      // AND check it's not the same as the input word
      return (
        dictWord !== inputWord &&
        (normalizedDictWord.endsWith(normalizedInput.slice(-2)) ||
          normalizedDictWord.endsWith(normalizedInput.slice(-3)))
      );
    });

    // Sort rhyming words based on the length of matching suffix and vowel priority
    const sortedRhymingWords = rhymingWords.sort((a, b) => {
      const aNormalized = normalizeVowels(a);
      const bNormalized = normalizeVowels(b);

      // Sort by the number of matching letters first
      const matchDifference =
        getMatchingSuffixLength(bNormalized, normalizedInput) -
        getMatchingSuffixLength(aNormalized, normalizedInput);

      // If the matches are equal, prioritize the exact vowel match
      if (matchDifference === 0) {
        const aExactVowelMatch =
          a.endsWith(inputWord.slice(-2)) || a.endsWith(inputWord.slice(-3));
        const bExactVowelMatch =
          b.endsWith(inputWord.slice(-2)) || b.endsWith(inputWord.slice(-3));
        return bExactVowelMatch - aExactVowelMatch; // Prefer exact vowel matches
      }

      return matchDifference; // Otherwise, return the number of matching letters
    });

    return sortedRhymingWords;
  }

  // Function to handle the input and set rhymes
  const handleRhymeSearch = (inputWord) => {
    // Parse input as a string to ensure no code is executed
    const sanitizedInput = inputWord.toString().trim().toLowerCase();

    // Check if input contains any non-alphabetical characters
    const validWord = /^[a-zA-Záäéěíýóúůčďěňřšťž]+$/.test(sanitizedInput);

    if (!validWord) {
      setRhyme([
        "Please enter a valid word without numbers or special characters.",
      ]);
      return;
    }

    // Check if input has at least two 2 letters
    if (sanitizedInput.length < 2) {
      setRhyme(["Please enter a word with at least 2 letters."]);
      return;
    }

    const rhymes = findRhymes(sanitizedInput, words);
    setRhyme(rhymes.length > 0 ? rhymes : ["No rhymes found."]);
    setShowAll(false);
  };

  return (
    <div className="rhyme-finder-container">
      <h2>Czech Rhyme Finder</h2>
      <input
        type="text"
        placeholder="Enter a word and press [Enter]"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleRhymeSearch(e.target.value);
          }
        }}
      />
      <p>Rhyming words:</p>
      <ul>
        {rhyme.slice(0, showAll ? rhyme.length : 20).map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
      {/* Show the "Show more rhymes" button if there are more than 20 rhymes and user hasn't clicked it */}
      {rhyme.length > 20 && !showAll && (
        <button onClick={() => setShowAll(true)}>Show more rhymes</button>
      )}
    </div>
  );
};

export default RhymeFinder;
