import React from 'react'
import { date } from 'zod'

const Document = () => {
  return (
    <div className="bg-gray-100 size-full p-3">
      <div className="flex space-x-3 size-full">
        <div className="w-1/2 bg-white rounded-md shadow-lg p-2">
          <InputForm />
        </div>
        <div className="w-1/2 bg-white rounded-md shadow-lg p-2">
          <Resume />
        </div>
      </div>
    </div>
  );
}

// React Hook Form
function InputForm () {


  return (
    <div>
      Form
    </div>
  );
}

function Resume () {
  return (
    <div>
      Resume Renderer
    </div>
  )
}

export default Document