import { toast } from "react-toastify";
import userAxios from "./userAxios";
async function emailVerification(userData, resend = null) {
    try {
        const { email, userName } = userData;
        if (resend) {

        const response = await userAxios.post("/email-resendcode", { email, userName });
        toast.success(response?.data?.message)
            return true;
        }
        const response = await userAxios.post("/email-verification", { email, userName })
        toast.success(response.data.message)
        return response.data.success || true;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Some thing wrong while sending email verification");
        return error?.response?.data?.success || false;
    }
}

export default emailVerification;