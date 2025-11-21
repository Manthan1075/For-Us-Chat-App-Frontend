import axios from "axios";

const BACKEND_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1/users`;

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createUser = async ({ username, password, userId }) => {
  try {
    const response = await api.post("/register", {
      username,
      password,
      userId,
    });

    return response?.data || null;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const loginUser = async ({ username, password }) => {
  try {
    
    const response = await api.post("/login", {
      username,
      password,
    
    });

    console.log("Response At user Services : ",response);

    return response?.data || null;
  } catch (error) {
    console.error(
      "Error While Login User :",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const fetchProfile = async (userId) => {
  try {
    const response = await api.get(`/get-profile/${userId}`);
    return response.data || null;
  } catch (error) {
    console.log("Error While Fetch Profile :", error);
    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const fetchAllUsers = async (userId) => {
  try {
    const response = await api.get("/get-all-users", {
      headers: {
        userid: userId,
      },
    });
    return response.data || null;
  } catch (error) {
    console.error("Error While Fetch All User Profile :", error);
    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const editProfile = async ({ userId, username, bio, profilePhoto }) => {
  try {
    const formData = new FormData();

    if (username) formData.append("username", username);
    if (bio) formData.append("bio", bio);

    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    const response = await axios.post(
      `${BACKEND_URL}/update-profile/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data || null;
  } catch (error) {
    console.error("Error While Update Profile: ", error);

    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const toggleNotification = async (userId) => {
  try {
    const response = await api.put(`/toggle-notification/${userId}`);
    return response.data || null;
  } catch (error) {
    console.error("Error While While Toggle Notification :", error);
    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/delete-user/${userId}`);
    return response.data || null;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const changePassword = async ({ oldPassword, newPassword, userId }) => {
  try {
    const response = await api.put(`/change-password/${userId}`, {
      oldPassword,
      newPassword,
    });
    return response.data || null;
  } catch (error) {
    console.error("Error While Changing Password : ", error);
    return {
      success: false,
      error: error.response?.data?.message || "Something went wrong",
    };
  }
};
