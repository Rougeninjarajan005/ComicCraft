import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const [story, setStory] = useState({
    character: "",
    setting: "",
    plot: "",
    tone: "",
    style: "",
  });

  const [generatedLayout, setGeneratedLayout] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    "STORY INPUT",
    "CHARACTER",
    "STYLE",
    "PANELS",
    "PREVIEW",
    "EXPORT",
  ];

  const updateStory = (field, value) => {
    setStory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateComic = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
          `${API_URL}/generate-comic/json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: story.plot,
            character: story.character,
            setting: story.setting,
            tone: story.tone,
            style: story.style,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setGeneratedLayout(data.layout || []);

      if (data.pdf) {
          setPdfUrl(`${API_URL}${data.pdf}`);
      }

      setCurrentStep(5);
    } catch (err) {
      console.error(err);

      setError(
        "Could not generate the comic. Please check that the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <div className="logo-mark">✦</div>

          <div>
            <div className="logo-title">ComicCraft</div>
            <div className="logo-subtitle">AI Comic Studio</div>
          </div>
        </div>

        <div className="header-badge">
          AI POWERED
        </div>
      </header>

      {/* STEP NAVIGATION */}
      <nav className="step-navigation">
        {steps.map((step, index) => {
          const number = index + 1;

          return (
            <button
              key={step}
              className={`step ${
                currentStep === number ? "active" : ""
              } ${currentStep > number ? "completed" : ""}`}
              onClick={() => setCurrentStep(number)}
            >
              <span className="step-number">
                {currentStep > number ? "✓" : number}
              </span>

              <span className="step-label">
                {step}
              </span>
            </button>
          );
        })}
      </nav>

      {/* WORKSPACE */}
      <div className="workspace">

        {/* MAIN PANEL */}
        <main className="main-panel">

          {/* STORY INPUT */}
          {currentStep === 1 && (
            <section className="content-section">

              <div className="section-heading">
                <span className="section-icon">✍</span>

                <div>
                  <h1>Create Your Story</h1>
                  <p>
                    Start with an idea and let AI transform it into a comic.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label>Story Plot</label>

                <textarea
                  value={story.plot}
                  onChange={(e) =>
                    updateStory("plot", e.target.value)
                  }
                  placeholder="Describe what happens in your story..."
                  rows="7"
                />

                <span className="field-hint">
                  Describe the main events of your comic.
                </span>
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Setting</label>

                  <input
                    type="text"
                    value={story.setting}
                    onChange={(e) =>
                      updateStory("setting", e.target.value)
                    }
                    placeholder="e.g. Futuristic city"
                  />
                </div>

                <div className="form-group">
                  <label>Tone</label>

                  <input
                    type="text"
                    value={story.tone}
                    onChange={(e) =>
                      updateStory("tone", e.target.value)
                    }
                    placeholder="e.g. Funny adventure"
                  />
                </div>

              </div>

              <div className="tip-card">
                <span>💡</span>

                <div>
                  <strong>Creative tip</strong>
                  <p>
                    Give your story a clear beginning, conflict and ending.
                  </p>
                </div>
              </div>

            </section>
          )}

          {/* CHARACTER */}
          {currentStep === 2 && (
            <section className="content-section">

              <div className="section-heading">
                <span className="section-icon">👤</span>

                <div>
                  <h1>Design Your Character</h1>
                  <p>
                    Tell us who will appear in your comic.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label>Main Character</label>

                <input
                  type="text"
                  value={story.character}
                  onChange={(e) =>
                    updateStory("character", e.target.value)
                  }
                  placeholder="e.g. A brave teenage inventor"
                />
              </div>

              <div className="character-card">

                <div className="character-avatar">
                  {story.character
                    ? story.character.charAt(0).toUpperCase()
                    : "?"}
                </div>

                <div className="character-info">
                  <span className="card-label">
                    MAIN CHARACTER
                  </span>

                  <h2>
                    {story.character || "Your Character"}
                  </h2>

                  <p>
                    {story.character
                      ? "Ready to become part of your comic."
                      : "Enter your character above to get started."}
                  </p>
                </div>

              </div>

            </section>
          )}

          {/* STYLE */}
          {currentStep === 3 && (
            <section className="content-section">

              <div className="section-heading">
                <span className="section-icon">🎨</span>

                <div>
                  <h1>Choose Your Style</h1>
                  <p>
                    Select the visual direction for your comic.
                  </p>
                </div>
              </div>

              <div className="style-grid">

                {[
                  {
                    name: "Anime",
                    icon: "✦",
                  },
                  {
                    name: "Cartoon",
                    icon: "☻",
                  },
                  {
                    name: "Manga",
                    icon: "◈",
                  },
                  {
                    name: "Comic Book",
                    icon: "⚡",
                  },
                  {
                    name: "Watercolor",
                    icon: "◉",
                  },
                  {
                    name: "Realistic",
                    icon: "◇",
                  },
                ].map((item) => (

                  <button
                    key={item.name}
                    className={`style-card ${
                      story.style === item.name
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateStory("style", item.name)
                    }
                  >

                    <span className="style-icon">
                      {item.icon}
                    </span>

                    <span className="style-name">
                      {item.name}
                    </span>

                    {story.style === item.name && (
                      <span className="style-check">
                        ✓
                      </span>
                    )}

                  </button>

                ))}

              </div>

              <div className="form-group custom-style">

                <label>
                  Custom Style
                </label>

                <input
                  type="text"
                  value={story.style}
                  onChange={(e) =>
                    updateStory("style", e.target.value)
                  }
                  placeholder="Or describe your own visual style..."
                />

              </div>

            </section>
          )}

          {/* PANELS */}
          {currentStep === 4 && (
            <section className="content-section">

              <div className="section-heading">
                <span className="section-icon">▦</span>

                <div>
                  <h1>Comic Panels</h1>
                  <p>
                    Your generated panels will appear here.
                  </p>
                </div>
              </div>

              {generatedLayout.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    ✦
                  </div>

                  <h2>
                    Ready to create your comic?
                  </h2>

                  <p>
                    Click <strong>Generate Comic</strong> to send
                    your story to the AI.
                  </p>

                </div>

              ) : (

                <div className="panel-grid">

                  {generatedLayout.map((panel, index) => (

                    <div
                      className="panel-card"
                      key={index}
                    >

                      <div className="panel-number">
                        PANEL {index + 1}
                      </div>

                      <img
                        src={`${API_URL}${panel.image}`}
                        alt={panel.title}
                      />

                      <div className="panel-content">

                        <h3>
                          {panel.title}
                        </h3>

                        <p>
                          {panel.description}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>
          )}

          {/* PREVIEW */}
          {currentStep === 5 && (
            <section className="content-section">

              <div className="section-heading">
                <span className="section-icon">◉</span>

                <div>
                  <h1>Comic Preview</h1>
                  <p>
                    Review your finished comic.
                  </p>
                </div>
              </div>

              {generatedLayout.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    ◉
                  </div>

                  <h2>
                    No comic generated yet
                  </h2>

                  <p>
                    Generate your comic to see the preview.
                  </p>

                </div>

              ) : (

                <div className="preview-grid">

                  {generatedLayout.map((panel, index) => (

                    <div
                      className="preview-panel"
                      key={index}
                    >

                      <img
                        src={`${API_URL}${panel.image}`}
                        alt={panel.title}
                      />

                      <div className="preview-text">

                        <span>
                          PANEL {index + 1}
                        </span>

                        <h3>
                          {panel.title}
                        </h3>

                        <p>
                          {panel.description}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>
          )}

          {/* EXPORT */}
          {currentStep === 6 && (
            <section className="content-section">

              <div className="section-heading">
                <span className="section-icon">↓</span>

                <div>
                  <h1>Export Your Comic</h1>
                  <p>
                    Your comic is ready to save.
                  </p>
                </div>
              </div>

              {pdfUrl ? (

                <div className="export-screen">

                  <div className="export-icon">
                    ✓
                  </div>

                  <h2>
                    Comic Ready!
                  </h2>

                  <p>
                    Your comic has been successfully generated
                    and exported as a PDF.
                  </p>

                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    ↓ Download Comic PDF
                  </a>

                </div>

              ) : (

                <div className="empty-state">

                  <div className="empty-icon">
                    ↓
                  </div>

                  <h2>
                    Nothing to export yet
                  </h2>

                  <p>
                    Generate your comic first.
                  </p>

                </div>

              )}

            </section>
          )}

          {/* ERROR */}
          {error && (
            <div className="error-message">
              <strong>Generation failed:</strong> {error}
            </div>
          )}

          {/* FOOTER NAVIGATION */}
          <div className="footer-navigation">

            <button
              className="secondary-button"
              onClick={previousStep}
              disabled={currentStep === 1 || loading}
            >
              ← Back
            </button>

            <div className="step-progress">
              Step {currentStep} of 6
            </div>

            {currentStep < 4 && (

              <button
                className="primary-button"
                onClick={nextStep}
              >
                Continue →
              </button>

            )}

            {currentStep === 4 && (

              <button
                className="primary-button generate-button"
                onClick={generateComic}
                disabled={loading}
              >
                {loading
                  ? "⏳ Generating..."
                  : "✦ Generate Comic"}
              </button>

            )}

            {currentStep === 5 && (

              <button
                className="primary-button"
                onClick={() => setCurrentStep(6)}
              >
                Export →
              </button>

            )}

          </div>

        </main>

        {/* SIDEBAR */}
        <aside className="sidebar">

          <div className="sidebar-card">

            <div className="sidebar-title">
              <span>PROJECT</span>
              <span className="status-dot"></span>
            </div>

            <h3>
              Untitled Comic
            </h3>

            <p>
              {generatedLayout.length > 0
                ? `${generatedLayout.length} panels generated`
                : "Your comic project"}
            </p>

          </div>

          <div className="sidebar-card">

            <div className="sidebar-title">
              WORKFLOW
            </div>

            <div className="workflow-list">

              {steps.map((step, index) => {

                const number = index + 1;

                return (
                  <button
                    key={step}
                    className={`workflow-item ${
                      currentStep === number
                        ? "active"
                        : ""
                    } ${
                      currentStep > number
                        ? "completed"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentStep(number)
                    }
                  >

                    <span className="workflow-number">
                      {currentStep > number
                        ? "✓"
                        : number}
                    </span>

                    <span>
                      {step}
                    </span>

                  </button>
                );

              })}

            </div>

          </div>

          <div className="sidebar-card project-summary">

            <div className="sidebar-title">
              STORY SUMMARY
            </div>

            <div className="summary-row">
              <span>Character</span>
              <strong>
                {story.character || "—"}
              </strong>
            </div>

            <div className="summary-row">
              <span>Setting</span>
              <strong>
                {story.setting || "—"}
              </strong>
            </div>

            <div className="summary-row">
              <span>Style</span>
              <strong>
                {story.style || "—"}
              </strong>
            </div>

          </div>

        </aside>

      </div>

      <footer className="app-footer">
        <span>ComicCraft</span>
        <span>AI Comic Studio</span>
      </footer>

    </div>
  );
}

export default App;