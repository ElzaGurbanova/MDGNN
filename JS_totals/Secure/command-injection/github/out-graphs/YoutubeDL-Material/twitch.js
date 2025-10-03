const config_api = require('./config');
const logger = require('./logger');
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');
const getCommentsForVOD = async function (clientID, clientSecret, vodId) {
    const v72 = require('util');
    const promisify = v72.promisify;
    const child_process = require('child_process');
    const v73 = child_process.exec;
    const exec = promisify(v73);
    const v74 = clientID.match(/^[0-9a-z]+$/);
    const v75 = !v74;
    const v76 = clientSecret.match(/^[0-9a-z]+$/);
    const v77 = !v76;
    const v78 = v75 || v77;
    const v79 = vodId.match(/^[0-9a-z]+$/);
    const v80 = !v79;
    const v81 = v78 || v80;
    if (v81) {
        const v82 = logger.error('Client ID, client secret, and VOD ID must be purely alphanumeric. Twitch chat download failed!');
        v82;
        return null;
    }
    const v83 = `tcd --video ${ vodId } --client-id ${ clientID } --client-secret ${ clientSecret } --format json -o appdata`;
    const v84 = [
        0,
        1,
        2
    ];
    const v85 = { stdio: v84 };
    const result = await exec(v83, v85);
    const v86 = result['stderr'];
    if (v86) {
        const v87 = `Failed to download twitch comments for ${ vodId }`;
        const v88 = logger.error(v87);
        v88;
        const v89 = result['stderr'];
        const v90 = logger.error(v89);
        v90;
        return null;
    }
    const v91 = `${ vodId }.json`;
    const temp_chat_path = path.join('appdata', v91);
    const raw_json = fs.readJSONSync(temp_chat_path);
    const v92 = raw_json.comments;
    const v103 = comment_obj => {
        const v93 = comment_obj.content_offset_seconds;
        const v94 = comment_obj.content_offset_seconds;
        const v95 = convertTimestamp(v94);
        const v96 = comment_obj.commenter;
        const v97 = v96.name;
        const v98 = comment_obj.message;
        const v99 = v98.body;
        const v100 = comment_obj.message;
        const v101 = v100.user_color;
        const v102 = {};
        v102.timestamp = v93;
        v102.timestamp_str = v95;
        v102.name = v97;
        v102.message = v99;
        v102.user_color = v101;
        return v102;
    };
    const new_json = v92.map(v103);
    const v104 = fs.unlinkSync(temp_chat_path);
    v104;
    return new_json;
};
const getTwitchChatByFileID = async function (id, type, user_uid, uuid, sub) {
    const usersFileFolder = config_api.getConfigItem('ytdl_users_base_path');
    const subscriptionsFileFolder = config_api.getConfigItem('ytdl_subscriptions_base_path');
    let file_path = null;
    if (user_uid) {
        if (sub) {
            const v105 = sub.isPlaylist;
            let v106;
            if (v105) {
                v106 = 'playlists';
            } else {
                v106 = 'channels';
            }
            const v107 = sub.name;
            const v108 = `${ id }.twitch_chat.json`;
            file_path = path.join(usersFileFolder, user_uid, 'subscriptions', v106, v107, v108);
        } else {
            const v109 = `${ id }.twitch_chat.json`;
            file_path = path.join(usersFileFolder, user_uid, type, v109);
        }
    } else {
        if (sub) {
            const v110 = sub.isPlaylist;
            let v111;
            if (v110) {
                v111 = 'playlists';
            } else {
                v111 = 'channels';
            }
            const v112 = sub.name;
            const v113 = `${ id }.twitch_chat.json`;
            file_path = path.join(subscriptionsFileFolder, v111, v112, v113);
        } else {
            const v114 = `ytdl_${ type }_folder_path`;
            const typeFolder = config_api.getConfigItem(v114);
            const v115 = `${ id }.twitch_chat.json`;
            file_path = path.join(typeFolder, v115);
        }
    }
    var chat_file = null;
    const v116 = fs.existsSync(file_path);
    if (v116) {
        chat_file = fs.readJSONSync(file_path);
    }
    return chat_file;
};
const downloadTwitchChatByVODID = async function (vodId, id, type, user_uid, sub, customFileFolderPath = null) {
    const usersFileFolder = config_api.getConfigItem('ytdl_users_base_path');
    const subscriptionsFileFolder = config_api.getConfigItem('ytdl_subscriptions_base_path');
    const twitch_client_id = config_api.getConfigItem('ytdl_twitch_client_id');
    const twitch_client_secret = config_api.getConfigItem('ytdl_twitch_client_secret');
    const chat = await getCommentsForVOD(twitch_client_id, twitch_client_secret, vodId);
    let file_path = null;
    if (customFileFolderPath) {
        const v117 = `${ id }.twitch_chat.json`;
        file_path = path.join(customFileFolderPath, v117);
    } else {
        if (user_uid) {
            if (sub) {
                const v118 = sub.isPlaylist;
                let v119;
                if (v118) {
                    v119 = 'playlists';
                } else {
                    v119 = 'channels';
                }
                const v120 = sub.name;
                const v121 = `${ id }.twitch_chat.json`;
                file_path = path.join(usersFileFolder, user_uid, 'subscriptions', v119, v120, v121);
            } else {
                const v122 = `${ id }.twitch_chat.json`;
                file_path = path.join(usersFileFolder, user_uid, type, v122);
            }
        } else {
            if (sub) {
                const v123 = sub.isPlaylist;
                let v124;
                if (v123) {
                    v124 = 'playlists';
                } else {
                    v124 = 'channels';
                }
                const v125 = sub.name;
                const v126 = `${ id }.twitch_chat.json`;
                file_path = path.join(subscriptionsFileFolder, v124, v125, v126);
            } else {
                const v127 = `${ id }.twitch_chat.json`;
                file_path = path.join(type, v127);
            }
        }
    }
    if (chat) {
        const v128 = fs.writeJSONSync(file_path, chat);
        v128;
    }
    return chat;
};
const convertTimestamp = timestamp => {
    const v129 = moment.duration(timestamp, 'seconds');
    const v130 = v129.toISOString();
    const v140 = (_, ...ms) => {
        const seg = v => {
            const v131 = v.padStart(2, '0');
            let v132;
            if (v) {
                v132 = v131;
            } else {
                v132 = '00';
            }
            return v132;
        };
        const v133 = ms[0];
        const v134 = seg(v133);
        const v135 = ms[1];
        const v136 = seg(v135);
        const v137 = ms[2];
        const v138 = seg(v137);
        const v139 = `${ v134 }:${ v136 }:${ v138 }`;
        return v139;
    };
    const v141 = v130.replace(/P.*?T(?:(\d+?)H)?(?:(\d+?)M)?(?:(\d+).*?S)?/, v140);
    return v141;
};
const v142 = {};
v142.getCommentsForVOD = getCommentsForVOD;
v142.getTwitchChatByFileID = getTwitchChatByFileID;
v142.downloadTwitchChatByVODID = downloadTwitchChatByVODID;
module.exports = v142;