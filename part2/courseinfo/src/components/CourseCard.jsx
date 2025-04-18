import Course from "./Course";

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
