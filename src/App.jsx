import { useState, useEffect } from 'react' 
import Header from './components/Header'
import Card from './components/Card'
import shuffle from'./utils/shuffle'
import useAppBadge from './hooks/useAppBadge';

function App() {
  const [cards, setCards] = useState(shuffle); // Cards array from assets
  const [pickOne, setPickOne] = useState(null); // First selection
  const [pickTwo, setPickTwo] = useState(null); // Second selection
  const [disabled, setDisabled] = useState(null); // Delay handler
  const [wins, setWins] = useState(0); // Win streak
  const [setBadge, clearBadge] = useAppBadge(); // Handles app badge

  // Handle card selection
  const handleClick = (card) => {
    if (!disabled) {
      pickOne ? setPickTwo(card) : setPickOne(card);
    }
  };

  const handleTurn = () => {
    setPickOne(null);
    setPickTwo(null);
    setDisabled(false);
  };

  const handleNewGame = () => {
    clearBadge();
    setWins(0);
    handleTurn();
    setCards(shuffle);
  }

  // Used for selection and match handling
  useEffect(() => {
    let pickTimer;

    // Two cards have been clicked
    if (pickOne && pickTwo) {
      // Check if the cards are the same
      if (pickOne.image === pickTwo.image) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.image === pickOne.image) {
              // Update card property to reflect match
              return { ...card, matched: true };
            } else {
              // No match
              return card;
            }
          });
        });
        handleTurn();
      } else {
        // Prevent new selections until after delay
        setDisabled(true);
        // Add delay between selections
        pickTimer = setTimeout(() => {
          handleTurn();
        }, 1000);
      }
    }

    return () => {
      clearTimeout(pickTimer);
    }
  }, [cards, pickOne, pickTwo]);

  // If player has found all matches, handle accordingly
  useEffect(() => {
    // Check for any remaining card matches
    const checkWin = cards.filter((card) => !card.matched);

    // All matches made, handle win/badge counters
    if (cards.length && checkWin.length < 1) {
      console.log('You win!');
      setWins(wins + 1);
      handleTurn();
      setBadge();
      setCards(shuffle);
    }

  }, [cards, wins])

  return (
    <>
      <Header handleNewGame={handleNewGame} wins={wins} />
      <div className="grid">
        {cards.map((card) => {
          const {image, id, matched} = card;

          return (
            <Card
              key={id}
              image={image}
              selected={card === pickOne || card === pickTwo || matched}
              onClick={() => handleClick(card)}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
