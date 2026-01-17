import axios from "axios";

const BACKEND_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1/messages`;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendMessage = async ({
  text,
  receiver,
  repliedOf,
  userid,
}) => {
  try {
    const body = {
      text,
      receiver,
    };
    if (repliedOf) {
      body.repliedOf = repliedOf;
    }

    const response = await api.post(`/send-message`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          userid: userid,
        },
      }
    );

    return response.data || null;
  } catch (error) {
    console.error("Error While Send Message :", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const editMessage = async ({ text, messageId, userId }) => {

  try {
    const response = await api.put(
      `/edit-message/${messageId}`,
      { text },
      {
        headers: {
          "Content-Type": "application/json",
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
  senderId,
  before,
  after
}) => {
  try {
    if (!senderId) {
      throw new Error("senderId is required");
    }
    if (!userId) {
      throw new Error("userId is required");
    }

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    
    if (after) {
      queryParams.append("after", after);
    }
    if (before) {
      queryParams.append("before", before);
    }

    if (isOnlyHighlighted !== undefined) {
      queryParams.append("isOnlyHighlighted", isOnlyHighlighted);
    }
    if (date) {
      queryParams.append("date", date);
    }

    const response = await api.get(
      `/get-messages/${senderId}?${queryParams.toString()}`,
      {
        headers: {
          userid: userId,
        },
      }
    );

    return response.data || null;
  } catch (error) {
    console.error("Error While Get Messages : ", error);
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Something went wrong",
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

    const response = await api.put(
      `/toggle-highlight/${messageId}`,
      {},
      {
        headers: {
          userid: userId,
        },
      }
    );
    return response.data || null;
  } catch (error) {
    console.error("Error While Highlight Message : ", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const sendImage = async ({ receiverId, image, userId }) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("receiverId", receiverId);
    const response = await axios.post(
      `${BACKEND_URL}/send-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          userid: userId,
        },
      }
    );
    return response.data || null;
  } catch (error) {
    console.log("Error While Send Image :", error)
    return error.message
  }
}

export const sendDrawing = async ({ receiverId, image, userId }) => {
  try {
    const payload = {
      image,
      receiverId,
    };
    const response = await axios.post(
      `${BACKEND_URL}/send-drawing`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          userid: userId,
        },
      }
    );
    return response.data || null;
  } catch (error) {
    console.log("Error While Send Drawing :", error)
    return error.message;
  }
}

