import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { useAgentStore } from "@/stores/agentStore";
import { useParams, useNavigate } from "react-router-dom";
import { WhisperService } from "@/lib/whisperService";

const whisperService = new WhisperService(process.env.OPENAI_API_KEY || "");

export default function MobileInput() {
  const [message, setMessage] = useState("");
  const [port, setPort] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [processingFile, setProcessingFile] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [debugMessages, setDebugMessages] = useState<string[]>([]);
  const isResponding = useAgentStore((state) => state.isResponding);

  const setInputMode = useAgentStore((state) => state.setInputMode);
  const { port: urlPort } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (urlPort && urlPort.length === 6 && /^\d+$/.test(urlPort)) {
      setPort(urlPort);
    }
  }, [urlPort]);

  useEffect(() => {
    setInputMode("mobile");
    return () => setInputMode("desktop");
  }, [setInputMode]);

  const addDebugMessage = (message: string) => {
    setDebugMessages((prev) => [...prev.slice(-10), message]);
  };

  const startRecording = async () => {
    try {
      addDebugMessage("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 32000,
        },
      });

      const allTypes = [
        "audio/webm",
        "audio/webm;codecs=opus",
        "audio/ogg",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "audio/mp4;codecs=mp4a",
        "audio/aac",
        "audio/mpeg",
      ];

      const supportedTypes = allTypes.filter((type) => {
        const isSupported = MediaRecorder.isTypeSupported(type);
        addDebugMessage(`${type}: ${isSupported ? "✓" : "✗"}`);
        return isSupported;
      });

      const preferredOrder = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "audio/mp4",
        "audio/aac",
        "audio/mpeg",
      ];

      const mimeType = preferredOrder.find((type) =>
        supportedTypes.includes(type)
      );

      if (!mimeType) {
        throw new Error("No supported audio MIME types found");
      }

      addDebugMessage(`Selected MIME type: ${mimeType}`);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.start(1000);
      setIsRecording(true);
      addDebugMessage("Recording started with 1-second chunks");

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          addDebugMessage(
            `Chunk received: ${event.data.size} bytes, type: ${event.data.type}`
          );
        }
      };

      mediaRecorder.onstop = async () => {
        addDebugMessage("Creating final audio blob...");
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });
        addDebugMessage(
          `Final blob: ${audioBlob.size} bytes, type: ${audioBlob.type}, chunks: ${audioChunksRef.current.length}`
        );

        try {
          setProcessingFile(mimeType);
          const buffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(
            String.fromCharCode(...new Uint8Array(buffer))
          );
          addDebugMessage(`Converted to base64, length: ${base64Audio.length}`);

          const result = await whisperService.transcribeAudio(
            new Blob([buffer], { type: mimeType }),
            mimeType
          );
          console.log("Transcription result:", result);

          if (result.trim()) {
            setMessage(result.trim());
            const aiResponse = await whisperService.client.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: result.trim() }],
            });
            setMessage(aiResponse.choices[0].message.content);
          } else {
            console.log("Failed to transcribe audio");
          }
        } catch (error) {
          console.error("Failed to process audio:", error);
          console.log("Failed to process audio");
        } finally {
          setProcessingFile("");
        }

        stream.getTracks().forEach((track) => track.stop());
      };
    } catch (error) {
      addDebugMessage(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePortSubmit = (input: string) => {
    if (input.length === 6 && /^\d+$/.test(input)) {
      navigate(`/mobile-input/${input}`);
      setPort(input);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && port) {
      try {
        // Implement sendMessage functionality here
        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleDisconnect = () => {
    setPort("");
    navigate("/mobile-input");
  };

  const getStatusMessage = () => {
    if (isRecording) return "Recording...";
    if (processingFile) return `Processing file as ${processingFile}...`;
    if (isResponding) return "Agent is responding...";
    return "Tap microphone to start recording";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!port ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-wii-blue mb-4">
            Enter Port Number
          </h1>
          <form
            className="w-full max-w-sm space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements[0] as HTMLInputElement)
                .value;
              handlePortSubmit(input);
            }}
          >
            <Input
              type="text"
              placeholder="Enter 6-digit port number"
              className="text-center text-2xl tracking-wider"
              maxLength={6}
              pattern="\d{6}"
            />
            <Button
              type="submit"
              className="w-full bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
            >
              Connect
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
            <div>
              <span className="text-sm text-gray-500">Connected to port: </span>
              <span className="font-mono font-bold">{port}</span>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="ghost"
              className="text-gray-600 hover:text-red-600"
            >
              Disconnect
            </Button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-lg font-medium mb-2">
                {isRecording ? "Microphone Recording" : "Microphone Muted"}
              </div>
              <button
                className={`w-32 h-32 rounded-full transition-colors flex items-center justify-center
                  ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-300"
                      : "bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
                  }`}
                onClick={toggleRecording}
                disabled={isResponding}
              >
                <Mic
                  className={`w-16 h-16 ${isRecording ? "animate-bounce" : ""}`}
                />
              </button>

              <div className="text-center text-gray-600 font-medium">
                {getStatusMessage()}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!message.trim()}
                className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
