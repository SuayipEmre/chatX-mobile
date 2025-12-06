import api from "./api";

export const fetchMessagesByChatId = async (chatId: string) => {

    try {
        const res = await api.get('/messages/' + chatId);
        console.log('res : ', res);

        return res.data.data;
    } catch (error) {
        return null
    }

}

export const sendMessage = async (chatId: string, content: string) => {
    try {
        const res = await api.post("/messages", {
            chatId,
            content,
        });
        return res.data.data;
    } catch (error) {
        console.log("sendMessage error:", error);
        throw error;
    }
};