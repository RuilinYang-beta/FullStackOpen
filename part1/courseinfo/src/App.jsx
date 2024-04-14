const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  );
};
const Content = (props) => {
  return props.content.map((part, idx) => {
    return <Part key={idx} part={part.part} exercises={part.exercises} />;
  });
};

const Total = (props) => {
  return (
    <p>
      Number of exercises{" "}
      {props.content.reduce((acc, part) => acc + part.exercises, 0)}
    </p>
  );
};

const App = () => {
  // const-definitions
  const course = "Half Stack application development";

  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;
  const content = [
    { part: part1, exercises: exercises1 },
    { part: part2, exercises: exercises2 },
    { part: part3, exercises: exercises3 },
  ];

  return (
    <div>
      <Header course={course} />
      <Content content={content} />
      <Total content={content} />
    </div>
  );
};

export default App;
