import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import useThreads from "../../../queryHooks/threads/useThreads";
import useGetSubjects from "../../../queryHooks/subjects/useGetSubjects";
import ThreadList from "./ThreadList";
import CreateThread from "./CreateThread";

const SubjectPage = () => {
  const { subjectId } = useParams(); // subjectId från URL
  const parsedSubjectId = parseInt(subjectId, 10);
  const [showCreate, setShowCreate] = useState(false);

  const { data: subjects } = useGetSubjects();
  const subject = subjects?.find((s) => s.subject_id === parsedSubjectId);
  const { isLoading, error } = useThreads(1, 10, "desc", parsedSubjectId);

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  if (!subject) return <p>Subject not found</p>;

  return (
    <div style={{ color: "white" }}>
      <div style={{ textAlign: "center" }}>
        <h1>{subject.title}</h1>
        <p>{subject.description}</p>
        <Button
          variant="light"
          style={{ backgroundColor: "black", color: "white" }}
          onClick={() => setShowCreate(true)}
        >
          Create thread
        </Button>
      </div>
      {showCreate && (
        <CreateThread
          defaultSubjectId={parsedSubjectId}
          onClose={() => setShowCreate(false)}
        />
      )}
      <ThreadList subjectId={parsedSubjectId} />
    </div>
  );
};

export default SubjectPage;
