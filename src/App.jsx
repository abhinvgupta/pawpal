import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ChatPage from "./ChatPage";

const dogs = [
  {
    id: 1,
    name: "Milo",
    breed: "Golden Retriever",
    age: "2 years",
    image: "https://placedog.net/500/280?id=1",
    traits: ["charming", "playful", "friendly"],
  },
  {
    id: 2,
    name: "Luna",
    breed: "French Bulldog",
    age: "1 year",
    image: "https://placedog.net/500/280?id=2",
    traits: ["cute", "curious", "loyal"],
  },
  {
    id: 3,
    name: "Rocky",
    breed: "German Shepherd",
    age: "3 years",
    image: "https://placedog.net/500/280?id=3",
    traits: ["protective", "smart", "alert"],
  },
  {
    id: 4,
    name: "Bella",
    breed: "Beagle",
    age: "4 years",
    image: "https://placedog.net/500/280?id=4",
    traits: ["charming", "energetic", "social"],
  },
  {
    id: 5,
    name: "Daisy",
    breed: "Poodle",
    age: "2 years",
    image: "https://placedog.net/500/280?id=5",
    traits: ["elegant", "smart", "calm"],
  },
  {
    id: 6,
    name: "Max",
    breed: "Boxer",
    age: "5 years",
    image: "https://placedog.net/500/280?id=6",
    traits: ["goofy", "strong", "friendly"],
  },
  {
    id: 7,
    name: "Nala",
    breed: "Shiba Inu",
    age: "2 years",
    image: "https://placedog.net/500/280?id=7",
    traits: ["independent", "cute", "confident"],
  },
  {
    id: 8,
    name: "Bruno",
    breed: "Rottweiler",
    age: "4 years",
    image: "https://placedog.net/500/280?id=8",
    traits: ["angry", "protective", "brave"],
  },
];

const getPathname = () => window.location.pathname;

const getChatDogIdFromPath = (path) => {
  const match = path.match(/^\/chat\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
};

function App() {
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    const onPopState = () => setPathname(getPathname());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath) => {
    if (nextPath === window.location.pathname) return;
    window.history.pushState({}, "", nextPath);
    setPathname(nextPath);
  };

  const selectedDog = useMemo(() => {
    const chatDogId = getChatDogIdFromPath(pathname);
    return dogs.find((dog) => dog.id === chatDogId) ?? null;
  }, [pathname]);

  if (pathname.startsWith("/chat")) {
    return <ChatPage dog={selectedDog} onBack={() => navigate("/")} />;
  }

  const availableBreeds = new Set(dogs.map((dog) => dog.breed)).size;

  return (
    <>
      <header className="header">
        <div className="header-top">
          <img src="/pawlogo.png" alt="PawPal Logo" />
        </div>
        <p>Meet your new furry best friends. Learn, play, and chat!</p>
      </header>
      <section className="section">
        <h3>Meet the Pack</h3>
        <p>{availableBreeds} breeds available</p>
      </section>
      <section className="dog-grid">
        {dogs.map((dog) => (
          <article className="dog-card" key={dog.id}>
            <img src={dog.image} alt={dog.name} />
            <div className="dog-card-content">
              <h4>{dog.name}</h4>
              <button
                className="chat-btn"
                aria-label={`Chat with ${dog.name}`}
                onClick={() => navigate(`/chat/${dog.id}`)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9l-4.4 3.3A.5.5 0 0 1 3.8 19V5.5H4z" />
                </svg>
              </button>
            </div>
            <p>{dog.breed}</p>
            <p>{dog.age}</p>
            <div className="trait-list">
              {dog.traits.map((trait) => (
                <span className="trait-chip" key={trait}>
                  {trait}
                </span>
              ))}
            </div>
            <button>Learn More</button>
          </article>
        ))}
      </section>
    </>
  );
}

export default App;
