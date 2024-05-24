import "./App.css";
import { useState, useEffect, createRef } from "react";

function Test() {
  const divRef = createRef();
  const [myName, setMyName] = useState("");
  const data = `Please enter your name`;

  const onChangeHandler = (event) => {
    setMyName(event.target.value);
  };

  useEffect(() => {
    divRef.current.innerText = myName;
  }, [myName]);

  return (
    <div className="App">
      <input
        type="text"
        name="name"
        onChange={onChangeHandler}
        value={myName}
      />
      <div className="container" ref={divRef}>
        {data}
      </div>
    </div>
  );
}

export default Test;
