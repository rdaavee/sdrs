class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    async handleUserMessage(message) {
        const typingMessage = this.createChatBotMessage(
            "SDRS Team is typing..."
        );
        this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, typingMessage],
        }));

        try {
            const res = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();

            const botMessage = this.createChatBotMessage(data.reply);
            this.setState((prev) => ({
                ...prev,
                messages: [
                    ...prev.messages.filter((m) => m !== typingMessage),
                    botMessage,
                ],
            }));
        } catch {
            const errorMsg = this.createChatBotMessage("Something went wrong");
            this.setState((prev) => ({
                ...prev,
                messages: [...prev.messages, errorMsg],
            }));
        }
    }
}

export default ActionProvider;
