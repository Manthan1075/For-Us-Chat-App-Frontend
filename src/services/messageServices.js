import axios from "axios";

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/messages`;

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendMessage = async ({
  text,
  receiver,
  isHighlighted,
  repliedOf,
  image,
  userid,
}) => {
  try {
    const formdata = new FormData();
    formdata.append(text);
    formdata.append(receiver);
    if (isHighlighted) formdata.append(isHighlighted);
    if (repliedOf) formdata.append(repliedOf);
    if (image) formdata.append(image);

    const response = await axios.post(`${BACKEND_URL}/send-message`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
        userId: userid,
      },
    });
    return response.data || null;
  } catch (error) {
    console.error("Error While Send Message :", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const editMessage = async ({ text, messageId, userId }) => {
  try {
    const response = await api.put(
      `/edit-message/${messageId}`,
      {
        text,
      },
      {
        headers: {
          userid: userId,
        },
      }
    );
    return response.data || null;
  } catch (error) {
    console.error("Error While Edit Message : ", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const deleteMessage = async ({ messageId, userId }) => {
  try {
    const response = await api.delete(`/delete-message/${messageId}`, {
      headers: {
        userid: userId,
      },
    });
    return response.data || null;
  } catch (error) {
    console.error("Error While Delete Message : ", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const getMessages = async ({
  page = 1,
  limit = 25,
  isOnlyHighlighted,
  date,
  userId,
}) => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (isOnlyHighlighted !== undefined) {
      queryParams.append("isOnlyHighlighted", isOnlyHighlighted);
    }

    if (date) {
      queryParams.append("date", date);
    }

    const response = await api.get(`/get-messages?${queryParams.toString()}`, {
      headers: {
        userid: userId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error While Get Messages : ", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const markAsSeen = async ({ senderId, userid }) => {
  try {
    const response = await api.put(
      "/mark-as-seen",
      {
        senderId,
      },
      {
        Headers: {
          userid: userid,
        },
      }
    );
    return response.data || null;
  } catch (error) {
    console.error("Error While Mark Message As Seen : ", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const reactOnMessage = async ({
  senderId,
  reaction,
  messageId,
  userId,
}) => {
  try {
    const response = await api.put(
      `/react-on-message/${messageId}`,
      {
        senderId,
        reaction,
      },
      {
        headers: {
          userid: userId,
        },
      }
    );
    return response.data || null;
  } catch (error) {
    console.error("Error While React On Message : ", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const toggleHighlightMsg = async ({ messageId, userId }) => {
  try {
    const response = await api.put(`/toggle-highlight/${messageId}`, {
      Headers: {
        userid: userId,
      },
    });
    return response.data || null;
  } catch (error) {
    console.error("Error While Highlight Message : ", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};
