import axios from "axios";
export const generateOtp = async (baseAddress,form) => {
    const { data } = await axios.post(`${baseAddress}/generate-otp`, form);
    if (!data.success) {
        throw new Error(data.error);
    }
    return data;
}

export const verifyEmail=async(baseAddress,userId,inputOtp)=>{
    const {data}=await axios.post(`${baseAddress}/verify-email`,{userId,inputOtp});
    return data.success;
}

export const requestRegistrationOptions=async (baseAddress,userId)=>{
    const {data}=await axios.post(`${baseAddress}/generate-registration-options`,{_id:userId});
    if(!data.success)throw new Error(data.error);
    return data.registrationOptions;
}

export const verifyAttResp=async(baseAddress,userId,attResp)=>{
    const data=await axios.post(`${baseAddress}/verify-attresp`,{userId,attResp});
    return data;
}


//login page related helpers

export const getAuthenticationOptions=async(baseAddress,email)=>{
    const {data}=await axios.post(`${baseAddress}/generate-authentication-options`,{userEmail:email});
    return data;
}