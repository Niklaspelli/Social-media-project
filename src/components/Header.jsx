import React, { useState, useEffect } from "react";
import { Form, Button, FormControl } from "react-bootstrap";
import { useUsers } from "../context/UserContext"; // Assuming UserProvider is in this folder

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  /* const { searchUsers } = useUsers();  */
  const { searchUsers, fetchAllUsers } = useUsers();
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Use the searchUsers function from context
    const results = searchUsers(searchTerm);
    setSearchResults(results); // Set the results in the state
    console.log("Searching for users:", results); // Log results or update UI
  };
  /* 
  // Optionally prefetch all users on mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // or however you store your auth token
    fetchAllUsers(token);
  }, []); */

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-10">
      {/* Search Form */}
      <Form inline onSubmit={handleSearchSubmit} className="d-flex w-50">
        <FormControl
          type="text"
          placeholder="Search users..."
          className="mr-2"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button variant="outline-info" type="submit">
          Search
        </Button>
      </Form>

      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results mt-4">
          <h5>Search Results:</h5>
          <ul>
            {searchResults.map((user) => (
              <li key={user.id}>
                <a href={`/profile/${user.id}`}>{user.username}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
