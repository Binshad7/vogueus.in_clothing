import { toast } from "react-toastify";
import userAxios from "./userAxios";
async function emailVerification(userData, resend = null) {
    console.log('hit the email verification state 1');

    try {
        console.log('hit the email verification state 2');

        const { email, userName } = userData;
        console.log("emailVerification -> email", email)
        if (resend) {
            console.log("resend", resend)
            const response = await userAxios.post("/email-resendcode", { email, userName })
            localStorage.setItem('otp', JSON.stringify(response.data.otp));
            return true;
        }
        console.log("emailVerification not resend")
        const response = await userAxios.post("/email-verification", { email, userName })
        return true;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Some thing wrong while sending email verification");
        return false;
    }


}

export default emailVerification;