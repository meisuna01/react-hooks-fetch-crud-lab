import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'; // ✅ important for toBeInTheDocument
import App from "../components/App"; // correct


beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (url.endsWith("/questions") && (!options || options.method === "GET")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: 1,
              prompt: "lorem testum 1",
              answers: ["choice 1", "choice 2", "choice 3", "choice 4"],
              correctIndex: 0,
            },
            {
              id: 2,
              prompt: "lorem testum 2",
              answers: ["choice 1", "choice 2", "choice 3", "choice 4"],
              correctIndex: 0,
            },
          ]),
      });
    }

    if (options?.method === "POST") {
      const newQ = { id: 3, ...JSON.parse(options.body) };
      return Promise.resolve({ json: () => Promise.resolve(newQ) });
    }

    if (options?.method === "PATCH") {
      const updatedQ = { id: 1, ...JSON.parse(options.body) };
      return Promise.resolve({ json: () => Promise.resolve(updatedQ) });
    }

    if (options?.method === "DELETE") {
      return Promise.resolve({ json: () => Promise.resolve({}) });
    }
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("View Questions"));

  // ✅ use await screen.findByText + jest-dom matcher
  expect(await screen.findByText("lorem testum 1")).toBeInTheDocument();
  expect(screen.getByText("lorem testum 2")).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("New Question"));

  fireEvent.change(screen.getByLabelText(/Prompt:/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1:/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2:/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3:/), {
    target: { value: "Test Answer 3" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4:/), {
    target: { value: "Test Answer 4" },
  });
  fireEvent.change(screen.getByTestId("new-question-correct"), {
    target: { value: "2" },
  });

  fireEvent.click(screen.getByText("Add Question"));

  // wait for the new question to appear
  fireEvent.click(screen.getByText("View Questions"));
  expect(await screen.findByText("Test Prompt")).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("View Questions"));

  const deleteBtn = await screen.findByTestId("question-1-delete");
  fireEvent.click(deleteBtn);

  await waitFor(() =>
    expect(screen.queryByText("lorem testum 1")).not.toBeInTheDocument()
  );
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("View Questions"));

  const firstQuestionSelect = await screen.findByTestId("question-1-correct");
  fireEvent.change(firstQuestionSelect, { target: { value: "2" } });

  expect(firstQuestionSelect.value).toBe("2");
});
