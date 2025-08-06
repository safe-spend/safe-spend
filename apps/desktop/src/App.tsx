import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@safe-spend/core-ui";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <h1>Welcome to SafeSpend - Creative Button Showcase</h1>

      <div className="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      {/* Button Showcase */}
      <div className="button-showcase" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Creative Button Collection</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <Button variant="primary" size="medium">Primary</Button>
          <Button variant="gradient" size="medium">Gradient</Button>
          <Button variant="glass" size="medium">Glass</Button>
          <Button variant="neon" size="medium">Neon</Button>
          <Button variant="magic" size="medium">Magic ✨</Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <Button variant="secondary" size="small">Secondary</Button>
          <Button variant="success" size="large">Success</Button>
          <Button variant="danger" size="medium">Danger</Button>
        </div>
      </div>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <Button type="submit" variant="magic" size="medium">
          Greet ✨
        </Button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
