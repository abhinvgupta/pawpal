import { useMemo, useState } from "react";

function ChatPage({ dog, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const canSend = input.trim().length > 0 && !isSending;

  const introPrompt = useMemo(() => {
    if (!dog) return "";
    return `You are ${dog.name}, a friendly ${dog.breed}, age ${dog.age} with traits ${dog.traits.join(", ")}. Keep responses short, playful, and safe.`;
  }, [dog]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending || !dog) return;

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dog: {
            name: dog.name,
            breed: dog.breed,
            age: dog.age,
            traits: dog.traits,
          },
          messages: [
            { role: "system", content: introPrompt },
            ...nextMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = body?.error?.message ?? "OpenAI request failed.";
        throw new Error(message);
      }

      const data = await response.json();
      const assistantText = data?.reply?.trim() || "I could not generate a response.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong while sending.");
    } finally {
      setIsSending(false);
    }
  };

  const onInputKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) {
        void handleSend();
      }
    }
  };

  if (!dog) {
    return (
      <main className="chat-page">
        <button className="back-btn" onClick={onBack}>
          Back to Dogs
        </button>
        <h2>Dog not found</h2>
      </main>
    );
  }

  return (
    <main className="chat-page">
      <button className="back-btn" onClick={onBack}>
        Back to Dogs
      </button>
      <div className="chat-header">
        <img src={dog.image} alt={dog.name} />
        <div>
          <h2>Chat with {dog.name}</h2>
          <p>
            {dog.breed} • {dog.age}
          </p>
        </div>
      </div>
      <section className="chat-box">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <p className="chat-empty">
              Send a message to start chatting with {dog.name}.
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.content}
              </div>
            ))
          )}
          {isSending ? (
            <p className="chat-status">Thinking...</p>
          ) : null}
        </div>

        {error ? <p className="chat-error">{error}</p> : null}

        <div className="chat-input-row">
          <textarea
            className="chat-textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={`Say hi to ${dog.name}...`}
            rows={3}
            disabled={isSending}
          />
          <button className="chat-send-btn" onClick={handleSend} disabled={!canSend}>
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default ChatPage;
