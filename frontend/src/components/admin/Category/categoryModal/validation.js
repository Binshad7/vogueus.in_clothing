export function validateCategory({name, description}){
    name = name.trim()
    description = description.trim()

    let isValid = true;
    let Regex = /^[a-zA-Z\s]+$/
    let error ={
        name:null,
        description:null
    } 

    if(!Regex.test(name)){
        console.log("working")
        error.name = "name shouldnt have any special charecter";
        isValid = false
    }
    
    if(!Regex.test(description)){
        error.description = "description shouldnt have any special charecter";
        isValid = false
    }

    if(!name){
        error.name = "enter anything"
        isValid = false
    }
    if(!description){
        error.description = "enter anything"
        isValid = false
    }

    if(isValid){
        error.name = null
        error.description = null
    }
    return error
}