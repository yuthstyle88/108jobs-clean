"use client";

import {Paperclip, Send, Smile} from "lucide-react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { createPortal } from "react-dom";

type MessageForm = {
    message: string;
};

interface ChatInputProps {
    onSubmit: (data: MessageForm) => void;
    disabled?: boolean;
    disabledHint?: string;
    isUploading?: boolean
    onFileUpload?: (e: Event) => void;
    onTyping?: (typing: boolean) => void;
    /** Optional hint to show when the other participant is typing (e.g., "กำลังพิมพ์...") */
    typingHint?: string;
    sendLatestRead: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({
                                                 onSubmit,
                                                 disabled = false,
                                                 disabledHint,
                                                 isUploading,
                                                 onFileUpload,
                                                 onTyping,
                                                 typingHint,
                                                 sendLatestRead
                                             }) => {
    const {t} = useTranslation();
    const {register, handleSubmit, reset, watch, setValue, getValues} = useForm<MessageForm>();
    const messageRef = useRef<HTMLTextAreaElement | null>(null);

    const {ref, ...rest} = register("message");
    const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const typingLastSentAtRef = useRef<number>(0);
    const typingLastStateRef = useRef<boolean | null>(null);
    const TYPING_TRUE_THROTTLE_MS = 5000; // 5 seconds throttle for typing=true
    const TYPING_STOP_DEBOUNCE_MS = 1500; // stop-typing debounce
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);
    const insertEmojiAtCursor = useCallback(
        (emoji: string) => {
            const textarea = messageRef.current;
            if (!textarea) return;

            const start = textarea.selectionStart ?? 0;
            const end = textarea.selectionEnd ?? 0;
            const current = getValues("message") ?? "";

            const newValue = current.slice(0, start) + emoji + current.slice(end);
            setValue("message", newValue, { shouldValidate: true });

            // put cursor right after the inserted emoji
            const newPos = start + emoji.length;
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(newPos, newPos);
                resizeTextarea();
            }, 0);
        },
        [getValues, setValue]
    );
    useEffect(() => {
        if (!showEmojiPicker) return;

        const handler = (e: MouseEvent) => {
            if (
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(e.target as Node)
            ) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showEmojiPicker]);
    // Drag and drop state and handlers
    const [isDragging, setIsDragging] = useState(false);
    const dragCounterRef = useRef(0);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        try { (e.dataTransfer as DataTransfer).dropEffect = 'copy'; } catch {}
    };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current += 1;
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current -= 1;
        if (dragCounterRef.current <= 0) {
            setIsDragging(false);
        }
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current = 0;
        setIsDragging(false);
        try {
            // Pass the native event so caller can read dataTransfer.files
            onFileUpload?.(e.nativeEvent as unknown as Event);
        } catch {}
    };

    useEffect(() => {
        const onWindowDragLeave = () => {
            setIsDragging(false);
            dragCounterRef.current = 0;
        };
        window.addEventListener('dragleave', onWindowDragLeave);
        return () => window.removeEventListener('dragleave', onWindowDragLeave);
    }, []);

    const resizeTextarea = () => {
        const textarea = messageRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    };

    useEffect(() => {
            resizeTextarea();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [watch("message")]);

    const internalSubmit = (data: MessageForm) => {
        if (disabled) return;
        const text = (data.message ?? '').trim();
        if (!text) return; // guard against empty messages
        onSubmit({ message: text });
        // stop typing on submit
        try { onTyping?.(false); } catch {}
        typingLastStateRef.current = false;
        typingLastSentAtRef.current = Date.now();
        if (typingTimerRef.current) { try { clearTimeout(typingTimerRef.current); } catch {} typingTimerRef.current = null; }
        reset();
        setTimeout(() => resizeTextarea(), 0);
    };

    useEffect(() => {
        return () => {
            if (typingTimerRef.current) {
                try { clearTimeout(typingTimerRef.current); } catch {}
                typingTimerRef.current = null;
            }
        };
    }, []);

    return (
        <form
            data-testid="chat-form"
            onSubmit={handleSubmit(internalSubmit)}
            className="flex flex-col gap-2"
            aria-disabled={disabled}
        >
            <div className="flex text-black items-center w-full">
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) => onFileUpload?.(e.nativeEvent as unknown as Event)}
                />
                <label
                    htmlFor="fileInput"
                    className="text-gray-400 hover:text-gray-600 mr-3 cursor-pointer"
                >
                    {isUploading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    ) : (
                        <Paperclip size={20}/>
                    )}
                </label>
                <div
                    className={`relative flex-1 border rounded-lg overflow-hidden flex transition-colors ${
                        isDragging ? "border-dashed bg-blue-50 border-blue-400" : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {isDragging && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-blue-50/70 text-blue-700 text-sm">
                            {t("profileChat.dropFiles") || "Drop files to upload"}
                        </div>
                    )}
          <textarea
              data-testid="chat-input"
              {...rest}
              ref={(e) => {
                  ref(e);
                  messageRef.current = e;
              }}
              placeholder={
                  disabled
                      ? (disabledHint !== undefined ? disabledHint : (t("profileChat.userNotAvailable") || "This user is not available for messages."))
                      : (typingHint ? typingHint : (t("profileChat.typeMessageHere") || "Type a message..."))
              }
              className={`text-text_primary flex-1 px-3 py-2 resize-none focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto break-words whitespace-pre-wrap ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
              rows={1}
              disabled={disabled}
              onKeyDown={(e) => {
                  if (disabled) { e.preventDefault(); return; }
                  if ((e as any).isComposing) return; // respect IME composition
                  if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const form = e.currentTarget.closest("form");
                      if (form) form.requestSubmit();
                  }
              }}
              onFocus={() => { try { sendLatestRead(); } catch {} }}
              onClick={() => { try { sendLatestRead(); } catch {} }}
              onDrop={(e) => { e.preventDefault(); }}
              onChange={(e) => {
                  // keep RHF in sync
                  try { (rest as any).onChange?.(e); } catch {}
                  resizeTextarea();
                  if (disabled) return;
                  const val = (e.target as HTMLTextAreaElement).value;
                  const now = Date.now();
                  const isTyping = !!val && val.trim().length > 0;

                  try {
                      if (isTyping) {
                          const lastState = typingLastStateRef.current;
                          const elapsed = now - (typingLastSentAtRef.current || 0);
                          if (lastState !== true || elapsed >= TYPING_TRUE_THROTTLE_MS) {
                              onTyping?.(true);
                              typingLastStateRef.current = true;
                              typingLastSentAtRef.current = now;
                          }
                      } else {
                          // Don't immediately send typing=false here.
                          // Let the debounce timer below handle stop-typing to avoid flapping.
                      }
                  } catch {}

                  if (typingTimerRef.current) {
                      try { clearTimeout(typingTimerRef.current); } catch {}
                      typingTimerRef.current = null;
                  }
                  typingTimerRef.current = setTimeout(() => {
                      try {
                          const stillEmpty = !messageRef.current || (messageRef.current.value || '').trim().length === 0;
                          if (stillEmpty && typingLastStateRef.current !== false) {
                              onTyping?.(false);
                              typingLastStateRef.current = false;
                              typingLastSentAtRef.current = Date.now();
                          }
                      } catch {}
                  }, TYPING_STOP_DEBOUNCE_MS);
              }}
          />
                    <button
                        type="button"
                        className={`bg-white px-3 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                        disabled={disabled}
                        aria-disabled={disabled}
                    >
                        <Smile size={20}/>
                    </button>
                </div>

                <button
                    type="submit"
                    className={`ml-3 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:text-primary'}`}
                    disabled={disabled}
                    aria-disabled={disabled}
                >
                    <Send size={20}/>
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
