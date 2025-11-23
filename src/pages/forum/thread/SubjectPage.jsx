import { useParams } from "react-router-dom";
import useThreads from "../../../queryHooks/threads/useThreads";
import useGetSubjects from "../../../queryHooks/subjects/useGetSubjects";
import ThreadList from "./ThreadList";
import CreateThread from "./CreateThread";

const SubjectPage = () => {
  const { subjectId } = useParams(); // subjectId från URL
  const parsedSubjectId = parseInt(subjectId, 10);
  console.log("subject id:", subjectId);
  console.log("parsed subjetct id:", parsedSubjectId);

  const { data: subjects } = useGetSubjects();
  const subject = subjects?.find((s) => s.subject_id === parsedSubjectId);
  const { isLoading, error } = useThreads(1, 10, "desc", parsedSubjectId);

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  if (!subject) return <p>Subject not found</p>;

  return (
    <div style={{ color: "white" }}>
      <h1>{subject.title}</h1>
      <h4>{subject.description}</h4> <ThreadList subjectId={parsedSubjectId} />
      <CreateThread defaultSubjectId={parsedSubjectId} />
    </div>
  );
};

export default SubjectPage;
