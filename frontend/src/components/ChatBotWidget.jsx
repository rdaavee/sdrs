import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { BotIcon } from "lucide-react";

import config from "../chatbot/config";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 p-4 bg-green-600 rounded-full shadow-lg text-white hover:bg-green-700 transition"
            >
                <BotIcon size={24} />
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-6 w-80 h-[500px] bg-white shadow-xl rounded-xl overflow-hidden">
                    <Chatbot
                        config={config}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                    />
                </div>
            )}
        </div>
    );
}
