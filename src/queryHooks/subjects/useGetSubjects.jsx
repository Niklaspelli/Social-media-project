import { useQuery } from "@tanstack/react-query";

// Function to fetch subjects from your backend
const fetchSubjects = async () => {
  const response = await fetch("http://localhost:5000/api/forum/subjects");
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return response.json();
};

// Custom hook to get subjects
const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
    staleTime: 10 * 60 * 1000, // 10 minuter
    refetchOnWindowFocus: false,
  });
};

export default useGetSubjects;
