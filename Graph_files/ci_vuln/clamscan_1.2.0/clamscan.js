const os = require('os');
const util = require('util');
const net = require('net');
const fs = require('fs');
const node_path = require('path');
const child_process = require('child_process');
const v1893 = require('stream');
const PassThrough = v1893.PassThrough;
const Transform = v1893.Transform;
const v1894 = util;
const promisify = v1894.promisify;
const v1895 = child_process;
const exec = v1895.exec;
const execFile = v1895.execFile;
const v1896 = fs.access;
const fs_access = promisify(v1896);
const v1897 = fs.readFile;
const fs_readfile = promisify(v1897);
const v1898 = fs.readdir;
const fs_readdir = promisify(v1898);
const v1899 = fs.stat;
const fs_stat = promisify(v1899);
const NodeClamTransform = require('./NodeClamTransform.js');
const cp_exec = promisify(exec);
const cp_execfile = promisify(execFile);
const NodeClamError = function NodeClamError(data = {}, ...params) {
    const msg = params[0];
    const fileName = params[1];
    const lineNumber = params[2];
    const v1900 = typeof data;
    const v1901 = v1900 === 'string';
    if (v1901) {
        msg = data;
        data = {};
    }
    params = [
        msg,
        fileName,
        lineNumber
    ];
    const v1902 = super(...params);
    v1902;
    const v1903 = Error.captureStackTrace;
    if (v1903) {
        const v1904 = Error.captureStackTrace(this, NodeClamError);
        v1904;
    }
    this.data = data;
    this.date = new Date();
};
NodeClamError['is_class'] = true;
const NodeClam = function NodeClam() {
    this.initialized = false;
    this.debug_label = 'node-clam';
    this.default_scanner = 'clamdscan';
    const v1905 = {};
    v1905.path = '/usr/bin/clamscan';
    v1905.scan_archives = true;
    v1905.db = null;
    v1905.active = true;
    const v1906 = {};
    v1906.socket = false;
    v1906.host = false;
    v1906.port = false;
    v1906.timeout = 60000;
    v1906.local_fallback = true;
    v1906.path = '/usr/bin/clamdscan';
    v1906.config_file = null;
    v1906.multiscan = true;
    v1906.reload_db = false;
    v1906.active = true;
    v1906.bypass_test = false;
    const v1907 = this.default_scanner;
    const v1908 = {
        remove_infected: false,
        quarantine_infected: false,
        scan_log: null,
        debug_mode: false,
        file_list: null,
        scan_recursively: true,
        clamscan: v1905,
        clamdscan: v1906,
        preference: v1907
    };
    const v1909 = Object.freeze(v1908);
    this.defaults = v1909;
    const v1910 = {};
    const v1911 = this.defaults;
    const v1912 = Object.assign(v1910, v1911);
    this.settings = v1912;
};
const init = async function init(options = {}, cb) {
    let has_cb = false;
    const v1913 = typeof cb;
    const v1914 = v1913 !== 'function';
    const v1915 = cb && v1914;
    if (v1915) {
        const v1916 = new NodeClamError('Invalid cb provided to init method. Second paramter, if provided, must be a function!');
        throw v1916;
    } else {
        const v1917 = typeof cb;
        const v1918 = v1917 === 'function';
        const v1919 = cb && v1918;
        if (v1919) {
            has_cb = true;
        }
    }
    const v2242 = async (resolve, reject) => {
        const v1920 = this.initialized;
        const v1921 = v1920 === true;
        if (v1921) {
            const v1922 = cb(null, this);
            const v1923 = resolve(this);
            let v1924;
            if (has_cb) {
                v1924 = v1922;
            } else {
                v1924 = v1923;
            }
            return v1924;
        }
        let settings = {};
        const v1925 = Object.prototype;
        const v1926 = v1925.hasOwnProperty;
        const v1927 = v1926.call(options, 'clamscan');
        const v1928 = options.clamscan;
        const v1929 = Object.keys(v1928);
        const v1930 = v1929.length;
        const v1931 = v1930 > 0;
        const v1932 = v1927 && v1931;
        if (v1932) {
            const v1933 = {};
            const v1934 = this.defaults;
            const v1935 = v1934.clamscan;
            const v1936 = options.clamscan;
            const v1937 = Object.assign(v1933, v1935, v1936);
            settings.clamscan = v1937;
            const v1938 = options.clamscan;
            const v1939 = delete v1938;
            v1939;
        }
        const v1940 = Object.prototype;
        const v1941 = v1940.hasOwnProperty;
        const v1942 = v1941.call(options, 'clamdscan');
        const v1943 = options.clamdscan;
        const v1944 = Object.keys(v1943);
        const v1945 = v1944.length;
        const v1946 = v1945 > 0;
        const v1947 = v1942 && v1946;
        if (v1947) {
            const v1948 = {};
            const v1949 = this.defaults;
            const v1950 = v1949.clamdscan;
            const v1951 = options.clamdscan;
            const v1952 = Object.assign(v1948, v1950, v1951);
            settings.clamdscan = v1952;
            const v1953 = options.clamdscan;
            const v1954 = delete v1953;
            v1954;
        }
        const v1955 = {};
        const v1956 = this.defaults;
        const v1957 = Object.assign(v1955, v1956, settings, options);
        this.settings = v1957;
        const v1958 = this.settings;
        const v1959 = this.settings;
        const v1960 = 'debug_mode' in v1959;
        const v1961 = v1958 && v1960;
        const v1962 = this.settings;
        const v1963 = v1962.debug_mode;
        const v1964 = v1963 === true;
        const v1965 = v1961 && v1964;
        if (v1965) {
            const v1966 = this.debug_label;
            const v1967 = `${ v1966 }: DEBUG MODE ON`;
            const v1968 = console.log(v1967);
            v1968;
        }
        const v1969 = this.settings;
        const v1970 = 'quarantine_path' in v1969;
        const v1971 = this.settings;
        const v1972 = v1971.quarantine_path;
        const v1973 = v1970 && v1972;
        if (v1973) {
            const v1974 = this.settings;
            const v1975 = this.settings;
            const v1976 = v1975.quarantine_path;
            v1974.quarantine_infected = v1976;
        }
        const v1977 = this.default_scanner;
        this.scanner = v1977;
        const v1978 = this.settings;
        const v1979 = 'preference' in v1978;
        const v1980 = this.settings;
        const v1981 = v1980.preference;
        const v1982 = typeof v1981;
        const v1983 = v1982 !== 'string';
        const v1984 = v1979 && v1983;
        const v1985 = [
            'clamscan',
            'clamdscan'
        ];
        const v1986 = this.settings;
        const v1987 = v1986.preference;
        const v1988 = v1985.includes(v1987);
        const v1989 = !v1988;
        const v1990 = v1984 || v1989;
        if (v1990) {
            const v1991 = this.settings;
            const v1992 = v1991.clamdscan;
            const v1993 = v1992.socket;
            const v1994 = this.settings;
            const v1995 = v1994.clamdscan;
            const v1996 = v1995.host;
            const v1997 = v1993 || v1996;
            if (v1997) {
                const v1998 = this.settings;
                const v1999 = v1998.clamdscan;
                v1999.local_fallback = false;
            } else {
                const err = new NodeClamError('Invalid virus scanner preference defined and no valid host/socket option provided!');
                const v2000 = cb(err, null);
                const v2001 = reject(err);
                let v2002;
                if (has_cb) {
                    v2002 = v2000;
                } else {
                    v2002 = v2001;
                }
                return v2002;
            }
        }
        const v2003 = this.settings;
        const v2004 = 'preference' in v2003;
        const v2005 = this.settings;
        const v2006 = v2005.preference;
        const v2007 = v2006 === 'clamscan';
        const v2008 = v2004 && v2007;
        const v2009 = this.settings;
        const v2010 = 'clamscan' in v2009;
        const v2011 = v2008 && v2010;
        const v2012 = this.settings;
        const v2013 = v2012.clamscan;
        const v2014 = 'active' in v2013;
        const v2015 = v2011 && v2014;
        const v2016 = this.settings;
        const v2017 = v2016.clamscan;
        const v2018 = v2017.active;
        const v2019 = v2018 === true;
        const v2020 = v2015 && v2019;
        const v2021 = this.settings;
        const v2022 = v2021.preference;
        const v2023 = v2022 === 'clamdscan';
        const v2024 = this.settings;
        const v2025 = 'clamdscan' in v2024;
        const v2026 = v2023 && v2025;
        const v2027 = this.settings;
        const v2028 = v2027.clamdscan;
        const v2029 = 'active' in v2028;
        const v2030 = v2026 && v2029;
        const v2031 = this.settings;
        const v2032 = v2031.clamdscan;
        const v2033 = v2032.active;
        const v2034 = v2033 !== true;
        const v2035 = v2030 && v2034;
        const v2036 = this.settings;
        const v2037 = 'clamscan' in v2036;
        const v2038 = v2035 && v2037;
        const v2039 = this.settings;
        const v2040 = v2039.clamscan;
        const v2041 = 'active' in v2040;
        const v2042 = v2038 && v2041;
        const v2043 = this.settings;
        const v2044 = v2043.clamscan;
        const v2045 = v2044.active;
        const v2046 = v2045 === true;
        const v2047 = v2042 && v2046;
        const v2048 = v2020 || v2047;
        if (v2048) {
            this.scanner = 'clamscan';
        }
        try {
            const v2049 = this.scanner;
            const v2050 = !await this._is_clamav_binary(v2049);
            if (v2050) {
                const v2051 = this.scanner;
                const v2052 = v2051 === 'clamdscan';
                const v2053 = this.settings;
                const v2054 = v2053.clamscan;
                const v2055 = v2054.active;
                const v2056 = v2055 === true;
                const v2057 = v2052 && v2056;
                const v2058 = v2057 && await this._is_clamav_binary('clamscan');
                if (v2058) {
                    this.scanner = 'clamscan';
                } else {
                    const v2059 = this.scanner;
                    const v2060 = v2059 === 'clamscan';
                    const v2061 = this.settings;
                    const v2062 = v2061.clamdscan;
                    const v2063 = v2062.active;
                    const v2064 = v2063 === true;
                    const v2065 = v2060 && v2064;
                    const v2066 = v2065 && await this._is_clamav_binary('clamdscan');
                    if (v2066) {
                        this.scanner = 'clamdscan';
                    } else {
                        const v2067 = this.settings;
                        const v2068 = v2067.clamdscan;
                        const v2069 = v2068.socket;
                        const v2070 = this.settings;
                        const v2071 = v2070.clamdscan;
                        const v2072 = v2071.host;
                        const v2073 = v2069 || v2072;
                        if (v2073) {
                            const v2074 = this.settings;
                            const v2075 = v2074.clamdscan;
                            v2075.local_fallback = false;
                        } else {
                            const err = new NodeClamError('No valid & active virus scanning binaries are active and available and host/socket option provided!');
                            const v2076 = cb(err, null);
                            const v2077 = reject(err);
                            let v2078;
                            if (has_cb) {
                                v2078 = v2076;
                            } else {
                                v2078 = v2077;
                            }
                            return v2078;
                        }
                    }
                }
            }
        } catch (err) {
            const v2079 = cb(err, null);
            const v2080 = reject(err);
            let v2081;
            if (has_cb) {
                v2081 = v2079;
            } else {
                v2081 = v2080;
            }
            return v2081;
        }
        const v2082 = this.settings;
        const v2083 = v2082.clamdscan;
        const v2084 = v2083.socket;
        const v2085 = !v2084;
        const v2086 = this.settings;
        const v2087 = v2086.clamdscan;
        const v2088 = v2087.host;
        const v2089 = !v2088;
        const v2090 = v2085 && v2089;
        const v2091 = this.settings;
        const v2092 = v2091.clamdscan;
        const v2093 = v2092.active;
        const v2094 = v2093 === true;
        const v2095 = this.settings;
        const v2096 = v2095.clamdscan;
        const v2097 = v2096.local_fallback;
        const v2098 = v2097 === true;
        const v2099 = v2094 && v2098;
        const v2100 = this.settings;
        const v2101 = v2100.clamscan;
        const v2102 = v2101.active;
        const v2103 = v2102 === true;
        const v2104 = v2099 || v2103;
        const v2105 = v2090 && v2104;
        const v2106 = this.settings;
        const v2107 = v2106.quarantine_infected;
        const v2108 = v2105 && v2107;
        if (v2108) {
            try {
                const v2109 = this.settings;
                const v2110 = v2109.quarantine_infected;
                const v2111 = fs.constants;
                const v2112 = v2111.R_OK;
                await fs_access(v2110, v2112);
            } catch (e) {
                const v2113 = this.settings;
                const v2114 = v2113.debug_mode;
                if (v2114) {
                    const v2115 = this.debug_label;
                    const v2116 = `${ v2115 } error:`;
                    const v2117 = console.log(v2116, err);
                    v2117;
                }
                const v2118 = { err: e };
                const v2119 = this.settings;
                const v2120 = v2119.quarantine_infected;
                const err = new NodeClamError(v2118, `Quarantine infected path (${ v2120 }) is invalid.`);
                const v2121 = cb(err, null);
                const v2122 = reject(err);
                let v2123;
                if (has_cb) {
                    v2123 = v2121;
                } else {
                    v2123 = v2122;
                }
                return v2123;
            }
        }
        const v2124 = this.settings;
        const v2125 = v2124.clamdscan;
        const v2126 = v2125.socket;
        const v2127 = !v2126;
        const v2128 = this.settings;
        const v2129 = v2128.clamdscan;
        const v2130 = v2129.host;
        const v2131 = !v2130;
        const v2132 = v2127 && v2131;
        const v2133 = this.scanner;
        const v2134 = v2133 === 'clamscan';
        const v2135 = v2132 && v2134;
        const v2136 = this.settings;
        const v2137 = v2136.clamscan;
        const v2138 = v2137.db;
        const v2139 = v2135 && v2138;
        if (v2139) {
            try {
                const v2140 = this.settings;
                const v2141 = v2140.clamscan;
                const v2142 = v2141.db;
                const v2143 = fs.constants;
                const v2144 = v2143.R_OK;
                await fs_access(v2142, v2144);
            } catch (err) {
                const v2145 = this.settings;
                const v2146 = v2145.debug_mode;
                if (v2146) {
                    const v2147 = this.debug_label;
                    const v2148 = `${ v2147 } error:`;
                    const v2149 = console.log(v2148, err);
                    v2149;
                }
                const v2150 = this.settings;
                const v2151 = v2150.clamscan;
                v2151.db = null;
            }
        }
        const v2152 = this.settings;
        const v2153 = v2152.clamdscan;
        const v2154 = v2153.socket;
        const v2155 = !v2154;
        const v2156 = this.settings;
        const v2157 = v2156.clamdscan;
        const v2158 = v2157.host;
        const v2159 = !v2158;
        const v2160 = v2155 && v2159;
        const v2161 = this.settings;
        const v2162 = v2161.clamdscan;
        const v2163 = v2162.socket;
        const v2164 = this.settings;
        const v2165 = v2164.clamdscan;
        const v2166 = v2165.host;
        const v2167 = v2163 || v2166;
        const v2168 = this.settings;
        const v2169 = v2168.clamdscan;
        const v2170 = v2169.local_fallback;
        const v2171 = v2170 === true;
        const v2172 = v2167 && v2171;
        const v2173 = this.settings;
        const v2174 = v2173.clamdscan;
        const v2175 = v2174.active;
        const v2176 = v2175 === true;
        const v2177 = v2172 && v2176;
        const v2178 = v2160 || v2177;
        const v2179 = this.settings;
        const v2180 = v2179.clamdscan;
        const v2181 = v2180.active;
        const v2182 = v2181 === false;
        const v2183 = this.settings;
        const v2184 = v2183.clamscan;
        const v2185 = v2184.active;
        const v2186 = v2185 === true;
        const v2187 = v2182 && v2186;
        const v2188 = v2178 || v2187;
        const v2189 = this.preference;
        const v2190 = v2188 || v2189;
        const v2191 = this.settings;
        const v2192 = v2191.scan_log;
        const v2193 = v2190 && v2192;
        if (v2193) {
            try {
                const v2194 = this.settings;
                const v2195 = v2194.scan_log;
                const v2196 = fs.constants;
                const v2197 = v2196.R_OK;
                await fs_access(v2195, v2197);
            } catch (err) {
                const v2198 = this.settings;
                const v2199 = v2198.debug_mode;
                if (v2199) {
                    const v2200 = this.debug_label;
                    const v2201 = `${ v2200 } error:`;
                    const v2202 = console.log(v2201, err);
                    v2202;
                }
                const v2203 = this.settings;
                v2203.scan_log = null;
            }
        }
        const v2204 = this.scanner;
        const v2205 = v2204 === 'clamdscan';
        const v2206 = this.settings;
        const v2207 = v2206.clamdscan;
        const v2208 = v2207.bypass_test;
        const v2209 = v2208 === false;
        const v2210 = v2205 && v2209;
        const v2211 = this.settings;
        const v2212 = v2211.clamdscan;
        const v2213 = v2212.socket;
        const v2214 = this.settings;
        const v2215 = v2214.clamdscan;
        const v2216 = v2215.host;
        const v2217 = v2213 || v2216;
        const v2218 = this.settings;
        const v2219 = v2218.clamdscan;
        const v2220 = v2219.port;
        const v2221 = v2217 || v2220;
        const v2222 = v2210 && v2221;
        if (v2222) {
            const v2223 = this.settings;
            const v2224 = v2223.debug_mode;
            if (v2224) {
                const v2225 = this.debug_label;
                const v2226 = `${ v2225 }: Initially testing socket/tcp connection to clamscan server.`;
                const v2227 = console.log(v2226);
                v2227;
            }
            try {
                await this._ping();
                const v2228 = this.settings;
                const v2229 = v2228.debug_mode;
                if (v2229) {
                    const v2230 = this.debug_label;
                    const v2231 = `${ v2230 }: Established connection to clamscan server for testing!`;
                    const v2232 = console.log(v2231);
                    v2232;
                }
            } catch (err) {
                const v2233 = cb(err, null);
                const v2234 = reject(err);
                let v2235;
                if (has_cb) {
                    v2235 = v2233;
                } else {
                    v2235 = v2234;
                }
                return v2235;
            }
        }
        const v2236 = this.scanner;
        const v2237 = this.settings;
        const v2238 = this._build_clam_flags(v2236, v2237);
        this.clam_flags = v2238;
        this.initialized = true;
        const v2239 = cb(null, this);
        const v2240 = resolve(this);
        let v2241;
        if (has_cb) {
            v2241 = v2239;
        } else {
            v2241 = v2240;
        }
        return v2241;
    };
    const v2243 = new Promise(v2242);
    return v2243;
};
NodeClam.init = init;
const reset = function reset(options = {}, cb) {
    let has_cb = false;
    const v2244 = typeof cb;
    const v2245 = v2244 !== 'function';
    const v2246 = cb && v2245;
    if (v2246) {
        const v2247 = new NodeClamError('Invalid cb provided to `reset`. Second paramter, if provided, must be a function!');
        throw v2247;
    } else {
        const v2248 = typeof cb;
        const v2249 = v2248 === 'function';
        const v2250 = cb && v2249;
        if (v2250) {
            has_cb = true;
        }
    }
    this.initialized = false;
    const v2251 = {};
    const v2252 = this.defaults;
    const v2253 = Object.assign(v2251, v2252);
    this.settings = v2253;
    const v2260 = async (resolve, reject) => {
        try {
            await this.init(options);
            const v2254 = cb(null, this);
            const v2255 = resolve(this);
            let v2256;
            if (has_cb) {
                v2256 = v2254;
            } else {
                v2256 = v2255;
            }
            return v2256;
        } catch (err) {
            const v2257 = cb(err, null);
            const v2258 = reject(err);
            let v2259;
            if (has_cb) {
                v2259 = v2257;
            } else {
                v2259 = v2258;
            }
            return v2259;
        }
    };
    const v2261 = new Promise(v2260);
    return v2261;
};
NodeClam.reset = reset;
const _build_clam_args = function _build_clam_args(item) {
    const v2262 = this.clam_flags;
    let args = v2262.slice();
    const v2263 = typeof item;
    const v2264 = v2263 === 'string';
    if (v2264) {
        const v2265 = args.push(item);
        v2265;
    }
    const v2266 = Array.isArray(item);
    if (v2266) {
        args = args.concat(item);
    }
    return args;
};
NodeClam._build_clam_args = _build_clam_args;
const _build_clam_flags = function _build_clam_flags(scanner, settings) {
    const flags_array = ['--no-summary'];
    const v2267 = scanner === 'clamscan';
    if (v2267) {
        const v2268 = flags_array.push('--stdout');
        v2268;
        const v2269 = settings.remove_infected;
        const v2270 = v2269 === true;
        if (v2270) {
            const v2271 = flags_array.push('--remove=yes');
            v2271;
        } else {
            const v2272 = flags_array.push('--remove=no');
            v2272;
        }
        const v2273 = 'clamscan' in settings;
        const v2274 = settings.clamscan;
        const v2275 = typeof v2274;
        const v2276 = v2275 === 'object';
        const v2277 = v2273 && v2276;
        const v2278 = settings.clamscan;
        const v2279 = 'db' in v2278;
        const v2280 = v2277 && v2279;
        const v2281 = settings.clamscan;
        const v2282 = v2281.db;
        const v2283 = v2280 && v2282;
        const v2284 = settings.clamscan;
        const v2285 = v2284.db;
        const v2286 = typeof v2285;
        const v2287 = v2286 === 'string';
        const v2288 = v2283 && v2287;
        if (v2288) {
            const v2289 = settings.clamscan;
            const v2290 = v2289.db;
            const v2291 = `--database=${ v2290 }`;
            const v2292 = flags_array.push(v2291);
            v2292;
        }
        const v2293 = settings.clamscan;
        const v2294 = v2293.scan_archives;
        const v2295 = v2294 === true;
        if (v2295) {
            const v2296 = flags_array.push('--scan-archive=yes');
            v2296;
        } else {
            const v2297 = flags_array.push('--scan-archive=no');
            v2297;
        }
        const v2298 = settings.scan_recursively;
        const v2299 = v2298 === true;
        if (v2299) {
            const v2300 = flags_array.push('-r');
            v2300;
        } else {
            const v2301 = flags_array.push('--recursive=no');
            v2301;
        }
    } else {
        const v2302 = scanner === 'clamdscan';
        if (v2302) {
            const v2303 = flags_array.push('--fdpass');
            v2303;
            const v2304 = settings.remove_infected;
            const v2305 = v2304 === true;
            if (v2305) {
                const v2306 = flags_array.push('--remove');
                v2306;
            }
            const v2307 = 'clamdscan' in settings;
            const v2308 = settings.clamdscan;
            const v2309 = typeof v2308;
            const v2310 = v2309 === 'object';
            const v2311 = v2307 && v2310;
            const v2312 = settings.clamdscan;
            const v2313 = 'config_file' in v2312;
            const v2314 = v2311 && v2313;
            const v2315 = settings.clamdscan;
            const v2316 = v2315.config_file;
            const v2317 = v2314 && v2316;
            const v2318 = settings.clamdscan;
            const v2319 = v2318.config_file;
            const v2320 = typeof v2319;
            const v2321 = v2320 === 'string';
            const v2322 = v2317 && v2321;
            if (v2322) {
                const v2323 = settings.clamdscan;
                const v2324 = v2323.config_file;
                const v2325 = `--config-file=${ v2324 }`;
                const v2326 = flags_array.push(v2325);
                v2326;
            }
            const v2327 = settings.clamdscan;
            const v2328 = v2327.multiscan;
            const v2329 = v2328 === true;
            if (v2329) {
                const v2330 = flags_array.push('--multiscan');
                v2330;
            }
            const v2331 = settings.clamdscan;
            const v2332 = v2331.reload_db;
            const v2333 = v2332 === true;
            if (v2333) {
                const v2334 = flags_array.push('--reload');
                v2334;
            }
        }
    }
    const v2335 = settings.remove_infected;
    const v2336 = v2335 !== true;
    if (v2336) {
        const v2337 = 'quarantine_infected' in settings;
        const v2338 = settings.quarantine_infected;
        const v2339 = v2337 && v2338;
        const v2340 = settings.quarantine_infected;
        const v2341 = typeof v2340;
        const v2342 = v2341 === 'string';
        const v2343 = v2339 && v2342;
        if (v2343) {
            const v2344 = settings.quarantine_infected;
            const v2345 = `--move=${ v2344 }`;
            const v2346 = flags_array.push(v2345);
            v2346;
        }
    }
    const v2347 = 'scan_log' in settings;
    const v2348 = settings.scan_log;
    const v2349 = v2347 && v2348;
    const v2350 = settings.scan_log;
    const v2351 = typeof v2350;
    const v2352 = v2351 === 'string';
    const v2353 = v2349 && v2352;
    if (v2353) {
        const v2354 = settings.scan_log;
        const v2355 = `--log=${ v2354 }`;
        const v2356 = flags_array.push(v2355);
        v2356;
    }
    const v2357 = 'file_list' in settings;
    const v2358 = settings.file_list;
    const v2359 = v2357 && v2358;
    const v2360 = settings.file_list;
    const v2361 = typeof v2360;
    const v2362 = v2361 === 'string';
    const v2363 = v2359 && v2362;
    if (v2363) {
        const v2364 = settings.file_list;
        const v2365 = `--file-list=${ v2364 }`;
        const v2366 = flags_array.push(v2365);
        v2366;
    }
    return flags_array;
};
NodeClam._build_clam_flags = _build_clam_flags;
const _init_socket = function _init_socket() {
    const v2461 = (resolve, reject) => {
        let client;
        const v2367 = this.settings;
        const v2368 = v2367.clamdscan;
        const v2369 = v2368.socket;
        if (v2369) {
            const v2370 = this.settings;
            const v2371 = v2370.clamdscan;
            const v2372 = v2371.socket;
            const v2373 = { path: v2372 };
            client = net.createConnection(v2373);
        } else {
            const v2374 = this.settings;
            const v2375 = v2374.clamdscan;
            const v2376 = v2375.port;
            if (v2376) {
                const v2377 = this.settings;
                const v2378 = v2377.clamdscan;
                const v2379 = v2378.host;
                if (v2379) {
                    const v2380 = this.settings;
                    const v2381 = v2380.clamdscan;
                    const v2382 = v2381.host;
                    const v2383 = this.settings;
                    const v2384 = v2383.clamdscan;
                    const v2385 = v2384.port;
                    const v2386 = {
                        host: v2382,
                        port: v2385
                    };
                    client = net.createConnection(v2386);
                } else {
                    const v2387 = this.settings;
                    const v2388 = v2387.clamdscan;
                    const v2389 = v2388.port;
                    const v2390 = { port: v2389 };
                    client = net.createConnection(v2390);
                }
            } else {
                const v2391 = new NodeClamError('Unable not establish connection to clamd service: No socket or host/port combo provided!');
                throw v2391;
            }
        }
        const v2392 = this.settings;
        const v2393 = v2392.clamdscan;
        const v2394 = v2393.timeout;
        if (v2394) {
            const v2395 = this.settings;
            const v2396 = v2395.clamdscan;
            const v2397 = v2396.timeout;
            const v2398 = client.setTimeout(v2397);
            v2398;
        }
        const v2441 = () => {
            const v2399 = client.remotePort;
            const v2400 = client.remotePort;
            const v2401 = v2400.toString();
            const v2402 = this.settings;
            const v2403 = v2402.clamdscan;
            const v2404 = v2403.port;
            const v2405 = v2404.toString();
            const v2406 = v2401 === v2405;
            const v2407 = v2399 && v2406;
            if (v2407) {
                const v2408 = this.settings;
                const v2409 = v2408.debug_mode;
                if (v2409) {
                    const v2410 = this.debug_label;
                    const v2411 = client.remoteAddress;
                    const v2412 = client.remotePort;
                    const v2413 = `${ v2410 }: using remote server: ${ v2411 }:${ v2412 }`;
                    const v2414 = console.log(v2413);
                    v2414;
                }
            } else {
                const v2415 = this.settings;
                const v2416 = v2415.clamdscan;
                const v2417 = v2416.socket;
                if (v2417) {
                    const v2418 = this.settings;
                    const v2419 = v2418.debug_mode;
                    if (v2419) {
                        const v2420 = this.debug_label;
                        const v2421 = this.settings;
                        const v2422 = v2421.clamdscan;
                        const v2423 = v2422.socket;
                        const v2424 = `${ v2420 }: using local unix domain socket: ${ v2423 }`;
                        const v2425 = console.log(v2424);
                        v2425;
                    }
                } else {
                    const v2426 = this.settings;
                    const v2427 = v2426.debug_mode;
                    if (v2427) {
                        const v2428 = client.address();
                        const port = v2428.port;
                        const address = v2428.address;
                        const v2429 = this.debug_label;
                        const v2430 = client.remotePort;
                        const v2431 = `${ v2429 }: meta port value: ${ port } vs ${ v2430 }`;
                        const v2432 = console.log(v2431);
                        v2432;
                        const v2433 = this.debug_label;
                        const v2434 = client.remoteAddress;
                        const v2435 = `${ v2433 }: meta address value: ${ address } vs ${ v2434 }`;
                        const v2436 = console.log(v2435);
                        v2436;
                        const v2437 = this.debug_label;
                        const v2438 = `${ v2437 }: something is not working...`;
                        const v2439 = console.log(v2438);
                        v2439;
                    }
                }
            }
            const v2440 = resolve(client);
            return v2440;
        };
        const v2442 = client.on('connect', v2441);
        const v2449 = () => {
            const v2443 = this.settings;
            const v2444 = v2443.debug_mode;
            if (v2444) {
                const v2445 = this.debug_label;
                const v2446 = `${ v2445 }: Socket connection timed out.`;
                const v2447 = console.log(v2446);
                v2447;
            }
            const v2448 = client.end();
            v2448;
        };
        const v2450 = v2442.on('timeout', v2449);
        const v2456 = () => {
            const v2451 = this.settings;
            const v2452 = v2451.debug_mode;
            if (v2452) {
                const v2453 = this.debug_label;
                const v2454 = `${ v2453 }: Socket connection closed.`;
                const v2455 = console.log(v2454);
                v2455;
            }
        };
        const v2457 = v2450.on('close', v2456);
        const v2459 = e => {
            const v2458 = reject(e);
            v2458;
        };
        const v2460 = v2457.on('error', v2459);
        v2460;
    };
    const v2462 = new Promise(v2461);
    return v2462;
};
NodeClam._init_socket = _init_socket;
const _is_clamav_binary = async function _is_clamav_binary(scanner) {
    const v2463 = this.settings;
    const v2464 = v2463[scanner];
    const v2465 = v2464.path;
    const path = v2465 || null;
    const v2466 = !path;
    if (v2466) {
        const v2467 = this.settings;
        const v2468 = v2467.debug_mode;
        if (v2468) {
            const v2469 = this.debug_label;
            const v2470 = `${ v2469 }: Could not determine path for clamav binary.`;
            const v2471 = console.log(v2470);
            v2471;
        }
        return false;
    }
    const version_cmds = {};
    version_cmds.clamdscan = `${ path } --version`;
    version_cmds.clamscan = `${ path } --version`;
    try {
        const v2472 = fs.constants;
        const v2473 = v2472.R_OK;
        await fs_access(path, v2473);
        const v2475 = version_cmds[scanner];
        const v2474 = await cp_exec(v2475);
        const stdout = v2474.stdout;
        const v2476 = stdout.toString();
        const v2477 = v2476.match(/ClamAV/);
        const v2478 = v2477 === null;
        if (v2478) {
            const v2479 = this.settings;
            const v2480 = v2479.debug_mode;
            if (v2480) {
                const v2481 = this.debug_label;
                const v2482 = `${ v2481 }: Could not verify the ${ scanner } binary.`;
                const v2483 = console.log(v2482);
                v2483;
            }
            return false;
        }
        return true;
    } catch (err) {
        const v2484 = this.settings;
        const v2485 = v2484.debug_mode;
        if (v2485) {
            const v2486 = this.debug_label;
            const v2487 = `${ v2486 }: Could not verify the ${ scanner } binary.`;
            const v2488 = console.log(v2487);
            v2488;
        }
        return false;
    }
};
NodeClam._is_clamav_binary = _is_clamav_binary;
const _is_localhost = function _is_localhost() {
    const v2489 = os.hostname();
    const v2490 = [
        '127.0.0.1',
        'localhost',
        v2489
    ];
    const v2491 = this.settings;
    const v2492 = v2491.clamdscan;
    const v2493 = v2492.host;
    const v2494 = v2490.includes(v2493);
    return v2494;
};
NodeClam._is_localhost = _is_localhost;
const _is_readable_stream = function _is_readable_stream(obj) {
    const v2495 = !obj;
    const v2496 = typeof obj;
    const v2497 = v2496 !== 'object';
    const v2498 = v2495 || v2497;
    if (v2498) {
        return false;
    }
    const v2499 = obj.pipe;
    const v2500 = typeof v2499;
    const v2501 = v2500 === 'function';
    const v2502 = obj._readableState;
    const v2503 = typeof v2502;
    const v2504 = v2503 === 'object';
    const v2505 = v2501 && v2504;
    return v2505;
};
NodeClam._is_readable_stream = _is_readable_stream;
const _ping = function _ping(cb) {
    let has_cb = false;
    const v2506 = typeof cb;
    const v2507 = v2506 !== 'function';
    const v2508 = cb && v2507;
    if (v2508) {
        const v2509 = new NodeClamError('Invalid cb provided to ping. Second parameter must be a function!');
        throw v2509;
    }
    const v2510 = typeof cb;
    const v2511 = v2510 === 'function';
    const v2512 = cb && v2511;
    if (v2512) {
        has_cb = true;
    }
    const v2538 = async (resolve, reject) => {
        try {
            const client = await this._init_socket('test_availability');
            const v2513 = this.settings;
            const v2514 = v2513.debug_mode;
            if (v2514) {
                const v2515 = this.debug_label;
                const v2516 = `${ v2515 }: Established connection to clamscan server for testing!`;
                const v2517 = console.log(v2516);
                v2517;
            }
            const v2518 = client.write('PING');
            v2518;
            const v2533 = data => {
                const v2519 = data.toString();
                const v2520 = v2519.trim();
                const v2521 = v2520 === 'PONG';
                if (v2521) {
                    const v2522 = this.settings;
                    const v2523 = v2522.debug_mode;
                    if (v2523) {
                        const v2524 = this.debug_label;
                        const v2525 = `${ v2524 }: PONG!`;
                        const v2526 = console.log(v2525);
                        v2526;
                    }
                    const v2527 = cb(null, client);
                    const v2528 = resolve(client);
                    let v2529;
                    if (has_cb) {
                        v2529 = v2527;
                    } else {
                        v2529 = v2528;
                    }
                    return v2529;
                }
                const err = new NodeClamError(data, 'Could not establish connection to the remote clamscan server.');
                const v2530 = cb(err, null);
                const v2531 = reject(err);
                let v2532;
                if (has_cb) {
                    v2532 = v2530;
                } else {
                    v2532 = v2531;
                }
                return v2532;
            };
            const v2534 = client.on('data', v2533);
            v2534;
        } catch (err) {
            const v2535 = cb(err, false);
            const v2536 = resolve(err);
            let v2537;
            if (has_cb) {
                v2537 = v2535;
            } else {
                v2537 = v2536;
            }
            return v2537;
        }
    };
    const v2539 = new Promise(v2538);
    return v2539;
};
NodeClam._ping = _ping;
const _process_result = function _process_result(result, file = null) {
    const v2540 = typeof result;
    const v2541 = v2540 !== 'string';
    if (v2541) {
        const v2542 = this.settings;
        const v2543 = v2542.debug_mode;
        if (v2543) {
            const v2544 = this.debug_label;
            const v2545 = `${ v2544 }: Invalid stdout from scanner (not a string): `;
            const v2546 = console.log(v2545, result);
            v2546;
        }
        const v2547 = new Error('Invalid result to process (not a string)');
        throw v2547;
    }
    result = result.trim();
    const v2548 = /:\s+OK(\u0000|[\r\n])?$/.test(result);
    if (v2548) {
        const v2549 = this.settings;
        const v2550 = v2549.debug_mode;
        if (v2550) {
            const v2551 = this.debug_label;
            const v2552 = `${ v2551 }: File is OK!`;
            const v2553 = console.log(v2552);
            v2553;
        }
        const v2554 = [];
        const v2555 = {};
        v2555.is_infected = false;
        v2555.viruses = v2554;
        v2555.file = file;
        v2555.resultString = result;
        return v2555;
    }
    const v2556 = /:\s+(.+)FOUND(\u0000|[\r\n])?/gm.test(result);
    if (v2556) {
        const v2557 = this.settings;
        const v2558 = v2557.debug_mode;
        if (v2558) {
            const v2559 = this.settings;
            const v2560 = v2559.debug_mode;
            if (v2560) {
                const v2561 = this.debug_label;
                const v2562 = `${ v2561 }: Scan Response: `;
                const v2563 = console.log(v2562, result);
                v2563;
            }
            const v2564 = this.settings;
            const v2565 = v2564.debug_mode;
            if (v2565) {
                const v2566 = this.debug_label;
                const v2567 = `${ v2566 }: File is INFECTED!`;
                const v2568 = console.log(v2567);
                v2568;
            }
        }
        const v2569 = result.split(/(\u0000|[\r\n])/);
        const v2574 = v => {
            const v2570 = /:\s+(.+)FOUND$/gm.test(v);
            const v2571 = v.replace(/(.+:\s+)(.+)FOUND/gm, '$2');
            const v2572 = v2571.trim();
            let v2573;
            if (v2570) {
                v2573 = v2572;
            } else {
                v2573 = null;
            }
            return v2573;
        };
        const v2575 = v2569.map(v2574);
        const v2578 = v => {
            const v2576 = !v;
            const v2577 = !v2576;
            return v2577;
        };
        const viruses = v2575.filter(v2578);
        const v2579 = {};
        v2579.is_infected = true;
        v2579.viruses = viruses;
        v2579.file = file;
        v2579.resultString = result;
        return v2579;
    }
    const v2580 = /^(.+)ERROR/gm.test(result);
    if (v2580) {
        const v2581 = result.replace(/^(.+)ERROR/gm, '$1');
        const error = v2581.trim();
        const v2582 = this.settings;
        const v2583 = v2582.debug_mode;
        if (v2583) {
            const v2584 = this.settings;
            const v2585 = v2584.debug_mode;
            if (v2585) {
                const v2586 = this.debug_label;
                const v2587 = `${ v2586 }: Error Response: `;
                const v2588 = console.log(v2587, error);
                v2588;
            }
            const v2589 = this.settings;
            const v2590 = v2589.debug_mode;
            if (v2590) {
                const v2591 = this.debug_label;
                const v2592 = `${ v2591 }: File may be INFECTED!`;
                const v2593 = console.log(v2592);
                v2593;
            }
        }
        const v2594 = { error };
        const v2595 = new NodeClamError(v2594, `An error occurred while scanning the piped-through stream: ${ error }`);
        return v2595;
    }
    const v2596 = this.settings;
    const v2597 = v2596.debug_mode;
    if (v2597) {
        const v2598 = this.settings;
        const v2599 = v2598.debug_mode;
        if (v2599) {
            const v2600 = this.debug_label;
            const v2601 = `${ v2600 }: Error Response: `;
            const v2602 = console.log(v2601, result);
            v2602;
        }
        const v2603 = this.settings;
        const v2604 = v2603.debug_mode;
        if (v2604) {
            const v2605 = this.debug_label;
            const v2606 = `${ v2605 }: File may be INFECTED!`;
            const v2607 = console.log(v2606);
            v2607;
        }
    }
    const v2608 = [];
    const v2609 = {};
    v2609.is_infected = null;
    v2609.viruses = v2608;
    v2609.file = file;
    v2609.resultString = result;
    return v2609;
};
NodeClam._process_result = _process_result;
const get_version = function get_version(cb) {
    const self = this;
    let has_cb = false;
    const v2610 = typeof cb;
    const v2611 = v2610 !== 'function';
    const v2612 = cb && v2611;
    if (v2612) {
        const v2613 = new NodeClamError('Invalid cb provided to scan_stream. Second paramter must be a function!');
        throw v2613;
    }
    const v2614 = typeof cb;
    const v2615 = v2614 === 'function';
    const v2616 = cb && v2615;
    if (v2616) {
        has_cb = true;
    }
    const v2689 = async (resolve, reject) => {
        const local_fallback = async () => {
            const v2617 = self.settings;
            const v2618 = self.scanner;
            const v2619 = v2617[v2618];
            const v2620 = v2619.path;
            const v2621 = self._build_clam_args('--version');
            const v2622 = v2621.join(' ');
            const command = `${ v2620 } ${ v2622 }`;
            const v2623 = self.settings;
            const v2624 = v2623.debug_mode;
            if (v2624) {
                const v2625 = this.debug_label;
                const v2626 = `${ v2625 }: Configured clam command: ${ command }`;
                const v2627 = console.log(v2626);
                v2627;
            }
            try {
                const v2628 = await cp_execfile(command);
                const stdout = v2628.stdout;
                const stderr = v2628.stderr;
                if (stderr) {
                    const v2629 = {
                        stderr,
                        file: null
                    };
                    const err = new NodeClamError(v2629, 'ClamAV responded with an unexpected response when requesting version.');
                    const v2630 = self.settings;
                    const v2631 = v2630.debug_mode;
                    if (v2631) {
                        const v2632 = this.debug_label;
                        const v2633 = `${ v2632 }: `;
                        const v2634 = console.log(v2633, err);
                        v2634;
                    }
                    const v2635 = cb(err, null, null);
                    const v2636 = reject(err);
                    let v2637;
                    if (has_cb) {
                        v2637 = v2635;
                    } else {
                        v2637 = v2636;
                    }
                    return v2637;
                } else {
                    const v2638 = cb(null, stdout);
                    const v2639 = resolve(stdout);
                    let v2640;
                    if (has_cb) {
                        v2640 = v2638;
                    } else {
                        v2640 = v2639;
                    }
                    return v2640;
                }
            } catch (e) {
                const v2641 = Object.prototype;
                const v2642 = v2641.hasOwnProperty;
                const v2643 = v2642.call(e, 'code');
                const v2644 = e.code;
                const v2645 = v2644 === 1;
                const v2646 = v2643 && v2645;
                if (v2646) {
                    const v2647 = cb(null, null);
                    const v2648 = resolve(null, null);
                    let v2649;
                    if (has_cb) {
                        v2649 = v2647;
                    } else {
                        v2649 = v2648;
                    }
                    return v2649;
                } else {
                    const v2650 = { err: e };
                    const err = new NodeClamError(v2650, 'There was an error requestion ClamAV version.');
                    const v2651 = self.settings;
                    const v2652 = v2651.debug_mode;
                    if (v2652) {
                        const v2653 = this.debug_label;
                        const v2654 = `${ v2653 }: `;
                        const v2655 = console.log(v2654, err);
                        v2655;
                    }
                    const v2656 = cb(err, null);
                    const v2657 = reject(err);
                    let v2658;
                    if (has_cb) {
                        v2658 = v2656;
                    } else {
                        v2658 = v2657;
                    }
                    return v2658;
                }
            }
        };
        const v2659 = this.scanner;
        const v2660 = v2659 === 'clamdscan';
        const v2661 = this.settings;
        const v2662 = v2661.clamdscan;
        const v2663 = v2662.socket;
        const v2664 = this.settings;
        const v2665 = v2664.clamdscan;
        const v2666 = v2665.host;
        const v2667 = v2663 || v2666;
        const v2668 = v2660 && v2667;
        if (v2668) {
            const chunks = [];
            try {
                const client = await this._init_socket();
                const v2669 = client.write('nVERSION\n');
                v2669;
                const v2671 = chunk => {
                    const v2670 = chunks.push(chunk);
                    return v2670;
                };
                const v2672 = client.on('data', v2671);
                v2672;
                const v2678 = () => {
                    const response = Buffer.concat(chunks);
                    const v2673 = response.toString();
                    const v2674 = cb(null, v2673);
                    const v2675 = response.toString();
                    const v2676 = resolve(v2675);
                    let v2677;
                    if (has_cb) {
                        v2677 = v2674;
                    } else {
                        v2677 = v2676;
                    }
                    return v2677;
                };
                const v2679 = client.on('end', v2678);
                v2679;
            } catch (err) {
                const v2680 = this.settings;
                const v2681 = v2680.clamdscan;
                const v2682 = v2681.local_fallback;
                const v2683 = v2682 === true;
                if (v2683) {
                    const v2684 = local_fallback();
                    return v2684;
                } else {
                    const v2685 = cb(err, null);
                    const v2686 = resolve(err);
                    let v2687;
                    if (has_cb) {
                        v2687 = v2685;
                    } else {
                        v2687 = v2686;
                    }
                    return v2687;
                }
            }
        } else {
            const v2688 = local_fallback();
            return v2688;
        }
    };
    const v2690 = new Promise(v2689);
    return v2690;
};
NodeClam.get_version = get_version;
const is_infected = function is_infected(file = '', cb) {
    const self = this;
    let has_cb = false;
    const v2691 = typeof cb;
    const v2692 = v2691 !== 'function';
    const v2693 = cb && v2692;
    if (v2693) {
        const v2694 = new NodeClamError('Invalid cb provided to is_infected. Second paramter, if provided, must be a function!');
        throw v2694;
    } else {
        const v2695 = typeof cb;
        const v2696 = v2695 === 'function';
        const v2697 = cb && v2696;
        if (v2697) {
            has_cb = true;
        }
    }
    const v2869 = async (resolve, reject) => {
        const v2698 = typeof file;
        const v2699 = v2698 !== 'string';
        const v2700 = typeof file;
        const v2701 = v2700 === 'string';
        const v2702 = file.trim();
        const v2703 = v2702 === '';
        const v2704 = v2701 && v2703;
        const v2705 = v2699 || v2704;
        if (v2705) {
            const v2706 = { file };
            const err = new NodeClamError(v2706, 'Invalid or empty file name provided.');
            const v2707 = [];
            const v2708 = cb(err, file, null, v2707);
            const v2709 = reject(err);
            let v2710;
            if (has_cb) {
                v2710 = v2708;
            } else {
                v2710 = v2709;
            }
            return v2710;
        }
        const v2711 = file.trim();
        file = v2711.replace(/ /g, ' ');
        const local_scan = () => {
            const v2712 = self.settings;
            const v2713 = v2712.debug_mode;
            if (v2713) {
                const v2714 = this.debug_label;
                const v2715 = `${ v2714 }: Scanning ${ file }`;
                const v2716 = console.log(v2715);
                v2716;
            }
            const args = self._build_clam_args(file);
            const v2717 = self.settings;
            const v2718 = v2717.debug_mode;
            if (v2718) {
                const v2719 = this.debug_label;
                const v2720 = self.settings;
                const v2721 = self.scanner;
                const v2722 = v2720[v2721];
                const v2723 = v2722.path;
                const v2724 = `${ v2719 }: Configured clam command: ${ v2723 }`;
                const v2725 = args.join(' ');
                const v2726 = console.log(v2724, v2725);
                v2726;
            }
            const v2727 = self.settings;
            const v2728 = self.scanner;
            const v2729 = v2727[v2728];
            const v2730 = v2729.path;
            const v2772 = (err, stdout, stderr) => {
                const v2731 = self._process_result(stdout, file);
                const is_infected = v2731.is_infected;
                const viruses = v2731.viruses;
                if (err) {
                    const v2732 = Object.prototype;
                    const v2733 = v2732.hasOwnProperty;
                    const v2734 = v2733.call(err, 'code');
                    const v2735 = err.code;
                    const v2736 = v2735 === 1;
                    const v2737 = v2734 && v2736;
                    if (v2737) {
                        const v2738 = cb(null, file, true, viruses);
                        const v2739 = {
                            file,
                            is_infected,
                            viruses
                        };
                        const v2740 = resolve(v2739);
                        let v2741;
                        if (has_cb) {
                            v2741 = v2738;
                        } else {
                            v2741 = v2740;
                        }
                        return v2741;
                    } else {
                        const v2742 = {
                            file,
                            err,
                            is_infected: null
                        };
                        const v2743 = err.code;
                        const error = new NodeClamError(v2742, `There was an error scanning the file (ClamAV Error Code: ${ v2743 })`);
                        const v2744 = self.settings;
                        const v2745 = v2744.debug_mode;
                        if (v2745) {
                            const v2746 = this.debug_label;
                            const v2747 = `${ v2746 }`;
                            const v2748 = console.log(v2747, error);
                            v2748;
                        }
                        const v2749 = [];
                        const v2750 = cb(error, file, null, v2749);
                        const v2751 = reject(error);
                        let v2752;
                        if (has_cb) {
                            v2752 = v2750;
                        } else {
                            v2752 = v2751;
                        }
                        return v2752;
                    }
                } else {
                    if (stderr) {
                        const v2753 = {
                            stderr,
                            file
                        };
                        const err = new NodeClamError(v2753, 'The file was scanned but ClamAV responded with an unexpected response.');
                        const v2754 = self.settings;
                        const v2755 = v2754.debug_mode;
                        if (v2755) {
                            const v2756 = this.debug_label;
                            const v2757 = `${ v2756 }: `;
                            const v2758 = console.log(v2757, err);
                            v2758;
                        }
                        const v2759 = cb(err, file, null, viruses);
                        const v2760 = {
                            file,
                            is_infected,
                            viruses
                        };
                        const v2761 = resolve(v2760);
                        let v2762;
                        if (has_cb) {
                            v2762 = v2759;
                        } else {
                            v2762 = v2761;
                        }
                        return v2762;
                    } else {
                        try {
                            const v2763 = cb(null, file, is_infected, viruses);
                            const v2764 = {
                                file,
                                is_infected,
                                viruses
                            };
                            const v2765 = resolve(v2764);
                            let v2766;
                            if (has_cb) {
                                v2766 = v2763;
                            } else {
                                v2766 = v2765;
                            }
                            return v2766;
                        } catch (e) {
                            const v2767 = {
                                file,
                                err: e,
                                is_infected: null
                            };
                            const err = new NodeClamError(v2767, 'There was an error processing the results from ClamAV');
                            const v2768 = [];
                            const v2769 = cb(err, file, null, v2768);
                            const v2770 = reject(err);
                            let v2771;
                            if (has_cb) {
                                v2771 = v2769;
                            } else {
                                v2771 = v2770;
                            }
                            return v2771;
                        }
                    }
                }
            };
            const v2773 = execFile(v2730, args, v2772);
            v2773;
        };
        try {
            const v2774 = fs.constants;
            const v2775 = v2774.R_OK;
            await fs_access(file, v2775);
        } catch (e) {
            const v2776 = {
                err: e,
                file
            };
            const err = new NodeClamError(v2776, 'Could not find file to scan!');
            const v2777 = cb(err, file, true);
            const v2778 = reject(err);
            let v2779;
            if (has_cb) {
                v2779 = v2777;
            } else {
                v2779 = v2778;
            }
            return v2779;
        }
        try {
            const stats = await fs_stat(file);
            const is_directory = stats.isDirectory();
            const is_file = stats.isFile();
            const v2780 = !is_file;
            const v2781 = !is_directory;
            const v2782 = v2780 && v2781;
            if (v2782) {
                const v2783 = `${ file } is not a valid file or directory.`;
                const v2784 = Error(v2783);
                throw v2784;
            } else {
                const v2785 = !is_file;
                const v2786 = v2785 && is_directory;
                if (v2786) {
                    const v2787 = await this.scan_dir(file);
                    const is_infected = v2787.is_infected;
                    const v2788 = [];
                    const v2789 = cb(null, file, is_infected, v2788);
                    const v2790 = [];
                    const v2791 = {
                        file,
                        is_infected,
                        viruses: v2790
                    };
                    const v2792 = resolve(v2791);
                    let v2793;
                    if (has_cb) {
                        v2793 = v2789;
                    } else {
                        v2793 = v2792;
                    }
                    return v2793;
                }
            }
        } catch (err) {
            const v2794 = cb(err, file, null);
            const v2795 = reject(err);
            let v2796;
            if (has_cb) {
                v2796 = v2794;
            } else {
                v2796 = v2795;
            }
            return v2796;
        }
        const v2797 = this.settings;
        const v2798 = v2797.clamdscan;
        const v2799 = v2798.socket;
        const v2800 = this.settings;
        const v2801 = v2800.clamdscan;
        const v2802 = v2801.host;
        const v2803 = v2799 || v2802;
        if (v2803) {
            const v2804 = this.settings;
            const v2805 = v2804.clamdscan;
            const v2806 = v2805.socket;
            if (v2806) {
                try {
                    const client = await this._init_socket('is_infected');
                    const v2807 = this.settings;
                    const v2808 = v2807.debug_mode;
                    if (v2808) {
                        const v2809 = this.debug_label;
                        const v2810 = `${ v2809 }: scanning with local domain socket now.`;
                        const v2811 = console.log(v2810);
                        v2811;
                    }
                    const v2812 = this.settings;
                    const v2813 = v2812.clamdscan;
                    const v2814 = v2813.multiscan;
                    const v2815 = v2814 === true;
                    if (v2815) {
                        const v2816 = `MULTISCAN ${ file }`;
                        const v2817 = client.write(v2816);
                        v2817;
                    } else {
                        const v2818 = `SCAN ${ file }`;
                        const v2819 = client.write(v2818);
                        v2819;
                    }
                    const v2840 = async data => {
                        const v2820 = this.settings;
                        const v2821 = v2820.debug_mode;
                        if (v2821) {
                            const v2822 = this.debug_label;
                            const v2823 = `${ v2822 }: Received response from remote clamd service.`;
                            const v2824 = console.log(v2823);
                            v2824;
                        }
                        try {
                            const v2825 = data.toString();
                            const result = this._process_result(v2825, file);
                            const v2826 = result instanceof Error;
                            if (v2826) {
                                throw result;
                            }
                            const v2827 = result;
                            const is_infected = v2827.is_infected;
                            const viruses = v2827.viruses;
                            const v2828 = cb(null, file, is_infected, viruses);
                            const v2829 = {
                                file,
                                is_infected,
                                viruses
                            };
                            const v2830 = resolve(v2829);
                            let v2831;
                            if (has_cb) {
                                v2831 = v2828;
                            } else {
                                v2831 = v2830;
                            }
                            return v2831;
                        } catch (err) {
                            const v2832 = this.settings;
                            const v2833 = v2832.clamdscan;
                            const v2834 = v2833.local_fallback;
                            const v2835 = v2834 === true;
                            if (v2835) {
                                return await local_scan();
                            }
                            const v2836 = [];
                            const v2837 = cb(err, file, null, v2836);
                            const v2838 = reject(err);
                            let v2839;
                            if (has_cb) {
                                v2839 = v2837;
                            } else {
                                v2839 = v2838;
                            }
                            return v2839;
                        }
                    };
                    const v2841 = client.on('data', v2840);
                    v2841;
                } catch (err) {
                    const v2842 = this.settings;
                    const v2843 = v2842.clamdscan;
                    const v2844 = v2843.local_fallback;
                    const v2845 = v2844 === true;
                    if (v2845) {
                        return await local_scan();
                    }
                    const v2846 = [];
                    const v2847 = cb(err, file, null, v2846);
                    const v2848 = reject(err);
                    let v2849;
                    if (has_cb) {
                        v2849 = v2847;
                    } else {
                        v2849 = v2848;
                    }
                    return v2849;
                }
            } else {
                const stream = fs.createReadStream(file);
                try {
                    const is_infected = await this.scan_stream(stream);
                    const v2850 = [];
                    const v2851 = cb(null, file, is_infected, v2850);
                    const v2852 = { file };
                    const v2853 = Object.assign(v2852, is_infected);
                    const v2854 = resolve(v2853);
                    let v2855;
                    if (has_cb) {
                        v2855 = v2851;
                    } else {
                        v2855 = v2854;
                    }
                    return v2855;
                } catch (e) {
                    const v2856 = this.settings;
                    const v2857 = v2856.clamdscan;
                    const v2858 = v2857.local_fallback;
                    const v2859 = v2858 === true;
                    if (v2859) {
                        return await local_scan();
                    }
                    const v2860 = {
                        err: e,
                        file
                    };
                    const err = new NodeClamError(v2860, 'Could not scan file via TCP or locally!');
                    const v2861 = [];
                    const v2862 = cb(err, file, null, v2861);
                    const v2863 = reject(err);
                    let v2864;
                    if (has_cb) {
                        v2864 = v2862;
                    } else {
                        v2864 = v2863;
                    }
                    return v2864;
                } finally {
                    const v2865 = stream.destroy();
                    v2865;
                }
            }
        } else {
            try {
                return await local_scan();
            } catch (err) {
                const v2866 = cb(err, file, null);
                const v2867 = reject(err);
                let v2868;
                if (has_cb) {
                    v2868 = v2866;
                } else {
                    v2868 = v2867;
                }
                return v2868;
            }
        }
    };
    const v2870 = new Promise(v2869);
    return v2870;
};
NodeClam.is_infected = is_infected;
const passthrough = function passthrough() {
    const me = this;
    let _scan_complete = false;
    let _av_waiting = null;
    let _av_scan_time = false;
    const clear_scan_benchmark = () => {
        if (_av_waiting) {
            const v2871 = clearInterval(_av_waiting);
            v2871;
        }
        _av_waiting = null;
        _av_scan_time = 0;
    };
    const v3001 = async function (chunk, encoding, cb) {
        const do_transform = () => {
            const v2872 = this._fork_stream;
            const v2873 = v2872.write(chunk);
            const v2874 = !v2873;
            if (v2874) {
                const v2875 = this._fork_stream;
                const v2877 = () => {
                    const v2876 = cb(null, chunk);
                    v2876;
                };
                const v2878 = v2875.once('drain', v2877);
                v2878;
            } else {
                const v2879 = cb(null, chunk);
                v2879;
            }
        };
        const handle_error = (err, is_infected = null, result = null) => {
            const v2880 = this._fork_stream;
            const v2881 = v2880.unpipe();
            v2881;
            const v2882 = this._fork_stream;
            const v2883 = v2882.destroy();
            v2883;
            const v2884 = this._clamav_transform;
            const v2885 = v2884.destroy();
            v2885;
            const v2886 = clear_scan_benchmark();
            v2886;
            const v2887 = is_infected === true;
            if (v2887) {
                const v2888 = _scan_complete === false;
                if (v2888) {
                    _scan_complete = true;
                    const v2889 = this.emit('scan-complete', result);
                    v2889;
                }
                const v2890 = this.emit('stream-infected', result);
                v2890;
            } else {
                const v2891 = this.emit('error', err);
                v2891;
            }
        };
        const v2892 = this._clamav_socket;
        const v2893 = !v2892;
        if (v2893) {
            this._fork_stream = new PassThrough();
            const v2894 = {};
            const v2895 = me.settings;
            const v2896 = v2895.debug_mode;
            this._clamav_transform = new NodeClamTransform(v2894, v2896);
            this._clamav_response_chunks = [];
            try {
                this._clamav_socket = await me._init_socket('passthrough');
                const v2897 = me.settings;
                const v2898 = v2897.debug_mode;
                if (v2898) {
                    const v2899 = me.debug_label;
                    const v2900 = `${ v2899 }: ClamAV Socket Initialized...`;
                    const v2901 = console.log(v2900);
                    v2901;
                }
                const v2902 = this._fork_stream;
                const v2903 = this._clamav_transform;
                const v2904 = v2902.pipe(v2903);
                const v2905 = this._clamav_socket;
                const v2906 = v2904.pipe(v2905);
                v2906;
                const v2907 = this._clamav_socket;
                const v2913 = hadError => {
                    const v2908 = me.settings;
                    const v2909 = v2908.debug_mode;
                    if (v2909) {
                        const v2910 = me.debug_label;
                        const v2911 = `${ v2910 }: ClamAV socket has been closed! Because of Error:`;
                        const v2912 = console.log(v2911, hadError);
                        v2912;
                    }
                };
                const v2914 = v2907.on('close', v2913);
                const v2933 = () => {
                    const v2915 = me.settings;
                    const v2916 = v2915.debug_mode;
                    if (v2916) {
                        const v2917 = me.debug_label;
                        const v2918 = `${ v2917 }: ClamAV socket has received the last chunk!`;
                        const v2919 = console.log(v2918);
                        v2919;
                    }
                    const v2920 = this._clamav_response_chunks;
                    const response = Buffer.concat(v2920);
                    const v2921 = response.toString('utf8');
                    const result = me._process_result(v2921, null);
                    this._clamav_response_chunks = [];
                    const v2922 = me.settings;
                    const v2923 = v2922.debug_mode;
                    if (v2923) {
                        const v2924 = me.debug_label;
                        const v2925 = `${ v2924 }: Result of scan:`;
                        const v2926 = console.log(v2925, result);
                        v2926;
                        const v2927 = me.debug_label;
                        const v2928 = `${ v2927 }: It took ${ _av_scan_time } seconds to scan the file(s).`;
                        const v2929 = console.log(v2928);
                        v2929;
                        const v2930 = clear_scan_benchmark();
                        v2930;
                    }
                    const v2931 = _scan_complete === false;
                    if (v2931) {
                        _scan_complete = true;
                        const v2932 = this.emit('scan-complete', result);
                        v2932;
                    }
                };
                const v2934 = v2914.on('end', v2933);
                const v2940 = () => {
                    const v2935 = me.settings;
                    const v2936 = v2935.debug_mode;
                    if (v2936) {
                        const v2937 = me.debug_label;
                        const v2938 = `${ v2937 }: ClamAV socket ready to receive`;
                        const v2939 = console.log(v2938);
                        v2939;
                    }
                };
                const v2941 = v2934.on('ready', v2940);
                const v2947 = () => {
                    const v2942 = me.settings;
                    const v2943 = v2942.debug_mode;
                    if (v2943) {
                        const v2944 = me.debug_label;
                        const v2945 = `${ v2944 }: Connected to ClamAV socket`;
                        const v2946 = console.log(v2945);
                        v2946;
                    }
                };
                const v2948 = v2941.on('connect', v2947);
                const v2953 = err => {
                    const v2949 = me.debug_label;
                    const v2950 = `${ v2949 }: Error emitted from ClamAV socket: `;
                    const v2951 = console.error(v2950, err);
                    v2951;
                    const v2952 = handle_error(err);
                    v2952;
                };
                const v2954 = v2948.on('error', v2953);
                const v2989 = cv_chunk => {
                    const v2955 = this._clamav_response_chunks;
                    const v2956 = v2955.push(cv_chunk);
                    v2956;
                    const v2957 = me.settings;
                    const v2958 = v2957.debug_mode;
                    if (v2958) {
                        const v2959 = me.debug_label;
                        const v2960 = `${ v2959 }: Got result!`;
                        const v2961 = cv_chunk.toString();
                        const v2962 = console.log(v2960, v2961);
                        v2962;
                    }
                    const v2963 = this._clamav_response_chunks;
                    const response = Buffer.concat(v2963);
                    const v2964 = response.toString();
                    const result = me._process_result(v2964, null);
                    const v2965 = result instanceof NodeClamError;
                    const v2966 = typeof result;
                    const v2967 = v2966 === 'object';
                    const v2968 = 'is_infected' in result;
                    const v2969 = v2967 && v2968;
                    const v2970 = result.is_infected;
                    const v2971 = v2970 === true;
                    const v2972 = v2969 && v2971;
                    const v2973 = v2965 || v2972;
                    if (v2973) {
                        const v2974 = typeof result;
                        const v2975 = v2974 === 'object';
                        const v2976 = 'is_infected' in result;
                        const v2977 = v2975 && v2976;
                        const v2978 = result.is_infected;
                        const v2979 = v2978 === true;
                        const v2980 = v2977 && v2979;
                        if (v2980) {
                            const v2981 = handle_error(null, true, result);
                            v2981;
                        } else {
                            const v2982 = handle_error(result);
                            v2982;
                        }
                    } else {
                        const v2983 = me.settings;
                        const v2984 = v2983.debug_mode;
                        if (v2984) {
                            const v2985 = me.debug_label;
                            const v2986 = `${ v2985 }: Processed Result: `;
                            const v2987 = response.toString();
                            const v2988 = console.log(v2986, result, v2987);
                            v2988;
                        }
                    }
                };
                const v2990 = v2954.on('data', v2989);
                v2990;
                const v2991 = me.settings;
                const v2992 = v2991.debug_mode;
                if (v2992) {
                    const v2993 = me.debug_label;
                    const v2994 = `${ v2993 }: Doing initial transform!`;
                    const v2995 = console.log(v2994);
                    v2995;
                }
                const v2996 = do_transform();
                v2996;
            } catch (err) {
                const v2997 = me.debug_label;
                const v2998 = `${ v2997 }: Error initiating socket to ClamAV: `;
                const v2999 = console.error(v2998, err);
                v2999;
            }
        } else {
            const v3000 = do_transform();
            v3000;
        }
    };
    const v3023 = function (cb) {
        const v3002 = me.settings;
        const v3003 = v3002.debug_mode;
        if (v3003) {
            const v3004 = me.debug_label;
            const v3005 = `${ v3004 }: Done with the full pipeline.`;
            const v3006 = console.log(v3005);
            v3006;
        }
        _av_waiting = null;
        _av_scan_time = 0;
        const v3007 = me.settings;
        const v3008 = v3007.debug_mode;
        if (v3008) {
            const v3014 = () => {
                _av_scan_time += 1;
                const v3009 = _av_scan_time % 5;
                const v3010 = v3009 === 0;
                if (v3010) {
                    const v3011 = me.debug_label;
                    const v3012 = `${ v3011 }: ClamAV has been scanning for ${ _av_scan_time } seconds...`;
                    const v3013 = console.log(v3012);
                    v3013;
                }
            };
            _av_waiting = setInterval(v3014, 1000);
        }
        const v3015 = this._clamav_socket;
        const v3016 = this._clamav_socket;
        const v3017 = v3016.writable;
        const v3018 = v3017 === true;
        const v3019 = v3015 && v3018;
        if (v3019) {
            const size = Buffer.alloc(4);
            const v3020 = size.writeInt32BE(0, 0);
            v3020;
            const v3021 = this._clamav_socket;
            const v3022 = v3021.write(size, cb);
            v3022;
        }
    };
    const v3024 = {
        transform: v3001,
        flush: v3023
    };
    const v3025 = new Transform(v3024);
    return v3025;
};
NodeClam.passthrough = passthrough;
const scan_file = function scan_file(file, cb) {
    const v3026 = this.is_infected(file, cb);
    return v3026;
};
NodeClam.scan_file = scan_file;
const scan_files = function scan_files(files = [], end_cb = null, file_cb = null) {
    const self = this;
    let has_cb = false;
    const v3027 = typeof file_cb;
    const v3028 = v3027 !== 'function';
    const v3029 = file_cb && v3028;
    if (v3029) {
        const v3030 = new NodeClamError('Invalid file callback provided to `scan_files`. Third paramter, if provided, must be a function!');
        throw v3030;
    }
    const v3031 = typeof end_cb;
    const v3032 = v3031 !== 'function';
    const v3033 = end_cb && v3032;
    if (v3033) {
        const v3034 = new NodeClamError('Invalid end-scan callback provided to `scan_files`. Second paramter, if provided, must be a function!');
        throw v3034;
    } else {
        const v3035 = typeof end_cb;
        const v3036 = v3035 === 'function';
        const v3037 = end_cb && v3036;
        if (v3037) {
            has_cb = true;
        }
    }
    const v3038 = Array.isArray(files);
    const v3039 = files && v3038;
    const v3040 = files.length;
    const v3041 = v3040 > 1000000;
    const v3042 = v3039 && v3041;
    if (v3042) {
        const v3043 = files.length;
        const v3044 = { num_files: v3043 };
        const v3045 = new NodeClamError(v3044, 'NodeClam has haulted because more than 1 million files were about to be scanned. We suggest taking a different approach.');
        throw v3045;
    }
    const v3419 = async (resolve, reject) => {
        const errors = {};
        let bad_files = [];
        let good_files = [];
        let viruses = [];
        let orig_num_files = 0;
        const parse_stdout = (err, stdout) => {
            const v3046 = stdout.trim();
            const v3047 = String.fromCharCode(10);
            const v3048 = v3046.split(v3047);
            const v3053 = v => {
                const v3049 = /FOUND\n?$/.test(v);
                const v3050 = v.replace(/(.+):\s+(.+)FOUND\n?$/, '$2');
                const v3051 = v3050.trim();
                let v3052;
                if (v3049) {
                    v3052 = v3051;
                } else {
                    v3052 = null;
                }
                return v3052;
            };
            const v3054 = v3048.map(v3053);
            const v3057 = v => {
                const v3055 = !v;
                const v3056 = !v3055;
                return v3056;
            };
            let viruses = v3054.filter(v3057);
            const v3058 = stdout.trim();
            const v3059 = String.fromCharCode(10);
            const v3060 = v3058.split(v3059);
            const v3078 = result => {
                const v3061 = /^[-]+$/.test(result);
                if (v3061) {
                    return;
                }
                let path = result.match(/^(.*): /);
                const v3062 = path.length;
                const v3063 = v3062 > 0;
                const v3064 = path && v3063;
                if (v3064) {
                    path = path[1];
                } else {
                    path = '<Unknown File Path!>';
                }
                const v3065 = /\s+OK(\u0000|[\r\n])$/.test(result);
                if (v3065) {
                    const v3066 = self.settings;
                    const v3067 = v3066.debug_mode;
                    if (v3067) {
                        const v3068 = this.debug_label;
                        const v3069 = `${ v3068 }: ${ path } is OK!`;
                        const v3070 = console.log(v3069);
                        v3070;
                    }
                    const v3071 = good_files.push(path);
                    v3071;
                } else {
                    const v3072 = self.settings;
                    const v3073 = v3072.debug_mode;
                    if (v3073) {
                        const v3074 = this.debug_label;
                        const v3075 = `${ v3074 }: ${ path } is INFECTED!`;
                        const v3076 = console.log(v3075);
                        v3076;
                    }
                    const v3077 = bad_files.push(path);
                    v3077;
                }
            };
            const v3079 = v3060.forEach(v3078);
            v3079;
            const v3080 = new Set(bad_files);
            bad_files = Array.from(v3080);
            const v3081 = new Set(good_files);
            good_files = Array.from(v3081);
            const v3082 = new Set(viruses);
            viruses = Array.from(v3082);
            if (err) {
                const v3083 = [];
                const v3084 = {};
                const v3085 = [];
                const v3086 = end_cb(err, v3083, bad_files, v3084, v3085);
                const v3087 = { bad_files };
                const v3088 = new NodeClamError(v3087, err);
                const v3089 = reject(v3088);
                let v3090;
                if (has_cb) {
                    v3090 = v3086;
                } else {
                    v3090 = v3089;
                }
                return v3090;
            }
            const v3091 = {};
            const v3092 = end_cb(null, good_files, bad_files, v3091, viruses);
            const v3093 = {
                good_files,
                bad_files,
                viruses,
                errors: null
            };
            const v3094 = resolve(v3093);
            let v3095;
            if (has_cb) {
                v3095 = v3092;
            } else {
                v3095 = v3094;
            }
            return v3095;
        };
        const local_scan = async () => {
            const v3097 = file => {
                const v3096 = file.replace(/ /g, '\\ ');
                return v3096;
            };
            const items = files.map(v3097);
            const v3098 = self.settings;
            const v3099 = self.scanner;
            const v3100 = v3098[v3099];
            const v3101 = v3100.path;
            const v3102 = self._build_clam_args(items);
            const v3103 = v3102.join(' ');
            const command = `${ v3101 } ${ v3103 }`;
            const v3104 = self.settings;
            const v3105 = v3104.debug_mode;
            if (v3105) {
                const v3106 = self.settings;
                const v3107 = v3106.debug_mode;
                if (v3107) {
                    const v3108 = self.debug_label;
                    const v3109 = `${ v3108 }: Configured clam command: ${ command }}`;
                    const v3110 = console.log(v3109);
                    v3110;
                }
            }
            const v3140 = (err, stdout, stderr) => {
                const v3111 = self.settings;
                const v3112 = v3111.debug_mode;
                if (v3112) {
                    const v3113 = this.debug_label;
                    const v3114 = `${ v3113 }: stdout:`;
                    const v3115 = console.log(v3114, stdout);
                    v3115;
                }
                if (err) {
                    const v3116 = parse_stdout(err, stdout);
                    return v3116;
                }
                if (stderr) {
                    const v3117 = self.settings;
                    const v3118 = v3117.debug_mode;
                    if (v3118) {
                        const v3119 = this.debug_label;
                        const v3120 = `${ v3119 }: `;
                        const v3121 = console.log(v3120, stderr);
                        v3121;
                    }
                    const v3122 = stderr.length;
                    const v3123 = v3122 > 0;
                    if (v3123) {
                        const v3124 = os.EOL;
                        const v3125 = stderr.split(v3124);
                        const v3135 = err_line => {
                            const match = err_line.match(/^ERROR: Can't access file (.*)+$/);
                            const v3126 = match !== null;
                            const v3127 = match.length;
                            const v3128 = v3127 > 1;
                            const v3129 = v3126 && v3128;
                            const v3130 = match[1];
                            const v3131 = typeof v3130;
                            const v3132 = v3131 === 'string';
                            const v3133 = v3129 && v3132;
                            if (v3133) {
                                const v3134 = match[1];
                                return v3134;
                            }
                            return '';
                        };
                        bad_files = v3125.map(v3135);
                        const v3138 = v => {
                            const v3136 = !v;
                            const v3137 = !v3136;
                            return v3137;
                        };
                        bad_files = bad_files.filter(v3138);
                    }
                }
                const v3139 = parse_stdout(null, stdout);
                return v3139;
            };
            const v3141 = execFile(command, v3140);
            v3141;
        };
        const do_scan = async files => {
            const num_files = files.length;
            const v3142 = self.settings;
            const v3143 = v3142.debug_mode;
            if (v3143) {
                const v3144 = this.debug_label;
                const v3145 = `${ v3144 }: Scanning a list of ${ num_files } passed files.`;
                const v3146 = console.log(v3145);
                v3146;
            }
            const v3147 = typeof file_cb;
            const v3148 = v3147 === 'function';
            const v3149 = file_cb && v3148;
            if (v3149) {
                const chunk_size = 10;
                let results = [];
                const v3150 = files.length;
                let v3151 = v3150 > 0;
                while (v3151) {
                    let chunk = [];
                    const v3152 = files.length;
                    const v3153 = v3152 > chunk_size;
                    if (v3153) {
                        chunk = files.splice(0, chunk_size);
                    } else {
                        chunk = files.splice(0);
                    }
                    const v3157 = file => {
                        const v3154 = this.is_infected(file);
                        const v3155 = e => {
                            return e;
                        };
                        const v3156 = v3154.catch(v3155);
                        return v3156;
                    };
                    const v3158 = chunk.map(v3157);
                    const chunk_results = await Promise.all(v3158);
                    const v3161 = (v, i) => {
                        const v3159 = chunk[i];
                        const v3160 = [
                            v3159,
                            v
                        ];
                        return v3160;
                    };
                    const chunk_results_mapped = chunk_results.map(v3161);
                    const v3165 = v => {
                        const v3162 = v[0];
                        const v3163 = v[1];
                        const v3164 = file_cb(null, v3162, v3163);
                        return v3164;
                    };
                    const v3166 = chunk_results_mapped.forEach(v3165);
                    v3166;
                    results = results.concat(chunk_results_mapped);
                    v3151 = v3150 > 0;
                }
                const v3179 = v => {
                    const v3167 = v[1];
                    const v3168 = v3167 === true;
                    if (v3168) {
                        const v3169 = v[0];
                        const v3170 = bad_files.push(v3169);
                        v3170;
                    } else {
                        const v3171 = v[1];
                        const v3172 = v3171 === false;
                        if (v3172) {
                            const v3173 = v[0];
                            const v3174 = good_files.push(v3173);
                            v3174;
                        } else {
                            const v3175 = v[1];
                            const v3176 = v3175 instanceof Error;
                            if (v3176) {
                                const v3177 = v[0];
                                const v3178 = v[1];
                                errors[v3177] = v3178;
                            }
                        }
                    }
                };
                const v3180 = results.forEach(v3179);
                v3180;
                const v3181 = results.length;
                const v3182 = num_files !== v3181;
                if (v3182) {
                    const err_msg = 'The number of results did not match the number of files to scan!';
                    const v3183 = new NodeClamError(err_msg);
                    const v3184 = {};
                    const v3185 = [];
                    const v3186 = end_cb(v3183, good_files, bad_files, v3184, v3185);
                    const v3187 = {
                        good_files,
                        bad_files
                    };
                    const v3188 = new NodeClamError(v3187, err_msg);
                    const v3189 = reject(v3188);
                    let v3190;
                    if (has_cb) {
                        v3190 = v3186;
                    } else {
                        v3190 = v3189;
                    }
                    return v3190;
                }
                const v3191 = new Set(bad_files);
                bad_files = Array.from(v3191);
                const v3192 = new Set(good_files);
                good_files = Array.from(v3192);
                const v3193 = self.settings;
                const v3194 = v3193.debug_mode;
                if (v3194) {
                    const v3195 = self.debug_label;
                    const v3196 = `${ v3195 }: Scan Complete!`;
                    const v3197 = console.log(v3196);
                    v3197;
                    const v3198 = self.debug_label;
                    const v3199 = `${ v3198 }: Num Bad Files: `;
                    const v3200 = bad_files.length;
                    const v3201 = console.log(v3199, v3200);
                    v3201;
                    const v3202 = self.debug_label;
                    const v3203 = `${ v3202 }: Num Good Files: `;
                    const v3204 = good_files.length;
                    const v3205 = console.log(v3203, v3204);
                    v3205;
                }
                const v3206 = {};
                const v3207 = [];
                const v3208 = end_cb(null, good_files, bad_files, v3206, v3207);
                const v3209 = [];
                const v3210 = {
                    good_files,
                    bad_files,
                    errors: null,
                    viruses: v3209
                };
                const v3211 = resolve(v3210);
                let v3212;
                if (has_cb) {
                    v3212 = v3208;
                } else {
                    v3212 = v3211;
                }
                return v3212;
            } else {
                let all_files = [];
                const finish_scan = async () => {
                    const v3215 = v => {
                        const v3213 = !v;
                        const v3214 = !v3213;
                        return v3214;
                    };
                    const v3216 = all_files.filter(v3215);
                    const v3217 = new Set(v3216);
                    const v3218 = Array.from(v3217);
                    const v3221 = v => {
                        const v3219 = typeof v;
                        const v3220 = v3219 === 'string';
                        return v3220;
                    };
                    all_files = v3218.filter(v3221);
                    const v3222 = all_files.length;
                    const v3223 = v3222 <= 0;
                    if (v3223) {
                        const err = new NodeClamError('No valid files provided to scan!');
                        const v3224 = [];
                        const v3225 = [];
                        const v3226 = {};
                        const v3227 = [];
                        const v3228 = end_cb(err, v3224, v3225, v3226, v3227);
                        const v3229 = reject(err);
                        let v3230;
                        if (has_cb) {
                            v3230 = v3228;
                        } else {
                            v3230 = v3229;
                        }
                        return v3230;
                    }
                    const v3231 = self.settings;
                    const v3232 = v3231.clamdscan;
                    const v3233 = v3232.socket;
                    const v3234 = self.settings;
                    const v3235 = v3234.clamdscan;
                    const v3236 = v3235.port;
                    const v3237 = v3233 || v3236;
                    if (v3237) {
                        const chunk_size = 10;
                        let results = [];
                        const v3238 = all_files.length;
                        let v3239 = v3238 > 0;
                        while (v3239) {
                            let chunk = [];
                            const v3240 = all_files.length;
                            const v3241 = v3240 > chunk_size;
                            if (v3241) {
                                chunk = all_files.splice(0, chunk_size);
                            } else {
                                chunk = all_files.splice(0);
                            }
                            const v3245 = file => {
                                const v3242 = self.is_infected(file);
                                const v3243 = e => {
                                    return e;
                                };
                                const v3244 = v3242.catch(v3243);
                                return v3244;
                            };
                            const v3246 = chunk.map(v3245);
                            const chunk_results = await Promise.all(v3246);
                            const v3249 = (v, i) => {
                                const v3247 = chunk[i];
                                const v3248 = [
                                    v3247,
                                    v
                                ];
                                return v3248;
                            };
                            const chunk_results_mapped = chunk_results.map(v3249);
                            results = results.concat(chunk_results_mapped);
                            v3239 = v3238 > 0;
                        }
                        const v3293 = v => {
                            const v3250 = v[1];
                            const v3251 = v3250 instanceof Error;
                            if (v3251) {
                                const v3252 = v[0];
                                const v3253 = v[1];
                                errors[v3252] = v3253;
                            } else {
                                const v3254 = v[1];
                                const v3255 = typeof v3254;
                                const v3256 = v3255 === 'object';
                                const v3257 = v[1];
                                const v3258 = 'is_infected' in v3257;
                                const v3259 = v3256 && v3258;
                                const v3260 = v[1];
                                const v3261 = v3260.is_infected;
                                const v3262 = v3261 === true;
                                const v3263 = v3259 && v3262;
                                if (v3263) {
                                    const v3264 = v[1];
                                    const v3265 = v3264.file;
                                    const v3266 = bad_files.push(v3265);
                                    v3266;
                                    const v3267 = v[1];
                                    const v3268 = 'viruses' in v3267;
                                    const v3269 = v[1];
                                    const v3270 = v3269.viruses;
                                    const v3271 = Array.isArray(v3270);
                                    const v3272 = v3268 && v3271;
                                    const v3273 = v[1];
                                    const v3274 = v3273.viruses;
                                    const v3275 = v3274.length;
                                    const v3276 = v3275 > 0;
                                    const v3277 = v3272 && v3276;
                                    if (v3277) {
                                        const v3278 = v[1];
                                        const v3279 = v3278.viruses;
                                        viruses = viruses.concat(v3279);
                                    }
                                } else {
                                    const v3280 = v[1];
                                    const v3281 = typeof v3280;
                                    const v3282 = v3281 === 'object';
                                    const v3283 = v[1];
                                    const v3284 = 'is_infected' in v3283;
                                    const v3285 = v3282 && v3284;
                                    const v3286 = v[1];
                                    const v3287 = v3286.is_infected;
                                    const v3288 = v3287 === false;
                                    const v3289 = v3285 && v3288;
                                    if (v3289) {
                                        const v3290 = v[1];
                                        const v3291 = v3290.file;
                                        const v3292 = good_files.push(v3291);
                                        v3292;
                                    }
                                }
                            }
                        };
                        const v3294 = results.forEach(v3293);
                        v3294;
                        const v3295 = new Set(bad_files);
                        bad_files = Array.from(v3295);
                        const v3296 = new Set(good_files);
                        good_files = Array.from(v3296);
                        const v3297 = new Set(viruses);
                        viruses = Array.from(v3297);
                        const v3298 = self.settings;
                        const v3299 = v3298.debug_mode;
                        if (v3299) {
                            const v3300 = self.debug_label;
                            const v3301 = `${ v3300 }: Scan Complete!`;
                            const v3302 = console.log(v3301);
                            v3302;
                            const v3303 = self.debug_label;
                            const v3304 = `${ v3303 }: Num Bad Files: `;
                            const v3305 = bad_files.length;
                            const v3306 = console.log(v3304, v3305);
                            v3306;
                            const v3307 = self.debug_label;
                            const v3308 = `${ v3307 }: Num Good Files: `;
                            const v3309 = good_files.length;
                            const v3310 = console.log(v3308, v3309);
                            v3310;
                            const v3311 = self.debug_label;
                            const v3312 = `${ v3311 }: Num Viruses: `;
                            const v3313 = viruses.length;
                            const v3314 = console.log(v3312, v3313);
                            v3314;
                        }
                        const v3315 = end_cb(null, good_files, bad_files, errors, viruses);
                        const v3316 = {
                            errors,
                            good_files,
                            bad_files,
                            viruses
                        };
                        const v3317 = resolve(v3316);
                        let v3318;
                        if (has_cb) {
                            v3318 = v3315;
                        } else {
                            v3318 = v3317;
                        }
                        return v3318;
                    } else {
                        const v3319 = local_scan();
                        return v3319;
                    }
                };
                const v3320 = this.scan_recursively;
                const v3321 = v3320 === false;
                const v3322 = this.scanner;
                const v3323 = v3322 === 'clamdscan';
                const v3324 = v3321 && v3323;
                if (v3324) {
                    const chunk_size = 10;
                    const v3325 = files.length;
                    let v3326 = v3325 > 0;
                    while (v3326) {
                        let chunk = [];
                        const v3327 = files.length;
                        const v3328 = v3327 > chunk_size;
                        if (v3328) {
                            chunk = files.splice(0, chunk_size);
                        } else {
                            chunk = files.splice(0);
                        }
                        const v3332 = file => {
                            const v3329 = fs_stat(file);
                            const v3330 = e => {
                                return e;
                            };
                            const v3331 = v3329.catch(v3330);
                            return v3331;
                        };
                        const v3333 = chunk.map(v3332);
                        const chunk_results = await Promise.all(v3333);
                        let i;
                        for (i in chunk_results) {
                            const v = chunk_results[i];
                            const v3334 = v instanceof Error;
                            if (v3334) {
                                const v3335 = chunk[i];
                                errors[v3335] = v;
                            } else {
                                const v3336 = v.isFile();
                                if (v3336) {
                                    const v3337 = chunk[i];
                                    const v3338 = all_files.push(v3337);
                                    v3338;
                                } else {
                                    const v3339 = v.isDirectory();
                                    if (v3339) {
                                        const rgx = new RegExp(`^(?!${ v })(.+)$`);
                                        try {
                                            const v3340 = chunk[i];
                                            const v3341 = { withFileTypes: true };
                                            const v3343 = x => {
                                                const v3342 = x.isFile();
                                                return v3342;
                                            };
                                            const v3344 = (await fs_readdir(v3340, v3341)).filter(v3343);
                                            const v3349 = x => {
                                                const v3345 = x.name;
                                                const v3346 = x.name;
                                                const v3347 = `${ v }/${ v3346 }`;
                                                const v3348 = v3345.replace(rgx, v3347);
                                                return v3348;
                                            };
                                            const contents = v3344.map(v3349);
                                            all_files = all_files.concat(contents);
                                        } catch (e) {
                                            const v3350 = chunk[i];
                                            errors[v3350] = e;
                                        }
                                    }
                                }
                            }
                        }
                        const v3351 = finish_scan();
                        return v3351;
                        v3326 = v3325 > 0;
                    }
                } else {
                    all_files = files;
                    const v3352 = finish_scan();
                    return v3352;
                }
            }
        };
        const v3353 = typeof files;
        const v3354 = v3353 === 'string';
        const v3355 = files.trim();
        const v3356 = v3355.length;
        const v3357 = v3356 > 0;
        const v3358 = v3354 && v3357;
        if (v3358) {
            const v3359 = files.trim();
            const v3360 = v3359.split(',');
            const v3362 = v => {
                const v3361 = v.trim();
                return v3361;
            };
            files = v3360.map(v3362);
        }
        const v3363 = Array.isArray(files);
        if (v3363) {
            orig_num_files = files.length;
            const v3366 = v => {
                const v3364 = !v;
                const v3365 = !v3364;
                return v3365;
            };
            const v3367 = files.filter(v3366);
            const v3370 = v => {
                const v3368 = typeof v;
                const v3369 = v3368 === 'string';
                return v3369;
            };
            files = v3367.filter(v3370);
            const v3371 = files.length;
            const v3372 = v3371 < orig_num_files;
            if (v3372) {
                const v3373 = files.length;
                const v3374 = {
                    num_files: v3373,
                    orig_num_files
                };
                const err = new NodeClamError(v3374, 'You\'ve specified at least one invalid item to the files list (first parameter) of the `scan_files` method.');
                const v3375 = [];
                const v3376 = [];
                const v3377 = {};
                const v3378 = [];
                const v3379 = end_cb(err, v3375, v3376, v3377, v3378);
                const v3380 = reject(err);
                let v3381;
                if (has_cb) {
                    v3381 = v3379;
                } else {
                    v3381 = v3380;
                }
                return v3381;
            }
        }
        const v3382 = Array.isArray(files);
        const v3383 = !v3382;
        const v3384 = files.length;
        const v3385 = v3384 <= 0;
        const v3386 = v3383 || v3385;
        if (v3386) {
            const v3387 = this.settings;
            const v3388 = 'file_list' in v3387;
            const v3389 = !v3388;
            const v3390 = this.settings;
            const v3391 = v3390.file_list;
            const v3392 = !v3391;
            const v3393 = v3389 || v3392;
            if (v3393) {
                const v3394 = this.settings;
                const v3395 = {
                    files,
                    settings: v3394
                };
                const err = new NodeClamError(v3395, 'No files provided to scan and no file list provided!');
                const v3396 = [];
                const v3397 = [];
                const v3398 = {};
                const v3399 = [];
                const v3400 = end_cb(err, v3396, v3397, v3398, v3399);
                const v3401 = reject(err);
                let v3402;
                if (has_cb) {
                    v3402 = v3400;
                } else {
                    v3402 = v3401;
                }
                return v3402;
            }
            try {
                const v3403 = this.settings;
                const v3404 = v3403.file_list;
                const v3405 = (await fs_readfile(v3404)).toString();
                const v3406 = os.EOL;
                const data = v3405.split(v3406);
                const v3407 = do_scan(data);
                return v3407;
            } catch (e) {
                const v3408 = this.settings;
                const v3409 = v3408.file_list;
                const v3410 = {
                    err: e,
                    file_list: v3409
                };
                const err = new NodeClamError(v3410, `No files provided and file list was provided but could not be found! ${ e }`);
                const v3411 = [];
                const v3412 = [];
                const v3413 = {};
                const v3414 = [];
                const v3415 = end_cb(err, v3411, v3412, v3413, v3414);
                const v3416 = reject(err);
                let v3417;
                if (has_cb) {
                    v3417 = v3415;
                } else {
                    v3417 = v3416;
                }
                return v3417;
            }
        } else {
            const v3418 = do_scan(files);
            return v3418;
        }
    };
    const v3420 = new Promise(v3419);
    return v3420;
};
NodeClam.scan_files = scan_files;
const scan_dir = function scan_dir(path = '', end_cb = null, file_cb = null) {
    const self = this;
    let has_cb = false;
    const v3421 = typeof end_cb;
    const v3422 = v3421 !== 'function';
    const v3423 = end_cb && v3422;
    if (v3423) {
        const v3424 = new NodeClamError('Invalid end-scan callback provided to `scan_dir`. Second paramter, if provided, must be a function!');
        throw v3424;
    } else {
        const v3425 = typeof end_cb;
        const v3426 = v3425 === 'function';
        const v3427 = end_cb && v3426;
        if (v3427) {
            has_cb = true;
        }
    }
    const v3668 = async (resolve, reject) => {
        const v3428 = typeof path;
        const v3429 = v3428 !== 'string';
        const v3430 = typeof path;
        const v3431 = v3430 === 'string';
        const v3432 = path.trim();
        const v3433 = v3432 === '';
        const v3434 = v3431 && v3433;
        const v3435 = v3429 || v3434;
        if (v3435) {
            const v3436 = { path };
            const err = new NodeClamError(v3436, 'Invalid path provided! Path must be a string!');
            const v3437 = [];
            const v3438 = [];
            const v3439 = end_cb(err, v3437, v3438);
            const v3440 = reject(err);
            let v3441;
            if (has_cb) {
                v3441 = v3439;
            } else {
                v3441 = v3440;
            }
            return v3441;
        }
        const v3442 = node_path.normalize(path);
        path = v3442.replace(/\/$/, '');
        try {
            const v3443 = fs.constants;
            const v3444 = v3443.R_OK;
            await fs_access(path, v3444);
        } catch (e) {
            const v3445 = {
                path,
                err: e
            };
            const err = new NodeClamError(v3445, 'Invalid path specified to scan!');
            const v3446 = [];
            const v3447 = [];
            const v3448 = end_cb(err, v3446, v3447);
            const v3449 = reject(err);
            let v3450;
            if (has_cb) {
                v3450 = v3448;
            } else {
                v3450 = v3449;
            }
            return v3450;
        }
        const local_scan = () => {
            const v3451 = self.settings;
            const v3452 = self.scanner;
            const v3453 = v3451[v3452];
            const v3454 = v3453.path;
            const v3455 = self._build_clam_args(path);
            const v3498 = (err, stdout, stderr) => {
                const v3456 = self._process_result(stdout, path);
                const is_infected = v3456.is_infected;
                const viruses = v3456.viruses;
                if (err) {
                    const v3457 = Object.prototype;
                    const v3458 = v3457.hasOwnProperty;
                    const v3459 = v3458.call(err, 'code');
                    const v3460 = err.code;
                    const v3461 = v3460 === 1;
                    const v3462 = v3459 && v3461;
                    if (v3462) {
                        const v3463 = [];
                        const v3464 = [path];
                        const v3465 = end_cb(null, v3463, v3464, viruses);
                        const v3466 = [path];
                        const v3467 = [];
                        const v3468 = {
                            path,
                            is_infected,
                            bad_files: v3466,
                            good_files: v3467,
                            viruses
                        };
                        const v3469 = resolve(v3468);
                        let v3470;
                        if (has_cb) {
                            v3470 = v3465;
                        } else {
                            v3470 = v3469;
                        }
                        return v3470;
                    } else {
                        const v3471 = {
                            path,
                            err
                        };
                        const error = new NodeClamError(v3471, 'There was an error scanning the path or processing the result.');
                        const v3472 = [];
                        const v3473 = [];
                        const v3474 = [];
                        const v3475 = end_cb(error, v3472, v3473, v3474);
                        const v3476 = reject(error);
                        let v3477;
                        if (has_cb) {
                            v3477 = v3475;
                        } else {
                            v3477 = v3476;
                        }
                        return v3477;
                    }
                }
                if (stderr) {
                    const v3478 = self.debug_label;
                    const v3479 = `${ v3478 } error: `;
                    const v3480 = console.error(v3479, stderr);
                    v3480;
                    const v3481 = [];
                    const v3482 = [];
                    const v3483 = [];
                    const v3484 = end_cb(null, v3481, v3482, v3483);
                    const v3485 = [];
                    const v3486 = [];
                    const v3487 = {
                        stderr,
                        path,
                        is_infected,
                        good_files: v3485,
                        bad_files: v3486,
                        viruses
                    };
                    const v3488 = resolve(v3487);
                    let v3489;
                    if (has_cb) {
                        v3489 = v3484;
                    } else {
                        v3489 = v3488;
                    }
                    return v3489;
                }
                let good_files;
                const v3490 = [];
                const v3491 = [path];
                if (is_infected) {
                    good_files = v3490;
                } else {
                    good_files = v3491;
                }
                let bad_files;
                const v3492 = [path];
                const v3493 = [];
                if (is_infected) {
                    bad_files = v3492;
                } else {
                    bad_files = v3493;
                }
                const v3494 = end_cb(null, good_files, bad_files, viruses);
                const v3495 = {
                    path,
                    is_infected,
                    good_files,
                    bad_files,
                    viruses
                };
                const v3496 = resolve(v3495);
                let v3497;
                if (has_cb) {
                    v3497 = v3494;
                } else {
                    v3497 = v3496;
                }
                return v3497;
            };
            const v3499 = execFile(v3454, v3455, v3498);
            v3499;
        };
        const v3500 = this.settings;
        const v3501 = v3500.scan_recursively;
        const v3502 = v3501 === true;
        const v3503 = typeof file_cb;
        const v3504 = v3503 === 'function';
        const v3505 = !has_cb;
        const v3506 = v3504 || v3505;
        const v3507 = v3502 && v3506;
        if (v3507) {
            try {
                const v3509 = [path];
                const v3508 = await cp_execfile('find', v3509);
                const stdout = v3508.stdout;
                const stderr = v3508.stderr;
                if (stderr) {
                    const v3510 = this.settings;
                    const v3511 = v3510.debug_mode;
                    if (v3511) {
                        const v3512 = this.debug_label;
                        const v3513 = `${ v3512 }: `;
                        const v3514 = console.log(v3513, stderr);
                        v3514;
                    }
                    const v3515 = [];
                    const v3516 = [];
                    const v3517 = end_cb(null, v3515, v3516);
                    const v3518 = [];
                    const v3519 = [];
                    const v3520 = [];
                    const v3521 = {
                        stderr,
                        path,
                        is_infected: null,
                        good_files: v3518,
                        bad_files: v3519,
                        viruses: v3520
                    };
                    const v3522 = resolve(v3521);
                    let v3523;
                    if (has_cb) {
                        v3523 = v3517;
                    } else {
                        v3523 = v3522;
                    }
                    return v3523;
                }
                const v3524 = stdout.trim();
                const v3525 = os.EOL;
                const v3526 = v3524.split(v3525);
                const v3529 = path => {
                    const v3527 = path.replace(/ /g, '\\ ');
                    const v3528 = v3527.trim();
                    return v3528;
                };
                const files = v3526.map(v3529);
                const v3530 = this.scan_files(files, end_cb, file_cb);
                return v3530;
            } catch (e) {
                const v3531 = {
                    path,
                    err: e
                };
                const err = new NodeClamError(v3531, 'There was an issue scanning the path specified!');
                const v3532 = [];
                const v3533 = [];
                const v3534 = end_cb(err, v3532, v3533);
                const v3535 = reject(err);
                let v3536;
                if (has_cb) {
                    v3536 = v3534;
                } else {
                    v3536 = v3535;
                }
                return v3536;
            }
        } else {
            const v3537 = this.settings;
            const v3538 = v3537.scan_recursively;
            const v3539 = v3538 === false;
            const v3540 = this.scanner;
            const v3541 = v3540 === 'clamdscan';
            const v3542 = v3539 && v3541;
            if (v3542) {
                try {
                    const v3544 = async file => {
                        const v3543 = (await fs_stat(file)).isFile();
                        return v3543;
                    };
                    const all_files = (await fs_readdir(path)).filter(v3544);
                    const v3545 = this.scan_files(all_files, end_cb, file_cb);
                    return v3545;
                } catch (e) {
                    const v3546 = {
                        path,
                        err: e
                    };
                    const err = new NodeClamError(v3546, 'Could not read the file listing of the path provided.');
                    const v3547 = [];
                    const v3548 = [];
                    const v3549 = end_cb(err, v3547, v3548);
                    const v3550 = reject(err);
                    let v3551;
                    if (has_cb) {
                        v3551 = v3549;
                    } else {
                        v3551 = v3550;
                    }
                    return v3551;
                }
            } else {
                const v3552 = typeof file_cb;
                const v3553 = v3552 !== 'function';
                const v3554 = !has_cb;
                const v3555 = v3553 || v3554;
                if (v3555) {
                    const v3556 = this.settings;
                    const v3557 = v3556.clamdscan;
                    const v3558 = v3557.socket;
                    const v3559 = this.settings;
                    const v3560 = v3559.clamdscan;
                    const v3561 = v3560.port;
                    const v3562 = this._is_localhost();
                    const v3563 = v3561 && v3562;
                    const v3564 = v3558 || v3563;
                    if (v3564) {
                        try {
                            const client = await this._init_socket();
                            const v3565 = this.settings;
                            const v3566 = v3565.debug_mode;
                            if (v3566) {
                                const v3567 = this.debug_label;
                                const v3568 = `${ v3567 }: scanning path with local domain socket now.`;
                                const v3569 = console.log(v3568);
                                v3569;
                            }
                            const v3570 = this.settings;
                            const v3571 = v3570.clamdscan;
                            const v3572 = v3571.multiscan;
                            const v3573 = v3572 === true;
                            if (v3573) {
                                const v3574 = `MULTISCAN ${ path }`;
                                const v3575 = client.write(v3574);
                                v3575;
                            } else {
                                const v3576 = `SCAN ${ path }`;
                                const v3577 = client.write(v3576);
                                v3577;
                            }
                            const chunks = [];
                            const v3579 = chunk => {
                                const v3578 = chunks.push(chunk);
                                v3578;
                            };
                            const v3580 = client.on('data', v3579);
                            const v3608 = async () => {
                                const v3581 = this.settings;
                                const v3582 = v3581.debug_mode;
                                if (v3582) {
                                    const v3583 = this.debug_label;
                                    const v3584 = `${ v3583 }: Received response from remote clamd service.`;
                                    const v3585 = console.log(v3584);
                                    v3585;
                                }
                                const response = Buffer.concat(chunks);
                                const v3586 = response.toString();
                                const result = this._process_result(v3586, path);
                                const v3587 = result instanceof Error;
                                if (v3587) {
                                    const v3588 = this.settings;
                                    const v3589 = v3588.clamdscan;
                                    const v3590 = v3589.local_fallback;
                                    const v3591 = v3590 === true;
                                    if (v3591) {
                                        const v3592 = local_scan();
                                        return v3592;
                                    }
                                    const v3593 = {
                                        path,
                                        err: result
                                    };
                                    const err = new NodeClamError(v3593, 'There was an issue scanning the path provided.');
                                    const v3594 = [];
                                    const v3595 = [];
                                    const v3596 = end_cb(err, v3594, v3595);
                                    const v3597 = reject(err);
                                    let v3598;
                                    if (has_cb) {
                                        v3598 = v3596;
                                    } else {
                                        v3598 = v3597;
                                    }
                                    return v3598;
                                }
                                const v3599 = result;
                                const is_infected = v3599.is_infected;
                                const viruses = v3599.viruses;
                                let good_files;
                                const v3600 = [];
                                const v3601 = [path];
                                if (is_infected) {
                                    good_files = v3600;
                                } else {
                                    good_files = v3601;
                                }
                                let bad_files;
                                const v3602 = [path];
                                const v3603 = [];
                                if (is_infected) {
                                    bad_files = v3602;
                                } else {
                                    bad_files = v3603;
                                }
                                const v3604 = end_cb(null, good_files, bad_files, viruses);
                                const v3605 = {
                                    path,
                                    is_infected,
                                    good_files,
                                    bad_files,
                                    viruses
                                };
                                const v3606 = resolve(v3605);
                                let v3607;
                                if (has_cb) {
                                    v3607 = v3604;
                                } else {
                                    v3607 = v3606;
                                }
                                return v3607;
                            };
                            const v3609 = v3580.on('end', v3608);
                            v3609;
                        } catch (e) {
                            const v3610 = {
                                path,
                                err: e
                            };
                            const err = new NodeClamError(v3610, 'There was an issue scanning the path provided.');
                            const v3611 = [];
                            const v3612 = [];
                            const v3613 = end_cb(err, v3611, v3612);
                            const v3614 = reject(err);
                            let v3615;
                            if (has_cb) {
                                v3615 = v3613;
                            } else {
                                v3615 = v3614;
                            }
                            return v3615;
                        }
                    } else {
                        const v3616 = this.settings;
                        const v3617 = v3616.clamdscan;
                        const v3618 = v3617.port;
                        const v3619 = this._is_localhost();
                        const v3620 = !v3619;
                        const v3621 = v3618 && v3620;
                        if (v3621) {
                            const results = [];
                            try {
                                const v3623 = [path];
                                const v3622 = await cp_execfile('find', v3623);
                                const stdout = v3622.stdout;
                                const stderr = v3622.stderr;
                                if (stderr) {
                                    const v3624 = this.settings;
                                    const v3625 = v3624.debug_mode;
                                    if (v3625) {
                                        const v3626 = this.debug_label;
                                        const v3627 = `${ v3626 }: `;
                                        const v3628 = console.log(v3627, stderr);
                                        v3628;
                                    }
                                    const v3629 = [];
                                    const v3630 = [];
                                    const v3631 = end_cb(null, v3629, v3630);
                                    const v3632 = [];
                                    const v3633 = [];
                                    const v3634 = [];
                                    const v3635 = {
                                        stderr,
                                        path,
                                        is_infected,
                                        good_files: v3632,
                                        bad_files: v3633,
                                        viruses: v3634
                                    };
                                    const v3636 = resolve(v3635);
                                    let v3637;
                                    if (has_cb) {
                                        v3637 = v3631;
                                    } else {
                                        v3637 = v3636;
                                    }
                                    return v3637;
                                }
                                const v3638 = stdout.split('\n');
                                const v3640 = path => {
                                    const v3639 = path.replace(/ /g, '\\ ');
                                    return v3639;
                                };
                                const files = v3638.map(v3640);
                                const chunk_size = 10;
                                const v3641 = files.length;
                                let v3642 = v3641 > 0;
                                while (v3642) {
                                    let chunk = [];
                                    const v3643 = files.length;
                                    const v3644 = v3643 > chunk_size;
                                    if (v3644) {
                                        chunk = files.splice(0, chunk_size);
                                    } else {
                                        chunk = files.splice(0);
                                    }
                                    const v3647 = file => {
                                        const v3645 = fs.createReadStream(file);
                                        const v3646 = this.scan_stream(v3645);
                                        return v3646;
                                    };
                                    const v3648 = chunk.map(v3647);
                                    const v3649 = results.concat(await Promise.all(v3648));
                                    v3649;
                                    v3642 = v3641 > 0;
                                }
                                const v3651 = v => {
                                    const v3650 = v === false;
                                    return v3650;
                                };
                                const is_infected = results.any(v3651);
                                let good_files;
                                const v3652 = [];
                                const v3653 = [path];
                                if (is_infected) {
                                    good_files = v3652;
                                } else {
                                    good_files = v3653;
                                }
                                let bad_files;
                                const v3654 = [path];
                                const v3655 = [];
                                if (is_infected) {
                                    bad_files = v3654;
                                } else {
                                    bad_files = v3655;
                                }
                                const v3656 = end_cb(null, good_files, bad_files);
                                const v3657 = [];
                                const v3658 = {
                                    path,
                                    is_infected,
                                    good_files,
                                    bad_files,
                                    viruses: v3657
                                };
                                const v3659 = resolve(v3658);
                                let v3660;
                                if (has_cb) {
                                    v3660 = v3656;
                                } else {
                                    v3660 = v3659;
                                }
                                return v3660;
                            } catch (e) {
                                const v3661 = {
                                    path,
                                    err: e
                                };
                                const err = new NodeClamError(v3661, 'Invalid path provided! Path must be a string!');
                                const v3662 = [];
                                const v3663 = [];
                                const v3664 = end_cb(err, v3662, v3663);
                                const v3665 = reject(err);
                                let v3666;
                                if (has_cb) {
                                    v3666 = v3664;
                                } else {
                                    v3666 = v3665;
                                }
                                return v3666;
                            }
                        } else {
                            const v3667 = local_scan();
                            v3667;
                        }
                    }
                }
            }
        }
    };
    const v3669 = new Promise(v3668);
    return v3669;
};
NodeClam.scan_dir = scan_dir;
const scan_stream = function scan_stream(stream, cb) {
    let has_cb = false;
    const v3670 = typeof cb;
    const v3671 = v3670 !== 'function';
    const v3672 = cb && v3671;
    if (v3672) {
        const v3673 = new NodeClamError('Invalid cb provided to scan_stream. Second paramter must be a function!');
        throw v3673;
    }
    const v3674 = typeof cb;
    const v3675 = v3674 === 'function';
    const v3676 = cb && v3675;
    if (v3676) {
        has_cb = true;
    }
    const v3783 = async (resolve, reject) => {
        let finished = false;
        const v3677 = this._is_readable_stream(stream);
        const v3678 = !v3677;
        if (v3678) {
            const v3679 = { stream };
            const err = new NodeClamError(v3679, 'Invalid stream provided to scan.');
            const v3680 = cb(err, null);
            const v3681 = reject(err);
            let v3682;
            if (has_cb) {
                v3682 = v3680;
            } else {
                v3682 = v3681;
            }
            return v3682;
        } else {
            const v3683 = this.settings;
            const v3684 = v3683.debug_mode;
            if (v3684) {
                const v3685 = this.debug_label;
                const v3686 = `${ v3685 }: Provided stream is readable.`;
                const v3687 = console.log(v3686);
                v3687;
            }
        }
        const v3688 = this.settings;
        const v3689 = v3688.clamdscan;
        const v3690 = v3689.socket;
        const v3691 = !v3690;
        const v3692 = this.settings;
        const v3693 = v3692.clamdscan;
        const v3694 = v3693.port;
        const v3695 = !v3694;
        const v3696 = this.settings;
        const v3697 = v3696.clamdscan;
        const v3698 = v3697.host;
        const v3699 = !v3698;
        const v3700 = v3695 || v3699;
        const v3701 = v3691 && v3700;
        if (v3701) {
            const v3702 = this.settings;
            const v3703 = v3702.clamdscan;
            const v3704 = { clamdscan_settings: v3703 };
            const err = new NodeClamError(v3704, 'Invalid information provided to connect to clamav service. A unix socket or port (+ optional host) is required!');
            const v3705 = cb(err, null);
            const v3706 = reject(err);
            let v3707;
            if (has_cb) {
                v3707 = v3705;
            } else {
                v3707 = v3706;
            }
            return v3707;
        }
        try {
            const v3708 = {};
            const v3709 = this.settings;
            const v3710 = v3709.debug_mode;
            const transform = new NodeClamTransform(v3708, v3710);
            const socket = await this._init_socket();
            const v3711 = stream.pipe(transform);
            const v3712 = v3711.pipe(socket);
            v3712;
            const v3719 = () => {
                const v3713 = this.settings;
                const v3714 = v3713.debug_mode;
                if (v3714) {
                    const v3715 = this.debug_label;
                    const v3716 = `${ v3715 }: The input stream has dried up.`;
                    const v3717 = console.log(v3716);
                    v3717;
                }
                finished = true;
                const v3718 = stream.destroy();
                v3718;
            };
            const v3720 = stream.on('end', v3719);
            const v3729 = err => {
                const v3721 = this.settings;
                const v3722 = v3721.debug_mode;
                if (v3722) {
                    const v3723 = this.debug_label;
                    const v3724 = `${ v3723 }: There was an error with the input stream (maybe uploader closed browser?).`;
                    const v3725 = console.log(v3724, err);
                    v3725;
                }
                const v3726 = cb(err, null);
                const v3727 = reject(err);
                let v3728;
                if (has_cb) {
                    v3728 = v3726;
                } else {
                    v3728 = v3727;
                }
                return v3728;
            };
            const v3730 = v3720.on('error', v3729);
            v3730;
            const chunks = [];
            const v3740 = chunk => {
                const v3731 = this.settings;
                const v3732 = v3731.debug_mode;
                if (v3732) {
                    const v3733 = this.debug_label;
                    const v3734 = `${ v3733 }: Received output from ClamAV Socket.`;
                    const v3735 = console.log(v3734);
                    v3735;
                }
                const v3736 = stream.isPaused();
                const v3737 = !v3736;
                if (v3737) {
                    const v3738 = stream.pause();
                    v3738;
                }
                const v3739 = chunks.push(chunk);
                v3739;
            };
            const v3741 = socket.on('data', v3740);
            const v3747 = hadError => {
                const v3742 = this.settings;
                const v3743 = v3742.debug_mode;
                if (v3743) {
                    const v3744 = this.debug_label;
                    const v3745 = `${ v3744 }: ClamAV socket has been closed!`;
                    const v3746 = console.log(v3745, hadError);
                    v3746;
                }
            };
            const v3748 = v3741.on('close', v3747);
            const v3755 = err => {
                const v3749 = this.debug_label;
                const v3750 = `${ v3749 }: Error emitted from ClamAV socket: `;
                const v3751 = console.error(v3750, err);
                v3751;
                const v3752 = cb(err, null);
                const v3753 = reject(err);
                let v3754;
                if (has_cb) {
                    v3754 = v3752;
                } else {
                    v3754 = v3753;
                }
                return v3754;
            };
            const v3756 = v3748.on('error', v3755);
            const v3778 = () => {
                const v3757 = this.settings;
                const v3758 = v3757.debug_mode;
                if (v3758) {
                    const v3759 = this.debug_label;
                    const v3760 = `${ v3759 }: ClamAV is done scanning.`;
                    const v3761 = console.log(v3760);
                    v3761;
                }
                const response = Buffer.concat(chunks);
                const v3762 = !finished;
                if (v3762) {
                    const v3763 = response.toString('utf8');
                    const v3764 = 'Scan aborted. Reply from server: ' + v3763;
                    const err = new NodeClamError(v3764);
                    const v3765 = cb(err, null);
                    const v3766 = reject(err);
                    let v3767;
                    if (has_cb) {
                        v3767 = v3765;
                    } else {
                        v3767 = v3766;
                    }
                    return v3767;
                } else {
                    const v3768 = this.settings;
                    const v3769 = v3768.debug_mode;
                    if (v3769) {
                        const v3770 = this.debug_label;
                        const v3771 = response.toString('utf8');
                        const v3772 = `${ v3770 }: Raw Response:  ${ v3771 }`;
                        const v3773 = console.log(v3772);
                        v3773;
                    }
                    const v3774 = response.toString('utf8');
                    const result = this._process_result(v3774, null);
                    const v3775 = cb(null, result);
                    const v3776 = resolve(result);
                    let v3777;
                    if (has_cb) {
                        v3777 = v3775;
                    } else {
                        v3777 = v3776;
                    }
                    return v3777;
                }
            };
            const v3779 = v3756.on('end', v3778);
            v3779;
        } catch (err) {
            const v3780 = cb(err, null);
            const v3781 = reject(err);
            let v3782;
            if (has_cb) {
                v3782 = v3780;
            } else {
                v3782 = v3781;
            }
            return v3782;
        }
    };
    const v3784 = new Promise(v3783);
    return v3784;
};
NodeClam.scan_stream = scan_stream;
NodeClam['is_class'] = true;
module.exports = NodeClam;