import React from 'react'

function FormInput({type,name,value,onChange,placeholder,className}) {
 const InputHnadle =(e)=>{
    onChange(e)
 }
  return (
   <input 
   type={type} 
   name={name}
   value={value}
   onChange={InputHnadle}
   placeholder={placeholder}
   className={className}
   />
  )
}

export default React.memo(FormInput)
