import axios from 'axios';
import { toast } from 'react-toastify';

export const getUserData = (token) => {
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${
      import.meta.env.VITE_FIREBASE_API_KEY
    }`,
    { idToken: token }
  );
};

export const updateProfile = (formData, token) => {
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${
      import.meta.env.VITE_FIREBASE_API_KEY
    }`,
    { ...formData, idToken: token }
  );
};

export const sendEmailVerificationCode = (token) => {
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${
      import.meta.env.VITE_FIREBASE_API_KEY
    }`,
    { requestType: 'VERIFY_EMAIL', idToken: token }
  );
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const { data } = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${
        import.meta.env.VITE_FIREBASE_API_KEY
      }`,
      { requestType: 'PASSWORD_RESET', email: email }
    );

    // console.log(data);

    return { success: true, data };
  } catch (error) {
    const errMsg =
      error.response?.data?.error?.message ||
      error.message ||
      'Failed to send password reset email!';
    toast.error(errMsg);
    console.log(error);
    return { success: false, errMsg };
  }
};

// export const verifyEmail = async (code) => {
//   try {
//     const { data } = await axios.post(
//       `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${
//         import.meta.env.VITE_FIREBASE_API_KEY
//       }`,
//       { oobCode: code }
//     );

//     return { success: true, data };
//   } catch (error) {
//     const errMsg = error.response.data.error.message || error.message;
//     alert(errMsg);
//     console.log(error);
//     return { success: false, errMsg };
//   }
// };
