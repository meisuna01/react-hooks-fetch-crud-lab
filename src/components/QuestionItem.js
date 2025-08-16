import React from "react";

function QuestionItem({ question, onDelete, onUpdate }) {
  function handleDelete() {
    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: "DELETE",
    }).then(() => onDelete(question.id));
  }

  function handleChangeCorrectAnswer(e) {
    const newCorrectIndex = parseInt(e.target.value);
    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((res) => res.json())
      .then((updatedQuestion) => onUpdate(updatedQuestion));
  }

  return (
    <li>
      <h3>{question.prompt}</h3>
      <ul>
        {question.answers.map((ans, i) => (
          <li key={i}>{ans}</li>
        ))}
      </ul>
      <label>
        Correct Answer:
        <select
          value={question.correctIndex}
          onChange={handleChangeCorrectAnswer}
        >
          {question.answers.map((ans, i) => (
            <option key={i} value={i}>
              {ans}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default QuestionItem;
