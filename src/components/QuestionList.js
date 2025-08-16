// src/components/QuestionList.js
import React from "react";

function QuestionList({ questions = [], onDeleteQuestion, onUpdateQuestion }) {
  return (
    <ul>
      {questions.map((q) => (
        <li key={q.id}>
          <h4>{q.prompt}</h4>
          <label>
            Correct Answer:
            <select
              data-testid={`question-${q.id}-correct`}
              value={q.correctIndex}
              onChange={(e) =>
                onUpdateQuestion({ ...q, correctIndex: parseInt(e.target.value) })
              }
            >
              {(q.answers || []).map((ans, i) => (
                <option key={i} value={i}>
                  {ans}
                </option>
              ))}
            </select>
          </label>
          <button data-testid={`question-${q.id}-delete`} onClick={() => onDeleteQuestion(q.id)}>
            Delete Question
          </button>
        </li>
      ))}
    </ul>
  );
}

export default QuestionList;
