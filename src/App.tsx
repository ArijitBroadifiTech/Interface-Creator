import { useState } from "react"
import JSON5 from 'json5'

function App() {
 
const [comment, setComment] = useState('');
const [interfaceOutput, setInterfaceOutput] = useState('');


function capitalizeFirstLetter(val: string){
  if(!val) return ''

  return val.charAt(0).toLocaleUpperCase() + val.slice(1)
}

// console.log(Object.entries(oldData));


let finalArray : any[]

const recursive = (data: unknown)=>
  {
    const result = Object.entries(data as Record<string, unknown>).reduce((acc: Record<string, unknown>, [key, value]) => 
    {
      if(typeof value === 'object' ){

          if(Array.isArray(value))
          {
          if((typeof value[0])=== 'object'){
            acc[key] =  capitalizeFirstLetter(key) + '[]'
            finalArray.push(recursive(value[0]))
          }else{
            acc[key] = typeof value[0] + '[]'
          }
            
          }
          else
          {
            acc[key] = capitalizeFirstLetter(key)
            finalArray.push(recursive(value))
          }
      }
      else
      {
        acc[key] = typeof value;
      }
      

      return acc;
    }, {});

    
    return result
}


  // const result = recursive(data);
  // finalArray.push(result)
  // console.log("Final Array",finalArray);

  //showing result in console
  
function generateInterface(
  name: string,
  obj: Record<string, string>
): string {
  const fields = Object.entries(obj)
    .map(([key, value]) => {
      return `  ${key}: ${value};`;
    })
    .join('\n');

  return `interface ${name} {\n${fields}\n}`;
}

function  formatResult(){
  const errorInterface = generateInterface('Error', finalArray[0]);
  const rootInterface = generateInterface('RootObject', finalArray[1]);

  const interfaceText = `${rootInterface}\n\n${errorInterface}`;
  setInterfaceOutput(interfaceText);


}

const handleChange = (event:  React.ChangeEvent<HTMLTextAreaElement>) => {  
  setComment(event.target.value);
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  finalArray = [];
  
  try{
    const parsed = JSON5.parse(comment)
    const result = recursive(parsed);
    finalArray.push(result)

    //Print in console
    console.log("Final Array",finalArray);

    formatResult()
  }catch{
    alert("Invalid input format")
  }
   
}

const handleResultChange = (event:  React.ChangeEvent<HTMLTextAreaElement>)=> {
  setInterfaceOutput(event.target.value)
}

  return (
    <>
     <div className="p-5 w-full grid grid-cols-2 gap-8 ">
     <div >
       <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label htmlFor="comment-area" className="font-bold text-blue-700">Enter your data</label>
        <textarea
          id="comment-area"
          value={comment}
          onChange={handleChange}
          rows={20}         
          placeholder="Type your data here..."
          className="bg-gray-200 p-2 rounded-2xl"
        />
        <button type="submit" className="bg-blue-600 p-2 rounded-2xl text-lg font-semibold text-white">Result</button>      
      </form>
     </div>

      <div className="flex flex-col space-y-4">
        <label htmlFor="result-area" className="font-bold text-green-700">Your expected Interface</label>
          <textarea 
          id="result-area"
          rows={20}
          value={interfaceOutput}
          onChange={handleResultChange}
          className="bg-gray-100 p-3 rounded-xl font-mono"
      />
      </div>
      
      </div>
    </>
  );
}

export default App;
