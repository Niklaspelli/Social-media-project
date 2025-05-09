import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const DeleteButton = ({ onDelete }) => {
  return (
    <Button variant="outline-danger" size="sm" onClick={onDelete}>
      <FontAwesomeIcon icon={faTrash} /> Delete
    </Button>
  );
};

export default DeleteButton;
