import React, { useState } from 'react'
import { createContext } from 'react'
const DriverDataContext=createContext();
function DriverContext({children}) {
    const [driver , setDriver]=useState({
      email:'',
    fullName:{
      firstName:'',
      lastName:''
    }
    });
  return (
    <DriverDataContext.Provider value={{driver , setDriver}}>
      {children}
    </DriverDataContext.Provider>
  )
}

export default DriverContext
export {DriverDataContext}
