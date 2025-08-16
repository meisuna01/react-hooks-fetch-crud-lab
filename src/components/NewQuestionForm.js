import React, { useState } from "react";

function NewQuestionForm({ onAddQuestion, questions }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleChangeAnswer = (i, value) => {
    const newAnswers = [...answers];
    newAnswers[i] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQ = { prompt, answers, correctIndex };
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQ),
    })
      .then((res) => res.json())
      .then((createdQ) => onAddQuestion(createdQ));
    setPrompt("");
    setAnswers(["", "", "", ""]);
    setCorrectIndex(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Prompt:
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
      </label>
      {answers.map((ans, i) => (
        <label key={i}>
          Answer {i + 1}:
          <input
            type="text"
            value={ans}
            onChange={(e) => handleChangeAnswer(i, e.target.value)}
            required
          />
        </label>
      ))}
      <label>
        Correct Answer:
        <select
          data-testid="new-question-correct"
          value={correctIndex}
          onChange={(e) => setCorrectIndex(Number(e.target.value))}
        >
          {answers.map((_, i) => (
            <option key={i} value={i}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default NewQuestionForm;
