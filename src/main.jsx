import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Heart,
  MapPin,
  Palmtree,
  PartyPopper,
  Plane,
  RefreshCw,
  Share2,
  Sparkles,
  Sun,
} from "lucide-react";
import "./styles.css";

const destinations = [
  "Sardegna",
  "Mykonos",
  "Ibiza",
  "Puglia",
  "Sicily",
  "Marbella",
  "St. Tropez",
  "Çeşme",
  "Amalfi Coast",
  "Mallorca",
  "Santorini",
  "Hvar",
  "Dubai",
  "Miami",
  "Bodrum",
  "Cap Ferret",
  "Milos",
  "Crete",
  "Corsica",
  "Algarve",
  "Azores",
  "Madeira",
  "Dolomites",
];
const companions = ["Your ex", "Your friend’s ex", "Your crush"];
const activities = [
  "Clubbing",
  "Boating",
  "Beach day",
  "Romantic restaurant",
  "Art gallery",
  "Sunset cocktails",
  "Sailing",
  "Beach club",
  "Old-town adventure",
  "Arguing",
  "Wine tasting",
  "Bike ride",
  "Watching World Cup",
  "Watching Netflix",
];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

const getSharedResult = () => {
  const params = new URLSearchParams(window.location.search);
  const shared = {
    place: params.get("destination"),
    person: params.get("companion"),
    activity: params.get("activity"),
  };
  return destinations.includes(shared.place) &&
    companions.includes(shared.person) &&
    activities.includes(shared.activity)
    ? shared
    : null;
};

const resultText = (result) =>
  `I’m going to ${result.place} with ${result.person.toLowerCase()} for ${result.activity.toLowerCase()}!`;

const resultUrl = (result) => {
  const url = new URL(window.location.origin);
  url.searchParams.set("destination", result.place);
  url.searchParams.set("companion", result.person);
  url.searchParams.set("activity", result.activity);
  return url.toString();
};

