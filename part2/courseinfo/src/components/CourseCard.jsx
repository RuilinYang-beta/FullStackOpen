const Header = ({ course }) => {
  return <h1>{course.name}</h1>;
};

const Content = ({ course }) => {
  return (
    <>
      {course.parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  );
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content course={course} />
    </>
  );
};

const Stats = ({ course }) => {
  const total = course.parts.reduce((acc, part) => acc + part.exercises, 0);
  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  );
};

const CourseCard = ({ course }) => {
  return (
    <>
      <Course course={course} />
      <Stats course={course} />
    </>
  );
};

export default CourseCard;
