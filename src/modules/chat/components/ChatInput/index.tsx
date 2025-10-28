"use client";

import {Paperclip, Send, Smile} from "lucide-react";
import React, {useEffect, useRef} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

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
    const {register, handleSubmit, reset, watch} = useForm<MessageForm>();
    const messageRef = useRef<HTMLTextAreaElement | null>(null);

    const {ref, ...rest} = register("message");
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

    const typingLastSentAtRef = useRef<number>(0);
    const typingLastStateRef = useRef<boolean | null>(null);
    const TYPING_TRUE_THROTTLE_MS = 5000; // 5 seconds throttle for typing=true
    const TYPING_STOP_DEBOUNCE_MS = 1500; // stop-typing debounce

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
        onSubmit(data);
        // stop typing on submit
        try { onTyping?.(false); } catch {}
        typingLastStateRef.current = false;
        typingLastSentAtRef.current = Date.now();
        if (typingTimerRef.current) { try { clearTimeout(typingTimerRef.current); } catch {} typingTimerRef.current = null; }
        reset();
        setTimeout(() => resizeTextarea(), 0);
    };

    return (
        <form
            data-testid="chat-form"
            onSubmit={handleSubmit(internalSubmit)}
            className="flex flex-col gap-2"
            aria-disabled={disabled}
        >
            <div className="flex items-center w-full">
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) => onFileUpload?.(e as unknown as Event)}
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
                <div className="flex-1 border rounded-lg overflow-hidden flex">
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
              className={`text-text-primary flex-1 px-3 py-2 resize-none focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto break-words whitespace-pre-wrap ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
              rows={1}
              disabled={disabled}
              onKeyDown={(e) => {
                  if (disabled) { e.preventDefault(); return; }
                  if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const form = e.currentTarget.closest("form");
                      if (form) form.requestSubmit();
                  }
              }}
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
                          if (typingLastStateRef.current !== false) {
                              onTyping?.(false);
                              typingLastStateRef.current = false;
                              typingLastSentAtRef.current = now;
                          }
                      }
                  } catch {}

                  if (typingTimerRef.current) {
                      try { clearTimeout(typingTimerRef.current); } catch {}
                      typingTimerRef.current = null;
                  }
                  typingTimerRef.current = setTimeout(() => {
                      try {
                          if (typingLastStateRef.current !== false) {
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