const saveResultImage = (result) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, "#0aa5ae");
  gradient.addColorStop(0.52, "#ef7b3b");
  gradient.addColorStop(1, "#f6bd43");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = "rgba(255,255,255,.2)";
  ctx.lineWidth = 2;
  for (let x = -500; x < 1300; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 900, 1350);
    ctx.stroke();
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff8c9";
  ctx.font = "900 32px Inter, sans-serif";
  ctx.fillText("SUMMER SCRATCHERS", 540, 125);
  ctx.fillStyle = "white";
  ctx.font = "900 72px Arial Black, sans-serif";
  ctx.fillText("MY SUMMER STORY", 540, 225);
  const items = [
    ["WHERE", result.place],
    ["WITH WHO", result.person],
    ["DOING WHAT", result.activity],
  ];
  items.forEach(([label, value], index) => {
    const y = 335 + index * 250;
    ctx.fillStyle = "rgba(8,30,38,.88)";
    ctx.beginPath();
    ctx.roundRect(100, y, 880, 190, 28);
    ctx.fill();
    ctx.fillStyle = "#63e1da";
    ctx.font = "900 24px Inter, sans-serif";
    ctx.fillText(label, 540, y + 58);
    ctx.fillStyle = "white";
    ctx.font = "900 53px Arial Black, sans-serif";
    const fitted = value.length > 20 ? 40 : value.length > 14 ? 46 : 53;
    ctx.font = `900 ${fitted}px Arial Black, sans-serif`;
    ctx.fillText(value.toUpperCase(), 540, y + 130);
  });
  ctx.fillStyle = "white";
  ctx.font = "800 25px Inter, sans-serif";
  ctx.fillText("scratchers.chingularity.com", 540, 1245);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `summer-scratchers-${result.place.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }, "image/png");
};

function Scratch({ children, label, onReveal, resetKey }) {
  const ref = useRef(null),
    drawing = useRef(false),
    last = useRef(null),
    revealed = useRef(false);
  useEffect(() => {
    const canvas = ref.current,
      rect = canvas.parentElement.getBoundingClientRect(),
      ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.scale(ratio, ratio);
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#9ba2a7");
    gradient.addColorStop(0.28, "#e7eaeb");
    gradient.addColorStop(0.55, "#8d969c");
    gradient.addColorStop(0.78, "#d8dcde");
    gradient.addColorStop(1, "#697279");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,.35)";
    for (let i = 0; i < 450; i++)
      ctx.fillRect(
        Math.random() * rect.width,
        Math.random() * rect.height,
        1.3,
        1.3,
      );
    ctx.fillStyle = "rgba(24,31,34,.38)";
    ctx.font = "900 11px Inter";
    ctx.textAlign = "center";
    for (let y = 22; y < rect.height; y += 34)
      for (let x = 18; x < rect.width + 55; x += 72) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.2);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    ctx.globalCompositeOperation = "destination-out";
    revealed.current = false;
  }, [label, resetKey]);
  const point = (e) => {
    const r = ref.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const move = (e) => {
    if (!drawing.current) return;
    const canvas = ref.current,
      ctx = canvas.getContext("2d"),
      p = point(e),
      ratio = canvas.width / canvas.getBoundingClientRect().width;
    ctx.save();
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 38;
    ctx.beginPath();
    ctx.moveTo(last.current?.x ?? p.x, last.current?.y ?? p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();
    last.current = p;
  };
  const finish = () => {
    drawing.current = false;
    last.current = null;
    if (revealed.current) return;
    const canvas = ref.current,
      ctx = canvas.getContext("2d"),
      data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0,
      total = 0;
    for (let i = 3; i < data.length; i += 80) {
      total++;
      if (data[i] < 40) clear++;
    }
    if (clear / total > 0.42) {
      revealed.current = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onReveal();
    }
  };
  return (
    <div className="scratch-zone">
      {children}
      <canvas
        ref={ref}
        aria-label={`Scratch to reveal ${label.toLowerCase()}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drawing.current = true;
          last.current = point(e);
          move(e);
        }}
        onPointerMove={move}
        onPointerUp={finish}
        onPointerCancel={finish}
      />
    </div>
  );
}

function Landing({ play }) {
  return (
    <main className="landing">
      <header className="hero summer">
        <span className="mini">YOUR SUMMER STORY STARTS HERE</span>
        <div className="sun-mark">
          <Sun />
        </div>
        <h1>
          SUMMER
          <br />
          <em>SCRATCHERS</em>
        </h1>
        <p>Where will you go on vacation this summer?</p>
      </header>
      <section className="intro">
        <div className="issue">
          <span>THE 2026 EDITION</span>
          <small>ONE TRIP · THREE REVEALS</small>
        </div>
        <div className="hero-ticket">
          <div className="ticket-ribbon">
            <span>THE GREAT SUMMER ESCAPE</span>
            <b>PLAY</b>
          </div>
          <div className="ticket-content">
            <div className="globe">
              <Palmtree />
            </div>
            <div>
              <small>SCRATCH YOUR STORY</small>
              <h2>
                DESTINATION
                <br />
                UNKNOWN
              </h2>
              <p>Reveal where, who and what.</p>
            </div>
            <ArrowRight />
          </div>
          <button onClick={play}>
            START SCRATCHING <Sparkles />
          </button>
        </div>
        <div className="destinations">
          <span>IN THE MIX</span>
          <div>
            {destinations.map((d) => (
              <i key={d}>{d}</i>
            ))}
          </div>
        </div>
      </section>
      <footer className="legal">
        A playful summer vacation generator. No purchases or real prizes.
      </footer>
    </main>
  );
}

