function passwordStorng(password) {
    let strength = 0;

    //If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
        strength += 1;
    }
    //If it has numbers and characters
    if (password.match(/([0-9])/)) {
        strength += 1;
    }

    //If it has one special character
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
        strength += 1;
    }

     //If password is greater than 7
     if (password.length >= 6) {
        strength += 1;
     }

     // 
     if(!password.trim()){
        return
     }
     if(strength <=2){
        return {
            status: 'weak',
            statusClass: 'text-red-500 ',
            class: 'bg-red-500 w-10 h-1' 
        }
     }
     if(strength ===3){
        return {
            status: 'medium',
            statusClass: 'text-yellow-500 ',
            class: 'bg-yellow-500 w-64 h-1 mt-1' 
        }
     }
     if(strength ===4){
        return {
            status: 'strong',
            statusClass: 'text-green-500 ',
            class: 'bg-green-500 w-auto h-1 mt-1' 
        }
     }
}
export default passwordStorng