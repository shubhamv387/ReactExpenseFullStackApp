import axios from 'axios';

export const getUserData = async (token) => {
  try {
    const { data } = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${
        import.meta.env.VITE_FIREBASE_API_KEY
      }`,
      { idToken: token }
    );

    return {
      displayName: data.users[0].displayName,
      email: data.users[0].email,
      photoUrl: data.users[0].photoUrl,
    };
  } catch (error) {
    const errMsg = error.response.data.error.message || error.message;
    alert(errMsg);
    console.log(error);
  }
};
