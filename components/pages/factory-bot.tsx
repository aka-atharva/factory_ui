"use client"

import { CardFooter } from "@/components/ui/card"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FactoryApi } from "@/lib/api-service"
import { Send, User, Sparkles, Factory, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function FactoryBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your factory assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
    // Focus input on component mount
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsThinking(true)

    try {
      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Send message to API
      const response = await FactoryApi.sendBotMessage(input)

      // Keep thinking animation for a minimum time
      await new Promise((resolve) => setTimeout(resolve, 800))

      setIsThinking(false)

      if (response.success && response.data) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.message,
          sender: "bot",
          timestamp: new Date(Date.now()),
        }
        setMessages((prev) => [...prev, botResponse])
      } else {
        // Handle error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I'm having trouble processing your request right now.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setIsThinking(false)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble processing your request right now.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Suggested questions to ask the bot
  const suggestedQuestions = [
    "What's our current production rate?",
    "How's our factory efficiency?",
    "Any downtime issues today?",
    "What's the status of production lines?",
  ]

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    // Focus the input after setting the question
    inputRef.current?.focus()
  }

  return (
    <Card className="w-full h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <div className="relative">
            <motion.div
              className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <Avatar className="h-10 w-10 border-2 border-primary/50">
              <AvatarImage src="/bot-avatar.png" alt="Factory Assistant" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Factory className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Factory Assistant
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </motion.div>
            </CardTitle>
            <CardDescription>Ask questions about factory operations and data</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <AnimatePresence initial={false}>
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index === messages.length - 1 ? 0.1 : 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start gap-2 max-w-[80%]">
                    {message.sender === "bot" && (
                      <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarImage src="/bot-avatar.png" alt="Bot" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <Factory className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted border border-border/50"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </motion.div>
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarImage src="/user-avatar.png" alt="User" />
                        <AvatarFallback className="bg-blue-500/10 text-blue-500">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Thinking animation */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarImage src="/bot-avatar.png" alt="Bot" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Factory className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-3 bg-muted border border-border/50">
                      <div className="flex space-x-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-primary/60"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.3, delay: 0.1 }}
                          className="h-2 w-2 rounded-full bg-primary/60"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.4, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-primary/60"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </AnimatePresence>
        </ScrollArea>
      </CardContent>

      {/* Suggested questions */}
      {messages.length < 3 && (
        <div className="px-4 py-2">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 transition-all"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Zap className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </motion.div>
        </div>
      </CardFooter>
    </Card>
  )
}

