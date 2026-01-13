import { useState } from "react";
import JSON5 from "json5";
import { Copy } from "lucide-react";
import { Editor, type Monaco } from "@monaco-editor/react";
import { toast, Toaster } from "sonner";

type InterfaceShape = Record<string, string>;
type InterfaceMap = Record<string, InterfaceShape>;

function App() {
  const [comment, setComment] = useState("");
  const [interfaceOutput, setInterfaceOutput] = useState("");
  const [copyResultState, setCopyResultState] = useState(false);

  function handleEditorWillMount(monaco: Monaco) {
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "569CD6" },
        { token: "type.identifier", foreground: "4EC9B0" },
      ],
      colors: {
      "editor.background": "#020617", // slate-950
      "editor.lineHighlightBackground": "#0f172a",
      "editorCursor.foreground": "#38bdf8",
      },
    });
  }

  //Capitalize the Interface name
  function capitalizeFirstLetter(val: string): string {
    if (!val) return "";
    return val.charAt(0).toUpperCase() + val.slice(1);
  }

  //The main function which will convert JSON to Interface data
  function recursive(data: unknown, interfaces: InterfaceMap): InterfaceShape {
    const result: InterfaceShape = {};

    if (typeof data !== "object" || data === null) return result;

    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        const interfaceName = capitalizeFirstLetter(key);

        if (Array.isArray(value)) {
          if (
            value.length > 0 &&
            typeof value[0] === "object" &&
            value[0] !== null
          ) {
            result[key] = `${interfaceName}[]`;
            interfaces[interfaceName] = recursive(value[0], interfaces);
          } else {
            result[key] = `${typeof value[0]}[]`;
          }
        } else {
          result[key] = interfaceName;
          interfaces[interfaceName] = recursive(value, interfaces);
        }
      } else {
        result[key] = typeof value;
      }
    });

    return result;
  }

  //Convert the Object data to String format to show in the output text area
  function generateInterface(name: string, obj: InterfaceShape): string {
    const fields = Object.entries(obj)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join("\n");

    return `interface ${name} {\n${fields}\n}`;
  }

  //Reflect the changes in input box
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  //After click the Generate button
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const parsed = JSON5.parse(comment);

      const interfaces: InterfaceMap = {};
      interfaces.RootObject = recursive(parsed, interfaces);

      const formatted = Object.entries(interfaces)
        .map(([name, shape]) => generateInterface(name, shape))
        .join("\n\n");

      setInterfaceOutput(formatted);
    }  catch (error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message);
    // console.log(error.message);
    
  } else {
    toast.error("Something went wrong");
    // console.error(error);
  }}
}

  const handleCopyText = () => {
    setCopyResultState(true);
    window.navigator.clipboard.writeText(interfaceOutput);

    setTimeout(() => {
      setCopyResultState(false);
    }, 1500);
  };

  return (
    <div className=" bg-gray-800">
      <div className="p-5 w-full grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-8 h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 h-10/12 min-h-80"
        >
          <label 
            htmlFor="input-area"
            className="font-bold text-blue-500 text-base lg:text-lg"
          >
            Enter your data
          </label>

          <textarea
            id="input-area"
            value={comment}
            onChange={handleChange}
            // rows={25}
            placeholder="Paste JSON / JSON5 here..."
            className="bg-gray-900 text-gray-100  p-2 rounded-2xl h-full shadow-md border border-gray-600"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="p-2 rounded-2xl text-base lg:text-lg font-semibold text-white bg-linear-to-r from-sky-700 via-blue-500 to-indigo-600 shadow-lg border border-sky-400 hover:scale-101"
          >
            Generate Interfaces
          </button>
        </form>

        {/* Output Layout */}
        <div className="relative">
          <div className="flex flex-col space-y-3 h-10/12">
            <label
              htmlFor="result-area"
              className="font-bold text-green-500 text-base lg:text-lg"
            >
              Generated TypeScript Interfaces
            </label>

            {/* <textarea
              id="result-area"
              // rows={25}
              value={interfaceOutput}
              readOnly
              className="bg-slate-900 text-white  p-3 rounded-xl font-mono h-full shadow-lg border border-gray-600"
            /> */}

            {/* Monaco editor */}
            <div className="rounded-xl overflow-auto border border-gray-600 shadow-lg bg-slate-900 h-full">
              <Editor
                height="100%"
                language="typescript"
                theme="custom-dark"
                value={interfaceOutput}
                beforeMount={handleEditorWillMount}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 16,
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
          
           {/* Copy Button */}
          { interfaceOutput && <div className="z-10 bg-blue-100 border rounded-lg border-blue-300 shadow-xl w-fit px-2 lg:px-3 py-1 lg:py-2 absolute right-0 lg:right-5 top-0 md:top-5 hover:scale-101 focus:outline-2">
              <button
                onClick={handleCopyText}
                className="flex space-x-2 items-center"
              >
                <Copy
                  className={`w-4 h-4 ${
                    copyResultState ? "text-green-700" : "text-gray-800"
                  } `}
                />
                <span
                  className={`text-md ${
                    copyResultState ? "text-green-700" : "text-gray-800"
                  }`}
                >
                  {copyResultState ? "Copied to clipboard!" : "Copy Code"}
                </span>
              </button>
            </div>}

        </div>
      </div>

     

      <Toaster 
       position="top-center" />
    </div>
  );
}

export default App;
