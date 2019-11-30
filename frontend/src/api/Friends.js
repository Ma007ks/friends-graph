const queue = require("async-delay-queue");
const VK = window.VK;

const API_VERSION = "5.73";


/*
    Возвращает списком данных пользователей по списку id
*/
let users_get = async (list_ids) => {
    let api_request = (resolve, reject) => {
        VK.api("users.get", { "user_ids": list_ids, "v": API_VERSION, 'fields': ['photo_200'] },
            function (data) {
                resolve(data.response);
            },
            (rejected_resp) => reject(rejected_resp));
    };

    return await queue.delay(() => new Promise(api_request), 100);
};

/*
    Возвращает друзей пользователя
*/
let friends_get = async (id, idsOnly) => {
    let params = { "user_id": id, "v": API_VERSION, "fields": [] };
    if (!idsOnly) {
        params['fields'].push('photo_200');
    }
    let api_request = (resolve, reject) => {
        VK.api("friends.get", params,
            (data) => data.response ? resolve(data.response.items) : resolve([]),
            (rejected_resp) => reject(rejected_resp))
    };
    return await queue.delay(() => new Promise(api_request), 100);
};


let vkscript_execute = async (code) => {
    let params = { "v": API_VERSION, "code": code };
    let api_request = (resolve, reject) => {
        VK.api("execute", params,
            (data) => data.response ? resolve(data.response) : resolve([]),
            (rejected_resp) => reject(rejected_resp))
    };
    return await queue.delay(() => new Promise(api_request), 100);
};

export { users_get, friends_get, vkscript_execute };