const labels = [
  {
    key: "place",
    number: "01",
    title: "WHERE",
    hint: "Your summer destination",
    Icon: MapPin,
  },
  {
    key: "person",
    number: "02",
    title: "WITH WHO",
    hint: "Your travel companion",
    Icon: Heart,
  },
  {
    key: "activity",
    number: "03",
    title: "DOING WHAT",
    hint: "Your main character moment",
    Icon: PartyPopper,
  },
];
function Game({ back, initialResult }) {
  const [reset, setReset] = useState(0),
    [result, setResult] = useState(
      () =>
        initialResult || {
          place: pick(destinations),
          person: pick(companions),
          activity: pick(activities),
        },
    ),
    [revealed, setRevealed] = useState(
      initialResult ? { place: true, person: true, activity: true } : {},
    ),
    [feedback, setFeedback] = useState("");
  const newTrip = () => {
    setResult({
      place: pick(destinations),
      person: pick(companions),
      activity: pick(activities),
    });
    setRevealed({});
    setReset((v) => v + 1);
    window.history.replaceState({}, "", window.location.pathname);
  };
  const shareResult = async () => {
    const data = {
      title: "My Summer Scratchers result",
      text: resultText(result),
      url: resultUrl(result),
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`);
        setFeedback("Result link copied");
        setTimeout(() => setFeedback(""), 2500);
      }
    } catch (error) {
      if (error.name !== "AbortError") setFeedback("Could not share this result");
    }
  };
  const complete = Object.keys(revealed).length === 3;
  return (
    <main className="game">
      <nav>
        <button onClick={back}>
          <ArrowLeft /> Home
        </button>
        <div>
          <span>SUMMER</span>
          <b>’26</b>
        </div>
      </nav>
      <section className="game-stage">
        <article className="vacation-card">
          <header>
            <Plane />
            <div>
              <span>SUMMER SCRATCHERS</span>
              <h2>WHERE WILL YOU GO?</h2>
            </div>
            <Sun />
          </header>
          <p className="instructions">
            Scratch all three panels to reveal your summer story
          </p>
          <div className="reveals">
            {labels.map(({ key, number, title, hint, Icon }) => (
              <section
                className={"reveal " + (revealed[key] ? "is-revealed" : "")}
                key={key}
              >
                <div className="reveal-label">
                  <b>{number}</b>
                  <div>
                    <span>{title}</span>
                    <small>{hint}</small>
                  </div>
                  <Icon />
                </div>
                <Scratch
                  label={title}
                  resetKey={reset}
                  onReveal={() => setRevealed((v) => ({ ...v, [key]: true }))}
                >
                  <div className="answer">
                    <Icon />
                    <strong>{result[key]}</strong>
                    <span>
                      {key === "place"
                        ? "Pack your bags"
                        : key === "person"
                          ? "This could get interesting"
                          : "Your summer highlight"}
                    </span>
                  </div>
                </Scratch>
              </section>
            ))}
          </div>
          <footer>
            <span>EUROPEAN SUMMER EDITION</span>
            <span>GOOD VIBES ONLY</span>
          </footer>
        </article>
        {complete && (
          <div className="result-wrap">
            <div className="result">
            <Check />
            <div>
              <small>YOUR SUMMER STORY</small>
              <p>
                You’re going to <b>{result.place}</b> with{" "}
                <b>{result.person.toLowerCase()}</b> for{" "}
                <b>{result.activity.toLowerCase()}</b>.
              </p>
            </div>
            </div>
            <div className="result-actions">
              <button onClick={() => saveResultImage(result)}>
                <Download /> Save image
              </button>
              <button className="share-button" onClick={shareResult}>
                <Share2 /> Share result
              </button>
            </div>
            {feedback && <p className="share-feedback">{feedback}</p>}
          </div>
        )}
        <button className="reset" onClick={newTrip}>
          <RefreshCw /> Scratch a new trip
        </button>
      </section>
    </main>
  );
}
function App() {
  const [sharedResult] = useState(getSharedResult);
  const [playing, setPlaying] = useState(Boolean(sharedResult));
  return (
    <div className="app-shell">
      {playing ? (
        <Game back={() => setPlaying(false)} initialResult={sharedResult} />
      ) : (
        <Landing play={() => setPlaying(true)} />
      )}
      <Analytics />
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
