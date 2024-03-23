import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

function App() {
  const [catHistory, setCatHistory] = useState([]);
  const [randomCat, setRandomCat] = useState(null);
  const [banAttributes, setBanAttributes] = useState([]);

  const addToBanList = (attr) => {
    if (!banAttributes.includes(attr)) {
      setBanAttributes([...banAttributes, attr]);
    }
  };

  const removeFromBanList = (attr) => {
    if (banAttributes.includes(attr)) {
      setBanAttributes(banAttributes.filter((b) => b != attr));
    }
  };

  const getRandomDog = async () => {
    try {
      const cat = await axios
        .get(`${apiUrl}?limit=1&has_breeds=1&api_key=${apiKey}`)
        .then((res) => res.data);
      const {
        id,
        origin,
        name,
        weight: { imperial },
        life_span,
      } = cat[0].breeds[0];

      if (
        banAttributes.includes(imperial) ||
        banAttributes.includes(origin) ||
        banAttributes.includes(life_span)
      ) {
        getRandomDog();
        return;
      }

      const img_url = cat[0].url;
      const prevCat = randomCat;
      prevCat && setCatHistory(catHistory.concat([prevCat]));
      setRandomCat({ id, origin, name, imperial, life_span, img_url });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="main">
        <div className="left">
          <h1 className="title">Who have you seen so far ?</h1>
          <div className="items">
            {catHistory.length > 0 ? (
              catHistory.map((c) => {
                console.log(c);
                return (
                  <div className="item" key={c.id}>
                    <img src={c.img_url} alt={c.name} className="item-src" />
                    <h2 className="item-lbl">
                      A {c.name} from {c.origin}
                    </h2>
                  </div>
                );
              })
            ) : (
              <span>No Cat Yet</span>
            )}
          </div>
        </div>
        <div className="main">
          <div className="box">
            <h2>Cattify</h2>
            <div className="elts">Discover cats from your wildest dreams !</div>
            {randomCat ? (
              <div className="current-cat">
                <div className="current-cat-name">{randomCat.id}</div>
                <div className="buttons">
                  <button
                    className="btn"
                    id="name"
                    onClick={() => addToBanList(randomCat.name)}
                  >
                    {randomCat.name}
                  </button>
                  <button
                    className="btn"
                    id="pounds"
                    onClick={() => addToBanList(randomCat.imperial)}
                  >
                    {randomCat.imperial} lbs
                  </button>
                  <button
                    className="btn"
                    id="country"
                    onClick={() => addToBanList(randomCat.origin)}
                  >
                    {randomCat.origin}
                  </button>
                  <button
                    className="btn"
                    id="age"
                    onClick={() => addToBanList(randomCat.life_span)}
                  >
                    {randomCat.life_span} years
                  </button>
                </div>
                <img
                  className="current-cat-img"
                  src={randomCat.img_url}
                  alt=""
                />
              </div>
            ) : null}
            <div className="btn-wrapper">
              <div className="btn-img" onClick={getRandomDog}>
                <img src="../src/assets/cross.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <h1 className="title">Ban List</h1>
          <div>Select an attribute in your listing to ban it</div>
          <div className="attributes">
            {banAttributes.length > 0 &&
              banAttributes.map((attr, i) => (
                <button
                  key={i}
                  className="btn btn-primary"
                  onClick={() => removeFromBanList(attr)}
                >
                  {attr}
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
