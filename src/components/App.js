import React, { useEffect, useState } from "react";
import QuestionList from "./QuestionList";
import NewQuestionForm from "./NewQuestionForm";

function App() {
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setQuestions(data);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddQuestion = (newQ) => setQuestions((prev) => [...prev, newQ]);
  const handleDeleteQuestion = (id) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  const handleUpdateQuestion = (updatedQ) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQ.id ? updatedQ : q))
    );

  return (
    <div>
      <h1>Quiz Admin Panel</h1>

      <button onClick={() => setShowQuestions((prev) => !prev)}>
        View Questions
      </button>
      <button onClick={() => setShowForm((prev) => !prev)}>New Question</button>

      {showForm && (
        <NewQuestionForm
          questions={questions}
          onAddQuestion={handleAddQuestion}
        />
      )}

      {showQuestions && (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </div>
  );
}

export default App;
