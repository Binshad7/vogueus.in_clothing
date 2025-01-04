import { createContext, useState } from "react";


export const SideBarContext = createContext();

function SideBarProvider({ children }) {

  const [isToogle, setToogle] = useState(true);
  const updateToogle = () => {
    setToogle(!isToogle)
  }   
  return (
    <SideBarContext.Provider value={{isToogle,updateToogle}}>
      {children}
    </SideBarContext.Provider>
  )
}

export default SideBarProvider;