import React from "react";

export default function test() {
  const [name, setName] = React.useState("");
  const submitForm = (event) => {
    event.preventDefault();
    console.log(name);
  };

  return (
    <div>
      <form onSubmit={submitForm} action="">
        <label htmlFor="name">Name</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          id="name"
          name="name"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
