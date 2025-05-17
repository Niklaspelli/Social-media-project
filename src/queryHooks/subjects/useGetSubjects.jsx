import { useQuery } from "@tanstack/react-query";

// Function to fetch subjects from your backend
const fetchSubjects = async () => {
  const response = await fetch("http://localhost:5000/api/auth/subjects");
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return response.json();
};

// Custom hook to get subjects
const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"], // Unique key for caching
    queryFn: fetchSubjects, // Function to fetch data
  });
};

export default useGetSubjects;
