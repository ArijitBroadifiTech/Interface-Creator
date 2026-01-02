import { useState } from "react";
import JSON5 from "json5";

type InterfaceShape = Record<string, string>;
type InterfaceMap = Record<string, InterfaceShape>;

function App() {
  const [comment, setComment] = useState("");
  const [interfaceOutput, setInterfaceOutput] = useState("");

  function capitalizeFirstLetter(val: string): string {
    if (!val) return "";
    return val.charAt(0).toUpperCase() + val.slice(1);
  }

  function recursive(
    data: unknown,
    interfaces: InterfaceMap
  ): InterfaceShape {
    const result: InterfaceShape = {};

    if (typeof data !== "object" || data === null) return result;

    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        const interfaceName = capitalizeFirstLetter(key);

        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
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

  function generateInterface(
    name: string,
    obj: InterfaceShape
  ): string {
    const fields = Object.entries(obj)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join("\n");

    return `interface ${name} {\n${fields}\n}`;
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

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
    } catch {
      alert("Invalid input format");
    }
  };

  return (
    <div className="p-5 w-full grid grid-cols-2 gap-8">
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="comment-area" className="font-bold text-blue-700">
            Enter your data
          </label>

          <textarea
            id="comment-area"
            value={comment}
            onChange={handleChange}
            rows={25}
            placeholder="Paste JSON / JSON5 here..."
            className="bg-gray-200 p-2 rounded-2xl"
          />

          <button
            type="submit"
            className="bg-blue-600 p-2 rounded-2xl text-lg font-semibold text-white"
          >
            Generate Interfaces
          </button>
        </form>
      </div>

      <div className="flex flex-col space-y-4">
        <label htmlFor="result-area" className="font-bold text-green-700">
          Generated TypeScript Interfaces
        </label>

        <textarea
          id="result-area"
          rows={25}
          value={interfaceOutput}
          readOnly
          className="bg-gray-100 p-3 rounded-xl font-mono"
        />
      </div>
    </div>
  );
}

export default App;
