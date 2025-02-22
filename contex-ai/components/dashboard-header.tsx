import { Button } from "@/components/ui/button";
import { Github, Code } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg">
      <h1 className="text-2xl font-bold">AI-Native Component Dashboard</h1>
      <div className="flex space-x-2">
        <Button variant="outline" className="flex items-center bg-gray-800 text-white border-gray-600 hover:bg-purple-800">
          <Code className="mr-2 h-4 w-4" />
          VSCode
        </Button>
        <Button variant="outline" className="flex items-center bg-gray-800 text-white border-gray-600 hover:bg-purple-800">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </header>
  );
}
