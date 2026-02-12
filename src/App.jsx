import React, { useState, useRef } from "react";
import angelVideo from "./angel.mp4";

const QUESTIONS = [
  {
    id: 1,
    title: "Особая дата",
    prompt:
      "В этот день заработал ютуб (дата)",
    answers: ["14.02", "14.2", "14/02", "14-02", "14 02"],
    hint: ""
  },
  {
    id: 2,
    title: "Задача для гениев",
    prompt:
      "Реши выражение, (не используй калкулятор) 72 ÷ (3 × 2) + 64 ÷ 8 − 14 ÷ 7. Напиши конечный результат.",
    answers: ["18", "18."],
    hint: ""
  },
  {
    id: 3,
    title: "Расшифруй шифр",
    prompt:
      "24, 1, 7, 13, 9, 20, 6, 7, 14. Вперед, ты в клубе 1% )))",
    answers: ["жемчужина"],
    hint: ""
  },
];

function normalize(text) {
  return text.trim().toLowerCase();
}

function isCorrectAnswer(userInput, expected) {
  const normalized = normalize(userInput);

  if (Array.isArray(expected)) {
    return expected.map(normalize).includes(normalized);
  }

  return normalized === normalize(expected);
}

function App() {
  const [step, setStep] = useState("intro"); // "intro" | question index (0-2) | "confirm" | "final"
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [showSurpriseVideo, setShowSurpriseVideo] = useState(false);
  const videoRef = useRef(null);

  const isIntro = step === "intro";
  const isConfirm = step === "confirm";
  const isFinal = step === "final";
  const currentIndex = typeof step === "number" ? step : 0;
  const currentQuestion = QUESTIONS[currentIndex];

  function handleStart() {
    setStep(0);
    setAnswer("");
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!currentQuestion) return;

    if (!answer.trim()) {
      setError("Нужно что-то ввести :)");
      return;
    }

    if (isCorrectAnswer(answer, currentQuestion.answers ?? currentQuestion.answer)) {
      const isLast = currentIndex === QUESTIONS.length - 1;
      if (isLast) {
        setStep("confirm");
      } else {
        setStep(currentIndex + 1);
      }
      setAnswer("");
      setError("");
    } else {
      setError("Пока не то. Подумай ещё немного ♥");
    }
  }

  function renderIntro() {
    return (
      <>
        <h1 className="title">Маленький квест для тебя 💌</h1>
        <p className="subtitle">
          Я подготовил для тебя маленький романтичный квест из 3 шагов.
          <br />
        </p>
        <button className="primary-button" onClick={handleStart}>
          Начать квест
        </button>
      </>
    );
  }

  function renderQuestion() {
    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

    return (
      <>
        <div className="progress-wrapper" aria-hidden="true">
          <div className="progress-text">
            Вопрос {currentIndex + 1} из {QUESTIONS.length}
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="question-title">{currentQuestion.title}</h2>
        <p className="question-prompt">{currentQuestion.prompt}</p>

        {currentQuestion.hint && (
          <p className="hint">Подсказка: {currentQuestion.hint}</p>
        )}

        <form onSubmit={handleSubmit} className="answer-form">
          <label className="answer-label">
            Твой ответ:
            <input
              type="text"
              className="answer-input"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (error) setError("");
              }}
              placeholder="Напиши сюда свою догадку"
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button
            type="submit"
            className="primary-button"
            disabled={!answer.trim()}
          >
            Проверить
          </button>
        </form>
      </>
    );
  }

  function renderConfirm() {
    return (
      <>
        <h1 className="title">Остался самый главный шаг</h1>
        <p className="subtitle">
          Ты разгадала все загадки. Значит, ты легко справляешься и с шифрами,
          и с числами, и с датами.
          <br />
          Теперь остался только один вопрос:
        </p>
        <div className="final-card">
          <p className="final-question">Согласна на свидание со мной? 💖</p>
          <button
            className="primary-button big"
            onClick={() => setStep("final")}
          >
            Согласна ✨
          </button>
        </div>
      </>
    );
  }

  function renderFinal() {
    return (
      <>
        <h1 className="title">Урааа! 🎆</h1>
        <p className="subtitle">
          Тогда свидание официально назначено.
          <br />
          Жемчужина, 18.00.
        </p>
        <div className="final-card">
          <p className="final-question">
            Люблюнькаю тебя, котик.
          </p>
          <button
            type="button"
            className="primary-button surprise-btn"
            onClick={() => setShowSurpriseVideo(true)}
          >
            Сюрприз 🎁
          </button>
        </div>
        <div className="fireworks" aria-hidden="true">
          <div className="firework f1" />
          <div className="firework f2" />
          <div className="firework f3" />
          <div className="firework f4" />
        </div>
      </>
    );
  }

  return (
    <div className="page">
      <div className="background-gradient" />
      <main className="card" aria-live="polite">
        {isIntro && renderIntro()}
        {!isIntro && !isConfirm && !isFinal && renderQuestion()}
        {isConfirm && renderConfirm()}
        {isFinal && renderFinal()}
      </main>
      <footer className="footer">
        Сделано с любовью специально для тебя ♥
      </footer>

      {showSurpriseVideo && (
        <div
          className="video-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Сюрприз — видео"
        >
          <button
            type="button"
            className="video-overlay-close"
            onClick={() => {
              setShowSurpriseVideo(false);
              if (videoRef.current) {
                videoRef.current.pause();
              }
            }}
            aria-label="Закрыть"
          >
            ✕
          </button>
          <video
            ref={videoRef}
            className="surprise-video"
            src={angelVideo}
            controls
            autoPlay
            playsInline
          />
        </div>
      )}
    </div>
  );
}

export default App;

