import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  function handleClick() {
    setIsButtonClicked(true);
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <div>
        <input
          onClick={handleClick}
          type="submit"
          className="button"
          value="Transfer"
        />
        {isButtonClicked && (
          <DataPrompt
            setBalance={setBalance}
            setIsButtonClicked={setIsButtonClicked}
          />
        )}
      </div>
    </form>
  );
}

function DataPrompt({ setBalance, setIsButtonClicked }) {
  const [data, setData] = useState("");

  function handleChange(event) {
    setData(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      // Note: i had to add "http://localhost: " before "/send-signature, otherwise it would not work"
      const response = await fetch("/send-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });

      const { balance, message } = await response.json();
      setBalance(balance); // Updates the new balance after transfer
      setIsButtonClicked(false); // Hides the "submit" button
      alert(message); // Display the status message returned from the server
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <label>
        Please enter the signature:
        <input type="text" value={data} onChange={handleChange} />
      </label>
      <div>
        <button type="submit" onClick={handleSubmit}>
          submit
        </button>
      </div>
    </div>
  );
}

export default Transfer;
