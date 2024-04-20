import { useState } from "react";

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ review, stats }) => {
  const sum = Object.values(review).reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );

  if (sum === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={review.good} />
        <StatisticsLine text="neutral" value={review.neutral} />
        <StatisticsLine text="bad" value={review.bad} />
        <StatisticsLine text="all" value={stats.all} />
        <StatisticsLine text="average" value={stats.average || 0} />
        <StatisticsLine text="positive" value={`${stats.positive || 0}%`} />
      </tbody>
    </table>
  );
};

const Title = ({ title }) => <h1>{title}</h1>;

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  // save clicks of each button to its own state
  const [review, setReview] = useState({ good: 0, neutral: 0, bad: 0 });
  const [stats, setStats] = useState({ all: 0, average: 0, positive: 0 });

  // returns a function that updates the state of the given number on the fly
  const handleButtonClick = (newReview) => () => {
    // update review counts
    setReview(newReview);

    // update statistics
    const sum = Object.values(newReview).reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );

    setStats({
      all: sum,
      average: ((newReview.good - newReview.bad) / sum).toFixed(2),
      positive: ((newReview.good / sum) * 100).toFixed(2),
    });
  };

  return (
    <>
      <Title title="give feedback" />
      <Button
        text="good"
        onClick={handleButtonClick({
          ...review,
          good: review.good + 1,
        })}
      />
      <Button
        text="neutral"
        onClick={handleButtonClick({ ...review, neutral: review.neutral + 1 })}
      />
      <Button
        text="bad"
        onClick={handleButtonClick({ ...review, bad: review.bad + 1 })}
      />

      <Title title="statistics" />
      <Statistics review={review} stats={stats} />
    </>
  );
};

export default App;
