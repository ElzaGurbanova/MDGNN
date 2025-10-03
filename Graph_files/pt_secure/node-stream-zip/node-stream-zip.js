let fs = require('fs');
const util = require('util');
const path = require('path');
const events = require('events');
const zlib = require('zlib');
const stream = require('stream');
const consts = {};
consts.LOCHDR = 30;
consts.LOCSIG = 67324752;
consts.LOCVER = 4;
consts.LOCFLG = 6;
consts.LOCHOW = 8;
consts.LOCTIM = 10;
consts.LOCCRC = 14;
consts.LOCSIZ = 18;
consts.LOCLEN = 22;
consts.LOCNAM = 26;
consts.LOCEXT = 28;
consts.EXTSIG = 134695760;
consts.EXTHDR = 16;
consts.EXTCRC = 4;
consts.EXTSIZ = 8;
consts.EXTLEN = 12;
consts.CENHDR = 46;
consts.CENSIG = 33639248;
consts.CENVEM = 4;
consts.CENVER = 6;
consts.CENFLG = 8;
consts.CENHOW = 10;
consts.CENTIM = 12;
consts.CENCRC = 16;
consts.CENSIZ = 20;
consts.CENLEN = 24;
consts.CENNAM = 28;
consts.CENEXT = 30;
consts.CENCOM = 32;
consts.CENDSK = 34;
consts.CENATT = 36;
consts.CENATX = 38;
consts.CENOFF = 42;
consts.ENDHDR = 22;
consts.ENDSIG = 101010256;
consts.ENDSIGFIRST = 80;
consts.ENDSUB = 8;
consts.ENDTOT = 10;
consts.ENDSIZ = 12;
consts.ENDOFF = 16;
consts.ENDCOM = 20;
consts.MAXFILECOMMENT = 65535;
consts.ENDL64HDR = 20;
consts.ENDL64SIG = 117853008;
consts.ENDL64SIGFIRST = 80;
consts.ENDL64OFS = 8;
consts.END64HDR = 56;
consts.END64SIG = 101075792;
consts.END64SIGFIRST = 80;
consts.END64SUB = 24;
consts.END64TOT = 32;
consts.END64SIZ = 40;
consts.END64OFF = 48;
consts.STORED = 0;
consts.SHRUNK = 1;
consts.REDUCED1 = 2;
consts.REDUCED2 = 3;
consts.REDUCED3 = 4;
consts.REDUCED4 = 5;
consts.IMPLODED = 6;
consts.DEFLATED = 8;
consts.ENHANCED_DEFLATED = 9;
consts.PKWARE = 10;
consts.BZIP2 = 12;
consts.LZMA = 14;
consts.IBM_TERSE = 18;
consts.IBM_LZ77 = 19;
consts.FLG_ENC = 0;
consts.FLG_COMP1 = 1;
consts.FLG_COMP2 = 2;
consts.FLG_DESC = 4;
consts.FLG_ENH = 8;
consts.FLG_STR = 16;
consts.FLG_LNG = 1024;
consts.FLG_MSK = 4096;
consts.FLG_ENTRY_ENC = 1;
consts.EF_ID = 0;
consts.EF_SIZE = 2;
consts.ID_ZIP64 = 1;
consts.ID_AVINFO = 7;
consts.ID_PFS = 8;
consts.ID_OS2 = 9;
consts.ID_NTFS = 10;
consts.ID_OPENVMS = 12;
consts.ID_UNIX = 13;
consts.ID_FORK = 14;
consts.ID_PATCH = 15;
consts.ID_X509_PKCS7 = 20;
consts.ID_X509_CERTID_F = 21;
consts.ID_X509_CERTID_C = 22;
consts.ID_STRONGENC = 23;
consts.ID_RECORD_MGT = 24;
consts.ID_X509_PKCS7_RL = 25;
consts.ID_IBM1 = 101;
consts.ID_IBM2 = 102;
consts.ID_POSZIP = 18064;
consts.EF_ZIP64_OR_32 = 4294967295;
consts.EF_ZIP64_OR_16 = 65535;
const StreamZip = function (config) {
    let fd;
    let fileSize;
    let chunkSize;
    let op;
    let centralDirectory;
    let closed;
    const ready = false;
    const that = this;
    let entries;
    const v883 = config.storeEntries;
    const v884 = v883 !== false;
    const v885 = {};
    if (v884) {
        entries = v885;
    } else {
        entries = null;
    }
    const fileName = config.file;
    let textDecoder;
    const v886 = config.nameEncoding;
    const v887 = config.nameEncoding;
    const v888 = new TextDecoder(v887);
    if (v886) {
        textDecoder = v888;
    } else {
        textDecoder = null;
    }
    const v889 = open();
    v889;
    const open = function () {
        const v890 = config.fd;
        if (v890) {
            fd = config.fd;
            const v891 = readFile();
            v891;
        } else {
            const v894 = (err, f) => {
                if (err) {
                    const v892 = that.emit('error', err);
                    return v892;
                }
                fd = f;
                const v893 = readFile();
                v893;
            };
            const v895 = fs.open(fileName, 'r', v894);
            v895;
        }
    };
    const readFile = function () {
        const v905 = (err, stat) => {
            if (err) {
                const v896 = that.emit('error', err);
                return v896;
            }
            fileSize = stat.size;
            const v897 = config.chunkSize;
            const v898 = fileSize / 1000;
            const v899 = Math.round(v898);
            chunkSize = v897 || v899;
            const v900 = 128 * 1024;
            const v901 = Math.min(v900, fileSize);
            const v902 = Math.min(chunkSize, v901);
            const v903 = Math.min(1024, fileSize);
            chunkSize = Math.max(v902, v903);
            const v904 = readCentralDirectory();
            v904;
        };
        const v906 = fs.fstat(fd, v905);
        v906;
    };
    const readUntilFoundCallback = function (err, bytesRead) {
        const v907 = !bytesRead;
        const v908 = err || v907;
        if (v908) {
            const v909 = new Error('Archive read error');
            const v910 = err || v909;
            const v911 = that.emit('error', v910);
            return v911;
        }
        let pos = op.lastPos;
        const v912 = op.win;
        const v913 = v912.position;
        let bufferPosition = pos - v913;
        const v914 = op.win;
        const buffer = v914.buffer;
        const minPos = op.minPos;
        const v915 = --pos;
        const v916 = v915 >= minPos;
        const v917 = --bufferPosition;
        const v918 = v917 >= 0;
        let v919 = v916 && v918;
        while (v919) {
            const v920 = buffer.length;
            const v921 = v920 - bufferPosition;
            const v922 = v921 >= 4;
            const v923 = buffer[bufferPosition];
            const v924 = op.firstByte;
            const v925 = v923 === v924;
            const v926 = v922 && v925;
            if (v926) {
                const v927 = buffer.readUInt32LE(bufferPosition);
                const v928 = op.sig;
                const v929 = v927 === v928;
                if (v929) {
                    op.lastBufferPosition = bufferPosition;
                    op.lastBytesRead = bytesRead;
                    const v930 = op.complete();
                    v930;
                    return;
                }
            }
            v919 = v916 && v918;
        }
        const v931 = pos === minPos;
        if (v931) {
            const v932 = new Error('Bad archive');
            const v933 = that.emit('error', v932);
            return v933;
        }
        op.lastPos = pos + 1;
        op.chunkSize *= 2;
        const v934 = pos <= minPos;
        if (v934) {
            const v935 = new Error('Bad archive');
            const v936 = that.emit('error', v935);
            return v936;
        }
        const v937 = op.chunkSize;
        const v938 = pos - minPos;
        const expandLength = Math.min(v937, v938);
        const v939 = op.win;
        const v940 = v939.expandLeft(expandLength, readUntilFoundCallback);
        v940;
    };
    const readCentralDirectory = function () {
        const v941 = consts.ENDHDR;
        const v942 = consts.MAXFILECOMMENT;
        const v943 = v941 + v942;
        const totalReadLength = Math.min(v943, fileSize);
        const v944 = new FileWindowBuffer(fd);
        const v945 = fileSize - totalReadLength;
        const v946 = Math.min(1024, chunkSize);
        const v947 = consts.ENDSIGFIRST;
        const v948 = consts.ENDSIG;
        op.win = v944;
        op.totalReadLength = totalReadLength;
        op.minPos = v945;
        op.lastPos = fileSize;
        op.chunkSize = v946;
        op.firstByte = v947;
        op.sig = v948;
        op.complete = readCentralDirectoryComplete;
        op = {};
        op = {};
        const v949 = op.win;
        const v950 = op.chunkSize;
        const v951 = fileSize - v950;
        const v952 = op.chunkSize;
        const v953 = v949.read(v951, v952, readUntilFoundCallback);
        v953;
    };
    const readCentralDirectoryComplete = function () {
        const v954 = op.win;
        const buffer = v954.buffer;
        const pos = op.lastBufferPosition;
        try {
            centralDirectory = new CentralDirectoryHeader();
            const v955 = consts.ENDHDR;
            const v956 = pos + v955;
            const v957 = buffer.slice(pos, v956);
            const v958 = centralDirectory.read(v957);
            v958;
            const v959 = op.win;
            const v960 = v959.position;
            centralDirectory.headerOffset = v960 + pos;
            const v961 = centralDirectory.commentLength;
            if (v961) {
                const v962 = consts.ENDHDR;
                const v963 = pos + v962;
                const v964 = consts.ENDHDR;
                const v965 = pos + v964;
                const v966 = centralDirectory.commentLength;
                const v967 = v965 + v966;
                const v968 = buffer.slice(v963, v967);
                const v969 = v968.toString();
                that.comment = v969;
            } else {
                that.comment = null;
            }
            const v970 = centralDirectory.volumeEntries;
            that.entriesCount = v970;
            that.centralDirectory = centralDirectory;
            const v971 = centralDirectory.volumeEntries;
            const v972 = consts.EF_ZIP64_OR_16;
            const v973 = v971 === v972;
            const v974 = centralDirectory.totalEntries;
            const v975 = consts.EF_ZIP64_OR_16;
            const v976 = v974 === v975;
            const v977 = v973 && v976;
            const v978 = centralDirectory.size;
            const v979 = consts.EF_ZIP64_OR_32;
            const v980 = v978 === v979;
            const v981 = v977 || v980;
            const v982 = centralDirectory.offset;
            const v983 = consts.EF_ZIP64_OR_32;
            const v984 = v982 === v983;
            const v985 = v981 || v984;
            if (v985) {
                const v986 = readZip64CentralDirectoryLocator();
                v986;
            } else {
                op = {};
                const v987 = readEntries();
                v987;
            }
        } catch (err) {
            const v988 = that.emit('error', err);
            v988;
        }
    };
    const readZip64CentralDirectoryLocator = function () {
        const length = consts.ENDL64HDR;
        const v989 = op.lastBufferPosition;
        const v990 = v989 > length;
        if (v990) {
            op.lastBufferPosition -= length;
            const v991 = readZip64CentralDirectoryLocatorComplete();
            v991;
        } else {
            const v992 = op.win;
            const v993 = op.win;
            const v994 = v993.position;
            const v995 = v994 - length;
            const v996 = op.win;
            const v997 = v996.position;
            const v998 = op.chunkSize;
            const v999 = consts.ENDL64SIGFIRST;
            const v1000 = consts.ENDL64SIG;
            op.win = v992;
            op.totalReadLength = length;
            op.minPos = v995;
            op.lastPos = v997;
            op.chunkSize = v998;
            op.firstByte = v999;
            op.sig = v1000;
            op.complete = readZip64CentralDirectoryLocatorComplete;
            op = {};
            op = {};
            const v1001 = op.win;
            const v1002 = op.lastPos;
            const v1003 = op.chunkSize;
            const v1004 = v1002 - v1003;
            const v1005 = op.chunkSize;
            const v1006 = v1001.read(v1004, v1005, readUntilFoundCallback);
            v1006;
        }
    };
    const readZip64CentralDirectoryLocatorComplete = function () {
        const v1007 = op.win;
        const buffer = v1007.buffer;
        const locHeader = new CentralDirectoryLoc64Header();
        const v1008 = op.lastBufferPosition;
        const v1009 = op.lastBufferPosition;
        const v1010 = consts.ENDL64HDR;
        const v1011 = v1009 + v1010;
        const v1012 = buffer.slice(v1008, v1011);
        const v1013 = locHeader.read(v1012);
        v1013;
        const v1014 = locHeader.headerOffset;
        const readLength = fileSize - v1014;
        const v1015 = op.win;
        const v1016 = locHeader.headerOffset;
        const v1017 = op.lastPos;
        const v1018 = op.chunkSize;
        const v1019 = consts.END64SIGFIRST;
        const v1020 = consts.END64SIG;
        op.win = v1015;
        op.totalReadLength = readLength;
        op.minPos = v1016;
        op.lastPos = v1017;
        op.chunkSize = v1018;
        op.firstByte = v1019;
        op.sig = v1020;
        op.complete = readZip64CentralDirectoryComplete;
        op = {};
        op = {};
        const v1021 = op.win;
        const v1022 = op.chunkSize;
        const v1023 = fileSize - v1022;
        const v1024 = op.chunkSize;
        const v1025 = v1021.read(v1023, v1024, readUntilFoundCallback);
        v1025;
    };
    const readZip64CentralDirectoryComplete = function () {
        const v1026 = op.win;
        const buffer = v1026.buffer;
        const zip64cd = new CentralDirectoryZip64Header();
        const v1027 = op.lastBufferPosition;
        const v1028 = op.lastBufferPosition;
        const v1029 = consts.END64HDR;
        const v1030 = v1028 + v1029;
        const v1031 = buffer.slice(v1027, v1030);
        const v1032 = zip64cd.read(v1031);
        v1032;
        const v1033 = that.centralDirectory;
        const v1034 = zip64cd.volumeEntries;
        v1033.volumeEntries = v1034;
        const v1035 = that.centralDirectory;
        const v1036 = zip64cd.totalEntries;
        v1035.totalEntries = v1036;
        const v1037 = that.centralDirectory;
        const v1038 = zip64cd.size;
        v1037.size = v1038;
        const v1039 = that.centralDirectory;
        const v1040 = zip64cd.offset;
        v1039.offset = v1040;
        const v1041 = zip64cd.volumeEntries;
        that.entriesCount = v1041;
        op = {};
        const v1042 = readEntries();
        v1042;
    };
    const readEntries = function () {
        const v1043 = new FileWindowBuffer(fd);
        const v1044 = centralDirectory.offset;
        const v1045 = centralDirectory.volumeEntries;
        op.win = v1043;
        op.pos = v1044;
        op.chunkSize = chunkSize;
        op.entriesLeft = v1045;
        op = {};
        op = {};
        const v1046 = op.win;
        const v1047 = op.pos;
        const v1048 = op.pos;
        const v1049 = fileSize - v1048;
        const v1050 = Math.min(chunkSize, v1049);
        const v1051 = v1046.read(v1047, v1050, readEntriesCallback);
        v1051;
    };
    const readEntriesCallback = function (err, bytesRead) {
        const v1052 = !bytesRead;
        const v1053 = err || v1052;
        if (v1053) {
            const v1054 = new Error('Entries read error');
            const v1055 = err || v1054;
            const v1056 = that.emit('error', v1055);
            return v1056;
        }
        const v1057 = op.pos;
        const v1058 = op.win;
        const v1059 = v1058.position;
        let bufferPos = v1057 - v1059;
        let entry = op.entry;
        const v1060 = op.win;
        const buffer = v1060.buffer;
        const bufferLength = buffer.length;
        try {
            const v1061 = op.entriesLeft;
            let v1062 = v1061 > 0;
            while (v1062) {
                const v1063 = !entry;
                if (v1063) {
                    entry = new ZipEntry();
                    const v1064 = entry.readHeader(buffer, bufferPos);
                    v1064;
                    const v1065 = op.win;
                    const v1066 = v1065.position;
                    entry.headerOffset = v1066 + bufferPos;
                    op.entry = entry;
                    const v1067 = consts.CENHDR;
                    op.pos += v1067;
                    bufferPos += consts.CENHDR;
                }
                const v1068 = entry.fnameLen;
                const v1069 = entry.extraLen;
                const v1070 = v1068 + v1069;
                const v1071 = entry.comLen;
                const entryHeaderSize = v1070 + v1071;
                const v1072 = op.entriesLeft;
                const v1073 = v1072 > 1;
                const v1074 = consts.CENHDR;
                let v1075;
                if (v1073) {
                    v1075 = v1074;
                } else {
                    v1075 = 0;
                }
                const advanceBytes = entryHeaderSize + v1075;
                const v1076 = bufferLength - bufferPos;
                const v1077 = v1076 < advanceBytes;
                if (v1077) {
                    const v1078 = op.win;
                    const v1079 = v1078.moveRight(chunkSize, readEntriesCallback, bufferPos);
                    v1079;
                    op.move = true;
                    return;
                }
                const v1080 = entry.read(buffer, bufferPos, textDecoder);
                v1080;
                const v1081 = config.skipEntryNameValidation;
                const v1082 = !v1081;
                if (v1082) {
                    const v1083 = entry.validateName();
                    v1083;
                }
                if (entries) {
                    const v1084 = entry.name;
                    entries[v1084] = entry;
                }
                const v1085 = that.emit('entry', entry);
                v1085;
                entry = null;
                op.entry = entry;
                const v1086 = op.entriesLeft;
                const v1087 = v1086--;
                v1087;
                op.pos += entryHeaderSize;
                bufferPos += entryHeaderSize;
                v1062 = v1061 > 0;
            }
            const v1088 = that.emit('ready');
            v1088;
        } catch (err) {
            const v1089 = that.emit('error', err);
            v1089;
        }
    };
    const checkEntriesExist = function () {
        const v1090 = !entries;
        if (v1090) {
            const v1091 = new Error('storeEntries disabled');
            throw v1091;
        }
    };
    const v1092 = function () {
        return ready;
    };
    const v1093 = { get: v1092 };
    const v1094 = Object.defineProperty(this, 'ready', v1093);
    v1094;
    const v1097 = function (name) {
        const v1095 = checkEntriesExist();
        v1095;
        const v1096 = entries[name];
        return v1096;
    };
    this.entry = v1097;
    const v1099 = function () {
        const v1098 = checkEntriesExist();
        v1098;
        return entries;
    };
    this.entries = v1099;
    const v1120 = function (entry, callback) {
        const v1118 = (err, entry) => {
            if (err) {
                const v1100 = callback(err);
                return v1100;
            }
            const offset = dataOffset(entry);
            const v1101 = entry.compressedSize;
            let entryStream = new EntryDataReaderStream(fd, offset, v1101);
            const v1102 = entry.method;
            const v1103 = consts.STORED;
            const v1104 = v1102 === v1103;
            if (v1104) {
            } else {
                const v1105 = entry.method;
                const v1106 = consts.DEFLATED;
                const v1107 = v1105 === v1106;
                if (v1107) {
                    const v1108 = zlib.createInflateRaw();
                    entryStream = entryStream.pipe(v1108);
                } else {
                    const v1109 = entry.method;
                    const v1110 = 'Unknown compression method: ' + v1109;
                    const v1111 = new Error(v1110);
                    const v1112 = callback(v1111);
                    return v1112;
                }
            }
            const v1113 = canVerifyCrc(entry);
            if (v1113) {
                const v1114 = entry.crc;
                const v1115 = entry.size;
                const v1116 = new EntryVerifyStream(entryStream, v1114, v1115);
                entryStream = entryStream.pipe(v1116);
            }
            const v1117 = callback(null, entryStream);
            v1117;
        };
        const v1119 = this.openEntry(entry, v1118, false);
        return v1119;
    };
    this.stream = v1120;
    const v1150 = function (entry) {
        let err = null;
        const v1121 = (e, en) => {
            err = e;
            entry = en;
        };
        const v1122 = this.openEntry(entry, v1121, true);
        v1122;
        if (err) {
            throw err;
        }
        const v1123 = entry.compressedSize;
        let data = Buffer.alloc(v1123);
        const v1124 = entry.compressedSize;
        const v1125 = dataOffset(entry);
        const v1126 = e => {
            err = e;
        };
        const v1127 = new FsRead(fd, data, 0, v1124, v1125, v1126);
        const v1128 = v1127.read(true);
        v1128;
        if (err) {
            throw err;
        }
        const v1129 = entry.method;
        const v1130 = consts.STORED;
        const v1131 = v1129 === v1130;
        if (v1131) {
        } else {
            const v1132 = entry.method;
            const v1133 = consts.DEFLATED;
            const v1134 = v1132 === v1133;
            const v1135 = entry.method;
            const v1136 = consts.ENHANCED_DEFLATED;
            const v1137 = v1135 === v1136;
            const v1138 = v1134 || v1137;
            if (v1138) {
                data = zlib.inflateRawSync(data);
            } else {
                const v1139 = entry.method;
                const v1140 = 'Unknown compression method: ' + v1139;
                const v1141 = new Error(v1140);
                throw v1141;
            }
        }
        const v1142 = data.length;
        const v1143 = entry.size;
        const v1144 = v1142 !== v1143;
        if (v1144) {
            const v1145 = new Error('Invalid size');
            throw v1145;
        }
        const v1146 = canVerifyCrc(entry);
        if (v1146) {
            const v1147 = entry.crc;
            const v1148 = entry.size;
            const verify = new CrcVerify(v1147, v1148);
            const v1149 = verify.data(data);
            v1149;
        }
        return data;
    };
    this.entryDataSync = v1150;
    const v1174 = function (entry, callback, sync) {
        const v1151 = typeof entry;
        const v1152 = v1151 === 'string';
        if (v1152) {
            const v1153 = checkEntriesExist();
            v1153;
            entry = entries[entry];
            const v1154 = !entry;
            if (v1154) {
                const v1155 = new Error('Entry not found');
                const v1156 = callback(v1155);
                return v1156;
            }
        }
        const v1157 = entry.isFile;
        const v1158 = !v1157;
        if (v1158) {
            const v1159 = new Error('Entry is not file');
            const v1160 = callback(v1159);
            return v1160;
        }
        const v1161 = !fd;
        if (v1161) {
            const v1162 = new Error('Archive closed');
            const v1163 = callback(v1162);
            return v1163;
        }
        const v1164 = consts.LOCHDR;
        const buffer = Buffer.alloc(v1164);
        const v1165 = buffer.length;
        const v1166 = entry.offset;
        const v1171 = err => {
            if (err) {
                const v1167 = callback(err);
                return v1167;
            }
            let readEx;
            try {
                const v1168 = entry.readDataHeader(buffer);
                v1168;
                const v1169 = entry.encrypted;
                if (v1169) {
                    readEx = new Error('Entry encrypted');
                }
            } catch (ex) {
                readEx = ex;
            }
            const v1170 = callback(readEx, entry);
            v1170;
        };
        const v1172 = new FsRead(fd, buffer, 0, v1165, v1166, v1171);
        const v1173 = v1172.read(sync);
        v1173;
    };
    this.openEntry = v1174;
    const dataOffset = function (entry) {
        const v1175 = entry.offset;
        const v1176 = consts.LOCHDR;
        const v1177 = v1175 + v1176;
        const v1178 = entry.fnameLen;
        const v1179 = v1177 + v1178;
        const v1180 = entry.extraLen;
        const v1181 = v1179 + v1180;
        return v1181;
    };
    const canVerifyCrc = function (entry) {
        const v1182 = entry.flags;
        const v1183 = v1182 & 8;
        const v1184 = v1183 !== 8;
        return v1184;
    };
    const extract = function (entry, outPath, callback) {
        const v1205 = (err, stm) => {
            if (err) {
                const v1185 = callback(err);
                v1185;
            } else {
                let fsStm;
                let errThrown;
                const v1190 = err => {
                    errThrown = err;
                    if (fsStm) {
                        const v1186 = stm.unpipe(fsStm);
                        v1186;
                        const v1188 = () => {
                            const v1187 = callback(err);
                            v1187;
                        };
                        const v1189 = fsStm.close(v1188);
                        v1189;
                    }
                };
                const v1191 = stm.on('error', v1190);
                v1191;
                const v1203 = (err, fdFile) => {
                    if (err) {
                        const v1192 = callback(err);
                        return v1192;
                    }
                    if (errThrown) {
                        const v1194 = () => {
                            const v1193 = callback(errThrown);
                            v1193;
                        };
                        const v1195 = fs.close(fd, v1194);
                        v1195;
                        return;
                    }
                    const v1196 = { fd: fdFile };
                    fsStm = fs.createWriteStream(outPath, v1196);
                    const v1200 = () => {
                        const v1197 = that.emit('extract', entry, outPath);
                        v1197;
                        const v1198 = !errThrown;
                        if (v1198) {
                            const v1199 = callback();
                            v1199;
                        }
                    };
                    const v1201 = fsStm.on('finish', v1200);
                    v1201;
                    const v1202 = stm.pipe(fsStm);
                    v1202;
                };
                const v1204 = fs.open(outPath, 'w', v1203);
                v1204;
            }
        };
        const v1206 = that.stream(entry, v1205);
        v1206;
    };
    const createDirectories = function (baseDir, dirs, callback) {
        const v1207 = dirs.length;
        const v1208 = !v1207;
        if (v1208) {
            const v1209 = callback();
            return v1209;
        }
        let dir = dirs.shift();
        const v1210 = path.join(...dir);
        dir = path.join(baseDir, v1210);
        const v1211 = { recursive: true };
        const v1217 = err => {
            const v1212 = err.code;
            const v1213 = v1212 !== 'EEXIST';
            const v1214 = err && v1213;
            if (v1214) {
                const v1215 = callback(err);
                return v1215;
            }
            const v1216 = createDirectories(baseDir, dirs, callback);
            v1216;
        };
        const v1218 = fs.mkdir(dir, v1211, v1217);
        v1218;
    };
    const extractFiles = function (baseDir, baseRelPath, files, callback, extractedCount) {
        const v1219 = files.length;
        const v1220 = !v1219;
        if (v1220) {
            const v1221 = callback(null, extractedCount);
            return v1221;
        }
        const file = files.shift();
        const v1222 = file.name;
        const v1223 = v1222.replace(baseRelPath, '');
        const targetPath = path.join(baseDir, v1223);
        const v1227 = err => {
            if (err) {
                const v1224 = callback(err, extractedCount);
                return v1224;
            }
            const v1225 = extractedCount + 1;
            const v1226 = extractFiles(baseDir, baseRelPath, files, callback, v1225);
            v1226;
        };
        const v1228 = extract(file, targetPath, v1227);
        v1228;
    };
    const v1285 = function (entry, outPath, callback) {
        let entryName = entry || '';
        const v1229 = typeof entry;
        const v1230 = v1229 === 'string';
        if (v1230) {
            entry = this.entry(entry);
            if (entry) {
                entryName = entry.name;
            } else {
                const v1231 = entryName.length;
                const v1232 = entryName.length;
                const v1233 = v1232 - 1;
                const v1234 = entryName[v1233];
                const v1235 = v1234 !== '/';
                const v1236 = v1231 && v1235;
                if (v1236) {
                    entryName += '/';
                }
            }
        }
        const v1237 = !entry;
        const v1238 = entry.isDirectory;
        const v1239 = v1237 || v1238;
        if (v1239) {
            const files = [];
            const dirs = [];
            const allDirs = {};
            let e;
            for (e in entries) {
                const v1240 = Object.prototype;
                const v1241 = v1240.hasOwnProperty;
                const v1242 = v1241.call(entries, e);
                const v1243 = e.lastIndexOf(entryName, 0);
                const v1244 = v1243 === 0;
                const v1245 = v1242 && v1244;
                if (v1245) {
                    let relPath = e.replace(entryName, '');
                    const childEntry = entries[e];
                    const v1246 = childEntry.isFile;
                    if (v1246) {
                        const v1247 = files.push(childEntry);
                        v1247;
                        relPath = path.dirname(relPath);
                    }
                    const v1248 = allDirs[relPath];
                    const v1249 = !v1248;
                    const v1250 = relPath && v1249;
                    const v1251 = relPath !== '.';
                    const v1252 = v1250 && v1251;
                    if (v1252) {
                        allDirs[relPath] = true;
                        const v1253 = relPath.split('/');
                        const v1254 = f => {
                            return f;
                        };
                        let parts = v1253.filter(v1254);
                        const v1255 = parts.length;
                        if (v1255) {
                            const v1256 = dirs.push(parts);
                            v1256;
                        }
                        const v1257 = parts.length;
                        let v1258 = v1257 > 1;
                        while (v1258) {
                            const v1259 = parts.length;
                            const v1260 = v1259 - 1;
                            parts = parts.slice(0, v1260);
                            const partsPath = parts.join('/');
                            const v1261 = allDirs[partsPath];
                            const v1262 = partsPath === '.';
                            const v1263 = v1261 || v1262;
                            if (v1263) {
                                break;
                            }
                            allDirs[partsPath] = true;
                            const v1264 = dirs.push(parts);
                            v1264;
                            v1258 = v1257 > 1;
                        }
                    }
                }
            }
            const v1268 = (x, y) => {
                const v1265 = x.length;
                const v1266 = y.length;
                const v1267 = v1265 - v1266;
                return v1267;
            };
            const v1269 = dirs.sort(v1268);
            v1269;
            const v1270 = dirs.length;
            if (v1270) {
                const v1273 = err => {
                    if (err) {
                        const v1271 = callback(err);
                        v1271;
                    } else {
                        const v1272 = extractFiles(outPath, entryName, files, callback, 0);
                        v1272;
                    }
                };
                const v1274 = createDirectories(outPath, dirs, v1273);
                v1274;
            } else {
                const v1275 = extractFiles(outPath, entryName, files, callback, 0);
                v1275;
            }
        } else {
            const v1283 = (err, stat) => {
                const v1276 = stat.isDirectory();
                const v1277 = stat && v1276;
                if (v1277) {
                    const v1278 = entry.name;
                    const v1279 = path.basename(v1278);
                    const v1280 = path.join(outPath, v1279);
                    const v1281 = extract(entry, v1280, callback);
                    v1281;
                } else {
                    const v1282 = extract(entry, outPath, callback);
                    v1282;
                }
            };
            const v1284 = fs.stat(outPath, v1283);
            v1284;
        }
    };
    this.extract = v1285;
    const v1292 = function (callback) {
        const v1286 = !fd;
        const v1287 = closed || v1286;
        if (v1287) {
            closed = true;
            if (callback) {
                const v1288 = callback();
                v1288;
            }
        } else {
            closed = true;
            const v1290 = err => {
                fd = null;
                if (callback) {
                    const v1289 = callback(err);
                    v1289;
                }
            };
            const v1291 = fs.close(fd, v1290);
            v1291;
        }
    };
    this.close = v1292;
    const v1293 = events.EventEmitter;
    const v1294 = v1293.prototype;
    const originalEmit = v1294.emit;
    const v1297 = function (...args) {
        const v1295 = !closed;
        if (v1295) {
            const v1296 = originalEmit.call(this, ...args);
            return v1296;
        }
    };
    this.emit = v1297;
};
const v1298 = function (customFs) {
    fs = customFs;
};
StreamZip.setFs = v1298;
const v1301 = (...args) => {
    const v1299 = StreamZip.debug;
    if (v1299) {
        const v1300 = console.log(...args);
        v1300;
    }
};
StreamZip.debugLog = v1301;
const v1302 = events.EventEmitter;
const v1303 = util.inherits(StreamZip, v1302);
v1303;
const propZip = Symbol('zip');
StreamZip.async = class StreamZipAsync extends events.EventEmitter {
    constructor(config) {
        const v1305 = super();
        v1305;
        const zip = new StreamZip(config);
        const v1307 = entry => {
            const v1306 = this.emit('entry', entry);
            return v1306;
        };
        const v1308 = zip.on('entry', v1307);
        v1308;
        const v1310 = (entry, outPath) => {
            const v1309 = this.emit('extract', entry, outPath);
            return v1309;
        };
        const v1311 = zip.on('extract', v1310);
        v1311;
        const v1317 = (resolve, reject) => {
            const v1314 = () => {
                const v1312 = zip.removeListener('error', reject);
                v1312;
                const v1313 = resolve(zip);
                v1313;
            };
            const v1315 = zip.on('ready', v1314);
            v1315;
            const v1316 = zip.on('error', reject);
            v1316;
        };
        this[propZip] = new Promise(v1317);
    }
    get entriesCount() {
        const v1318 = this[propZip];
        const v1320 = zip => {
            const v1319 = zip.entriesCount;
            return v1319;
        };
        const v1321 = v1318.then(v1320);
        return v1321;
    }
    get comment() {
        const v1322 = this[propZip];
        const v1324 = zip => {
            const v1323 = zip.comment;
            return v1323;
        };
        const v1325 = v1322.then(v1324);
        return v1325;
    }
    async entry(name) {
        const v1326 = this[propZip];
        const zip = await v1326;
        const v1327 = zip.entry(name);
        return v1327;
    }
    async entries() {
        const v1328 = this[propZip];
        const zip = await v1328;
        const v1329 = zip.entries();
        return v1329;
    }
    async stream(entry) {
        const v1330 = this[propZip];
        const zip = await v1330;
        const v1335 = (resolve, reject) => {
            const v1333 = (err, stm) => {
                if (err) {
                    const v1331 = reject(err);
                    v1331;
                } else {
                    const v1332 = resolve(stm);
                    v1332;
                }
            };
            const v1334 = zip.stream(entry, v1333);
            v1334;
        };
        const v1336 = new Promise(v1335);
        return v1336;
    }
    async entryData(entry) {
        const stm = await this.stream(entry);
        const v1348 = (resolve, reject) => {
            const data = [];
            const v1338 = chunk => {
                const v1337 = data.push(chunk);
                return v1337;
            };
            const v1339 = stm.on('data', v1338);
            v1339;
            const v1342 = () => {
                const v1340 = Buffer.concat(data);
                const v1341 = resolve(v1340);
                v1341;
            };
            const v1343 = stm.on('end', v1342);
            v1343;
            const v1346 = err => {
                const v1344 = stm.removeAllListeners('end');
                v1344;
                const v1345 = reject(err);
                v1345;
            };
            const v1347 = stm.on('error', v1346);
            v1347;
        };
        const v1349 = new Promise(v1348);
        return v1349;
    }
    async extract(entry, outPath) {
        const v1350 = this[propZip];
        const zip = await v1350;
        const v1355 = (resolve, reject) => {
            const v1353 = (err, res) => {
                if (err) {
                    const v1351 = reject(err);
                    v1351;
                } else {
                    const v1352 = resolve(res);
                    v1352;
                }
            };
            const v1354 = zip.extract(entry, outPath, v1353);
            v1354;
        };
        const v1356 = new Promise(v1355);
        return v1356;
    }
    async close() {
        const v1357 = this[propZip];
        const zip = await v1357;
        const v1362 = (resolve, reject) => {
            const v1360 = err => {
                if (err) {
                    const v1358 = reject(err);
                    v1358;
                } else {
                    const v1359 = resolve();
                    v1359;
                }
            };
            const v1361 = zip.close(v1360);
            v1361;
        };
        const v1363 = new Promise(v1362);
        return v1363;
    }
};
const CentralDirectoryHeader = function CentralDirectoryHeader() {
};
const read = function read(data) {
    const v1364 = data.length;
    const v1365 = consts.ENDHDR;
    const v1366 = v1364 !== v1365;
    const v1367 = data.readUInt32LE(0);
    const v1368 = consts.ENDSIG;
    const v1369 = v1367 !== v1368;
    const v1370 = v1366 || v1369;
    if (v1370) {
        const v1371 = new Error('Invalid central directory');
        throw v1371;
    }
    const v1372 = consts.ENDSUB;
    const v1373 = data.readUInt16LE(v1372);
    this.volumeEntries = v1373;
    const v1374 = consts.ENDTOT;
    const v1375 = data.readUInt16LE(v1374);
    this.totalEntries = v1375;
    const v1376 = consts.ENDSIZ;
    const v1377 = data.readUInt32LE(v1376);
    this.size = v1377;
    const v1378 = consts.ENDOFF;
    const v1379 = data.readUInt32LE(v1378);
    this.offset = v1379;
    const v1380 = consts.ENDCOM;
    const v1381 = data.readUInt16LE(v1380);
    this.commentLength = v1381;
};
CentralDirectoryHeader.read = read;
CentralDirectoryHeader['is_class'] = true;
const CentralDirectoryLoc64Header = function CentralDirectoryLoc64Header() {
};
const read = function read(data) {
    const v1382 = data.length;
    const v1383 = consts.ENDL64HDR;
    const v1384 = v1382 !== v1383;
    const v1385 = data.readUInt32LE(0);
    const v1386 = consts.ENDL64SIG;
    const v1387 = v1385 !== v1386;
    const v1388 = v1384 || v1387;
    if (v1388) {
        const v1389 = new Error('Invalid zip64 central directory locator');
        throw v1389;
    }
    const v1390 = consts.ENDSUB;
    const v1391 = readUInt64LE(data, v1390);
    this.headerOffset = v1391;
};
CentralDirectoryLoc64Header.read = read;
CentralDirectoryLoc64Header['is_class'] = true;
const CentralDirectoryZip64Header = function CentralDirectoryZip64Header() {
};
const read = function read(data) {
    const v1392 = data.length;
    const v1393 = consts.END64HDR;
    const v1394 = v1392 !== v1393;
    const v1395 = data.readUInt32LE(0);
    const v1396 = consts.END64SIG;
    const v1397 = v1395 !== v1396;
    const v1398 = v1394 || v1397;
    if (v1398) {
        const v1399 = new Error('Invalid central directory');
        throw v1399;
    }
    const v1400 = consts.END64SUB;
    const v1401 = readUInt64LE(data, v1400);
    this.volumeEntries = v1401;
    const v1402 = consts.END64TOT;
    const v1403 = readUInt64LE(data, v1402);
    this.totalEntries = v1403;
    const v1404 = consts.END64SIZ;
    const v1405 = readUInt64LE(data, v1404);
    this.size = v1405;
    const v1406 = consts.END64OFF;
    const v1407 = readUInt64LE(data, v1406);
    this.offset = v1407;
};
CentralDirectoryZip64Header.read = read;
CentralDirectoryZip64Header['is_class'] = true;
const ZipEntry = function ZipEntry() {
};
const readHeader = function readHeader(data, offset) {
    const v1408 = data.length;
    const v1409 = consts.CENHDR;
    const v1410 = offset + v1409;
    const v1411 = v1408 < v1410;
    const v1412 = data.readUInt32LE(offset);
    const v1413 = consts.CENSIG;
    const v1414 = v1412 !== v1413;
    const v1415 = v1411 || v1414;
    if (v1415) {
        const v1416 = new Error('Invalid entry header');
        throw v1416;
    }
    const v1417 = consts.CENVEM;
    const v1418 = offset + v1417;
    const v1419 = data.readUInt16LE(v1418);
    this.verMade = v1419;
    const v1420 = consts.CENVER;
    const v1421 = offset + v1420;
    const v1422 = data.readUInt16LE(v1421);
    this.version = v1422;
    const v1423 = consts.CENFLG;
    const v1424 = offset + v1423;
    const v1425 = data.readUInt16LE(v1424);
    this.flags = v1425;
    const v1426 = consts.CENHOW;
    const v1427 = offset + v1426;
    const v1428 = data.readUInt16LE(v1427);
    this.method = v1428;
    const v1429 = consts.CENTIM;
    const v1430 = offset + v1429;
    const timebytes = data.readUInt16LE(v1430);
    const v1431 = consts.CENTIM;
    const v1432 = offset + v1431;
    const v1433 = v1432 + 2;
    const datebytes = data.readUInt16LE(v1433);
    const v1434 = parseZipTime(timebytes, datebytes);
    this.time = v1434;
    const v1435 = consts.CENCRC;
    const v1436 = offset + v1435;
    const v1437 = data.readUInt32LE(v1436);
    this.crc = v1437;
    const v1438 = consts.CENSIZ;
    const v1439 = offset + v1438;
    const v1440 = data.readUInt32LE(v1439);
    this.compressedSize = v1440;
    const v1441 = consts.CENLEN;
    const v1442 = offset + v1441;
    const v1443 = data.readUInt32LE(v1442);
    this.size = v1443;
    const v1444 = consts.CENNAM;
    const v1445 = offset + v1444;
    const v1446 = data.readUInt16LE(v1445);
    this.fnameLen = v1446;
    const v1447 = consts.CENEXT;
    const v1448 = offset + v1447;
    const v1449 = data.readUInt16LE(v1448);
    this.extraLen = v1449;
    const v1450 = consts.CENCOM;
    const v1451 = offset + v1450;
    const v1452 = data.readUInt16LE(v1451);
    this.comLen = v1452;
    const v1453 = consts.CENDSK;
    const v1454 = offset + v1453;
    const v1455 = data.readUInt16LE(v1454);
    this.diskStart = v1455;
    const v1456 = consts.CENATT;
    const v1457 = offset + v1456;
    const v1458 = data.readUInt16LE(v1457);
    this.inattr = v1458;
    const v1459 = consts.CENATX;
    const v1460 = offset + v1459;
    const v1461 = data.readUInt32LE(v1460);
    this.attr = v1461;
    const v1462 = consts.CENOFF;
    const v1463 = offset + v1462;
    const v1464 = data.readUInt32LE(v1463);
    this.offset = v1464;
};
ZipEntry.readHeader = readHeader;
const readDataHeader = function readDataHeader(data) {
    const v1465 = data.readUInt32LE(0);
    const v1466 = consts.LOCSIG;
    const v1467 = v1465 !== v1466;
    if (v1467) {
        const v1468 = new Error('Invalid local header');
        throw v1468;
    }
    const v1469 = consts.LOCVER;
    const v1470 = data.readUInt16LE(v1469);
    this.version = v1470;
    const v1471 = consts.LOCFLG;
    const v1472 = data.readUInt16LE(v1471);
    this.flags = v1472;
    const v1473 = consts.LOCHOW;
    const v1474 = data.readUInt16LE(v1473);
    this.method = v1474;
    const v1475 = consts.LOCTIM;
    const timebytes = data.readUInt16LE(v1475);
    const v1476 = consts.LOCTIM;
    const v1477 = v1476 + 2;
    const datebytes = data.readUInt16LE(v1477);
    const v1478 = parseZipTime(timebytes, datebytes);
    this.time = v1478;
    const v1479 = consts.LOCCRC;
    const v1480 = data.readUInt32LE(v1479);
    const v1481 = this.crc;
    this.crc = v1480 || v1481;
    const v1482 = consts.LOCSIZ;
    const compressedSize = data.readUInt32LE(v1482);
    const v1483 = consts.EF_ZIP64_OR_32;
    const v1484 = compressedSize !== v1483;
    const v1485 = compressedSize && v1484;
    if (v1485) {
        this.compressedSize = compressedSize;
    }
    const v1486 = consts.LOCLEN;
    const size = data.readUInt32LE(v1486);
    const v1487 = consts.EF_ZIP64_OR_32;
    const v1488 = size !== v1487;
    const v1489 = size && v1488;
    if (v1489) {
        this.size = size;
    }
    const v1490 = consts.LOCNAM;
    const v1491 = data.readUInt16LE(v1490);
    this.fnameLen = v1491;
    const v1492 = consts.LOCEXT;
    const v1493 = data.readUInt16LE(v1492);
    this.extraLen = v1493;
};
ZipEntry.readDataHeader = readDataHeader;
const read = function read(data, offset, textDecoder) {
    offset = this.fnameLen;
    const nameData = data.slice(offset, offset);
    const v1494 = new Uint8Array(nameData);
    const v1495 = textDecoder.decode(v1494);
    const v1496 = nameData.toString('utf8');
    let v1497;
    if (textDecoder) {
        v1497 = v1495;
    } else {
        v1497 = v1496;
    }
    this.name = v1497;
    const v1498 = offset - 1;
    const lastChar = data[v1498];
    const v1499 = lastChar === 47;
    const v1500 = lastChar === 92;
    this.isDirectory = v1499 || v1500;
    const v1501 = this.extraLen;
    if (v1501) {
        const v1502 = this.readExtra(data, offset);
        v1502;
        offset += this.extraLen;
    }
    const v1503 = this.comLen;
    const v1504 = this.comLen;
    const v1505 = offset + v1504;
    const v1506 = data.slice(offset, v1505);
    const v1507 = v1506.toString();
    let v1508;
    if (v1503) {
        v1508 = v1507;
    } else {
        v1508 = null;
    }
    this.comment = v1508;
};
ZipEntry.read = read;
const validateName = function validateName() {
    const v1509 = this.name;
    const v1510 = /\\|^\w+:|^\/|(^|\/)\.\.(\/|$)/.test(v1509);
    if (v1510) {
        const v1511 = this.name;
        const v1512 = 'Malicious entry: ' + v1511;
        const v1513 = new Error(v1512);
        throw v1513;
    }
};
ZipEntry.validateName = validateName;
const readExtra = function readExtra(data, offset) {
    let signature;
    let size;
    const v1514 = this.extraLen;
    const maxPos = offset + v1514;
    let v1515 = offset < maxPos;
    while (v1515) {
        signature = data.readUInt16LE(offset);
        offset += 2;
        size = data.readUInt16LE(offset);
        offset += 2;
        const v1516 = consts.ID_ZIP64;
        const v1517 = v1516 === signature;
        if (v1517) {
            const v1518 = this.parseZip64Extra(data, offset, size);
            v1518;
        }
        offset += size;
        v1515 = offset < maxPos;
    }
};
ZipEntry.readExtra = readExtra;
const parseZip64Extra = function parseZip64Extra(data, offset, length) {
    const v1519 = length >= 8;
    const v1520 = this.size;
    const v1521 = consts.EF_ZIP64_OR_32;
    const v1522 = v1520 === v1521;
    const v1523 = v1519 && v1522;
    if (v1523) {
        const v1524 = readUInt64LE(data, offset);
        this.size = v1524;
        offset += 8;
        length -= 8;
    }
    const v1525 = length >= 8;
    const v1526 = this.compressedSize;
    const v1527 = consts.EF_ZIP64_OR_32;
    const v1528 = v1526 === v1527;
    const v1529 = v1525 && v1528;
    if (v1529) {
        const v1530 = readUInt64LE(data, offset);
        this.compressedSize = v1530;
        offset += 8;
        length -= 8;
    }
    const v1531 = length >= 8;
    const v1532 = this.offset;
    const v1533 = consts.EF_ZIP64_OR_32;
    const v1534 = v1532 === v1533;
    const v1535 = v1531 && v1534;
    if (v1535) {
        const v1536 = readUInt64LE(data, offset);
        this.offset = v1536;
        offset += 8;
        length -= 8;
    }
    const v1537 = length >= 4;
    const v1538 = this.diskStart;
    const v1539 = consts.EF_ZIP64_OR_16;
    const v1540 = v1538 === v1539;
    const v1541 = v1537 && v1540;
    if (v1541) {
        const v1542 = data.readUInt32LE(offset);
        this.diskStart = v1542;
    }
};
ZipEntry.parseZip64Extra = parseZip64Extra;
const encrypted = function encrypted() {
    const v1543 = this.flags;
    const v1544 = consts.FLG_ENTRY_ENC;
    const v1545 = v1543 & v1544;
    const v1546 = consts.FLG_ENTRY_ENC;
    const v1547 = v1545 === v1546;
    return v1547;
};
ZipEntry.encrypted = encrypted;
const isFile = function isFile() {
    const v1548 = this.isDirectory;
    const v1549 = !v1548;
    return v1549;
};
ZipEntry.isFile = isFile;
ZipEntry['is_class'] = true;
const FsRead = function FsRead(fd, buffer, offset, length, position, callback) {
    this.fd = fd;
    this.buffer = buffer;
    this.offset = offset;
    this.length = length;
    this.position = position;
    this.callback = callback;
    this.bytesRead = 0;
    this.waiting = false;
};
const read = function read(sync) {
    const v1550 = this.position;
    const v1551 = this.bytesRead;
    const v1552 = this.length;
    const v1553 = this.offset;
    const v1554 = StreamZip.debugLog('read', v1550, v1551, v1552, v1553);
    v1554;
    this.waiting = true;
    let err;
    if (sync) {
        let bytesRead = 0;
        try {
            const v1555 = this.fd;
            const v1556 = this.buffer;
            const v1557 = this.offset;
            const v1558 = this.bytesRead;
            const v1559 = v1557 + v1558;
            const v1560 = this.length;
            const v1561 = this.bytesRead;
            const v1562 = v1560 - v1561;
            const v1563 = this.position;
            const v1564 = this.bytesRead;
            const v1565 = v1563 + v1564;
            bytesRead = fs.readSync(v1555, v1556, v1559, v1562, v1565);
        } catch (e) {
            err = e;
        }
        let v1566;
        if (err) {
            v1566 = bytesRead;
        } else {
            v1566 = null;
        }
        const v1567 = this.readCallback(sync, err, v1566);
        v1567;
    } else {
        const v1568 = this.fd;
        const v1569 = this.buffer;
        const v1570 = this.offset;
        const v1571 = this.bytesRead;
        const v1572 = v1570 + v1571;
        const v1573 = this.length;
        const v1574 = this.bytesRead;
        const v1575 = v1573 - v1574;
        const v1576 = this.position;
        const v1577 = this.bytesRead;
        const v1578 = v1576 + v1577;
        const v1579 = this.readCallback;
        const v1580 = v1579.bind(this, sync);
        const v1581 = fs.read(v1568, v1569, v1572, v1575, v1578, v1580);
        v1581;
    }
};
FsRead.read = read;
const readCallback = function readCallback(sync, err, bytesRead) {
    const v1582 = typeof bytesRead;
    const v1583 = v1582 === 'number';
    if (v1583) {
        this.bytesRead += bytesRead;
    }
    const v1584 = !bytesRead;
    const v1585 = err || v1584;
    const v1586 = this.bytesRead;
    const v1587 = this.length;
    const v1588 = v1586 === v1587;
    const v1589 = v1585 || v1588;
    if (v1589) {
        this.waiting = false;
        const v1590 = this.bytesRead;
        const v1591 = this.callback(err, v1590);
        return v1591;
    } else {
        const v1592 = this.read(sync);
        v1592;
    }
};
FsRead.readCallback = readCallback;
FsRead['is_class'] = true;
const FileWindowBuffer = function FileWindowBuffer(fd) {
    this.position = 0;
    const v1593 = Buffer.alloc(0);
    this.buffer = v1593;
    this.fd = fd;
    this.fsOp = null;
};
const checkOp = function checkOp() {
    const v1594 = this.fsOp;
    const v1595 = this.fsOp;
    const v1596 = v1595.waiting;
    const v1597 = v1594 && v1596;
    if (v1597) {
        const v1598 = new Error('Operation in progress');
        throw v1598;
    }
};
FileWindowBuffer.checkOp = checkOp;
const read = function read(pos, length, callback) {
    const v1599 = this.checkOp();
    v1599;
    const v1600 = this.buffer;
    const v1601 = v1600.length;
    const v1602 = v1601 < length;
    if (v1602) {
        const v1603 = Buffer.alloc(length);
        this.buffer = v1603;
    }
    this.position = pos;
    const v1604 = this.fd;
    const v1605 = this.buffer;
    const v1606 = this.position;
    const v1607 = new FsRead(v1604, v1605, 0, length, v1606, callback);
    const v1608 = v1607.read();
    this.fsOp = v1608;
};
FileWindowBuffer.read = read;
const expandLeft = function expandLeft(length, callback) {
    const v1609 = this.checkOp();
    v1609;
    const v1610 = Buffer.alloc(length);
    const v1611 = this.buffer;
    const v1612 = [
        v1610,
        v1611
    ];
    const v1613 = Buffer.concat(v1612);
    this.buffer = v1613;
    this.position -= length;
    const v1614 = this.position;
    const v1615 = v1614 < 0;
    if (v1615) {
        this.position = 0;
    }
    const v1616 = this.fd;
    const v1617 = this.buffer;
    const v1618 = this.position;
    const v1619 = new FsRead(v1616, v1617, 0, length, v1618, callback);
    const v1620 = v1619.read();
    this.fsOp = v1620;
};
FileWindowBuffer.expandLeft = expandLeft;
const expandRight = function expandRight(length, callback) {
    const v1621 = this.checkOp();
    v1621;
    const v1622 = this.buffer;
    const offset = v1622.length;
    const v1623 = this.buffer;
    const v1624 = Buffer.alloc(length);
    const v1625 = [
        v1623,
        v1624
    ];
    const v1626 = Buffer.concat(v1625);
    this.buffer = v1626;
    const v1627 = this.fd;
    const v1628 = this.buffer;
    const v1629 = this.position;
    const v1630 = v1629 + offset;
    const v1631 = new FsRead(v1627, v1628, offset, length, v1630, callback);
    const v1632 = v1631.read();
    this.fsOp = v1632;
};
FileWindowBuffer.expandRight = expandRight;
const moveRight = function moveRight(length, callback, shift) {
    const v1633 = this.checkOp();
    v1633;
    if (shift) {
        const v1634 = this.buffer;
        const v1635 = this.buffer;
        const v1636 = v1634.copy(v1635, 0, shift);
        v1636;
    } else {
        shift = 0;
    }
    this.position += shift;
    const v1637 = this.fd;
    const v1638 = this.buffer;
    const v1639 = this.buffer;
    const v1640 = v1639.length;
    const v1641 = v1640 - shift;
    const v1642 = this.position;
    const v1643 = this.buffer;
    const v1644 = v1643.length;
    const v1645 = v1642 + v1644;
    const v1646 = v1645 - shift;
    const v1647 = new FsRead(v1637, v1638, v1641, shift, v1646, callback);
    const v1648 = v1647.read();
    this.fsOp = v1648;
};
FileWindowBuffer.moveRight = moveRight;
FileWindowBuffer['is_class'] = true;
const EntryDataReaderStream = function EntryDataReaderStream(fd, offset, length) {
    const v1650 = super();
    v1650;
    this.fd = fd;
    this.offset = offset;
    this.length = length;
    this.pos = 0;
    const v1651 = this.readCallback;
    const v1652 = v1651.bind(this);
    this.readCallback = v1652;
};
const _read = function _read(n) {
    const v1653 = this.length;
    const v1654 = this.pos;
    const v1655 = v1653 - v1654;
    const v1656 = Math.min(n, v1655);
    const buffer = Buffer.alloc(v1656);
    const v1657 = buffer.length;
    if (v1657) {
        const v1658 = this.fd;
        const v1659 = buffer.length;
        const v1660 = this.offset;
        const v1661 = this.pos;
        const v1662 = v1660 + v1661;
        const v1663 = this.readCallback;
        const v1664 = fs.read(v1658, buffer, 0, v1659, v1662, v1663);
        v1664;
    } else {
        const v1665 = this.push(null);
        v1665;
    }
};
EntryDataReaderStream._read = _read;
const readCallback = function readCallback(err, bytesRead, buffer) {
    this.pos += bytesRead;
    if (err) {
        const v1666 = this.emit('error', err);
        v1666;
        const v1667 = this.push(null);
        v1667;
    } else {
        const v1668 = !bytesRead;
        if (v1668) {
            const v1669 = this.push(null);
            v1669;
        } else {
            const v1670 = buffer.length;
            const v1671 = bytesRead !== v1670;
            if (v1671) {
                buffer = buffer.slice(0, bytesRead);
            }
            const v1672 = this.push(buffer);
            v1672;
        }
    }
};
EntryDataReaderStream.readCallback = readCallback;
EntryDataReaderStream['is_class'] = true;
const EntryVerifyStream = function EntryVerifyStream(baseStm, crc, size) {
    const v1674 = super();
    v1674;
    this.verify = new CrcVerify(crc, size);
    const v1676 = e => {
        const v1675 = this.emit('error', e);
        v1675;
    };
    const v1677 = baseStm.on('error', v1676);
    v1677;
};
const _transform = function _transform(data, encoding, callback) {
    let err;
    try {
        const v1678 = this.verify;
        const v1679 = v1678.data(data);
        v1679;
    } catch (e) {
        err = e;
    }
    const v1680 = callback(err, data);
    v1680;
};
EntryVerifyStream._transform = _transform;
EntryVerifyStream['is_class'] = true;
const CrcVerify = function CrcVerify(crc, size) {
    this.crc = crc;
    this.size = size;
    const v1681 = ~0;
    const v1682 = {};
    v1682.crc = v1681;
    v1682.size = 0;
    this.state = v1682;
};
const data = function data(data) {
    const crcTable = CrcVerify.getCrcTable();
    const v1683 = this.state;
    let crc = v1683.crc;
    let off = 0;
    let len = data.length;
    const v1684 = --len;
    let v1685 = v1684 >= 0;
    while (v1685) {
        const v1686 = off++;
        const v1687 = data[v1686];
        const v1688 = crc ^ v1687;
        const v1689 = v1688 & 255;
        const v1690 = crcTable[v1689];
        const v1691 = crc >>> 8;
        crc = v1690 ^ v1691;
        v1685 = v1684 >= 0;
    }
    const v1692 = this.state;
    v1692.crc = crc;
    const v1693 = this.state;
    const v1694 = data.length;
    v1693.size += v1694;
    const v1695 = this.state;
    const v1696 = v1695.size;
    const v1697 = this.size;
    const v1698 = v1696 >= v1697;
    if (v1698) {
        const buf = Buffer.alloc(4);
        const v1699 = this.state;
        const v1700 = v1699.crc;
        const v1701 = ~v1700;
        const v1702 = v1701 & 4294967295;
        const v1703 = buf.writeInt32LE(v1702, 0);
        v1703;
        crc = buf.readUInt32LE(0);
        const v1704 = this.crc;
        const v1705 = crc !== v1704;
        if (v1705) {
            const v1706 = new Error('Invalid CRC');
            throw v1706;
        }
        const v1707 = this.state;
        const v1708 = v1707.size;
        const v1709 = this.size;
        const v1710 = v1708 !== v1709;
        if (v1710) {
            const v1711 = new Error('Invalid size');
            throw v1711;
        }
    }
};
CrcVerify.data = data;
const getCrcTable = function getCrcTable() {
    let crcTable = CrcVerify.crcTable;
    const v1712 = !crcTable;
    if (v1712) {
        crcTable = [];
        CrcVerify.crcTable = crcTable;
        const b = Buffer.alloc(4);
        let n = 0;
        let v1713 = n < 256;
        while (v1713) {
            let c = n;
            let k = 8;
            const v1715 = --k;
            let v1716 = v1715 >= 0;
            while (v1716) {
                const v1717 = c & 1;
                const v1718 = v1717 !== 0;
                if (v1718) {
                    const v1719 = c >>> 1;
                    c = 3988292384 ^ v1719;
                } else {
                    c = c >>> 1;
                }
                v1716 = v1715 >= 0;
            }
            const v1720 = c < 0;
            if (v1720) {
                const v1721 = b.writeInt32LE(c, 0);
                v1721;
                c = b.readUInt32LE(0);
            }
            crcTable[n] = c;
            const v1714 = n++;
            v1713 = n < 256;
        }
    }
    return crcTable;
};
CrcVerify.getCrcTable = getCrcTable;
CrcVerify['is_class'] = true;
const parseZipTime = function (timebytes, datebytes) {
    const timebits = toBits(timebytes, 16);
    const datebits = toBits(datebytes, 16);
    const v1722 = timebits.slice(0, 5);
    const v1723 = v1722.join('');
    const v1724 = parseInt(v1723, 2);
    const v1725 = timebits.slice(5, 11);
    const v1726 = v1725.join('');
    const v1727 = parseInt(v1726, 2);
    const v1728 = timebits.slice(11, 16);
    const v1729 = v1728.join('');
    const v1730 = parseInt(v1729, 2);
    const v1731 = v1730 * 2;
    const v1732 = datebits.slice(0, 7);
    const v1733 = v1732.join('');
    const v1734 = parseInt(v1733, 2);
    const v1735 = v1734 + 1980;
    const v1736 = datebits.slice(7, 11);
    const v1737 = v1736.join('');
    const v1738 = parseInt(v1737, 2);
    const v1739 = datebits.slice(11, 16);
    const v1740 = v1739.join('');
    const v1741 = parseInt(v1740, 2);
    const mt = {};
    mt.h = v1724;
    mt.m = v1727;
    mt.s = v1731;
    mt.Y = v1735;
    mt.M = v1738;
    mt.D = v1741;
    const v1742 = mt.Y;
    const v1743 = mt.M;
    const v1744 = mt.D;
    const v1745 = [
        v1742,
        v1743,
        v1744
    ];
    const v1746 = v1745.join('-');
    const v1747 = v1746 + ' ';
    const v1748 = mt.h;
    const v1749 = mt.m;
    const v1750 = mt.s;
    const v1751 = [
        v1748,
        v1749,
        v1750
    ];
    const v1752 = v1751.join(':');
    const v1753 = v1747 + v1752;
    const dt_str = v1753 + ' GMT+0';
    const v1754 = new Date(dt_str);
    const v1755 = v1754.getTime();
    return v1755;
};
const toBits = function (dec, size) {
    const v1756 = dec >>> 0;
    let b = v1756.toString(2);
    const v1757 = b.length;
    let v1758 = v1757 < size;
    while (v1758) {
        b = '0' + b;
        v1758 = v1757 < size;
    }
    const v1759 = b.split('');
    return v1759;
};
const readUInt64LE = function (buffer, offset) {
    const v1760 = offset + 4;
    const v1761 = buffer.readUInt32LE(v1760);
    const v1762 = v1761 * 4294967296;
    const v1763 = buffer.readUInt32LE(offset);
    const v1764 = v1762 + v1763;
    return v1764;
};
module.exports = StreamZip;