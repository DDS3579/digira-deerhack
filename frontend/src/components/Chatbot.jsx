import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleGenAI } from "@google/genai";
import { getComplaints, getSamachar, getEvents, getHelpRequests, getLostFound, getInvitations } from "@/services/api";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm here to help you. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Get API key from environment variables
  const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY || "";
  
  // Initialize Google GenAI instance (memoized to avoid recreating on every render)
  const ai = useMemo(() => {
    return API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
  }, [API_KEY]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchBackendData = async () => {
    try {
      const [complaints, samachar, events, helpRequests, lostFound, invitations] = await Promise.allSettled([
        getComplaints(10).catch(() => []),
        getSamachar(10).catch(() => []),
        getEvents().catch(() => []),
        getHelpRequests(10).catch(() => []),
        getLostFound(10).catch(() => []),
        getInvitations(10).catch(() => []),
      ]);

      return {
        complaints: complaints.status === "fulfilled" ? (complaints.value || []) : [],
        samachar: samachar.status === "fulfilled" ? (samachar.value || []) : [],
        events: events.status === "fulfilled" ? (events.value || []) : [],
        helpRequests: helpRequests.status === "fulfilled" ? (helpRequests.value || []) : [],
        lostFound: lostFound.status === "fulfilled" ? (lostFound.value || []) : [],
        invitations: invitations.status === "fulfilled" ? (invitations.value || []) : [],
      };
    } catch (error) {
      console.error("Error fetching backend data:", error);
      return {
        complaints: [],
        samachar: [],
        events: [],
        helpRequests: [],
        lostFound: [],
        invitations: [],
      };
    }
  };

  const formatDataForContext = (data) => {
    let context = "Here is the current data from the system:\n\n";

    // Format Complaints
    if (data.complaints && data.complaints.length > 0) {
      context += "COMPLAINTS:\n";
      data.complaints.forEach((complaint, index) => {
        context += `${index + 1}. ${complaint.title || complaint.subject || "Untitled Complaint"}\n`;
        if (complaint.description || complaint.content) {
          context += `   Description: ${complaint.description || complaint.content}\n`;
        }
        if (complaint.status) {
          context += `   Status: ${complaint.status}\n`;
        }
        if (complaint.created_at || complaint.date) {
          context += `   Date: ${complaint.created_at || complaint.date}\n`;
        }
        if (complaint.user_name) {
          context += `   By: ${complaint.user_name}\n`;
        }
        context += "\n";
      });
    } else {
      context += "COMPLAINTS: No complaints received.\n\n";
    }

    // Format Samachar/Updates
    if (data.samachar && data.samachar.length > 0) {
      context += "UPDATES (SAMACHAR):\n";
      data.samachar.forEach((update, index) => {
        context += `${index + 1}. ${update.title || update.subject || "Community Update"}\n`;
        if (update.description || update.content) {
          context += `   Description: ${update.description || update.content}\n`;
        }
        if (update.created_at || update.date) {
          context += `   Date: ${update.created_at || update.date}\n`;
        }
        if (update.user_name) {
          context += `   By: ${update.user_name}\n`;
        }
        context += "\n";
      });
    } else {
      context += "UPDATES (SAMACHAR): No updates received.\n\n";
    }

    // Format Events
    if (data.events && data.events.length > 0) {
      context += "EVENTS:\n";
      data.events.forEach((event, index) => {
        context += `${index + 1}. ${event.title || event.name || "Untitled Event"}\n`;
        if (event.description || event.content) {
          context += `   Description: ${event.description || event.content}\n`;
        }
        if (event.date || event.event_date || event.created_at) {
          context += `   Date: ${event.date || event.event_date || event.created_at}\n`;
        }
        if (event.location) {
          context += `   Location: ${event.location}\n`;
        }
        context += "\n";
      });
    } else {
      context += "EVENTS: No events received.\n\n";
    }

    // Format Help Requests
    if (data.helpRequests && data.helpRequests.length > 0) {
      context += "HELP REQUESTS:\n";
      data.helpRequests.forEach((request, index) => {
        context += `${index + 1}. ${request.title || request.subject || "Help Request"}\n`;
        if (request.description || request.content) {
          context += `   Description: ${request.description || request.content}\n`;
        }
        if (request.created_at || request.date) {
          context += `   Date: ${request.created_at || request.date}\n`;
        }
        context += "\n";
      });
    } else {
      context += "HELP REQUESTS: No help requests received.\n\n";
    }

    // Format Lost & Found
    if (data.lostFound && data.lostFound.length > 0) {
      context += "LOST & FOUND:\n";
      data.lostFound.forEach((item, index) => {
        context += `${index + 1}. ${item.title || item.subject || "Lost/Found Item"}\n`;
        if (item.description || item.content) {
          context += `   Description: ${item.description || item.content}\n`;
        }
        if (item.created_at || item.date) {
          context += `   Date: ${item.created_at || item.date}\n`;
        }
        context += "\n";
      });
    } else {
      context += "LOST & FOUND: No lost & found items received.\n\n";
    }

    // Format Invitations
    if (data.invitations && data.invitations.length > 0) {
      context += "INVITATIONS:\n";
      data.invitations.forEach((invitation, index) => {
        context += `${index + 1}. ${invitation.title || invitation.subject || "Invitation"}\n`;
        if (invitation.description || invitation.content) {
          context += `   Description: ${invitation.description || invitation.content}\n`;
        }
        if (invitation.created_at || invitation.date) {
          context += `   Date: ${invitation.created_at || invitation.date}\n`;
        }
        context += "\n";
      });
    } else {
      context += "INVITATIONS: No invitations received.\n\n";
    }

    return context;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      if (!API_KEY || !ai) {
        throw new Error("API key not configured");
      }

      // Fetch backend data to provide context
      const backendData = await fetchBackendData();
      const dataContext = formatDataForContext(backendData);

      // Build system prompt with backend data context
      const systemPrompt = `You are a helpful assistant for a community management system. Use the following data from the backend to answer user questions accurately. If the data shows "No [item] received" for any category, inform the user that there are no updates in that category. Always base your answers on the actual data provided below.\n\n${dataContext}\n\nAnswer the user's question based on the above data. If there is no relevant data, say "No updates received" or similar.`;

      // Build conversation history for the API
      // Convert messages to the format expected by Google GenAI
      // Include system prompt first, then conversation history, then current user message
      const conversationHistory = [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I have access to the current system data and will answer your questions based on it." }],
        },
        ...messages.map((msg) => {
          // Google GenAI expects role to be 'user' or 'model' (not 'assistant')
          const role = msg.role === "assistant" ? "model" : "user";
          return {
            role: role,
            parts: [{ text: msg.content }],
          };
        }),
        {
          role: "user",
          parts: [{ text: userMessage.content }],
        },
      ];

      // Call Google GenAI API following the structure provided
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: conversationHistory,
      });

      // Extract the response text - following the structure from the example
      // The response should have a .text property
      let responseText = "";
      if (response.text) {
        responseText = typeof response.text === "function" 
          ? await response.text() 
          : response.text;
      } else if (response.response?.text) {
        responseText = typeof response.response.text === "function" 
          ? await response.response.text() 
          : response.response.text;
      } else {
        // Fallback: try to extract from candidates if available
        responseText = response.candidates?.[0]?.content?.parts?.[0]?.text 
          || "I'm sorry, I couldn't generate a response.";
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: error.message === "API key not configured"
          ? "Please add VITE_GOOGLE_GENAI_API_KEY to your .env file to enable chatbot functionality."
          : `Sorry, I encountered an error: ${error.message || "Please try again later."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "transition-all duration-200 hover:scale-110"
        )}
        size="icon"
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Interface Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <SheetTitle>Chat Assistant</SheetTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2 text-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 space-y-2">
            {!API_KEY && (
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 mb-2">
                <p className="font-medium">API Key Required</p>
                <p>Please add VITE_GOOGLE_GENAI_API_KEY to your .env file to enable functionality.</p>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[60px] max-h-[120px] resize-none"
                disabled={isLoading || !API_KEY}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !API_KEY}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

