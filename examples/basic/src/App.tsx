import { useState } from "react";
import { useCopy } from "use-copy-ts";

export default function App() {
  const { copy, copied, copiedText, reset, clear } = useCopy();
  const [textareaValue, setTextareaValue] = useState("try writing here");

  const buttonStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    color: "white",
    border: "none",
    marginRight: "1rem",
    borderRadius: "0.375rem",
    transition: "background-color 0.2s",
  };

  const stateStyle = {
    color: "#374151",
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>use-copy-ts - Basic Example</h1>
      <h2>State:</h2>
      <div style={{ marginLeft: "1rem" }}>
        <p>
          copied:{" "}
          <span style={{ ...stateStyle }}>{copied ? "true" : "false"}</span>
        </p>
        <p>
          copiedText:{" "}
          <span style={{ ...stateStyle }}>{copiedText ?? "null"}</span>
        </p>
      </div>
      <h2>Actions:</h2>
      <div style={{ marginLeft: "1rem" }}>
        <button
          onClick={() => copy("Hello World")}
          style={{
            ...buttonStyle,
            backgroundColor:
              copied && copiedText === "Hello World" ? "#10b981" : "#3b82f6",
          }}
        >
          {copied ? "Copied! ✓" : 'Copy "Hello World"'}
        </button>
        <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>
          Click the button to copy text to clipboard
        </p>
        <textarea
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          placeholder="try writing here"
        />
        <div>
          <button
            style={{
              ...buttonStyle,
              backgroundColor:
                copied && copiedText === textareaValue ? "#10b981" : "#3b82f6",
            }}
            onClick={() => copy(textareaValue)}
          >
            copy textarea
          </button>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={reset}
            style={{
              ...buttonStyle,
              backgroundColor: "#ef4444",
            }}
          >
            Reset State
          </button>
          <button
            onClick={clear}
            style={{
              ...buttonStyle,
              backgroundColor: "#ef4444",
            }}
          >
            Clear State and Clipboard
          </button>
        </div>
      </div>
      <h2>Try Pasting:</h2>

      <textarea
        style={{
          width: "100%",
          height: "100px",
          marginTop: "1rem",
        }}
        placeholder="Try pasting here (Ctrl+V or Cmd+V)"
      />
    </div>
  );
}
