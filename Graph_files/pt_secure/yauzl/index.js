var fs = require('fs');
var zlib = require('zlib');
var fd_slicer = require('./fd-slicer');
var crc32 = require('buffer-crc32');
var util = require('util');
const v742 = require('events');
var EventEmitter = v742.EventEmitter;
const v743 = require('stream');
var Transform = v743.Transform;
const v744 = require('stream');
var PassThrough = v744.PassThrough;
const v745 = require('stream');
var Writable = v745.Writable;
exports.open = open;
exports.fromFd = fromFd;
exports.fromBuffer = fromBuffer;
exports.fromRandomAccessReader = fromRandomAccessReader;
exports.dosDateTimeToDate = dosDateTimeToDate;
exports.getFileNameLowLevel = getFileNameLowLevel;
exports.validateFileName = validateFileName;
exports.parseExtraFields = parseExtraFields;
exports.ZipFile = ZipFile;
exports.Entry = Entry;
exports.LocalFileHeader = LocalFileHeader;
exports.RandomAccessReader = RandomAccessReader;
const open = function (path, options, callback) {
    const v746 = typeof options;
    const v747 = v746 === 'function';
    if (v747) {
        callback = options;
        options = null;
    }
    const v748 = options == null;
    if (v748) {
        options = {};
    }
    const v749 = options.autoClose;
    const v750 = v749 == null;
    if (v750) {
        options.autoClose = true;
    }
    const v751 = options.lazyEntries;
    const v752 = v751 == null;
    if (v752) {
        options.lazyEntries = false;
    }
    const v753 = options.decodeStrings;
    const v754 = v753 == null;
    if (v754) {
        options.decodeStrings = true;
    }
    const v755 = options.validateEntrySizes;
    const v756 = v755 == null;
    if (v756) {
        options.validateEntrySizes = true;
    }
    const v757 = options.strictFileNames;
    const v758 = v757 == null;
    if (v758) {
        options.strictFileNames = false;
    }
    const v759 = callback == null;
    if (v759) {
        callback = defaultCallback;
    }
    const v765 = function (err, fd) {
        if (err) {
            const v760 = callback(err);
            return v760;
        }
        const v763 = function (err, zipfile) {
            if (err) {
                const v761 = fs.close(fd, defaultCallback);
                v761;
            }
            const v762 = callback(err, zipfile);
            v762;
        };
        const v764 = fromFd(fd, options, v763);
        v764;
    };
    const v766 = fs.open(path, 'r', v765);
    v766;
};
const fromFd = function (fd, options, callback) {
    const v767 = typeof options;
    const v768 = v767 === 'function';
    if (v768) {
        callback = options;
        options = null;
    }
    const v769 = options == null;
    if (v769) {
        options = {};
    }
    const v770 = options.autoClose;
    const v771 = v770 == null;
    if (v771) {
        options.autoClose = false;
    }
    const v772 = options.lazyEntries;
    const v773 = v772 == null;
    if (v773) {
        options.lazyEntries = false;
    }
    const v774 = options.decodeStrings;
    const v775 = v774 == null;
    if (v775) {
        options.decodeStrings = true;
    }
    const v776 = options.validateEntrySizes;
    const v777 = v776 == null;
    if (v777) {
        options.validateEntrySizes = true;
    }
    const v778 = options.strictFileNames;
    const v779 = v778 == null;
    if (v779) {
        options.strictFileNames = false;
    }
    const v780 = callback == null;
    if (v780) {
        callback = defaultCallback;
    }
    const v785 = function (err, stats) {
        if (err) {
            const v781 = callback(err);
            return v781;
        }
        const v782 = { autoClose: true };
        var reader = fd_slicer.createFromFd(fd, v782);
        const v783 = stats.size;
        const v784 = fromRandomAccessReader(reader, v783, options, callback);
        v784;
    };
    const v786 = fs.fstat(fd, v785);
    v786;
};
const fromBuffer = function (buffer, options, callback) {
    const v787 = typeof options;
    const v788 = v787 === 'function';
    if (v788) {
        callback = options;
        options = null;
    }
    const v789 = options == null;
    if (v789) {
        options = {};
    }
    options.autoClose = false;
    const v790 = options.lazyEntries;
    const v791 = v790 == null;
    if (v791) {
        options.lazyEntries = false;
    }
    const v792 = options.decodeStrings;
    const v793 = v792 == null;
    if (v793) {
        options.decodeStrings = true;
    }
    const v794 = options.validateEntrySizes;
    const v795 = v794 == null;
    if (v795) {
        options.validateEntrySizes = true;
    }
    const v796 = options.strictFileNames;
    const v797 = v796 == null;
    if (v797) {
        options.strictFileNames = false;
    }
    const v798 = { maxChunkSize: 65536 };
    var reader = fd_slicer.createFromBuffer(buffer, v798);
    const v799 = buffer.length;
    const v800 = fromRandomAccessReader(reader, v799, options, callback);
    v800;
};
const fromRandomAccessReader = function (reader, totalSize, options, callback) {
    const v801 = typeof options;
    const v802 = v801 === 'function';
    if (v802) {
        callback = options;
        options = null;
    }
    const v803 = options == null;
    if (v803) {
        options = {};
    }
    const v804 = options.autoClose;
    const v805 = v804 == null;
    if (v805) {
        options.autoClose = true;
    }
    const v806 = options.lazyEntries;
    const v807 = v806 == null;
    if (v807) {
        options.lazyEntries = false;
    }
    const v808 = options.decodeStrings;
    const v809 = v808 == null;
    if (v809) {
        options.decodeStrings = true;
    }
    const v810 = options.decodeStrings;
    const v811 = !v810;
    const v812 = !v811;
    var decodeStrings = v812;
    const v813 = options.validateEntrySizes;
    const v814 = v813 == null;
    if (v814) {
        options.validateEntrySizes = true;
    }
    const v815 = options.strictFileNames;
    const v816 = v815 == null;
    if (v816) {
        options.strictFileNames = false;
    }
    const v817 = callback == null;
    if (v817) {
        callback = defaultCallback;
    }
    const v818 = typeof totalSize;
    const v819 = v818 !== 'number';
    if (v819) {
        const v820 = new Error('expected totalSize parameter to be a number');
        throw v820;
    }
    const v821 = Number.MAX_SAFE_INTEGER;
    const v822 = totalSize > v821;
    if (v822) {
        const v823 = new Error('zip file too large. only file sizes up to 2^52 are supported due to JavaScript\'s Number type being an IEEE 754 double.');
        throw v823;
    }
    const v824 = reader.ref();
    v824;
    var eocdrWithoutCommentSize = 22;
    var zip64EocdlSize = 20;
    var maxCommentSize = 65535;
    const v825 = zip64EocdlSize + eocdrWithoutCommentSize;
    const v826 = v825 + maxCommentSize;
    var bufferSize = Math.min(v826, totalSize);
    var buffer = newBuffer(bufferSize);
    const v827 = buffer.length;
    var bufferReadStart = totalSize - v827;
    const v882 = function (err) {
        if (err) {
            const v828 = callback(err);
            return v828;
        }
        var i = bufferSize - eocdrWithoutCommentSize;
        let v829 = i >= 0;
        while (v829) {
            const v830 = buffer.readUInt32LE(i);
            const v831 = v830 !== 101010256;
            if (v831) {
                continue;
            }
            var eocdrBuffer = buffer.subarray(i);
            var diskNumber = eocdrBuffer.readUInt16LE(4);
            var entryCount = eocdrBuffer.readUInt16LE(10);
            var centralDirectoryOffset = eocdrBuffer.readUInt32LE(16);
            var commentLength = eocdrBuffer.readUInt16LE(20);
            const v832 = eocdrBuffer.length;
            var expectedCommentLength = v832 - eocdrWithoutCommentSize;
            const v833 = commentLength !== expectedCommentLength;
            if (v833) {
                const v834 = 'Invalid comment length. Expected: ' + expectedCommentLength;
                const v835 = v834 + '. Found: ';
                const v836 = v835 + commentLength;
                const v837 = v836 + '. Are there extra bytes at the end of the file? Or is the end of central dir signature `PK\u263A\u263B` in the comment?';
                const v838 = new Error(v837);
                const v839 = callback(v838);
                return v839;
            }
            let comment;
            const v840 = eocdrBuffer.subarray(22);
            const v841 = decodeBuffer(v840, false);
            const v842 = eocdrBuffer.subarray(22);
            if (decodeStrings) {
                comment = v841;
            } else {
                comment = v842;
            }
            const v843 = i - zip64EocdlSize;
            const v844 = v843 >= 0;
            const v845 = i - zip64EocdlSize;
            const v846 = buffer.readUInt32LE(v845);
            const v847 = v846 === 117853008;
            const v848 = v844 && v847;
            if (v848) {
                const v849 = i - zip64EocdlSize;
                const v850 = i - zip64EocdlSize;
                const v851 = v850 + zip64EocdlSize;
                var zip64EocdlBuffer = buffer.subarray(v849, v851);
                var zip64EocdrOffset = readUInt64LE(zip64EocdlBuffer, 8);
                var zip64EocdrBuffer = newBuffer(56);
                const v852 = zip64EocdrBuffer.length;
                const v868 = function (err) {
                    if (err) {
                        const v853 = callback(err);
                        return v853;
                    }
                    const v854 = zip64EocdrBuffer.readUInt32LE(0);
                    const v855 = v854 !== 101075792;
                    if (v855) {
                        const v856 = new Error('invalid zip64 end of central directory record signature');
                        const v857 = callback(v856);
                        return v857;
                    }
                    diskNumber = zip64EocdrBuffer.readUInt32LE(16);
                    const v858 = diskNumber !== 0;
                    if (v858) {
                        const v859 = 'multi-disk zip files are not supported: found disk number: ' + diskNumber;
                        const v860 = new Error(v859);
                        const v861 = callback(v860);
                        return v861;
                    }
                    entryCount = readUInt64LE(zip64EocdrBuffer, 32);
                    centralDirectoryOffset = readUInt64LE(zip64EocdrBuffer, 48);
                    const v862 = options.autoClose;
                    const v863 = options.lazyEntries;
                    const v864 = options.validateEntrySizes;
                    const v865 = options.strictFileNames;
                    const v866 = new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, v862, v863, decodeStrings, v864, v865);
                    const v867 = callback(null, v866);
                    return v867;
                };
                const v869 = readAndAssertNoEof(reader, zip64EocdrBuffer, 0, v852, zip64EocdrOffset, v868);
                return v869;
            }
            const v870 = diskNumber !== 0;
            if (v870) {
                const v871 = 'multi-disk zip files are not supported: found disk number: ' + diskNumber;
                const v872 = new Error(v871);
                const v873 = callback(v872);
                return v873;
            }
            const v874 = options.autoClose;
            const v875 = options.lazyEntries;
            const v876 = options.validateEntrySizes;
            const v877 = options.strictFileNames;
            const v878 = new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, v874, v875, decodeStrings, v876, v877);
            const v879 = callback(null, v878);
            return v879;
            v829 = i >= 0;
        }
        const v880 = new Error('End of central directory record signature not found. Either not a zip file, or file is truncated.');
        const v881 = callback(v880);
        v881;
    };
    const v883 = readAndAssertNoEof(reader, buffer, 0, bufferSize, bufferReadStart, v882);
    v883;
};
const v884 = util.inherits(ZipFile, EventEmitter);
v884;
const ZipFile = function (reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, lazyEntries, decodeStrings, validateEntrySizes, strictFileNames) {
    var self = this;
    const v885 = EventEmitter.call(self);
    v885;
    self.reader = reader;
    const v886 = self.reader;
    const v888 = function (err) {
        const v887 = emitError(self, err);
        v887;
    };
    const v889 = v886.on('error', v888);
    v889;
    const v890 = self.reader;
    const v892 = function () {
        const v891 = self.emit('close');
        v891;
    };
    const v893 = v890.once('close', v892);
    v893;
    self.readEntryCursor = centralDirectoryOffset;
    self.fileSize = fileSize;
    self.entryCount = entryCount;
    self.comment = comment;
    self.entriesRead = 0;
    const v894 = !autoClose;
    const v895 = !v894;
    self.autoClose = v895;
    const v896 = !lazyEntries;
    const v897 = !v896;
    self.lazyEntries = v897;
    const v898 = !decodeStrings;
    const v899 = !v898;
    self.decodeStrings = v899;
    const v900 = !validateEntrySizes;
    const v901 = !v900;
    self.validateEntrySizes = v901;
    const v902 = !strictFileNames;
    const v903 = !v902;
    self.strictFileNames = v903;
    self.isOpen = true;
    self.emittedError = false;
    const v904 = self.lazyEntries;
    const v905 = !v904;
    if (v905) {
        const v906 = self._readEntry();
        v906;
    }
};
const v907 = ZipFile.prototype;
const v912 = function () {
    const v908 = this.isOpen;
    const v909 = !v908;
    if (v909) {
        return;
    }
    this.isOpen = false;
    const v910 = this.reader;
    const v911 = v910.unref();
    v911;
};
v907.close = v912;
const emitErrorAndAutoClose = function (self, err) {
    const v913 = self.autoClose;
    if (v913) {
        const v914 = self.close();
        v914;
    }
    const v915 = emitError(self, err);
    v915;
};
const emitError = function (self, err) {
    const v916 = self.emittedError;
    if (v916) {
        return;
    }
    self.emittedError = true;
    const v917 = self.emit('error', err);
    v917;
};
const v918 = ZipFile.prototype;
const v923 = function () {
    const v919 = this.lazyEntries;
    const v920 = !v919;
    if (v920) {
        const v921 = new Error('readEntry() called without lazyEntries:true');
        throw v921;
    }
    const v922 = this._readEntry();
    v922;
};
v918.readEntry = v923;
const v924 = ZipFile.prototype;
const v1056 = function () {
    var self = this;
    const v925 = self.entryCount;
    const v926 = self.entriesRead;
    const v927 = v925 === v926;
    if (v927) {
        const v932 = function () {
            const v928 = self.autoClose;
            if (v928) {
                const v929 = self.close();
                v929;
            }
            const v930 = self.emittedError;
            if (v930) {
                return;
            }
            const v931 = self.emit('end');
            v931;
        };
        const v933 = setImmediate(v932);
        v933;
        return;
    }
    const v934 = self.emittedError;
    if (v934) {
        return;
    }
    var buffer = newBuffer(46);
    const v935 = self.reader;
    const v936 = buffer.length;
    const v937 = self.readEntryCursor;
    const v1054 = function (err) {
        if (err) {
            const v938 = emitErrorAndAutoClose(self, err);
            return v938;
        }
        const v939 = self.emittedError;
        if (v939) {
            return;
        }
        var entry = new Entry();
        var signature = buffer.readUInt32LE(0);
        const v940 = signature !== 33639248;
        if (v940) {
            const v941 = signature.toString(16);
            const v942 = 'invalid central directory file header signature: 0x' + v941;
            const v943 = new Error(v942);
            const v944 = emitErrorAndAutoClose(self, v943);
            return v944;
        }
        const v945 = buffer.readUInt16LE(4);
        entry.versionMadeBy = v945;
        const v946 = buffer.readUInt16LE(6);
        entry.versionNeededToExtract = v946;
        const v947 = buffer.readUInt16LE(8);
        entry.generalPurposeBitFlag = v947;
        const v948 = buffer.readUInt16LE(10);
        entry.compressionMethod = v948;
        const v949 = buffer.readUInt16LE(12);
        entry.lastModFileTime = v949;
        const v950 = buffer.readUInt16LE(14);
        entry.lastModFileDate = v950;
        const v951 = buffer.readUInt32LE(16);
        entry.crc32 = v951;
        const v952 = buffer.readUInt32LE(20);
        entry.compressedSize = v952;
        const v953 = buffer.readUInt32LE(24);
        entry.uncompressedSize = v953;
        const v954 = buffer.readUInt16LE(28);
        entry.fileNameLength = v954;
        const v955 = buffer.readUInt16LE(30);
        entry.extraFieldLength = v955;
        const v956 = buffer.readUInt16LE(32);
        entry.fileCommentLength = v956;
        const v957 = buffer.readUInt16LE(36);
        entry.internalFileAttributes = v957;
        const v958 = buffer.readUInt32LE(38);
        entry.externalFileAttributes = v958;
        const v959 = buffer.readUInt32LE(42);
        entry.relativeOffsetOfLocalHeader = v959;
        const v960 = entry.generalPurposeBitFlag;
        const v961 = v960 & 64;
        if (v961) {
            const v962 = new Error('strong encryption is not supported');
            const v963 = emitErrorAndAutoClose(self, v962);
            return v963;
        }
        self.readEntryCursor += 46;
        const v964 = entry.fileNameLength;
        const v965 = entry.extraFieldLength;
        const v966 = v964 + v965;
        const v967 = entry.fileCommentLength;
        const v968 = v966 + v967;
        buffer = newBuffer(v968);
        const v969 = self.reader;
        const v970 = buffer.length;
        const v971 = self.readEntryCursor;
        const v1052 = function (err) {
            if (err) {
                const v972 = emitErrorAndAutoClose(self, err);
                return v972;
            }
            const v973 = self.emittedError;
            if (v973) {
                return;
            }
            const v974 = entry.fileNameLength;
            const v975 = buffer.subarray(0, v974);
            entry.fileNameRaw = v975;
            const v976 = entry.fileNameLength;
            const v977 = entry.extraFieldLength;
            var fileCommentStart = v976 + v977;
            const v978 = entry.fileNameLength;
            const v979 = buffer.subarray(v978, fileCommentStart);
            entry.extraFieldRaw = v979;
            const v980 = entry.fileCommentLength;
            const v981 = fileCommentStart + v980;
            const v982 = buffer.subarray(fileCommentStart, v981);
            entry.fileCommentRaw = v982;
            try {
                const v983 = entry.extraFieldRaw;
                const v984 = parseExtraFields(v983);
                entry.extraFields = v984;
            } catch (err) {
                const v985 = emitErrorAndAutoClose(self, err);
                return v985;
            }
            const v986 = self.decodeStrings;
            if (v986) {
                const v987 = entry.generalPurposeBitFlag;
                const v988 = v987 & 2048;
                var isUtf8 = v988 !== 0;
                const v989 = entry.fileCommentRaw;
                const v990 = decodeBuffer(v989, isUtf8);
                entry.fileComment = v990;
                const v991 = entry.generalPurposeBitFlag;
                const v992 = entry.fileNameRaw;
                const v993 = entry.extraFields;
                const v994 = self.strictFileNames;
                const v995 = getFileNameLowLevel(v991, v992, v993, v994);
                entry.fileName = v995;
                const v996 = entry.fileName;
                var errorMessage = validateFileName(v996);
                const v997 = errorMessage != null;
                if (v997) {
                    const v998 = new Error(errorMessage);
                    const v999 = emitErrorAndAutoClose(self, v998);
                    return v999;
                }
            } else {
                const v1000 = entry.fileCommentRaw;
                entry.fileComment = v1000;
                const v1001 = entry.fileNameRaw;
                entry.fileName = v1001;
            }
            const v1002 = entry.fileComment;
            entry.comment = v1002;
            const v1003 = buffer.length;
            self.readEntryCursor += v1003;
            self.entriesRead += 1;
            var i = 0;
            const v1004 = entry.extraFields;
            const v1005 = v1004.length;
            let v1006 = i < v1005;
            while (v1006) {
                const v1008 = entry.extraFields;
                var extraField = v1008[i];
                const v1009 = extraField.id;
                const v1010 = v1009 !== 1;
                if (v1010) {
                    continue;
                }
                var zip64EiefBuffer = extraField.data;
                var index = 0;
                const v1011 = entry.uncompressedSize;
                const v1012 = v1011 === 4294967295;
                if (v1012) {
                    const v1013 = index + 8;
                    const v1014 = zip64EiefBuffer.length;
                    const v1015 = v1013 > v1014;
                    if (v1015) {
                        const v1016 = new Error('zip64 extended information extra field does not include uncompressed size');
                        const v1017 = emitErrorAndAutoClose(self, v1016);
                        return v1017;
                    }
                    const v1018 = readUInt64LE(zip64EiefBuffer, index);
                    entry.uncompressedSize = v1018;
                    index += 8;
                }
                const v1019 = entry.compressedSize;
                const v1020 = v1019 === 4294967295;
                if (v1020) {
                    const v1021 = index + 8;
                    const v1022 = zip64EiefBuffer.length;
                    const v1023 = v1021 > v1022;
                    if (v1023) {
                        const v1024 = new Error('zip64 extended information extra field does not include compressed size');
                        const v1025 = emitErrorAndAutoClose(self, v1024);
                        return v1025;
                    }
                    const v1026 = readUInt64LE(zip64EiefBuffer, index);
                    entry.compressedSize = v1026;
                    index += 8;
                }
                const v1027 = entry.relativeOffsetOfLocalHeader;
                const v1028 = v1027 === 4294967295;
                if (v1028) {
                    const v1029 = index + 8;
                    const v1030 = zip64EiefBuffer.length;
                    const v1031 = v1029 > v1030;
                    if (v1031) {
                        const v1032 = new Error('zip64 extended information extra field does not include relative header offset');
                        const v1033 = emitErrorAndAutoClose(self, v1032);
                        return v1033;
                    }
                    const v1034 = readUInt64LE(zip64EiefBuffer, index);
                    entry.relativeOffsetOfLocalHeader = v1034;
                    index += 8;
                }
                break;
                const v1007 = i++;
                v1006 = i < v1005;
            }
            const v1035 = self.validateEntrySizes;
            const v1036 = entry.compressionMethod;
            const v1037 = v1036 === 0;
            const v1038 = v1035 && v1037;
            if (v1038) {
                var expectedCompressedSize = entry.uncompressedSize;
                const v1039 = entry.isEncrypted();
                if (v1039) {
                    expectedCompressedSize += 12;
                }
                const v1040 = entry.compressedSize;
                const v1041 = v1040 !== expectedCompressedSize;
                if (v1041) {
                    const v1042 = entry.compressedSize;
                    const v1043 = 'compressed/uncompressed size mismatch for stored file: ' + v1042;
                    const v1044 = v1043 + ' != ';
                    const v1045 = entry.uncompressedSize;
                    var msg = v1044 + v1045;
                    const v1046 = new Error(msg);
                    const v1047 = emitErrorAndAutoClose(self, v1046);
                    return v1047;
                }
            }
            const v1048 = self.emit('entry', entry);
            v1048;
            const v1049 = self.lazyEntries;
            const v1050 = !v1049;
            if (v1050) {
                const v1051 = self._readEntry();
                v1051;
            }
        };
        const v1053 = readAndAssertNoEof(v969, buffer, 0, v970, v971, v1052);
        v1053;
    };
    const v1055 = readAndAssertNoEof(v935, buffer, 0, v936, v937, v1054);
    v1055;
};
v924._readEntry = v1056;
const v1057 = ZipFile.prototype;
const v1147 = function (entry, options, callback) {
    var self = this;
    var relativeStart = 0;
    var relativeEnd = entry.compressedSize;
    const v1058 = callback == null;
    if (v1058) {
        callback = options;
        options = null;
    }
    const v1059 = options == null;
    if (v1059) {
        options = {};
    } else {
        const v1060 = options.decrypt;
        const v1061 = v1060 != null;
        if (v1061) {
            const v1062 = entry.isEncrypted();
            const v1063 = !v1062;
            if (v1063) {
                const v1064 = new Error('options.decrypt can only be specified for encrypted entries');
                throw v1064;
            }
            const v1065 = options.decrypt;
            const v1066 = v1065 !== false;
            if (v1066) {
                const v1067 = options.decrypt;
                const v1068 = 'invalid options.decrypt value: ' + v1067;
                const v1069 = new Error(v1068);
                throw v1069;
            }
            const v1070 = entry.isCompressed();
            if (v1070) {
                const v1071 = options.decompress;
                const v1072 = v1071 !== false;
                if (v1072) {
                    const v1073 = new Error('entry is encrypted and compressed, and options.decompress !== false');
                    throw v1073;
                }
            }
        }
        const v1074 = options.decompress;
        const v1075 = v1074 != null;
        if (v1075) {
            const v1076 = entry.isCompressed();
            const v1077 = !v1076;
            if (v1077) {
                const v1078 = new Error('options.decompress can only be specified for compressed entries');
                throw v1078;
            }
            const v1079 = options.decompress;
            const v1080 = v1079 === false;
            const v1081 = options.decompress;
            const v1082 = v1081 === true;
            const v1083 = v1080 || v1082;
            const v1084 = !v1083;
            if (v1084) {
                const v1085 = options.decompress;
                const v1086 = 'invalid options.decompress value: ' + v1085;
                const v1087 = new Error(v1086);
                throw v1087;
            }
        }
        const v1088 = options.start;
        const v1089 = v1088 != null;
        const v1090 = options.end;
        const v1091 = v1090 != null;
        const v1092 = v1089 || v1091;
        if (v1092) {
            const v1093 = entry.isCompressed();
            const v1094 = options.decompress;
            const v1095 = v1094 !== false;
            const v1096 = v1093 && v1095;
            if (v1096) {
                const v1097 = new Error('start/end range not allowed for compressed entry without options.decompress === false');
                throw v1097;
            }
            const v1098 = entry.isEncrypted();
            const v1099 = options.decrypt;
            const v1100 = v1099 !== false;
            const v1101 = v1098 && v1100;
            if (v1101) {
                const v1102 = new Error('start/end range not allowed for encrypted entry without options.decrypt === false');
                throw v1102;
            }
        }
        const v1103 = options.start;
        const v1104 = v1103 != null;
        if (v1104) {
            relativeStart = options.start;
            const v1105 = relativeStart < 0;
            if (v1105) {
                const v1106 = new Error('options.start < 0');
                throw v1106;
            }
            const v1107 = entry.compressedSize;
            const v1108 = relativeStart > v1107;
            if (v1108) {
                const v1109 = new Error('options.start > entry.compressedSize');
                throw v1109;
            }
        }
        const v1110 = options.end;
        const v1111 = v1110 != null;
        if (v1111) {
            relativeEnd = options.end;
            const v1112 = relativeEnd < 0;
            if (v1112) {
                const v1113 = new Error('options.end < 0');
                throw v1113;
            }
            const v1114 = entry.compressedSize;
            const v1115 = relativeEnd > v1114;
            if (v1115) {
                const v1116 = new Error('options.end > entry.compressedSize');
                throw v1116;
            }
            const v1117 = relativeEnd < relativeStart;
            if (v1117) {
                const v1118 = new Error('options.end < options.start');
                throw v1118;
            }
        }
    }
    const v1119 = self.isOpen;
    const v1120 = !v1119;
    if (v1120) {
        const v1121 = new Error('closed');
        const v1122 = callback(v1121);
        return v1122;
    }
    const v1123 = entry.isEncrypted();
    if (v1123) {
        const v1124 = options.decrypt;
        const v1125 = v1124 !== false;
        if (v1125) {
            const v1126 = new Error('entry is encrypted, and options.decrypt !== false');
            const v1127 = callback(v1126);
            return v1127;
        }
    }
    var decompress;
    const v1128 = entry.compressionMethod;
    const v1129 = v1128 === 0;
    if (v1129) {
        decompress = false;
    } else {
        const v1130 = entry.compressionMethod;
        const v1131 = v1130 === 8;
        if (v1131) {
            const v1132 = options.decompress;
            const v1133 = v1132 != null;
            const v1134 = options.decompress;
            if (v1133) {
                decompress = v1134;
            } else {
                decompress = true;
            }
        } else {
            const v1135 = entry.compressionMethod;
            const v1136 = 'unsupported compression method: ' + v1135;
            const v1137 = new Error(v1136);
            const v1138 = callback(v1137);
            return v1138;
        }
    }
    const v1139 = { minimal: true };
    const v1145 = function (err, localFileHeader) {
        if (err) {
            const v1140 = callback(err);
            return v1140;
        }
        const v1141 = localFileHeader.fileDataStart;
        const v1142 = entry.compressedSize;
        const v1143 = entry.uncompressedSize;
        const v1144 = self.openReadStreamLowLevel(v1141, v1142, relativeStart, relativeEnd, decompress, v1143, callback);
        v1144;
    };
    const v1146 = self.readLocalFileHeader(entry, v1139, v1145);
    v1146;
};
v1057.openReadStream = v1147;
const v1148 = ZipFile.prototype;
const v1175 = function (fileDataStart, compressedSize, relativeStart, relativeEnd, decompress, uncompressedSize, callback) {
    var self = this;
    var fileDataEnd = fileDataStart + compressedSize;
    const v1149 = self.reader;
    const v1150 = fileDataStart + relativeStart;
    const v1151 = fileDataStart + relativeEnd;
    const v1152 = {
        start: v1150,
        end: v1151
    };
    var readStream = v1149.createReadStream(v1152);
    var endpointStream = readStream;
    if (decompress) {
        var destroyed = false;
        var inflateFilter = zlib.createInflateRaw();
        const v1157 = function (err) {
            const v1155 = function () {
                const v1153 = !destroyed;
                if (v1153) {
                    const v1154 = inflateFilter.emit('error', err);
                    v1154;
                }
            };
            const v1156 = setImmediate(v1155);
            v1156;
        };
        const v1158 = readStream.on('error', v1157);
        v1158;
        const v1159 = readStream.pipe(inflateFilter);
        v1159;
        const v1160 = self.validateEntrySizes;
        if (v1160) {
            endpointStream = new AssertByteCountStream(uncompressedSize);
            const v1165 = function (err) {
                const v1163 = function () {
                    const v1161 = !destroyed;
                    if (v1161) {
                        const v1162 = endpointStream.emit('error', err);
                        v1162;
                    }
                };
                const v1164 = setImmediate(v1163);
                v1164;
            };
            const v1166 = inflateFilter.on('error', v1165);
            v1166;
            const v1167 = inflateFilter.pipe(endpointStream);
            v1167;
        } else {
            endpointStream = inflateFilter;
        }
        const v1172 = function () {
            destroyed = true;
            const v1168 = inflateFilter !== endpointStream;
            if (v1168) {
                const v1169 = inflateFilter.unpipe(endpointStream);
                v1169;
            }
            const v1170 = readStream.unpipe(inflateFilter);
            v1170;
            const v1171 = readStream.destroy();
            v1171;
        };
        const v1173 = installDestroyFn(endpointStream, v1172);
        v1173;
    }
    const v1174 = callback(null, endpointStream);
    v1174;
};
v1148.openReadStreamLowLevel = v1175;
const v1176 = ZipFile.prototype;
const v1236 = function (entry, options, callback) {
    var self = this;
    const v1177 = callback == null;
    if (v1177) {
        callback = options;
        options = null;
    }
    const v1178 = options == null;
    if (v1178) {
        options = {};
    }
    const v1179 = self.reader;
    const v1180 = v1179.ref();
    v1180;
    var buffer = newBuffer(30);
    const v1181 = self.reader;
    const v1182 = buffer.length;
    const v1183 = entry.relativeOffsetOfLocalHeader;
    const v1234 = function (err) {
        try {
            if (err) {
                const v1184 = callback(err);
                return v1184;
            }
            var signature = buffer.readUInt32LE(0);
            const v1185 = signature !== 67324752;
            if (v1185) {
                const v1186 = signature.toString(16);
                const v1187 = 'invalid local file header signature: 0x' + v1186;
                const v1188 = new Error(v1187);
                const v1189 = callback(v1188);
                return v1189;
            }
            var fileNameLength = buffer.readUInt16LE(26);
            var extraFieldLength = buffer.readUInt16LE(28);
            const v1190 = entry.relativeOffsetOfLocalHeader;
            const v1191 = v1190 + 30;
            const v1192 = v1191 + fileNameLength;
            var fileDataStart = v1192 + extraFieldLength;
            const v1193 = entry.compressedSize;
            const v1194 = fileDataStart + v1193;
            const v1195 = self.fileSize;
            const v1196 = v1194 > v1195;
            if (v1196) {
                const v1197 = 'file data overflows file bounds: ' + fileDataStart;
                const v1198 = v1197 + ' + ';
                const v1199 = entry.compressedSize;
                const v1200 = v1198 + v1199;
                const v1201 = v1200 + ' > ';
                const v1202 = self.fileSize;
                const v1203 = v1201 + v1202;
                const v1204 = new Error(v1203);
                const v1205 = callback(v1204);
                return v1205;
            }
            const v1206 = options.minimal;
            if (v1206) {
                const v1207 = { fileDataStart: fileDataStart };
                const v1208 = callback(null, v1207);
                return v1208;
            }
            var localFileHeader = new LocalFileHeader();
            localFileHeader.fileDataStart = fileDataStart;
            const v1209 = buffer.readUInt16LE(4);
            localFileHeader.versionNeededToExtract = v1209;
            const v1210 = buffer.readUInt16LE(6);
            localFileHeader.generalPurposeBitFlag = v1210;
            const v1211 = buffer.readUInt16LE(8);
            localFileHeader.compressionMethod = v1211;
            const v1212 = buffer.readUInt16LE(10);
            localFileHeader.lastModFileTime = v1212;
            const v1213 = buffer.readUInt16LE(12);
            localFileHeader.lastModFileDate = v1213;
            const v1214 = buffer.readUInt32LE(14);
            localFileHeader.crc32 = v1214;
            const v1215 = buffer.readUInt32LE(18);
            localFileHeader.compressedSize = v1215;
            const v1216 = buffer.readUInt32LE(22);
            localFileHeader.uncompressedSize = v1216;
            localFileHeader.fileNameLength = fileNameLength;
            localFileHeader.extraFieldLength = extraFieldLength;
            const v1217 = fileNameLength + extraFieldLength;
            buffer = newBuffer(v1217);
            const v1218 = self.reader;
            const v1219 = v1218.ref();
            v1219;
            const v1220 = self.reader;
            const v1221 = buffer.length;
            const v1222 = entry.relativeOffsetOfLocalHeader;
            const v1223 = v1222 + 30;
            const v1230 = function (err) {
                try {
                    if (err) {
                        const v1224 = callback(err);
                        return v1224;
                    }
                    const v1225 = buffer.subarray(0, fileNameLength);
                    localFileHeader.fileName = v1225;
                    const v1226 = buffer.subarray(fileNameLength);
                    localFileHeader.extraField = v1226;
                    const v1227 = callback(null, localFileHeader);
                    return v1227;
                } finally {
                    const v1228 = self.reader;
                    const v1229 = v1228.unref();
                    v1229;
                }
            };
            const v1231 = readAndAssertNoEof(v1220, buffer, 0, v1221, v1223, v1230);
            v1231;
        } finally {
            const v1232 = self.reader;
            const v1233 = v1232.unref();
            v1233;
        }
    };
    const v1235 = readAndAssertNoEof(v1181, buffer, 0, v1182, v1183, v1234);
    v1235;
};
v1176.readLocalFileHeader = v1236;
const Entry = function () {
};
const v1237 = Entry.prototype;
const v1275 = function (options) {
    const v1238 = options == null;
    if (v1238) {
        options = {};
    }
    const v1239 = options.forceDosFormat;
    const v1240 = !v1239;
    if (v1240) {
        var i = 0;
        const v1241 = this.extraFields;
        const v1242 = v1241.length;
        let v1243 = i < v1242;
        while (v1243) {
            const v1245 = this.extraFields;
            var extraField = v1245[i];
            const v1246 = extraField.id;
            const v1247 = v1246 === 21589;
            if (v1247) {
                var data = extraField.data;
                const v1248 = data.length;
                const v1249 = v1248 < 5;
                if (v1249) {
                    continue;
                }
                var flags = data[0];
                var HAS_MTIME = 1;
                const v1250 = flags & HAS_MTIME;
                const v1251 = !v1250;
                if (v1251) {
                    continue;
                }
                var posixTimestamp = data.readInt32LE(1);
                const v1252 = posixTimestamp * 1000;
                const v1253 = new Date(v1252);
                return v1253;
            } else {
                const v1254 = extraField.id;
                const v1255 = v1254 === 10;
                if (v1255) {
                    var data = extraField.data;
                    var cursor = 4;
                    const v1256 = data.length;
                    const v1257 = v1256 + 4;
                    let v1258 = cursor < v1257;
                    while (v1258) {
                        var tag = data.readUInt16LE(cursor);
                        cursor += 2;
                        var size = data.readUInt16LE(cursor);
                        cursor += 2;
                        const v1259 = tag !== 1;
                        if (v1259) {
                            cursor += size;
                            continue;
                        }
                        const v1260 = size < 8;
                        const v1261 = cursor + size;
                        const v1262 = data.length;
                        const v1263 = v1261 > v1262;
                        const v1264 = v1260 || v1263;
                        if (v1264) {
                            break;
                        }
                        const v1265 = cursor + 4;
                        const v1266 = data.readInt32LE(v1265);
                        const v1267 = 4294967296 * v1266;
                        const v1268 = data.readUInt32LE(cursor);
                        var hundredNanoSecondsSince1601 = v1267 + v1268;
                        const v1269 = hundredNanoSecondsSince1601 / 10000;
                        var millisecondsSince1970 = v1269 - 11644473600000;
                        const v1270 = new Date(millisecondsSince1970);
                        return v1270;
                        v1258 = cursor < v1257;
                    }
                }
            }
            const v1244 = i++;
            v1243 = i < v1242;
        }
    }
    const v1271 = this.lastModFileDate;
    const v1272 = this.lastModFileTime;
    const v1273 = options.timezone;
    const v1274 = dosDateTimeToDate(v1271, v1272, v1273);
    return v1274;
};
v1237.getLastModDate = v1275;
const v1276 = Entry.prototype;
const v1280 = function () {
    const v1277 = this.generalPurposeBitFlag;
    const v1278 = v1277 & 1;
    const v1279 = v1278 !== 0;
    return v1279;
};
v1276.isEncrypted = v1280;
const v1281 = Entry.prototype;
const v1284 = function () {
    const v1282 = this.compressionMethod;
    const v1283 = v1282 === 8;
    return v1283;
};
v1281.isCompressed = v1284;
const LocalFileHeader = function () {
};
const dosDateTimeToDate = function (date, time, timezone) {
    var day = date & 31;
    const v1285 = date >> 5;
    const v1286 = v1285 & 15;
    var month = v1286 - 1;
    const v1287 = date >> 9;
    const v1288 = v1287 & 127;
    var year = v1288 + 1980;
    var millisecond = 0;
    const v1289 = time & 31;
    var second = v1289 * 2;
    const v1290 = time >> 5;
    var minute = v1290 & 63;
    const v1291 = time >> 11;
    var hour = v1291 & 31;
    const v1292 = timezone == null;
    const v1293 = timezone === 'local';
    const v1294 = v1292 || v1293;
    if (v1294) {
        const v1295 = new Date(year, month, day, hour, minute, second, millisecond);
        return v1295;
    } else {
        const v1296 = timezone === 'UTC';
        if (v1296) {
            const v1297 = Date.UTC(year, month, day, hour, minute, second, millisecond);
            const v1298 = new Date(v1297);
            return v1298;
        } else {
            const v1299 = options.timezone;
            const v1300 = 'unrecognized options.timezone: ' + v1299;
            const v1301 = new Error(v1300);
            throw v1301;
        }
    }
};
const getFileNameLowLevel = function (generalPurposeBitFlag, fileNameBuffer, extraFields, strictFileNames) {
    var fileName = null;
    var i = 0;
    const v1302 = extraFields.length;
    let v1303 = i < v1302;
    while (v1303) {
        var extraField = extraFields[i];
        const v1305 = extraField.id;
        const v1306 = v1305 === 28789;
        if (v1306) {
            const v1307 = extraField.data;
            const v1308 = v1307.length;
            const v1309 = v1308 < 6;
            if (v1309) {
                continue;
            }
            const v1310 = extraField.data;
            const v1311 = v1310.readUInt8(0);
            const v1312 = v1311 !== 1;
            if (v1312) {
                continue;
            }
            const v1313 = extraField.data;
            var oldNameCrc32 = v1313.readUInt32LE(1);
            const v1314 = crc32.unsigned(fileNameBuffer);
            const v1315 = v1314 !== oldNameCrc32;
            if (v1315) {
                continue;
            }
            const v1316 = extraField.data;
            const v1317 = v1316.subarray(5);
            fileName = decodeBuffer(v1317, true);
            break;
        }
        const v1304 = i++;
        v1303 = i < v1302;
    }
    const v1318 = fileName == null;
    if (v1318) {
        const v1319 = generalPurposeBitFlag & 2048;
        var isUtf8 = v1319 !== 0;
        fileName = decodeBuffer(fileNameBuffer, isUtf8);
    }
    const v1320 = !strictFileNames;
    if (v1320) {
        fileName = fileName.replace(/\\/g, '/');
    }
    return fileName;
};
const validateFileName = function (fileName) {
    const v1321 = fileName.indexOf('\\');
    const v1322 = -1;
    const v1323 = v1321 !== v1322;
    if (v1323) {
        const v1324 = 'invalid characters in fileName: ' + fileName;
        return v1324;
    }
    const v1325 = /^[a-zA-Z]:/.test(fileName);
    const v1326 = /^\//.test(fileName);
    const v1327 = v1325 || v1326;
    if (v1327) {
        const v1328 = 'absolute path: ' + fileName;
        return v1328;
    }
    const v1329 = fileName.split('/');
    const v1330 = v1329.indexOf('..');
    const v1331 = -1;
    const v1332 = v1330 !== v1331;
    if (v1332) {
        const v1333 = 'invalid relative path: ' + fileName;
        return v1333;
    }
    return null;
};
const parseExtraFields = function (extraFieldBuffer) {
    var extraFields = [];
    var i = 0;
    const v1334 = extraFieldBuffer.length;
    const v1335 = v1334 - 3;
    let v1336 = i < v1335;
    while (v1336) {
        const v1337 = i + 0;
        var headerId = extraFieldBuffer.readUInt16LE(v1337);
        const v1338 = i + 2;
        var dataSize = extraFieldBuffer.readUInt16LE(v1338);
        var dataStart = i + 4;
        var dataEnd = dataStart + dataSize;
        const v1339 = extraFieldBuffer.length;
        const v1340 = dataEnd > v1339;
        if (v1340) {
            const v1341 = new Error('extra field length exceeds extra field buffer size');
            throw v1341;
        }
        var dataBuffer = extraFieldBuffer.subarray(dataStart, dataEnd);
        const v1342 = {
            id: headerId,
            data: dataBuffer
        };
        const v1343 = extraFields.push(v1342);
        v1343;
        i = dataEnd;
        v1336 = i < v1335;
    }
    return extraFields;
};
const readAndAssertNoEof = function (reader, buffer, offset, length, position, callback) {
    const v1344 = length === 0;
    if (v1344) {
        const v1347 = function () {
            const v1345 = newBuffer(0);
            const v1346 = callback(null, v1345);
            v1346;
        };
        const v1348 = setImmediate(v1347);
        return v1348;
    }
    const v1354 = function (err, bytesRead) {
        if (err) {
            const v1349 = callback(err);
            return v1349;
        }
        const v1350 = bytesRead < length;
        if (v1350) {
            const v1351 = new Error('unexpected EOF');
            const v1352 = callback(v1351);
            return v1352;
        }
        const v1353 = callback();
        v1353;
    };
    const v1355 = reader.read(buffer, offset, length, position, v1354);
    v1355;
};
const v1356 = util.inherits(AssertByteCountStream, Transform);
v1356;
const AssertByteCountStream = function (byteCount) {
    const v1357 = Transform.call(this);
    v1357;
    this.actualByteCount = 0;
    this.expectedByteCount = byteCount;
};
const v1358 = AssertByteCountStream.prototype;
const v1370 = function (chunk, encoding, cb) {
    const v1359 = chunk.length;
    this.actualByteCount += v1359;
    const v1360 = this.actualByteCount;
    const v1361 = this.expectedByteCount;
    const v1362 = v1360 > v1361;
    if (v1362) {
        const v1363 = this.expectedByteCount;
        const v1364 = 'too many bytes in the stream. expected ' + v1363;
        const v1365 = v1364 + '. got at least ';
        const v1366 = this.actualByteCount;
        var msg = v1365 + v1366;
        const v1367 = new Error(msg);
        const v1368 = cb(v1367);
        return v1368;
    }
    const v1369 = cb(null, chunk);
    v1369;
};
v1358._transform = v1370;
const v1371 = AssertByteCountStream.prototype;
const v1382 = function (cb) {
    const v1372 = this.actualByteCount;
    const v1373 = this.expectedByteCount;
    const v1374 = v1372 < v1373;
    if (v1374) {
        const v1375 = this.expectedByteCount;
        const v1376 = 'not enough bytes in the stream. expected ' + v1375;
        const v1377 = v1376 + '. got only ';
        const v1378 = this.actualByteCount;
        var msg = v1377 + v1378;
        const v1379 = new Error(msg);
        const v1380 = cb(v1379);
        return v1380;
    }
    const v1381 = cb();
    v1381;
};
v1371._flush = v1382;
const v1383 = util.inherits(RandomAccessReader, EventEmitter);
v1383;
const RandomAccessReader = function () {
    const v1384 = EventEmitter.call(this);
    v1384;
    this.refCount = 0;
};
const v1385 = RandomAccessReader.prototype;
const v1386 = function () {
    this.refCount += 1;
};
v1385.ref = v1386;
const v1387 = RandomAccessReader.prototype;
const v1396 = function () {
    var self = this;
    self.refCount -= 1;
    const v1388 = self.refCount;
    const v1389 = v1388 > 0;
    if (v1389) {
        return;
    }
    const v1390 = self.refCount;
    const v1391 = v1390 < 0;
    if (v1391) {
        const v1392 = new Error('invalid unref');
        throw v1392;
    }
    const v1393 = self.close(onCloseDone);
    v1393;
    const onCloseDone = function (err) {
        if (err) {
            const v1394 = self.emit('error', err);
            return v1394;
        }
        const v1395 = self.emit('close');
        v1395;
    };
};
v1387.unref = v1396;
const v1397 = RandomAccessReader.prototype;
const v1427 = function (options) {
    const v1398 = options == null;
    if (v1398) {
        options = {};
    }
    var start = options.start;
    var end = options.end;
    const v1399 = start === end;
    if (v1399) {
        var emptyStream = new PassThrough();
        const v1401 = function () {
            const v1400 = emptyStream.end();
            v1400;
        };
        const v1402 = setImmediate(v1401);
        v1402;
        return emptyStream;
    }
    var stream = this._readStreamForRange(start, end);
    var destroyed = false;
    var refUnrefFilter = new RefUnrefFilter(this);
    const v1407 = function (err) {
        const v1405 = function () {
            const v1403 = !destroyed;
            if (v1403) {
                const v1404 = refUnrefFilter.emit('error', err);
                v1404;
            }
        };
        const v1406 = setImmediate(v1405);
        v1406;
    };
    const v1408 = stream.on('error', v1407);
    v1408;
    const v1412 = function () {
        const v1409 = stream.unpipe(refUnrefFilter);
        v1409;
        const v1410 = refUnrefFilter.unref();
        v1410;
        const v1411 = stream.destroy();
        v1411;
    };
    const v1413 = installDestroyFn(refUnrefFilter, v1412);
    v1413;
    const v1414 = end - start;
    var byteCounter = new AssertByteCountStream(v1414);
    const v1419 = function (err) {
        const v1417 = function () {
            const v1415 = !destroyed;
            if (v1415) {
                const v1416 = byteCounter.emit('error', err);
                v1416;
            }
        };
        const v1418 = setImmediate(v1417);
        v1418;
    };
    const v1420 = refUnrefFilter.on('error', v1419);
    v1420;
    const v1423 = function () {
        destroyed = true;
        const v1421 = refUnrefFilter.unpipe(byteCounter);
        v1421;
        const v1422 = refUnrefFilter.destroy();
        v1422;
    };
    const v1424 = installDestroyFn(byteCounter, v1423);
    v1424;
    const v1425 = stream.pipe(refUnrefFilter);
    const v1426 = v1425.pipe(byteCounter);
    return v1426;
};
v1397.createReadStream = v1427;
const v1428 = RandomAccessReader.prototype;
const v1430 = function (start, end) {
    const v1429 = new Error('not implemented');
    throw v1429;
};
v1428._readStreamForRange = v1430;
const v1431 = RandomAccessReader.prototype;
const v1444 = function (buffer, offset, length, position, callback) {
    const v1432 = position + length;
    const v1433 = {
        start: position,
        end: v1432
    };
    var readStream = this.createReadStream(v1433);
    var writeStream = new Writable();
    var written = 0;
    const v1438 = function (chunk, encoding, cb) {
        const v1434 = offset + written;
        const v1435 = chunk.length;
        const v1436 = chunk.copy(buffer, v1434, 0, v1435);
        v1436;
        written += chunk.length;
        const v1437 = cb();
        v1437;
    };
    writeStream._write = v1438;
    const v1439 = writeStream.on('finish', callback);
    v1439;
    const v1441 = function (error) {
        const v1440 = callback(error);
        v1440;
    };
    const v1442 = readStream.on('error', v1441);
    v1442;
    const v1443 = readStream.pipe(writeStream);
    v1443;
};
v1431.read = v1444;
const v1445 = RandomAccessReader.prototype;
const v1447 = function (callback) {
    const v1446 = setImmediate(callback);
    v1446;
};
v1445.close = v1447;
const v1448 = util.inherits(RefUnrefFilter, PassThrough);
v1448;
const RefUnrefFilter = function (context) {
    const v1449 = PassThrough.call(this);
    v1449;
    this.context = context;
    const v1450 = this.context;
    const v1451 = v1450.ref();
    v1451;
    this.unreffedYet = false;
};
const v1452 = RefUnrefFilter.prototype;
const v1455 = function (cb) {
    const v1453 = this.unref();
    v1453;
    const v1454 = cb();
    v1454;
};
v1452._flush = v1455;
const v1456 = RefUnrefFilter.prototype;
const v1460 = function (cb) {
    const v1457 = this.unreffedYet;
    if (v1457) {
        return;
    }
    this.unreffedYet = true;
    const v1458 = this.context;
    const v1459 = v1458.unref();
    v1459;
};
v1456.unref = v1460;
var cp437 = '\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ\xA2\xA3\xA5\u20A7ƒáíóúñÑªº\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580αßΓπΣσµτΦΘΩδ\u221Eφε\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221Aⁿ\xB2\u25A0\xA0';
const decodeBuffer = function (buffer, isUtf8) {
    if (isUtf8) {
        const v1461 = buffer.toString('utf8');
        return v1461;
    } else {
        var result = '';
        var i = 0;
        const v1462 = buffer.length;
        let v1463 = i < v1462;
        while (v1463) {
            const v1465 = buffer[i];
            result += cp437[v1465];
            const v1464 = i++;
            v1463 = i < v1462;
        }
        return result;
    }
};
const readUInt64LE = function (buffer, offset) {
    var lower32 = buffer.readUInt32LE(offset);
    const v1466 = offset + 4;
    var upper32 = buffer.readUInt32LE(v1466);
    const v1467 = upper32 * 4294967296;
    const v1468 = v1467 + lower32;
    return v1468;
};
var newBuffer;
const v1469 = Buffer.allocUnsafe;
const v1470 = typeof v1469;
const v1471 = v1470 === 'function';
if (v1471) {
    const v1473 = function (len) {
        const v1472 = Buffer.allocUnsafe(len);
        return v1472;
    };
    newBuffer = v1473;
} else {
    const v1475 = function (len) {
        const v1474 = new Buffer(len);
        return v1474;
    };
    newBuffer = v1475;
}
const installDestroyFn = function (stream, fn) {
    const v1476 = stream.destroy;
    const v1477 = typeof v1476;
    const v1478 = v1477 === 'function';
    if (v1478) {
        const v1482 = function (err, cb) {
            const v1479 = fn();
            v1479;
            const v1480 = cb != null;
            if (v1480) {
                const v1481 = cb(err);
                v1481;
            }
        };
        stream._destroy = v1482;
    } else {
        stream.destroy = fn;
    }
};
const defaultCallback = function (err) {
    if (err) {
        throw err;
    }
};