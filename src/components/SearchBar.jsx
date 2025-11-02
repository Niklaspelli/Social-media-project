import { useState, useEffect } from "react";
import {
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authData } = useAuth();

  const token = authData?.accessToken;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const fetchUser = async (username) => {
    setLoading(true);
    setError(null);
    console.log("Fetching users for:", username);

    try {
      const csrfToken = getCookie("csrfToken");

      const response = await fetch(
        `http://localhost:5000/api/auth/search/users/${encodeURIComponent(
          username
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "CSRF-Token": csrfToken,
          },
          credentials: "include",
        }
      );

      console.log("API Response:", response); // Debug log for API response

      if (!response.ok) throw new Error("User not found or unauthorized");

      const data = await response.json();
      console.log("Fetched data:", data); // Debug log for fetched data

      setUserProfiles(data); // Update the state with fetched users
    } catch (error) {
      setError(error.message); // Set error state
      console.error("Error fetching user:", error.message);
    } finally {
      setLoading(false); // Mark as done loading
    }
  };

  // Debounce the search input to reduce frequent API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay before setting the debounced value

    return () => clearTimeout(timer); // Cleanup on change
  }, [searchTerm]);

  // Fetch user profiles based on debounced search term
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      console.log("Searching with term:", debouncedSearchTerm); // Debug log for debounced term
      fetchUser(debouncedSearchTerm); // Trigger the fetch when debounced term changes
    } else {
      setUserProfiles([]); // Clear the user profiles when search is cleared
    }
  }, [debouncedSearchTerm]);

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debouncedSearchTerm.trim()) {
      console.log("Submit search term:", debouncedSearchTerm); // Debug log for submit
    }
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <InputGroup>
        <FormControl
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="secondary" type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </InputGroup>

      {/* Loading Spinner */}
      {loading && <div>Loading...</div>}

      {/* Error Message */}
      {error && <div>{error}</div>}

      {/* Show search results dropdown if there are results */}
      {debouncedSearchTerm && userProfiles.length > 0 && !loading && !error ? (
        <ListGroup className="position-absolute w-100 mt-2">
          {userProfiles.map((user) => (
            <ListGroup.Item key={user.id} className="d-flex align-items-center">
              {user.avatar && (
                <Link
                  to={`/user/${user.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Image
                    src={user.avatar}
                    roundedCircle
                    height="30"
                    width="30"
                    alt={`${user.username}'s avatar`}
                    className="me-2"
                  />
                </Link>
              )}
              <span>{user.username}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        debouncedSearchTerm && !loading && !error && <div>No users found</div>
      )}
    </form>
  );
};

export default SearchBar;
