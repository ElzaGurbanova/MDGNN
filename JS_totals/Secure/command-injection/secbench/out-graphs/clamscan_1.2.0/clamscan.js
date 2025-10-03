const os = require('os');
const util = require('util');
const net = require('net');
const fs = require('fs');
const node_path = require('path');
const child_process = require('child_process');
const v1896 = require('stream');
const PassThrough = v1896.PassThrough;
const Transform = v1896.Transform;
const v1897 = util;
const promisify = v1897.promisify;
const v1898 = child_process;
const exec = v1898.exec;
const execFile = v1898.execFile;
const v1899 = fs.access;
const fs_access = promisify(v1899);
const v1900 = fs.readFile;
const fs_readfile = promisify(v1900);
const v1901 = fs.readdir;
const fs_readdir = promisify(v1901);
const v1902 = fs.stat;
const fs_stat = promisify(v1902);
const NodeClamTransform = require('./NodeClamTransform.js');
const cp_exec = promisify(exec);
const cp_execfile = promisify(execFile);
const NodeClamError = function NodeClamError(data = {}, ...params) {
    const msg = params[0];
    const fileName = params[1];
    const lineNumber = params[2];
    const v1903 = typeof data;
    const v1904 = v1903 === 'string';
    if (v1904) {
        msg = data;
        data = {};
    }
    params = [
        msg,
        fileName,
        lineNumber
    ];
    const v1905 = super(...params);
    v1905;
    const v1906 = Error.captureStackTrace;
    if (v1906) {
        const v1907 = Error.captureStackTrace(this, NodeClamError);
        v1907;
    }
    this.data = data;
    this.date = new Date();
};
NodeClamError['is_class'] = true;
const NodeClam = function NodeClam() {
    this.initialized = false;
    this.debug_label = 'node-clam';
    this.default_scanner = 'clamdscan';
    const v1908 = {};
    v1908.path = '/usr/bin/clamscan';
    v1908.scan_archives = true;
    v1908.db = null;
    v1908.active = true;
    const v1909 = {};
    v1909.socket = false;
    v1909.host = false;
    v1909.port = false;
    v1909.timeout = 60000;
    v1909.local_fallback = true;
    v1909.path = '/usr/bin/clamdscan';
    v1909.config_file = null;
    v1909.multiscan = true;
    v1909.reload_db = false;
    v1909.active = true;
    v1909.bypass_test = false;
    const v1910 = this.default_scanner;
    const v1911 = {
        remove_infected: false,
        quarantine_infected: false,
        scan_log: null,
        debug_mode: false,
        file_list: null,
        scan_recursively: true,
        clamscan: v1908,
        clamdscan: v1909,
        preference: v1910
    };
    const v1912 = Object.freeze(v1911);
    this.defaults = v1912;
    const v1913 = {};
    const v1914 = this.defaults;
    const v1915 = Object.assign(v1913, v1914);
    this.settings = v1915;
};
const init = async function init(options = {}, cb) {
    let has_cb = false;
    const v1916 = typeof cb;
    const v1917 = v1916 !== 'function';
    const v1918 = cb && v1917;
    if (v1918) {
        const v1919 = new NodeClamError('Invalid cb provided to init method. Second paramter, if provided, must be a function!');
        throw v1919;
    } else {
        const v1920 = typeof cb;
        const v1921 = v1920 === 'function';
        const v1922 = cb && v1921;
        if (v1922) {
            has_cb = true;
        }
    }
    const v2245 = async (resolve, reject) => {
        const v1923 = this.initialized;
        const v1924 = v1923 === true;
        if (v1924) {
            const v1925 = cb(null, this);
            const v1926 = resolve(this);
            let v1927;
            if (has_cb) {
                v1927 = v1925;
            } else {
                v1927 = v1926;
            }
            return v1927;
        }
        let settings = {};
        const v1928 = Object.prototype;
        const v1929 = v1928.hasOwnProperty;
        const v1930 = v1929.call(options, 'clamscan');
        const v1931 = options.clamscan;
        const v1932 = Object.keys(v1931);
        const v1933 = v1932.length;
        const v1934 = v1933 > 0;
        const v1935 = v1930 && v1934;
        if (v1935) {
            const v1936 = {};
            const v1937 = this.defaults;
            const v1938 = v1937.clamscan;
            const v1939 = options.clamscan;
            const v1940 = Object.assign(v1936, v1938, v1939);
            settings.clamscan = v1940;
            const v1941 = options.clamscan;
            const v1942 = delete v1941;
            v1942;
        }
        const v1943 = Object.prototype;
        const v1944 = v1943.hasOwnProperty;
        const v1945 = v1944.call(options, 'clamdscan');
        const v1946 = options.clamdscan;
        const v1947 = Object.keys(v1946);
        const v1948 = v1947.length;
        const v1949 = v1948 > 0;
        const v1950 = v1945 && v1949;
        if (v1950) {
            const v1951 = {};
            const v1952 = this.defaults;
            const v1953 = v1952.clamdscan;
            const v1954 = options.clamdscan;
            const v1955 = Object.assign(v1951, v1953, v1954);
            settings.clamdscan = v1955;
            const v1956 = options.clamdscan;
            const v1957 = delete v1956;
            v1957;
        }
        const v1958 = {};
        const v1959 = this.defaults;
        const v1960 = Object.assign(v1958, v1959, settings, options);
        this.settings = v1960;
        const v1961 = this.settings;
        const v1962 = this.settings;
        const v1963 = 'debug_mode' in v1962;
        const v1964 = v1961 && v1963;
        const v1965 = this.settings;
        const v1966 = v1965.debug_mode;
        const v1967 = v1966 === true;
        const v1968 = v1964 && v1967;
        if (v1968) {
            const v1969 = this.debug_label;
            const v1970 = `${ v1969 }: DEBUG MODE ON`;
            const v1971 = console.log(v1970);
            v1971;
        }
        const v1972 = this.settings;
        const v1973 = 'quarantine_path' in v1972;
        const v1974 = this.settings;
        const v1975 = v1974.quarantine_path;
        const v1976 = v1973 && v1975;
        if (v1976) {
            const v1977 = this.settings;
            const v1978 = this.settings;
            const v1979 = v1978.quarantine_path;
            v1977.quarantine_infected = v1979;
        }
        const v1980 = this.default_scanner;
        this.scanner = v1980;
        const v1981 = this.settings;
        const v1982 = 'preference' in v1981;
        const v1983 = this.settings;
        const v1984 = v1983.preference;
        const v1985 = typeof v1984;
        const v1986 = v1985 !== 'string';
        const v1987 = v1982 && v1986;
        const v1988 = [
            'clamscan',
            'clamdscan'
        ];
        const v1989 = this.settings;
        const v1990 = v1989.preference;
        const v1991 = v1988.includes(v1990);
        const v1992 = !v1991;
        const v1993 = v1987 || v1992;
        if (v1993) {
            const v1994 = this.settings;
            const v1995 = v1994.clamdscan;
            const v1996 = v1995.socket;
            const v1997 = this.settings;
            const v1998 = v1997.clamdscan;
            const v1999 = v1998.host;
            const v2000 = v1996 || v1999;
            if (v2000) {
                const v2001 = this.settings;
                const v2002 = v2001.clamdscan;
                v2002.local_fallback = false;
            } else {
                const err = new NodeClamError('Invalid virus scanner preference defined and no valid host/socket option provided!');
                const v2003 = cb(err, null);
                const v2004 = reject(err);
                let v2005;
                if (has_cb) {
                    v2005 = v2003;
                } else {
                    v2005 = v2004;
                }
                return v2005;
            }
        }
        const v2006 = this.settings;
        const v2007 = 'preference' in v2006;
        const v2008 = this.settings;
        const v2009 = v2008.preference;
        const v2010 = v2009 === 'clamscan';
        const v2011 = v2007 && v2010;
        const v2012 = this.settings;
        const v2013 = 'clamscan' in v2012;
        const v2014 = v2011 && v2013;
        const v2015 = this.settings;
        const v2016 = v2015.clamscan;
        const v2017 = 'active' in v2016;
        const v2018 = v2014 && v2017;
        const v2019 = this.settings;
        const v2020 = v2019.clamscan;
        const v2021 = v2020.active;
        const v2022 = v2021 === true;
        const v2023 = v2018 && v2022;
        const v2024 = this.settings;
        const v2025 = v2024.preference;
        const v2026 = v2025 === 'clamdscan';
        const v2027 = this.settings;
        const v2028 = 'clamdscan' in v2027;
        const v2029 = v2026 && v2028;
        const v2030 = this.settings;
        const v2031 = v2030.clamdscan;
        const v2032 = 'active' in v2031;
        const v2033 = v2029 && v2032;
        const v2034 = this.settings;
        const v2035 = v2034.clamdscan;
        const v2036 = v2035.active;
        const v2037 = v2036 !== true;
        const v2038 = v2033 && v2037;
        const v2039 = this.settings;
        const v2040 = 'clamscan' in v2039;
        const v2041 = v2038 && v2040;
        const v2042 = this.settings;
        const v2043 = v2042.clamscan;
        const v2044 = 'active' in v2043;
        const v2045 = v2041 && v2044;
        const v2046 = this.settings;
        const v2047 = v2046.clamscan;
        const v2048 = v2047.active;
        const v2049 = v2048 === true;
        const v2050 = v2045 && v2049;
        const v2051 = v2023 || v2050;
        if (v2051) {
            this.scanner = 'clamscan';
        }
        try {
            const v2052 = this.scanner;
            const v2053 = !await this._is_clamav_binary(v2052);
            if (v2053) {
                const v2054 = this.scanner;
                const v2055 = v2054 === 'clamdscan';
                const v2056 = this.settings;
                const v2057 = v2056.clamscan;
                const v2058 = v2057.active;
                const v2059 = v2058 === true;
                const v2060 = v2055 && v2059;
                const v2061 = v2060 && await this._is_clamav_binary('clamscan');
                if (v2061) {
                    this.scanner = 'clamscan';
                } else {
                    const v2062 = this.scanner;
                    const v2063 = v2062 === 'clamscan';
                    const v2064 = this.settings;
                    const v2065 = v2064.clamdscan;
                    const v2066 = v2065.active;
                    const v2067 = v2066 === true;
                    const v2068 = v2063 && v2067;
                    const v2069 = v2068 && await this._is_clamav_binary('clamdscan');
                    if (v2069) {
                        this.scanner = 'clamdscan';
                    } else {
                        const v2070 = this.settings;
                        const v2071 = v2070.clamdscan;
                        const v2072 = v2071.socket;
                        const v2073 = this.settings;
                        const v2074 = v2073.clamdscan;
                        const v2075 = v2074.host;
                        const v2076 = v2072 || v2075;
                        if (v2076) {
                            const v2077 = this.settings;
                            const v2078 = v2077.clamdscan;
                            v2078.local_fallback = false;
                        } else {
                            const err = new NodeClamError('No valid & active virus scanning binaries are active and available and host/socket option provided!');
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
                    }
                }
            }
        } catch (err) {
            const v2082 = cb(err, null);
            const v2083 = reject(err);
            let v2084;
            if (has_cb) {
                v2084 = v2082;
            } else {
                v2084 = v2083;
            }
            return v2084;
        }
        const v2085 = this.settings;
        const v2086 = v2085.clamdscan;
        const v2087 = v2086.socket;
        const v2088 = !v2087;
        const v2089 = this.settings;
        const v2090 = v2089.clamdscan;
        const v2091 = v2090.host;
        const v2092 = !v2091;
        const v2093 = v2088 && v2092;
        const v2094 = this.settings;
        const v2095 = v2094.clamdscan;
        const v2096 = v2095.active;
        const v2097 = v2096 === true;
        const v2098 = this.settings;
        const v2099 = v2098.clamdscan;
        const v2100 = v2099.local_fallback;
        const v2101 = v2100 === true;
        const v2102 = v2097 && v2101;
        const v2103 = this.settings;
        const v2104 = v2103.clamscan;
        const v2105 = v2104.active;
        const v2106 = v2105 === true;
        const v2107 = v2102 || v2106;
        const v2108 = v2093 && v2107;
        const v2109 = this.settings;
        const v2110 = v2109.quarantine_infected;
        const v2111 = v2108 && v2110;
        if (v2111) {
            try {
                const v2112 = this.settings;
                const v2113 = v2112.quarantine_infected;
                const v2114 = fs.constants;
                const v2115 = v2114.R_OK;
                await fs_access(v2113, v2115);
            } catch (e) {
                const v2116 = this.settings;
                const v2117 = v2116.debug_mode;
                if (v2117) {
                    const v2118 = this.debug_label;
                    const v2119 = `${ v2118 } error:`;
                    const v2120 = console.log(v2119, err);
                    v2120;
                }
                const v2121 = { err: e };
                const v2122 = this.settings;
                const v2123 = v2122.quarantine_infected;
                const err = new NodeClamError(v2121, `Quarantine infected path (${ v2123 }) is invalid.`);
                const v2124 = cb(err, null);
                const v2125 = reject(err);
                let v2126;
                if (has_cb) {
                    v2126 = v2124;
                } else {
                    v2126 = v2125;
                }
                return v2126;
            }
        }
        const v2127 = this.settings;
        const v2128 = v2127.clamdscan;
        const v2129 = v2128.socket;
        const v2130 = !v2129;
        const v2131 = this.settings;
        const v2132 = v2131.clamdscan;
        const v2133 = v2132.host;
        const v2134 = !v2133;
        const v2135 = v2130 && v2134;
        const v2136 = this.scanner;
        const v2137 = v2136 === 'clamscan';
        const v2138 = v2135 && v2137;
        const v2139 = this.settings;
        const v2140 = v2139.clamscan;
        const v2141 = v2140.db;
        const v2142 = v2138 && v2141;
        if (v2142) {
            try {
                const v2143 = this.settings;
                const v2144 = v2143.clamscan;
                const v2145 = v2144.db;
                const v2146 = fs.constants;
                const v2147 = v2146.R_OK;
                await fs_access(v2145, v2147);
            } catch (err) {
                const v2148 = this.settings;
                const v2149 = v2148.debug_mode;
                if (v2149) {
                    const v2150 = this.debug_label;
                    const v2151 = `${ v2150 } error:`;
                    const v2152 = console.log(v2151, err);
                    v2152;
                }
                const v2153 = this.settings;
                const v2154 = v2153.clamscan;
                v2154.db = null;
            }
        }
        const v2155 = this.settings;
        const v2156 = v2155.clamdscan;
        const v2157 = v2156.socket;
        const v2158 = !v2157;
        const v2159 = this.settings;
        const v2160 = v2159.clamdscan;
        const v2161 = v2160.host;
        const v2162 = !v2161;
        const v2163 = v2158 && v2162;
        const v2164 = this.settings;
        const v2165 = v2164.clamdscan;
        const v2166 = v2165.socket;
        const v2167 = this.settings;
        const v2168 = v2167.clamdscan;
        const v2169 = v2168.host;
        const v2170 = v2166 || v2169;
        const v2171 = this.settings;
        const v2172 = v2171.clamdscan;
        const v2173 = v2172.local_fallback;
        const v2174 = v2173 === true;
        const v2175 = v2170 && v2174;
        const v2176 = this.settings;
        const v2177 = v2176.clamdscan;
        const v2178 = v2177.active;
        const v2179 = v2178 === true;
        const v2180 = v2175 && v2179;
        const v2181 = v2163 || v2180;
        const v2182 = this.settings;
        const v2183 = v2182.clamdscan;
        const v2184 = v2183.active;
        const v2185 = v2184 === false;
        const v2186 = this.settings;
        const v2187 = v2186.clamscan;
        const v2188 = v2187.active;
        const v2189 = v2188 === true;
        const v2190 = v2185 && v2189;
        const v2191 = v2181 || v2190;
        const v2192 = this.preference;
        const v2193 = v2191 || v2192;
        const v2194 = this.settings;
        const v2195 = v2194.scan_log;
        const v2196 = v2193 && v2195;
        if (v2196) {
            try {
                const v2197 = this.settings;
                const v2198 = v2197.scan_log;
                const v2199 = fs.constants;
                const v2200 = v2199.R_OK;
                await fs_access(v2198, v2200);
            } catch (err) {
                const v2201 = this.settings;
                const v2202 = v2201.debug_mode;
                if (v2202) {
                    const v2203 = this.debug_label;
                    const v2204 = `${ v2203 } error:`;
                    const v2205 = console.log(v2204, err);
                    v2205;
                }
                const v2206 = this.settings;
                v2206.scan_log = null;
            }
        }
        const v2207 = this.scanner;
        const v2208 = v2207 === 'clamdscan';
        const v2209 = this.settings;
        const v2210 = v2209.clamdscan;
        const v2211 = v2210.bypass_test;
        const v2212 = v2211 === false;
        const v2213 = v2208 && v2212;
        const v2214 = this.settings;
        const v2215 = v2214.clamdscan;
        const v2216 = v2215.socket;
        const v2217 = this.settings;
        const v2218 = v2217.clamdscan;
        const v2219 = v2218.host;
        const v2220 = v2216 || v2219;
        const v2221 = this.settings;
        const v2222 = v2221.clamdscan;
        const v2223 = v2222.port;
        const v2224 = v2220 || v2223;
        const v2225 = v2213 && v2224;
        if (v2225) {
            const v2226 = this.settings;
            const v2227 = v2226.debug_mode;
            if (v2227) {
                const v2228 = this.debug_label;
                const v2229 = `${ v2228 }: Initially testing socket/tcp connection to clamscan server.`;
                const v2230 = console.log(v2229);
                v2230;
            }
            try {
                await this._ping();
                const v2231 = this.settings;
                const v2232 = v2231.debug_mode;
                if (v2232) {
                    const v2233 = this.debug_label;
                    const v2234 = `${ v2233 }: Established connection to clamscan server for testing!`;
                    const v2235 = console.log(v2234);
                    v2235;
                }
            } catch (err) {
                const v2236 = cb(err, null);
                const v2237 = reject(err);
                let v2238;
                if (has_cb) {
                    v2238 = v2236;
                } else {
                    v2238 = v2237;
                }
                return v2238;
            }
        }
        const v2239 = this.scanner;
        const v2240 = this.settings;
        const v2241 = this._build_clam_flags(v2239, v2240);
        this.clam_flags = v2241;
        this.initialized = true;
        const v2242 = cb(null, this);
        const v2243 = resolve(this);
        let v2244;
        if (has_cb) {
            v2244 = v2242;
        } else {
            v2244 = v2243;
        }
        return v2244;
    };
    const v2246 = new Promise(v2245);
    return v2246;
};
NodeClam.init = init;
const reset = function reset(options = {}, cb) {
    let has_cb = false;
    const v2247 = typeof cb;
    const v2248 = v2247 !== 'function';
    const v2249 = cb && v2248;
    if (v2249) {
        const v2250 = new NodeClamError('Invalid cb provided to `reset`. Second paramter, if provided, must be a function!');
        throw v2250;
    } else {
        const v2251 = typeof cb;
        const v2252 = v2251 === 'function';
        const v2253 = cb && v2252;
        if (v2253) {
            has_cb = true;
        }
    }
    this.initialized = false;
    const v2254 = {};
    const v2255 = this.defaults;
    const v2256 = Object.assign(v2254, v2255);
    this.settings = v2256;
    const v2263 = async (resolve, reject) => {
        try {
            await this.init(options);
            const v2257 = cb(null, this);
            const v2258 = resolve(this);
            let v2259;
            if (has_cb) {
                v2259 = v2257;
            } else {
                v2259 = v2258;
            }
            return v2259;
        } catch (err) {
            const v2260 = cb(err, null);
            const v2261 = reject(err);
            let v2262;
            if (has_cb) {
                v2262 = v2260;
            } else {
                v2262 = v2261;
            }
            return v2262;
        }
    };
    const v2264 = new Promise(v2263);
    return v2264;
};
NodeClam.reset = reset;
const _build_clam_args = function _build_clam_args(item) {
    const v2265 = this.clam_flags;
    let args = v2265.slice();
    const v2266 = typeof item;
    const v2267 = v2266 === 'string';
    if (v2267) {
        const v2268 = args.push(item);
        v2268;
    }
    const v2269 = Array.isArray(item);
    if (v2269) {
        args = args.concat(item);
    }
    return args;
};
NodeClam._build_clam_args = _build_clam_args;
const _build_clam_flags = function _build_clam_flags(scanner, settings) {
    const flags_array = ['--no-summary'];
    const v2270 = scanner === 'clamscan';
    if (v2270) {
        const v2271 = flags_array.push('--stdout');
        v2271;
        const v2272 = settings.remove_infected;
        const v2273 = v2272 === true;
        if (v2273) {
            const v2274 = flags_array.push('--remove=yes');
            v2274;
        } else {
            const v2275 = flags_array.push('--remove=no');
            v2275;
        }
        const v2276 = 'clamscan' in settings;
        const v2277 = settings.clamscan;
        const v2278 = typeof v2277;
        const v2279 = v2278 === 'object';
        const v2280 = v2276 && v2279;
        const v2281 = settings.clamscan;
        const v2282 = 'db' in v2281;
        const v2283 = v2280 && v2282;
        const v2284 = settings.clamscan;
        const v2285 = v2284.db;
        const v2286 = v2283 && v2285;
        const v2287 = settings.clamscan;
        const v2288 = v2287.db;
        const v2289 = typeof v2288;
        const v2290 = v2289 === 'string';
        const v2291 = v2286 && v2290;
        if (v2291) {
            const v2292 = settings.clamscan;
            const v2293 = v2292.db;
            const v2294 = `--database=${ v2293 }`;
            const v2295 = flags_array.push(v2294);
            v2295;
        }
        const v2296 = settings.clamscan;
        const v2297 = v2296.scan_archives;
        const v2298 = v2297 === true;
        if (v2298) {
            const v2299 = flags_array.push('--scan-archive=yes');
            v2299;
        } else {
            const v2300 = flags_array.push('--scan-archive=no');
            v2300;
        }
        const v2301 = settings.scan_recursively;
        const v2302 = v2301 === true;
        if (v2302) {
            const v2303 = flags_array.push('-r');
            v2303;
        } else {
            const v2304 = flags_array.push('--recursive=no');
            v2304;
        }
    } else {
        const v2305 = scanner === 'clamdscan';
        if (v2305) {
            const v2306 = flags_array.push('--fdpass');
            v2306;
            const v2307 = settings.remove_infected;
            const v2308 = v2307 === true;
            if (v2308) {
                const v2309 = flags_array.push('--remove');
                v2309;
            }
            const v2310 = 'clamdscan' in settings;
            const v2311 = settings.clamdscan;
            const v2312 = typeof v2311;
            const v2313 = v2312 === 'object';
            const v2314 = v2310 && v2313;
            const v2315 = settings.clamdscan;
            const v2316 = 'config_file' in v2315;
            const v2317 = v2314 && v2316;
            const v2318 = settings.clamdscan;
            const v2319 = v2318.config_file;
            const v2320 = v2317 && v2319;
            const v2321 = settings.clamdscan;
            const v2322 = v2321.config_file;
            const v2323 = typeof v2322;
            const v2324 = v2323 === 'string';
            const v2325 = v2320 && v2324;
            if (v2325) {
                const v2326 = settings.clamdscan;
                const v2327 = v2326.config_file;
                const v2328 = `--config-file=${ v2327 }`;
                const v2329 = flags_array.push(v2328);
                v2329;
            }
            const v2330 = settings.clamdscan;
            const v2331 = v2330.multiscan;
            const v2332 = v2331 === true;
            if (v2332) {
                const v2333 = flags_array.push('--multiscan');
                v2333;
            }
            const v2334 = settings.clamdscan;
            const v2335 = v2334.reload_db;
            const v2336 = v2335 === true;
            if (v2336) {
                const v2337 = flags_array.push('--reload');
                v2337;
            }
        }
    }
    const v2338 = settings.remove_infected;
    const v2339 = v2338 !== true;
    if (v2339) {
        const v2340 = 'quarantine_infected' in settings;
        const v2341 = settings.quarantine_infected;
        const v2342 = v2340 && v2341;
        const v2343 = settings.quarantine_infected;
        const v2344 = typeof v2343;
        const v2345 = v2344 === 'string';
        const v2346 = v2342 && v2345;
        if (v2346) {
            const v2347 = settings.quarantine_infected;
            const v2348 = `--move=${ v2347 }`;
            const v2349 = flags_array.push(v2348);
            v2349;
        }
    }
    const v2350 = 'scan_log' in settings;
    const v2351 = settings.scan_log;
    const v2352 = v2350 && v2351;
    const v2353 = settings.scan_log;
    const v2354 = typeof v2353;
    const v2355 = v2354 === 'string';
    const v2356 = v2352 && v2355;
    if (v2356) {
        const v2357 = settings.scan_log;
        const v2358 = `--log=${ v2357 }`;
        const v2359 = flags_array.push(v2358);
        v2359;
    }
    const v2360 = 'file_list' in settings;
    const v2361 = settings.file_list;
    const v2362 = v2360 && v2361;
    const v2363 = settings.file_list;
    const v2364 = typeof v2363;
    const v2365 = v2364 === 'string';
    const v2366 = v2362 && v2365;
    if (v2366) {
        const v2367 = settings.file_list;
        const v2368 = `--file-list=${ v2367 }`;
        const v2369 = flags_array.push(v2368);
        v2369;
    }
    return flags_array;
};
NodeClam._build_clam_flags = _build_clam_flags;
const _init_socket = function _init_socket() {
    const v2464 = (resolve, reject) => {
        let client;
        const v2370 = this.settings;
        const v2371 = v2370.clamdscan;
        const v2372 = v2371.socket;
        if (v2372) {
            const v2373 = this.settings;
            const v2374 = v2373.clamdscan;
            const v2375 = v2374.socket;
            const v2376 = { path: v2375 };
            client = net.createConnection(v2376);
        } else {
            const v2377 = this.settings;
            const v2378 = v2377.clamdscan;
            const v2379 = v2378.port;
            if (v2379) {
                const v2380 = this.settings;
                const v2381 = v2380.clamdscan;
                const v2382 = v2381.host;
                if (v2382) {
                    const v2383 = this.settings;
                    const v2384 = v2383.clamdscan;
                    const v2385 = v2384.host;
                    const v2386 = this.settings;
                    const v2387 = v2386.clamdscan;
                    const v2388 = v2387.port;
                    const v2389 = {
                        host: v2385,
                        port: v2388
                    };
                    client = net.createConnection(v2389);
                } else {
                    const v2390 = this.settings;
                    const v2391 = v2390.clamdscan;
                    const v2392 = v2391.port;
                    const v2393 = { port: v2392 };
                    client = net.createConnection(v2393);
                }
            } else {
                const v2394 = new NodeClamError('Unable not establish connection to clamd service: No socket or host/port combo provided!');
                throw v2394;
            }
        }
        const v2395 = this.settings;
        const v2396 = v2395.clamdscan;
        const v2397 = v2396.timeout;
        if (v2397) {
            const v2398 = this.settings;
            const v2399 = v2398.clamdscan;
            const v2400 = v2399.timeout;
            const v2401 = client.setTimeout(v2400);
            v2401;
        }
        const v2444 = () => {
            const v2402 = client.remotePort;
            const v2403 = client.remotePort;
            const v2404 = v2403.toString();
            const v2405 = this.settings;
            const v2406 = v2405.clamdscan;
            const v2407 = v2406.port;
            const v2408 = v2407.toString();
            const v2409 = v2404 === v2408;
            const v2410 = v2402 && v2409;
            if (v2410) {
                const v2411 = this.settings;
                const v2412 = v2411.debug_mode;
                if (v2412) {
                    const v2413 = this.debug_label;
                    const v2414 = client.remoteAddress;
                    const v2415 = client.remotePort;
                    const v2416 = `${ v2413 }: using remote server: ${ v2414 }:${ v2415 }`;
                    const v2417 = console.log(v2416);
                    v2417;
                }
            } else {
                const v2418 = this.settings;
                const v2419 = v2418.clamdscan;
                const v2420 = v2419.socket;
                if (v2420) {
                    const v2421 = this.settings;
                    const v2422 = v2421.debug_mode;
                    if (v2422) {
                        const v2423 = this.debug_label;
                        const v2424 = this.settings;
                        const v2425 = v2424.clamdscan;
                        const v2426 = v2425.socket;
                        const v2427 = `${ v2423 }: using local unix domain socket: ${ v2426 }`;
                        const v2428 = console.log(v2427);
                        v2428;
                    }
                } else {
                    const v2429 = this.settings;
                    const v2430 = v2429.debug_mode;
                    if (v2430) {
                        const v2431 = client.address();
                        const port = v2431.port;
                        const address = v2431.address;
                        const v2432 = this.debug_label;
                        const v2433 = client.remotePort;
                        const v2434 = `${ v2432 }: meta port value: ${ port } vs ${ v2433 }`;
                        const v2435 = console.log(v2434);
                        v2435;
                        const v2436 = this.debug_label;
                        const v2437 = client.remoteAddress;
                        const v2438 = `${ v2436 }: meta address value: ${ address } vs ${ v2437 }`;
                        const v2439 = console.log(v2438);
                        v2439;
                        const v2440 = this.debug_label;
                        const v2441 = `${ v2440 }: something is not working...`;
                        const v2442 = console.log(v2441);
                        v2442;
                    }
                }
            }
            const v2443 = resolve(client);
            return v2443;
        };
        const v2445 = client.on('connect', v2444);
        const v2452 = () => {
            const v2446 = this.settings;
            const v2447 = v2446.debug_mode;
            if (v2447) {
                const v2448 = this.debug_label;
                const v2449 = `${ v2448 }: Socket connection timed out.`;
                const v2450 = console.log(v2449);
                v2450;
            }
            const v2451 = client.end();
            v2451;
        };
        const v2453 = v2445.on('timeout', v2452);
        const v2459 = () => {
            const v2454 = this.settings;
            const v2455 = v2454.debug_mode;
            if (v2455) {
                const v2456 = this.debug_label;
                const v2457 = `${ v2456 }: Socket connection closed.`;
                const v2458 = console.log(v2457);
                v2458;
            }
        };
        const v2460 = v2453.on('close', v2459);
        const v2462 = e => {
            const v2461 = reject(e);
            v2461;
        };
        const v2463 = v2460.on('error', v2462);
        v2463;
    };
    const v2465 = new Promise(v2464);
    return v2465;
};
NodeClam._init_socket = _init_socket;
const _is_clamav_binary = async function _is_clamav_binary(scanner) {
    const v2466 = this.settings;
    const v2467 = v2466[scanner];
    const v2468 = v2467.path;
    const path = v2468 || null;
    const v2469 = !path;
    if (v2469) {
        const v2470 = this.settings;
        const v2471 = v2470.debug_mode;
        if (v2471) {
            const v2472 = this.debug_label;
            const v2473 = `${ v2472 }: Could not determine path for clamav binary.`;
            const v2474 = console.log(v2473);
            v2474;
        }
        return false;
    }
    const version_cmds = {};
    version_cmds.clamdscan = `${ path } --version`;
    version_cmds.clamscan = `${ path } --version`;
    try {
        const v2475 = fs.constants;
        const v2476 = v2475.R_OK;
        await fs_access(path, v2476);
        const v2477 = version_cmds[scanner];
        version_cmds_exec = v2477.split(' ');
        const v2479 = version_cmds_exec[0];
        const v2480 = version_cmds_exec[1];
        const v2481 = [v2480];
        const v2478 = await cp_execfile(v2479, v2481);
        const stdout = v2478.stdout;
        const v2482 = stdout.toString();
        const v2483 = v2482.match(/ClamAV/);
        const v2484 = v2483 === null;
        if (v2484) {
            const v2485 = this.settings;
            const v2486 = v2485.debug_mode;
            if (v2486) {
                const v2487 = this.debug_label;
                const v2488 = `${ v2487 }: Could not verify the ${ scanner } binary.`;
                const v2489 = console.log(v2488);
                v2489;
            }
            return false;
        }
        return true;
    } catch (err) {
        const v2490 = this.settings;
        const v2491 = v2490.debug_mode;
        if (v2491) {
            const v2492 = this.debug_label;
            const v2493 = `${ v2492 }: Could not verify the ${ scanner } binary.`;
            const v2494 = console.log(v2493);
            v2494;
        }
        return false;
    }
};
NodeClam._is_clamav_binary = _is_clamav_binary;
const _is_localhost = function _is_localhost() {
    const v2495 = os.hostname();
    const v2496 = [
        '127.0.0.1',
        'localhost',
        v2495
    ];
    const v2497 = this.settings;
    const v2498 = v2497.clamdscan;
    const v2499 = v2498.host;
    const v2500 = v2496.includes(v2499);
    return v2500;
};
NodeClam._is_localhost = _is_localhost;
const _is_readable_stream = function _is_readable_stream(obj) {
    const v2501 = !obj;
    const v2502 = typeof obj;
    const v2503 = v2502 !== 'object';
    const v2504 = v2501 || v2503;
    if (v2504) {
        return false;
    }
    const v2505 = obj.pipe;
    const v2506 = typeof v2505;
    const v2507 = v2506 === 'function';
    const v2508 = obj._readableState;
    const v2509 = typeof v2508;
    const v2510 = v2509 === 'object';
    const v2511 = v2507 && v2510;
    return v2511;
};
NodeClam._is_readable_stream = _is_readable_stream;
const _ping = function _ping(cb) {
    let has_cb = false;
    const v2512 = typeof cb;
    const v2513 = v2512 !== 'function';
    const v2514 = cb && v2513;
    if (v2514) {
        const v2515 = new NodeClamError('Invalid cb provided to ping. Second parameter must be a function!');
        throw v2515;
    }
    const v2516 = typeof cb;
    const v2517 = v2516 === 'function';
    const v2518 = cb && v2517;
    if (v2518) {
        has_cb = true;
    }
    const v2544 = async (resolve, reject) => {
        try {
            const client = await this._init_socket('test_availability');
            const v2519 = this.settings;
            const v2520 = v2519.debug_mode;
            if (v2520) {
                const v2521 = this.debug_label;
                const v2522 = `${ v2521 }: Established connection to clamscan server for testing!`;
                const v2523 = console.log(v2522);
                v2523;
            }
            const v2524 = client.write('PING');
            v2524;
            const v2539 = data => {
                const v2525 = data.toString();
                const v2526 = v2525.trim();
                const v2527 = v2526 === 'PONG';
                if (v2527) {
                    const v2528 = this.settings;
                    const v2529 = v2528.debug_mode;
                    if (v2529) {
                        const v2530 = this.debug_label;
                        const v2531 = `${ v2530 }: PONG!`;
                        const v2532 = console.log(v2531);
                        v2532;
                    }
                    const v2533 = cb(null, client);
                    const v2534 = resolve(client);
                    let v2535;
                    if (has_cb) {
                        v2535 = v2533;
                    } else {
                        v2535 = v2534;
                    }
                    return v2535;
                }
                const err = new NodeClamError(data, 'Could not establish connection to the remote clamscan server.');
                const v2536 = cb(err, null);
                const v2537 = reject(err);
                let v2538;
                if (has_cb) {
                    v2538 = v2536;
                } else {
                    v2538 = v2537;
                }
                return v2538;
            };
            const v2540 = client.on('data', v2539);
            v2540;
        } catch (err) {
            const v2541 = cb(err, false);
            const v2542 = resolve(err);
            let v2543;
            if (has_cb) {
                v2543 = v2541;
            } else {
                v2543 = v2542;
            }
            return v2543;
        }
    };
    const v2545 = new Promise(v2544);
    return v2545;
};
NodeClam._ping = _ping;
const _process_result = function _process_result(result, file = null) {
    const v2546 = typeof result;
    const v2547 = v2546 !== 'string';
    if (v2547) {
        const v2548 = this.settings;
        const v2549 = v2548.debug_mode;
        if (v2549) {
            const v2550 = this.debug_label;
            const v2551 = `${ v2550 }: Invalid stdout from scanner (not a string): `;
            const v2552 = console.log(v2551, result);
            v2552;
        }
        const v2553 = new Error('Invalid result to process (not a string)');
        throw v2553;
    }
    result = result.trim();
    const v2554 = /:\s+OK(\u0000|[\r\n])?$/.test(result);
    if (v2554) {
        const v2555 = this.settings;
        const v2556 = v2555.debug_mode;
        if (v2556) {
            const v2557 = this.debug_label;
            const v2558 = `${ v2557 }: File is OK!`;
            const v2559 = console.log(v2558);
            v2559;
        }
        const v2560 = [];
        const v2561 = {};
        v2561.is_infected = false;
        v2561.viruses = v2560;
        v2561.file = file;
        v2561.resultString = result;
        return v2561;
    }
    const v2562 = /:\s+(.+)FOUND(\u0000|[\r\n])?/gm.test(result);
    if (v2562) {
        const v2563 = this.settings;
        const v2564 = v2563.debug_mode;
        if (v2564) {
            const v2565 = this.settings;
            const v2566 = v2565.debug_mode;
            if (v2566) {
                const v2567 = this.debug_label;
                const v2568 = `${ v2567 }: Scan Response: `;
                const v2569 = console.log(v2568, result);
                v2569;
            }
            const v2570 = this.settings;
            const v2571 = v2570.debug_mode;
            if (v2571) {
                const v2572 = this.debug_label;
                const v2573 = `${ v2572 }: File is INFECTED!`;
                const v2574 = console.log(v2573);
                v2574;
            }
        }
        const v2575 = result.split(/(\u0000|[\r\n])/);
        const v2580 = v => {
            const v2576 = /:\s+(.+)FOUND$/gm.test(v);
            const v2577 = v.replace(/(.+:\s+)(.+)FOUND/gm, '$2');
            const v2578 = v2577.trim();
            let v2579;
            if (v2576) {
                v2579 = v2578;
            } else {
                v2579 = null;
            }
            return v2579;
        };
        const v2581 = v2575.map(v2580);
        const v2584 = v => {
            const v2582 = !v;
            const v2583 = !v2582;
            return v2583;
        };
        const viruses = v2581.filter(v2584);
        const v2585 = {};
        v2585.is_infected = true;
        v2585.viruses = viruses;
        v2585.file = file;
        v2585.resultString = result;
        return v2585;
    }
    const v2586 = /^(.+)ERROR/gm.test(result);
    if (v2586) {
        const v2587 = result.replace(/^(.+)ERROR/gm, '$1');
        const error = v2587.trim();
        const v2588 = this.settings;
        const v2589 = v2588.debug_mode;
        if (v2589) {
            const v2590 = this.settings;
            const v2591 = v2590.debug_mode;
            if (v2591) {
                const v2592 = this.debug_label;
                const v2593 = `${ v2592 }: Error Response: `;
                const v2594 = console.log(v2593, error);
                v2594;
            }
            const v2595 = this.settings;
            const v2596 = v2595.debug_mode;
            if (v2596) {
                const v2597 = this.debug_label;
                const v2598 = `${ v2597 }: File may be INFECTED!`;
                const v2599 = console.log(v2598);
                v2599;
            }
        }
        const v2600 = { error };
        const v2601 = new NodeClamError(v2600, `An error occurred while scanning the piped-through stream: ${ error }`);
        return v2601;
    }
    const v2602 = this.settings;
    const v2603 = v2602.debug_mode;
    if (v2603) {
        const v2604 = this.settings;
        const v2605 = v2604.debug_mode;
        if (v2605) {
            const v2606 = this.debug_label;
            const v2607 = `${ v2606 }: Error Response: `;
            const v2608 = console.log(v2607, result);
            v2608;
        }
        const v2609 = this.settings;
        const v2610 = v2609.debug_mode;
        if (v2610) {
            const v2611 = this.debug_label;
            const v2612 = `${ v2611 }: File may be INFECTED!`;
            const v2613 = console.log(v2612);
            v2613;
        }
    }
    const v2614 = [];
    const v2615 = {};
    v2615.is_infected = null;
    v2615.viruses = v2614;
    v2615.file = file;
    v2615.resultString = result;
    return v2615;
};
NodeClam._process_result = _process_result;
const get_version = function get_version(cb) {
    const self = this;
    let has_cb = false;
    const v2616 = typeof cb;
    const v2617 = v2616 !== 'function';
    const v2618 = cb && v2617;
    if (v2618) {
        const v2619 = new NodeClamError('Invalid cb provided to scan_stream. Second paramter must be a function!');
        throw v2619;
    }
    const v2620 = typeof cb;
    const v2621 = v2620 === 'function';
    const v2622 = cb && v2621;
    if (v2622) {
        has_cb = true;
    }
    const v2695 = async (resolve, reject) => {
        const local_fallback = async () => {
            const v2623 = self.settings;
            const v2624 = self.scanner;
            const v2625 = v2623[v2624];
            const v2626 = v2625.path;
            const v2627 = self._build_clam_args('--version');
            const v2628 = v2627.join(' ');
            const command = `${ v2626 } ${ v2628 }`;
            const v2629 = self.settings;
            const v2630 = v2629.debug_mode;
            if (v2630) {
                const v2631 = this.debug_label;
                const v2632 = `${ v2631 }: Configured clam command: ${ command }`;
                const v2633 = console.log(v2632);
                v2633;
            }
            try {
                const v2634 = await cp_execfile(command);
                const stdout = v2634.stdout;
                const stderr = v2634.stderr;
                if (stderr) {
                    const v2635 = {
                        stderr,
                        file: null
                    };
                    const err = new NodeClamError(v2635, 'ClamAV responded with an unexpected response when requesting version.');
                    const v2636 = self.settings;
                    const v2637 = v2636.debug_mode;
                    if (v2637) {
                        const v2638 = this.debug_label;
                        const v2639 = `${ v2638 }: `;
                        const v2640 = console.log(v2639, err);
                        v2640;
                    }
                    const v2641 = cb(err, null, null);
                    const v2642 = reject(err);
                    let v2643;
                    if (has_cb) {
                        v2643 = v2641;
                    } else {
                        v2643 = v2642;
                    }
                    return v2643;
                } else {
                    const v2644 = cb(null, stdout);
                    const v2645 = resolve(stdout);
                    let v2646;
                    if (has_cb) {
                        v2646 = v2644;
                    } else {
                        v2646 = v2645;
                    }
                    return v2646;
                }
            } catch (e) {
                const v2647 = Object.prototype;
                const v2648 = v2647.hasOwnProperty;
                const v2649 = v2648.call(e, 'code');
                const v2650 = e.code;
                const v2651 = v2650 === 1;
                const v2652 = v2649 && v2651;
                if (v2652) {
                    const v2653 = cb(null, null);
                    const v2654 = resolve(null, null);
                    let v2655;
                    if (has_cb) {
                        v2655 = v2653;
                    } else {
                        v2655 = v2654;
                    }
                    return v2655;
                } else {
                    const v2656 = { err: e };
                    const err = new NodeClamError(v2656, 'There was an error requestion ClamAV version.');
                    const v2657 = self.settings;
                    const v2658 = v2657.debug_mode;
                    if (v2658) {
                        const v2659 = this.debug_label;
                        const v2660 = `${ v2659 }: `;
                        const v2661 = console.log(v2660, err);
                        v2661;
                    }
                    const v2662 = cb(err, null);
                    const v2663 = reject(err);
                    let v2664;
                    if (has_cb) {
                        v2664 = v2662;
                    } else {
                        v2664 = v2663;
                    }
                    return v2664;
                }
            }
        };
        const v2665 = this.scanner;
        const v2666 = v2665 === 'clamdscan';
        const v2667 = this.settings;
        const v2668 = v2667.clamdscan;
        const v2669 = v2668.socket;
        const v2670 = this.settings;
        const v2671 = v2670.clamdscan;
        const v2672 = v2671.host;
        const v2673 = v2669 || v2672;
        const v2674 = v2666 && v2673;
        if (v2674) {
            const chunks = [];
            try {
                const client = await this._init_socket();
                const v2675 = client.write('nVERSION\n');
                v2675;
                const v2677 = chunk => {
                    const v2676 = chunks.push(chunk);
                    return v2676;
                };
                const v2678 = client.on('data', v2677);
                v2678;
                const v2684 = () => {
                    const response = Buffer.concat(chunks);
                    const v2679 = response.toString();
                    const v2680 = cb(null, v2679);
                    const v2681 = response.toString();
                    const v2682 = resolve(v2681);
                    let v2683;
                    if (has_cb) {
                        v2683 = v2680;
                    } else {
                        v2683 = v2682;
                    }
                    return v2683;
                };
                const v2685 = client.on('end', v2684);
                v2685;
            } catch (err) {
                const v2686 = this.settings;
                const v2687 = v2686.clamdscan;
                const v2688 = v2687.local_fallback;
                const v2689 = v2688 === true;
                if (v2689) {
                    const v2690 = local_fallback();
                    return v2690;
                } else {
                    const v2691 = cb(err, null);
                    const v2692 = resolve(err);
                    let v2693;
                    if (has_cb) {
                        v2693 = v2691;
                    } else {
                        v2693 = v2692;
                    }
                    return v2693;
                }
            }
        } else {
            const v2694 = local_fallback();
            return v2694;
        }
    };
    const v2696 = new Promise(v2695);
    return v2696;
};
NodeClam.get_version = get_version;
const is_infected = function is_infected(file = '', cb) {
    const self = this;
    let has_cb = false;
    const v2697 = typeof cb;
    const v2698 = v2697 !== 'function';
    const v2699 = cb && v2698;
    if (v2699) {
        const v2700 = new NodeClamError('Invalid cb provided to is_infected. Second paramter, if provided, must be a function!');
        throw v2700;
    } else {
        const v2701 = typeof cb;
        const v2702 = v2701 === 'function';
        const v2703 = cb && v2702;
        if (v2703) {
            has_cb = true;
        }
    }
    const v2875 = async (resolve, reject) => {
        const v2704 = typeof file;
        const v2705 = v2704 !== 'string';
        const v2706 = typeof file;
        const v2707 = v2706 === 'string';
        const v2708 = file.trim();
        const v2709 = v2708 === '';
        const v2710 = v2707 && v2709;
        const v2711 = v2705 || v2710;
        if (v2711) {
            const v2712 = { file };
            const err = new NodeClamError(v2712, 'Invalid or empty file name provided.');
            const v2713 = [];
            const v2714 = cb(err, file, null, v2713);
            const v2715 = reject(err);
            let v2716;
            if (has_cb) {
                v2716 = v2714;
            } else {
                v2716 = v2715;
            }
            return v2716;
        }
        const v2717 = file.trim();
        file = v2717.replace(/ /g, ' ');
        const local_scan = () => {
            const v2718 = self.settings;
            const v2719 = v2718.debug_mode;
            if (v2719) {
                const v2720 = this.debug_label;
                const v2721 = `${ v2720 }: Scanning ${ file }`;
                const v2722 = console.log(v2721);
                v2722;
            }
            const args = self._build_clam_args(file);
            const v2723 = self.settings;
            const v2724 = v2723.debug_mode;
            if (v2724) {
                const v2725 = this.debug_label;
                const v2726 = self.settings;
                const v2727 = self.scanner;
                const v2728 = v2726[v2727];
                const v2729 = v2728.path;
                const v2730 = `${ v2725 }: Configured clam command: ${ v2729 }`;
                const v2731 = args.join(' ');
                const v2732 = console.log(v2730, v2731);
                v2732;
            }
            const v2733 = self.settings;
            const v2734 = self.scanner;
            const v2735 = v2733[v2734];
            const v2736 = v2735.path;
            const v2778 = (err, stdout, stderr) => {
                const v2737 = self._process_result(stdout, file);
                const is_infected = v2737.is_infected;
                const viruses = v2737.viruses;
                if (err) {
                    const v2738 = Object.prototype;
                    const v2739 = v2738.hasOwnProperty;
                    const v2740 = v2739.call(err, 'code');
                    const v2741 = err.code;
                    const v2742 = v2741 === 1;
                    const v2743 = v2740 && v2742;
                    if (v2743) {
                        const v2744 = cb(null, file, true, viruses);
                        const v2745 = {
                            file,
                            is_infected,
                            viruses
                        };
                        const v2746 = resolve(v2745);
                        let v2747;
                        if (has_cb) {
                            v2747 = v2744;
                        } else {
                            v2747 = v2746;
                        }
                        return v2747;
                    } else {
                        const v2748 = {
                            file,
                            err,
                            is_infected: null
                        };
                        const v2749 = err.code;
                        const error = new NodeClamError(v2748, `There was an error scanning the file (ClamAV Error Code: ${ v2749 })`);
                        const v2750 = self.settings;
                        const v2751 = v2750.debug_mode;
                        if (v2751) {
                            const v2752 = this.debug_label;
                            const v2753 = `${ v2752 }`;
                            const v2754 = console.log(v2753, error);
                            v2754;
                        }
                        const v2755 = [];
                        const v2756 = cb(error, file, null, v2755);
                        const v2757 = reject(error);
                        let v2758;
                        if (has_cb) {
                            v2758 = v2756;
                        } else {
                            v2758 = v2757;
                        }
                        return v2758;
                    }
                } else {
                    if (stderr) {
                        const v2759 = {
                            stderr,
                            file
                        };
                        const err = new NodeClamError(v2759, 'The file was scanned but ClamAV responded with an unexpected response.');
                        const v2760 = self.settings;
                        const v2761 = v2760.debug_mode;
                        if (v2761) {
                            const v2762 = this.debug_label;
                            const v2763 = `${ v2762 }: `;
                            const v2764 = console.log(v2763, err);
                            v2764;
                        }
                        const v2765 = cb(err, file, null, viruses);
                        const v2766 = {
                            file,
                            is_infected,
                            viruses
                        };
                        const v2767 = resolve(v2766);
                        let v2768;
                        if (has_cb) {
                            v2768 = v2765;
                        } else {
                            v2768 = v2767;
                        }
                        return v2768;
                    } else {
                        try {
                            const v2769 = cb(null, file, is_infected, viruses);
                            const v2770 = {
                                file,
                                is_infected,
                                viruses
                            };
                            const v2771 = resolve(v2770);
                            let v2772;
                            if (has_cb) {
                                v2772 = v2769;
                            } else {
                                v2772 = v2771;
                            }
                            return v2772;
                        } catch (e) {
                            const v2773 = {
                                file,
                                err: e,
                                is_infected: null
                            };
                            const err = new NodeClamError(v2773, 'There was an error processing the results from ClamAV');
                            const v2774 = [];
                            const v2775 = cb(err, file, null, v2774);
                            const v2776 = reject(err);
                            let v2777;
                            if (has_cb) {
                                v2777 = v2775;
                            } else {
                                v2777 = v2776;
                            }
                            return v2777;
                        }
                    }
                }
            };
            const v2779 = execFile(v2736, args, v2778);
            v2779;
        };
        try {
            const v2780 = fs.constants;
            const v2781 = v2780.R_OK;
            await fs_access(file, v2781);
        } catch (e) {
            const v2782 = {
                err: e,
                file
            };
            const err = new NodeClamError(v2782, 'Could not find file to scan!');
            const v2783 = cb(err, file, true);
            const v2784 = reject(err);
            let v2785;
            if (has_cb) {
                v2785 = v2783;
            } else {
                v2785 = v2784;
            }
            return v2785;
        }
        try {
            const stats = await fs_stat(file);
            const is_directory = stats.isDirectory();
            const is_file = stats.isFile();
            const v2786 = !is_file;
            const v2787 = !is_directory;
            const v2788 = v2786 && v2787;
            if (v2788) {
                const v2789 = `${ file } is not a valid file or directory.`;
                const v2790 = Error(v2789);
                throw v2790;
            } else {
                const v2791 = !is_file;
                const v2792 = v2791 && is_directory;
                if (v2792) {
                    const v2793 = await this.scan_dir(file);
                    const is_infected = v2793.is_infected;
                    const v2794 = [];
                    const v2795 = cb(null, file, is_infected, v2794);
                    const v2796 = [];
                    const v2797 = {
                        file,
                        is_infected,
                        viruses: v2796
                    };
                    const v2798 = resolve(v2797);
                    let v2799;
                    if (has_cb) {
                        v2799 = v2795;
                    } else {
                        v2799 = v2798;
                    }
                    return v2799;
                }
            }
        } catch (err) {
            const v2800 = cb(err, file, null);
            const v2801 = reject(err);
            let v2802;
            if (has_cb) {
                v2802 = v2800;
            } else {
                v2802 = v2801;
            }
            return v2802;
        }
        const v2803 = this.settings;
        const v2804 = v2803.clamdscan;
        const v2805 = v2804.socket;
        const v2806 = this.settings;
        const v2807 = v2806.clamdscan;
        const v2808 = v2807.host;
        const v2809 = v2805 || v2808;
        if (v2809) {
            const v2810 = this.settings;
            const v2811 = v2810.clamdscan;
            const v2812 = v2811.socket;
            if (v2812) {
                try {
                    const client = await this._init_socket('is_infected');
                    const v2813 = this.settings;
                    const v2814 = v2813.debug_mode;
                    if (v2814) {
                        const v2815 = this.debug_label;
                        const v2816 = `${ v2815 }: scanning with local domain socket now.`;
                        const v2817 = console.log(v2816);
                        v2817;
                    }
                    const v2818 = this.settings;
                    const v2819 = v2818.clamdscan;
                    const v2820 = v2819.multiscan;
                    const v2821 = v2820 === true;
                    if (v2821) {
                        const v2822 = `MULTISCAN ${ file }`;
                        const v2823 = client.write(v2822);
                        v2823;
                    } else {
                        const v2824 = `SCAN ${ file }`;
                        const v2825 = client.write(v2824);
                        v2825;
                    }
                    const v2846 = async data => {
                        const v2826 = this.settings;
                        const v2827 = v2826.debug_mode;
                        if (v2827) {
                            const v2828 = this.debug_label;
                            const v2829 = `${ v2828 }: Received response from remote clamd service.`;
                            const v2830 = console.log(v2829);
                            v2830;
                        }
                        try {
                            const v2831 = data.toString();
                            const result = this._process_result(v2831, file);
                            const v2832 = result instanceof Error;
                            if (v2832) {
                                throw result;
                            }
                            const v2833 = result;
                            const is_infected = v2833.is_infected;
                            const viruses = v2833.viruses;
                            const v2834 = cb(null, file, is_infected, viruses);
                            const v2835 = {
                                file,
                                is_infected,
                                viruses
                            };
                            const v2836 = resolve(v2835);
                            let v2837;
                            if (has_cb) {
                                v2837 = v2834;
                            } else {
                                v2837 = v2836;
                            }
                            return v2837;
                        } catch (err) {
                            const v2838 = this.settings;
                            const v2839 = v2838.clamdscan;
                            const v2840 = v2839.local_fallback;
                            const v2841 = v2840 === true;
                            if (v2841) {
                                return await local_scan();
                            }
                            const v2842 = [];
                            const v2843 = cb(err, file, null, v2842);
                            const v2844 = reject(err);
                            let v2845;
                            if (has_cb) {
                                v2845 = v2843;
                            } else {
                                v2845 = v2844;
                            }
                            return v2845;
                        }
                    };
                    const v2847 = client.on('data', v2846);
                    v2847;
                } catch (err) {
                    const v2848 = this.settings;
                    const v2849 = v2848.clamdscan;
                    const v2850 = v2849.local_fallback;
                    const v2851 = v2850 === true;
                    if (v2851) {
                        return await local_scan();
                    }
                    const v2852 = [];
                    const v2853 = cb(err, file, null, v2852);
                    const v2854 = reject(err);
                    let v2855;
                    if (has_cb) {
                        v2855 = v2853;
                    } else {
                        v2855 = v2854;
                    }
                    return v2855;
                }
            } else {
                const stream = fs.createReadStream(file);
                try {
                    const is_infected = await this.scan_stream(stream);
                    const v2856 = [];
                    const v2857 = cb(null, file, is_infected, v2856);
                    const v2858 = { file };
                    const v2859 = Object.assign(v2858, is_infected);
                    const v2860 = resolve(v2859);
                    let v2861;
                    if (has_cb) {
                        v2861 = v2857;
                    } else {
                        v2861 = v2860;
                    }
                    return v2861;
                } catch (e) {
                    const v2862 = this.settings;
                    const v2863 = v2862.clamdscan;
                    const v2864 = v2863.local_fallback;
                    const v2865 = v2864 === true;
                    if (v2865) {
                        return await local_scan();
                    }
                    const v2866 = {
                        err: e,
                        file
                    };
                    const err = new NodeClamError(v2866, 'Could not scan file via TCP or locally!');
                    const v2867 = [];
                    const v2868 = cb(err, file, null, v2867);
                    const v2869 = reject(err);
                    let v2870;
                    if (has_cb) {
                        v2870 = v2868;
                    } else {
                        v2870 = v2869;
                    }
                    return v2870;
                } finally {
                    const v2871 = stream.destroy();
                    v2871;
                }
            }
        } else {
            try {
                return await local_scan();
            } catch (err) {
                const v2872 = cb(err, file, null);
                const v2873 = reject(err);
                let v2874;
                if (has_cb) {
                    v2874 = v2872;
                } else {
                    v2874 = v2873;
                }
                return v2874;
            }
        }
    };
    const v2876 = new Promise(v2875);
    return v2876;
};
NodeClam.is_infected = is_infected;
const passthrough = function passthrough() {
    const me = this;
    let _scan_complete = false;
    let _av_waiting = null;
    let _av_scan_time = false;
    const clear_scan_benchmark = () => {
        if (_av_waiting) {
            const v2877 = clearInterval(_av_waiting);
            v2877;
        }
        _av_waiting = null;
        _av_scan_time = 0;
    };
    const v3007 = async function (chunk, encoding, cb) {
        const do_transform = () => {
            const v2878 = this._fork_stream;
            const v2879 = v2878.write(chunk);
            const v2880 = !v2879;
            if (v2880) {
                const v2881 = this._fork_stream;
                const v2883 = () => {
                    const v2882 = cb(null, chunk);
                    v2882;
                };
                const v2884 = v2881.once('drain', v2883);
                v2884;
            } else {
                const v2885 = cb(null, chunk);
                v2885;
            }
        };
        const handle_error = (err, is_infected = null, result = null) => {
            const v2886 = this._fork_stream;
            const v2887 = v2886.unpipe();
            v2887;
            const v2888 = this._fork_stream;
            const v2889 = v2888.destroy();
            v2889;
            const v2890 = this._clamav_transform;
            const v2891 = v2890.destroy();
            v2891;
            const v2892 = clear_scan_benchmark();
            v2892;
            const v2893 = is_infected === true;
            if (v2893) {
                const v2894 = _scan_complete === false;
                if (v2894) {
                    _scan_complete = true;
                    const v2895 = this.emit('scan-complete', result);
                    v2895;
                }
                const v2896 = this.emit('stream-infected', result);
                v2896;
            } else {
                const v2897 = this.emit('error', err);
                v2897;
            }
        };
        const v2898 = this._clamav_socket;
        const v2899 = !v2898;
        if (v2899) {
            this._fork_stream = new PassThrough();
            const v2900 = {};
            const v2901 = me.settings;
            const v2902 = v2901.debug_mode;
            this._clamav_transform = new NodeClamTransform(v2900, v2902);
            this._clamav_response_chunks = [];
            try {
                this._clamav_socket = await me._init_socket('passthrough');
                const v2903 = me.settings;
                const v2904 = v2903.debug_mode;
                if (v2904) {
                    const v2905 = me.debug_label;
                    const v2906 = `${ v2905 }: ClamAV Socket Initialized...`;
                    const v2907 = console.log(v2906);
                    v2907;
                }
                const v2908 = this._fork_stream;
                const v2909 = this._clamav_transform;
                const v2910 = v2908.pipe(v2909);
                const v2911 = this._clamav_socket;
                const v2912 = v2910.pipe(v2911);
                v2912;
                const v2913 = this._clamav_socket;
                const v2919 = hadError => {
                    const v2914 = me.settings;
                    const v2915 = v2914.debug_mode;
                    if (v2915) {
                        const v2916 = me.debug_label;
                        const v2917 = `${ v2916 }: ClamAV socket has been closed! Because of Error:`;
                        const v2918 = console.log(v2917, hadError);
                        v2918;
                    }
                };
                const v2920 = v2913.on('close', v2919);
                const v2939 = () => {
                    const v2921 = me.settings;
                    const v2922 = v2921.debug_mode;
                    if (v2922) {
                        const v2923 = me.debug_label;
                        const v2924 = `${ v2923 }: ClamAV socket has received the last chunk!`;
                        const v2925 = console.log(v2924);
                        v2925;
                    }
                    const v2926 = this._clamav_response_chunks;
                    const response = Buffer.concat(v2926);
                    const v2927 = response.toString('utf8');
                    const result = me._process_result(v2927, null);
                    this._clamav_response_chunks = [];
                    const v2928 = me.settings;
                    const v2929 = v2928.debug_mode;
                    if (v2929) {
                        const v2930 = me.debug_label;
                        const v2931 = `${ v2930 }: Result of scan:`;
                        const v2932 = console.log(v2931, result);
                        v2932;
                        const v2933 = me.debug_label;
                        const v2934 = `${ v2933 }: It took ${ _av_scan_time } seconds to scan the file(s).`;
                        const v2935 = console.log(v2934);
                        v2935;
                        const v2936 = clear_scan_benchmark();
                        v2936;
                    }
                    const v2937 = _scan_complete === false;
                    if (v2937) {
                        _scan_complete = true;
                        const v2938 = this.emit('scan-complete', result);
                        v2938;
                    }
                };
                const v2940 = v2920.on('end', v2939);
                const v2946 = () => {
                    const v2941 = me.settings;
                    const v2942 = v2941.debug_mode;
                    if (v2942) {
                        const v2943 = me.debug_label;
                        const v2944 = `${ v2943 }: ClamAV socket ready to receive`;
                        const v2945 = console.log(v2944);
                        v2945;
                    }
                };
                const v2947 = v2940.on('ready', v2946);
                const v2953 = () => {
                    const v2948 = me.settings;
                    const v2949 = v2948.debug_mode;
                    if (v2949) {
                        const v2950 = me.debug_label;
                        const v2951 = `${ v2950 }: Connected to ClamAV socket`;
                        const v2952 = console.log(v2951);
                        v2952;
                    }
                };
                const v2954 = v2947.on('connect', v2953);
                const v2959 = err => {
                    const v2955 = me.debug_label;
                    const v2956 = `${ v2955 }: Error emitted from ClamAV socket: `;
                    const v2957 = console.error(v2956, err);
                    v2957;
                    const v2958 = handle_error(err);
                    v2958;
                };
                const v2960 = v2954.on('error', v2959);
                const v2995 = cv_chunk => {
                    const v2961 = this._clamav_response_chunks;
                    const v2962 = v2961.push(cv_chunk);
                    v2962;
                    const v2963 = me.settings;
                    const v2964 = v2963.debug_mode;
                    if (v2964) {
                        const v2965 = me.debug_label;
                        const v2966 = `${ v2965 }: Got result!`;
                        const v2967 = cv_chunk.toString();
                        const v2968 = console.log(v2966, v2967);
                        v2968;
                    }
                    const v2969 = this._clamav_response_chunks;
                    const response = Buffer.concat(v2969);
                    const v2970 = response.toString();
                    const result = me._process_result(v2970, null);
                    const v2971 = result instanceof NodeClamError;
                    const v2972 = typeof result;
                    const v2973 = v2972 === 'object';
                    const v2974 = 'is_infected' in result;
                    const v2975 = v2973 && v2974;
                    const v2976 = result.is_infected;
                    const v2977 = v2976 === true;
                    const v2978 = v2975 && v2977;
                    const v2979 = v2971 || v2978;
                    if (v2979) {
                        const v2980 = typeof result;
                        const v2981 = v2980 === 'object';
                        const v2982 = 'is_infected' in result;
                        const v2983 = v2981 && v2982;
                        const v2984 = result.is_infected;
                        const v2985 = v2984 === true;
                        const v2986 = v2983 && v2985;
                        if (v2986) {
                            const v2987 = handle_error(null, true, result);
                            v2987;
                        } else {
                            const v2988 = handle_error(result);
                            v2988;
                        }
                    } else {
                        const v2989 = me.settings;
                        const v2990 = v2989.debug_mode;
                        if (v2990) {
                            const v2991 = me.debug_label;
                            const v2992 = `${ v2991 }: Processed Result: `;
                            const v2993 = response.toString();
                            const v2994 = console.log(v2992, result, v2993);
                            v2994;
                        }
                    }
                };
                const v2996 = v2960.on('data', v2995);
                v2996;
                const v2997 = me.settings;
                const v2998 = v2997.debug_mode;
                if (v2998) {
                    const v2999 = me.debug_label;
                    const v3000 = `${ v2999 }: Doing initial transform!`;
                    const v3001 = console.log(v3000);
                    v3001;
                }
                const v3002 = do_transform();
                v3002;
            } catch (err) {
                const v3003 = me.debug_label;
                const v3004 = `${ v3003 }: Error initiating socket to ClamAV: `;
                const v3005 = console.error(v3004, err);
                v3005;
            }
        } else {
            const v3006 = do_transform();
            v3006;
        }
    };
    const v3029 = function (cb) {
        const v3008 = me.settings;
        const v3009 = v3008.debug_mode;
        if (v3009) {
            const v3010 = me.debug_label;
            const v3011 = `${ v3010 }: Done with the full pipeline.`;
            const v3012 = console.log(v3011);
            v3012;
        }
        _av_waiting = null;
        _av_scan_time = 0;
        const v3013 = me.settings;
        const v3014 = v3013.debug_mode;
        if (v3014) {
            const v3020 = () => {
                _av_scan_time += 1;
                const v3015 = _av_scan_time % 5;
                const v3016 = v3015 === 0;
                if (v3016) {
                    const v3017 = me.debug_label;
                    const v3018 = `${ v3017 }: ClamAV has been scanning for ${ _av_scan_time } seconds...`;
                    const v3019 = console.log(v3018);
                    v3019;
                }
            };
            _av_waiting = setInterval(v3020, 1000);
        }
        const v3021 = this._clamav_socket;
        const v3022 = this._clamav_socket;
        const v3023 = v3022.writable;
        const v3024 = v3023 === true;
        const v3025 = v3021 && v3024;
        if (v3025) {
            const size = Buffer.alloc(4);
            const v3026 = size.writeInt32BE(0, 0);
            v3026;
            const v3027 = this._clamav_socket;
            const v3028 = v3027.write(size, cb);
            v3028;
        }
    };
    const v3030 = {
        transform: v3007,
        flush: v3029
    };
    const v3031 = new Transform(v3030);
    return v3031;
};
NodeClam.passthrough = passthrough;
const scan_file = function scan_file(file, cb) {
    const v3032 = this.is_infected(file, cb);
    return v3032;
};
NodeClam.scan_file = scan_file;
const scan_files = function scan_files(files = [], end_cb = null, file_cb = null) {
    const self = this;
    let has_cb = false;
    const v3033 = typeof file_cb;
    const v3034 = v3033 !== 'function';
    const v3035 = file_cb && v3034;
    if (v3035) {
        const v3036 = new NodeClamError('Invalid file callback provided to `scan_files`. Third paramter, if provided, must be a function!');
        throw v3036;
    }
    const v3037 = typeof end_cb;
    const v3038 = v3037 !== 'function';
    const v3039 = end_cb && v3038;
    if (v3039) {
        const v3040 = new NodeClamError('Invalid end-scan callback provided to `scan_files`. Second paramter, if provided, must be a function!');
        throw v3040;
    } else {
        const v3041 = typeof end_cb;
        const v3042 = v3041 === 'function';
        const v3043 = end_cb && v3042;
        if (v3043) {
            has_cb = true;
        }
    }
    const v3044 = Array.isArray(files);
    const v3045 = files && v3044;
    const v3046 = files.length;
    const v3047 = v3046 > 1000000;
    const v3048 = v3045 && v3047;
    if (v3048) {
        const v3049 = files.length;
        const v3050 = { num_files: v3049 };
        const v3051 = new NodeClamError(v3050, 'NodeClam has haulted because more than 1 million files were about to be scanned. We suggest taking a different approach.');
        throw v3051;
    }
    const v3425 = async (resolve, reject) => {
        const errors = {};
        let bad_files = [];
        let good_files = [];
        let viruses = [];
        let orig_num_files = 0;
        const parse_stdout = (err, stdout) => {
            const v3052 = stdout.trim();
            const v3053 = String.fromCharCode(10);
            const v3054 = v3052.split(v3053);
            const v3059 = v => {
                const v3055 = /FOUND\n?$/.test(v);
                const v3056 = v.replace(/(.+):\s+(.+)FOUND\n?$/, '$2');
                const v3057 = v3056.trim();
                let v3058;
                if (v3055) {
                    v3058 = v3057;
                } else {
                    v3058 = null;
                }
                return v3058;
            };
            const v3060 = v3054.map(v3059);
            const v3063 = v => {
                const v3061 = !v;
                const v3062 = !v3061;
                return v3062;
            };
            let viruses = v3060.filter(v3063);
            const v3064 = stdout.trim();
            const v3065 = String.fromCharCode(10);
            const v3066 = v3064.split(v3065);
            const v3084 = result => {
                const v3067 = /^[-]+$/.test(result);
                if (v3067) {
                    return;
                }
                let path = result.match(/^(.*): /);
                const v3068 = path.length;
                const v3069 = v3068 > 0;
                const v3070 = path && v3069;
                if (v3070) {
                    path = path[1];
                } else {
                    path = '<Unknown File Path!>';
                }
                const v3071 = /\s+OK(\u0000|[\r\n])$/.test(result);
                if (v3071) {
                    const v3072 = self.settings;
                    const v3073 = v3072.debug_mode;
                    if (v3073) {
                        const v3074 = this.debug_label;
                        const v3075 = `${ v3074 }: ${ path } is OK!`;
                        const v3076 = console.log(v3075);
                        v3076;
                    }
                    const v3077 = good_files.push(path);
                    v3077;
                } else {
                    const v3078 = self.settings;
                    const v3079 = v3078.debug_mode;
                    if (v3079) {
                        const v3080 = this.debug_label;
                        const v3081 = `${ v3080 }: ${ path } is INFECTED!`;
                        const v3082 = console.log(v3081);
                        v3082;
                    }
                    const v3083 = bad_files.push(path);
                    v3083;
                }
            };
            const v3085 = v3066.forEach(v3084);
            v3085;
            const v3086 = new Set(bad_files);
            bad_files = Array.from(v3086);
            const v3087 = new Set(good_files);
            good_files = Array.from(v3087);
            const v3088 = new Set(viruses);
            viruses = Array.from(v3088);
            if (err) {
                const v3089 = [];
                const v3090 = {};
                const v3091 = [];
                const v3092 = end_cb(err, v3089, bad_files, v3090, v3091);
                const v3093 = { bad_files };
                const v3094 = new NodeClamError(v3093, err);
                const v3095 = reject(v3094);
                let v3096;
                if (has_cb) {
                    v3096 = v3092;
                } else {
                    v3096 = v3095;
                }
                return v3096;
            }
            const v3097 = {};
            const v3098 = end_cb(null, good_files, bad_files, v3097, viruses);
            const v3099 = {
                good_files,
                bad_files,
                viruses,
                errors: null
            };
            const v3100 = resolve(v3099);
            let v3101;
            if (has_cb) {
                v3101 = v3098;
            } else {
                v3101 = v3100;
            }
            return v3101;
        };
        const local_scan = async () => {
            const v3103 = file => {
                const v3102 = file.replace(/ /g, '\\ ');
                return v3102;
            };
            const items = files.map(v3103);
            const v3104 = self.settings;
            const v3105 = self.scanner;
            const v3106 = v3104[v3105];
            const v3107 = v3106.path;
            const v3108 = self._build_clam_args(items);
            const v3109 = v3108.join(' ');
            const command = `${ v3107 } ${ v3109 }`;
            const v3110 = self.settings;
            const v3111 = v3110.debug_mode;
            if (v3111) {
                const v3112 = self.settings;
                const v3113 = v3112.debug_mode;
                if (v3113) {
                    const v3114 = self.debug_label;
                    const v3115 = `${ v3114 }: Configured clam command: ${ command }}`;
                    const v3116 = console.log(v3115);
                    v3116;
                }
            }
            const v3146 = (err, stdout, stderr) => {
                const v3117 = self.settings;
                const v3118 = v3117.debug_mode;
                if (v3118) {
                    const v3119 = this.debug_label;
                    const v3120 = `${ v3119 }: stdout:`;
                    const v3121 = console.log(v3120, stdout);
                    v3121;
                }
                if (err) {
                    const v3122 = parse_stdout(err, stdout);
                    return v3122;
                }
                if (stderr) {
                    const v3123 = self.settings;
                    const v3124 = v3123.debug_mode;
                    if (v3124) {
                        const v3125 = this.debug_label;
                        const v3126 = `${ v3125 }: `;
                        const v3127 = console.log(v3126, stderr);
                        v3127;
                    }
                    const v3128 = stderr.length;
                    const v3129 = v3128 > 0;
                    if (v3129) {
                        const v3130 = os.EOL;
                        const v3131 = stderr.split(v3130);
                        const v3141 = err_line => {
                            const match = err_line.match(/^ERROR: Can't access file (.*)+$/);
                            const v3132 = match !== null;
                            const v3133 = match.length;
                            const v3134 = v3133 > 1;
                            const v3135 = v3132 && v3134;
                            const v3136 = match[1];
                            const v3137 = typeof v3136;
                            const v3138 = v3137 === 'string';
                            const v3139 = v3135 && v3138;
                            if (v3139) {
                                const v3140 = match[1];
                                return v3140;
                            }
                            return '';
                        };
                        bad_files = v3131.map(v3141);
                        const v3144 = v => {
                            const v3142 = !v;
                            const v3143 = !v3142;
                            return v3143;
                        };
                        bad_files = bad_files.filter(v3144);
                    }
                }
                const v3145 = parse_stdout(null, stdout);
                return v3145;
            };
            const v3147 = execFile(command, v3146);
            v3147;
        };
        const do_scan = async files => {
            const num_files = files.length;
            const v3148 = self.settings;
            const v3149 = v3148.debug_mode;
            if (v3149) {
                const v3150 = this.debug_label;
                const v3151 = `${ v3150 }: Scanning a list of ${ num_files } passed files.`;
                const v3152 = console.log(v3151);
                v3152;
            }
            const v3153 = typeof file_cb;
            const v3154 = v3153 === 'function';
            const v3155 = file_cb && v3154;
            if (v3155) {
                const chunk_size = 10;
                let results = [];
                const v3156 = files.length;
                let v3157 = v3156 > 0;
                while (v3157) {
                    let chunk = [];
                    const v3158 = files.length;
                    const v3159 = v3158 > chunk_size;
                    if (v3159) {
                        chunk = files.splice(0, chunk_size);
                    } else {
                        chunk = files.splice(0);
                    }
                    const v3163 = file => {
                        const v3160 = this.is_infected(file);
                        const v3161 = e => {
                            return e;
                        };
                        const v3162 = v3160.catch(v3161);
                        return v3162;
                    };
                    const v3164 = chunk.map(v3163);
                    const chunk_results = await Promise.all(v3164);
                    const v3167 = (v, i) => {
                        const v3165 = chunk[i];
                        const v3166 = [
                            v3165,
                            v
                        ];
                        return v3166;
                    };
                    const chunk_results_mapped = chunk_results.map(v3167);
                    const v3171 = v => {
                        const v3168 = v[0];
                        const v3169 = v[1];
                        const v3170 = file_cb(null, v3168, v3169);
                        return v3170;
                    };
                    const v3172 = chunk_results_mapped.forEach(v3171);
                    v3172;
                    results = results.concat(chunk_results_mapped);
                    v3157 = v3156 > 0;
                }
                const v3185 = v => {
                    const v3173 = v[1];
                    const v3174 = v3173 === true;
                    if (v3174) {
                        const v3175 = v[0];
                        const v3176 = bad_files.push(v3175);
                        v3176;
                    } else {
                        const v3177 = v[1];
                        const v3178 = v3177 === false;
                        if (v3178) {
                            const v3179 = v[0];
                            const v3180 = good_files.push(v3179);
                            v3180;
                        } else {
                            const v3181 = v[1];
                            const v3182 = v3181 instanceof Error;
                            if (v3182) {
                                const v3183 = v[0];
                                const v3184 = v[1];
                                errors[v3183] = v3184;
                            }
                        }
                    }
                };
                const v3186 = results.forEach(v3185);
                v3186;
                const v3187 = results.length;
                const v3188 = num_files !== v3187;
                if (v3188) {
                    const err_msg = 'The number of results did not match the number of files to scan!';
                    const v3189 = new NodeClamError(err_msg);
                    const v3190 = {};
                    const v3191 = [];
                    const v3192 = end_cb(v3189, good_files, bad_files, v3190, v3191);
                    const v3193 = {
                        good_files,
                        bad_files
                    };
                    const v3194 = new NodeClamError(v3193, err_msg);
                    const v3195 = reject(v3194);
                    let v3196;
                    if (has_cb) {
                        v3196 = v3192;
                    } else {
                        v3196 = v3195;
                    }
                    return v3196;
                }
                const v3197 = new Set(bad_files);
                bad_files = Array.from(v3197);
                const v3198 = new Set(good_files);
                good_files = Array.from(v3198);
                const v3199 = self.settings;
                const v3200 = v3199.debug_mode;
                if (v3200) {
                    const v3201 = self.debug_label;
                    const v3202 = `${ v3201 }: Scan Complete!`;
                    const v3203 = console.log(v3202);
                    v3203;
                    const v3204 = self.debug_label;
                    const v3205 = `${ v3204 }: Num Bad Files: `;
                    const v3206 = bad_files.length;
                    const v3207 = console.log(v3205, v3206);
                    v3207;
                    const v3208 = self.debug_label;
                    const v3209 = `${ v3208 }: Num Good Files: `;
                    const v3210 = good_files.length;
                    const v3211 = console.log(v3209, v3210);
                    v3211;
                }
                const v3212 = {};
                const v3213 = [];
                const v3214 = end_cb(null, good_files, bad_files, v3212, v3213);
                const v3215 = [];
                const v3216 = {
                    good_files,
                    bad_files,
                    errors: null,
                    viruses: v3215
                };
                const v3217 = resolve(v3216);
                let v3218;
                if (has_cb) {
                    v3218 = v3214;
                } else {
                    v3218 = v3217;
                }
                return v3218;
            } else {
                let all_files = [];
                const finish_scan = async () => {
                    const v3221 = v => {
                        const v3219 = !v;
                        const v3220 = !v3219;
                        return v3220;
                    };
                    const v3222 = all_files.filter(v3221);
                    const v3223 = new Set(v3222);
                    const v3224 = Array.from(v3223);
                    const v3227 = v => {
                        const v3225 = typeof v;
                        const v3226 = v3225 === 'string';
                        return v3226;
                    };
                    all_files = v3224.filter(v3227);
                    const v3228 = all_files.length;
                    const v3229 = v3228 <= 0;
                    if (v3229) {
                        const err = new NodeClamError('No valid files provided to scan!');
                        const v3230 = [];
                        const v3231 = [];
                        const v3232 = {};
                        const v3233 = [];
                        const v3234 = end_cb(err, v3230, v3231, v3232, v3233);
                        const v3235 = reject(err);
                        let v3236;
                        if (has_cb) {
                            v3236 = v3234;
                        } else {
                            v3236 = v3235;
                        }
                        return v3236;
                    }
                    const v3237 = self.settings;
                    const v3238 = v3237.clamdscan;
                    const v3239 = v3238.socket;
                    const v3240 = self.settings;
                    const v3241 = v3240.clamdscan;
                    const v3242 = v3241.port;
                    const v3243 = v3239 || v3242;
                    if (v3243) {
                        const chunk_size = 10;
                        let results = [];
                        const v3244 = all_files.length;
                        let v3245 = v3244 > 0;
                        while (v3245) {
                            let chunk = [];
                            const v3246 = all_files.length;
                            const v3247 = v3246 > chunk_size;
                            if (v3247) {
                                chunk = all_files.splice(0, chunk_size);
                            } else {
                                chunk = all_files.splice(0);
                            }
                            const v3251 = file => {
                                const v3248 = self.is_infected(file);
                                const v3249 = e => {
                                    return e;
                                };
                                const v3250 = v3248.catch(v3249);
                                return v3250;
                            };
                            const v3252 = chunk.map(v3251);
                            const chunk_results = await Promise.all(v3252);
                            const v3255 = (v, i) => {
                                const v3253 = chunk[i];
                                const v3254 = [
                                    v3253,
                                    v
                                ];
                                return v3254;
                            };
                            const chunk_results_mapped = chunk_results.map(v3255);
                            results = results.concat(chunk_results_mapped);
                            v3245 = v3244 > 0;
                        }
                        const v3299 = v => {
                            const v3256 = v[1];
                            const v3257 = v3256 instanceof Error;
                            if (v3257) {
                                const v3258 = v[0];
                                const v3259 = v[1];
                                errors[v3258] = v3259;
                            } else {
                                const v3260 = v[1];
                                const v3261 = typeof v3260;
                                const v3262 = v3261 === 'object';
                                const v3263 = v[1];
                                const v3264 = 'is_infected' in v3263;
                                const v3265 = v3262 && v3264;
                                const v3266 = v[1];
                                const v3267 = v3266.is_infected;
                                const v3268 = v3267 === true;
                                const v3269 = v3265 && v3268;
                                if (v3269) {
                                    const v3270 = v[1];
                                    const v3271 = v3270.file;
                                    const v3272 = bad_files.push(v3271);
                                    v3272;
                                    const v3273 = v[1];
                                    const v3274 = 'viruses' in v3273;
                                    const v3275 = v[1];
                                    const v3276 = v3275.viruses;
                                    const v3277 = Array.isArray(v3276);
                                    const v3278 = v3274 && v3277;
                                    const v3279 = v[1];
                                    const v3280 = v3279.viruses;
                                    const v3281 = v3280.length;
                                    const v3282 = v3281 > 0;
                                    const v3283 = v3278 && v3282;
                                    if (v3283) {
                                        const v3284 = v[1];
                                        const v3285 = v3284.viruses;
                                        viruses = viruses.concat(v3285);
                                    }
                                } else {
                                    const v3286 = v[1];
                                    const v3287 = typeof v3286;
                                    const v3288 = v3287 === 'object';
                                    const v3289 = v[1];
                                    const v3290 = 'is_infected' in v3289;
                                    const v3291 = v3288 && v3290;
                                    const v3292 = v[1];
                                    const v3293 = v3292.is_infected;
                                    const v3294 = v3293 === false;
                                    const v3295 = v3291 && v3294;
                                    if (v3295) {
                                        const v3296 = v[1];
                                        const v3297 = v3296.file;
                                        const v3298 = good_files.push(v3297);
                                        v3298;
                                    }
                                }
                            }
                        };
                        const v3300 = results.forEach(v3299);
                        v3300;
                        const v3301 = new Set(bad_files);
                        bad_files = Array.from(v3301);
                        const v3302 = new Set(good_files);
                        good_files = Array.from(v3302);
                        const v3303 = new Set(viruses);
                        viruses = Array.from(v3303);
                        const v3304 = self.settings;
                        const v3305 = v3304.debug_mode;
                        if (v3305) {
                            const v3306 = self.debug_label;
                            const v3307 = `${ v3306 }: Scan Complete!`;
                            const v3308 = console.log(v3307);
                            v3308;
                            const v3309 = self.debug_label;
                            const v3310 = `${ v3309 }: Num Bad Files: `;
                            const v3311 = bad_files.length;
                            const v3312 = console.log(v3310, v3311);
                            v3312;
                            const v3313 = self.debug_label;
                            const v3314 = `${ v3313 }: Num Good Files: `;
                            const v3315 = good_files.length;
                            const v3316 = console.log(v3314, v3315);
                            v3316;
                            const v3317 = self.debug_label;
                            const v3318 = `${ v3317 }: Num Viruses: `;
                            const v3319 = viruses.length;
                            const v3320 = console.log(v3318, v3319);
                            v3320;
                        }
                        const v3321 = end_cb(null, good_files, bad_files, errors, viruses);
                        const v3322 = {
                            errors,
                            good_files,
                            bad_files,
                            viruses
                        };
                        const v3323 = resolve(v3322);
                        let v3324;
                        if (has_cb) {
                            v3324 = v3321;
                        } else {
                            v3324 = v3323;
                        }
                        return v3324;
                    } else {
                        const v3325 = local_scan();
                        return v3325;
                    }
                };
                const v3326 = this.scan_recursively;
                const v3327 = v3326 === false;
                const v3328 = this.scanner;
                const v3329 = v3328 === 'clamdscan';
                const v3330 = v3327 && v3329;
                if (v3330) {
                    const chunk_size = 10;
                    const v3331 = files.length;
                    let v3332 = v3331 > 0;
                    while (v3332) {
                        let chunk = [];
                        const v3333 = files.length;
                        const v3334 = v3333 > chunk_size;
                        if (v3334) {
                            chunk = files.splice(0, chunk_size);
                        } else {
                            chunk = files.splice(0);
                        }
                        const v3338 = file => {
                            const v3335 = fs_stat(file);
                            const v3336 = e => {
                                return e;
                            };
                            const v3337 = v3335.catch(v3336);
                            return v3337;
                        };
                        const v3339 = chunk.map(v3338);
                        const chunk_results = await Promise.all(v3339);
                        let i;
                        for (i in chunk_results) {
                            const v = chunk_results[i];
                            const v3340 = v instanceof Error;
                            if (v3340) {
                                const v3341 = chunk[i];
                                errors[v3341] = v;
                            } else {
                                const v3342 = v.isFile();
                                if (v3342) {
                                    const v3343 = chunk[i];
                                    const v3344 = all_files.push(v3343);
                                    v3344;
                                } else {
                                    const v3345 = v.isDirectory();
                                    if (v3345) {
                                        const rgx = new RegExp(`^(?!${ v })(.+)$`);
                                        try {
                                            const v3346 = chunk[i];
                                            const v3347 = { withFileTypes: true };
                                            const v3349 = x => {
                                                const v3348 = x.isFile();
                                                return v3348;
                                            };
                                            const v3350 = (await fs_readdir(v3346, v3347)).filter(v3349);
                                            const v3355 = x => {
                                                const v3351 = x.name;
                                                const v3352 = x.name;
                                                const v3353 = `${ v }/${ v3352 }`;
                                                const v3354 = v3351.replace(rgx, v3353);
                                                return v3354;
                                            };
                                            const contents = v3350.map(v3355);
                                            all_files = all_files.concat(contents);
                                        } catch (e) {
                                            const v3356 = chunk[i];
                                            errors[v3356] = e;
                                        }
                                    }
                                }
                            }
                        }
                        const v3357 = finish_scan();
                        return v3357;
                        v3332 = v3331 > 0;
                    }
                } else {
                    all_files = files;
                    const v3358 = finish_scan();
                    return v3358;
                }
            }
        };
        const v3359 = typeof files;
        const v3360 = v3359 === 'string';
        const v3361 = files.trim();
        const v3362 = v3361.length;
        const v3363 = v3362 > 0;
        const v3364 = v3360 && v3363;
        if (v3364) {
            const v3365 = files.trim();
            const v3366 = v3365.split(',');
            const v3368 = v => {
                const v3367 = v.trim();
                return v3367;
            };
            files = v3366.map(v3368);
        }
        const v3369 = Array.isArray(files);
        if (v3369) {
            orig_num_files = files.length;
            const v3372 = v => {
                const v3370 = !v;
                const v3371 = !v3370;
                return v3371;
            };
            const v3373 = files.filter(v3372);
            const v3376 = v => {
                const v3374 = typeof v;
                const v3375 = v3374 === 'string';
                return v3375;
            };
            files = v3373.filter(v3376);
            const v3377 = files.length;
            const v3378 = v3377 < orig_num_files;
            if (v3378) {
                const v3379 = files.length;
                const v3380 = {
                    num_files: v3379,
                    orig_num_files
                };
                const err = new NodeClamError(v3380, 'You\'ve specified at least one invalid item to the files list (first parameter) of the `scan_files` method.');
                const v3381 = [];
                const v3382 = [];
                const v3383 = {};
                const v3384 = [];
                const v3385 = end_cb(err, v3381, v3382, v3383, v3384);
                const v3386 = reject(err);
                let v3387;
                if (has_cb) {
                    v3387 = v3385;
                } else {
                    v3387 = v3386;
                }
                return v3387;
            }
        }
        const v3388 = Array.isArray(files);
        const v3389 = !v3388;
        const v3390 = files.length;
        const v3391 = v3390 <= 0;
        const v3392 = v3389 || v3391;
        if (v3392) {
            const v3393 = this.settings;
            const v3394 = 'file_list' in v3393;
            const v3395 = !v3394;
            const v3396 = this.settings;
            const v3397 = v3396.file_list;
            const v3398 = !v3397;
            const v3399 = v3395 || v3398;
            if (v3399) {
                const v3400 = this.settings;
                const v3401 = {
                    files,
                    settings: v3400
                };
                const err = new NodeClamError(v3401, 'No files provided to scan and no file list provided!');
                const v3402 = [];
                const v3403 = [];
                const v3404 = {};
                const v3405 = [];
                const v3406 = end_cb(err, v3402, v3403, v3404, v3405);
                const v3407 = reject(err);
                let v3408;
                if (has_cb) {
                    v3408 = v3406;
                } else {
                    v3408 = v3407;
                }
                return v3408;
            }
            try {
                const v3409 = this.settings;
                const v3410 = v3409.file_list;
                const v3411 = (await fs_readfile(v3410)).toString();
                const v3412 = os.EOL;
                const data = v3411.split(v3412);
                const v3413 = do_scan(data);
                return v3413;
            } catch (e) {
                const v3414 = this.settings;
                const v3415 = v3414.file_list;
                const v3416 = {
                    err: e,
                    file_list: v3415
                };
                const err = new NodeClamError(v3416, `No files provided and file list was provided but could not be found! ${ e }`);
                const v3417 = [];
                const v3418 = [];
                const v3419 = {};
                const v3420 = [];
                const v3421 = end_cb(err, v3417, v3418, v3419, v3420);
                const v3422 = reject(err);
                let v3423;
                if (has_cb) {
                    v3423 = v3421;
                } else {
                    v3423 = v3422;
                }
                return v3423;
            }
        } else {
            const v3424 = do_scan(files);
            return v3424;
        }
    };
    const v3426 = new Promise(v3425);
    return v3426;
};
NodeClam.scan_files = scan_files;
const scan_dir = function scan_dir(path = '', end_cb = null, file_cb = null) {
    const self = this;
    let has_cb = false;
    const v3427 = typeof end_cb;
    const v3428 = v3427 !== 'function';
    const v3429 = end_cb && v3428;
    if (v3429) {
        const v3430 = new NodeClamError('Invalid end-scan callback provided to `scan_dir`. Second paramter, if provided, must be a function!');
        throw v3430;
    } else {
        const v3431 = typeof end_cb;
        const v3432 = v3431 === 'function';
        const v3433 = end_cb && v3432;
        if (v3433) {
            has_cb = true;
        }
    }
    const v3674 = async (resolve, reject) => {
        const v3434 = typeof path;
        const v3435 = v3434 !== 'string';
        const v3436 = typeof path;
        const v3437 = v3436 === 'string';
        const v3438 = path.trim();
        const v3439 = v3438 === '';
        const v3440 = v3437 && v3439;
        const v3441 = v3435 || v3440;
        if (v3441) {
            const v3442 = { path };
            const err = new NodeClamError(v3442, 'Invalid path provided! Path must be a string!');
            const v3443 = [];
            const v3444 = [];
            const v3445 = end_cb(err, v3443, v3444);
            const v3446 = reject(err);
            let v3447;
            if (has_cb) {
                v3447 = v3445;
            } else {
                v3447 = v3446;
            }
            return v3447;
        }
        const v3448 = node_path.normalize(path);
        path = v3448.replace(/\/$/, '');
        try {
            const v3449 = fs.constants;
            const v3450 = v3449.R_OK;
            await fs_access(path, v3450);
        } catch (e) {
            const v3451 = {
                path,
                err: e
            };
            const err = new NodeClamError(v3451, 'Invalid path specified to scan!');
            const v3452 = [];
            const v3453 = [];
            const v3454 = end_cb(err, v3452, v3453);
            const v3455 = reject(err);
            let v3456;
            if (has_cb) {
                v3456 = v3454;
            } else {
                v3456 = v3455;
            }
            return v3456;
        }
        const local_scan = () => {
            const v3457 = self.settings;
            const v3458 = self.scanner;
            const v3459 = v3457[v3458];
            const v3460 = v3459.path;
            const v3461 = self._build_clam_args(path);
            const v3504 = (err, stdout, stderr) => {
                const v3462 = self._process_result(stdout, path);
                const is_infected = v3462.is_infected;
                const viruses = v3462.viruses;
                if (err) {
                    const v3463 = Object.prototype;
                    const v3464 = v3463.hasOwnProperty;
                    const v3465 = v3464.call(err, 'code');
                    const v3466 = err.code;
                    const v3467 = v3466 === 1;
                    const v3468 = v3465 && v3467;
                    if (v3468) {
                        const v3469 = [];
                        const v3470 = [path];
                        const v3471 = end_cb(null, v3469, v3470, viruses);
                        const v3472 = [path];
                        const v3473 = [];
                        const v3474 = {
                            path,
                            is_infected,
                            bad_files: v3472,
                            good_files: v3473,
                            viruses
                        };
                        const v3475 = resolve(v3474);
                        let v3476;
                        if (has_cb) {
                            v3476 = v3471;
                        } else {
                            v3476 = v3475;
                        }
                        return v3476;
                    } else {
                        const v3477 = {
                            path,
                            err
                        };
                        const error = new NodeClamError(v3477, 'There was an error scanning the path or processing the result.');
                        const v3478 = [];
                        const v3479 = [];
                        const v3480 = [];
                        const v3481 = end_cb(error, v3478, v3479, v3480);
                        const v3482 = reject(error);
                        let v3483;
                        if (has_cb) {
                            v3483 = v3481;
                        } else {
                            v3483 = v3482;
                        }
                        return v3483;
                    }
                }
                if (stderr) {
                    const v3484 = self.debug_label;
                    const v3485 = `${ v3484 } error: `;
                    const v3486 = console.error(v3485, stderr);
                    v3486;
                    const v3487 = [];
                    const v3488 = [];
                    const v3489 = [];
                    const v3490 = end_cb(null, v3487, v3488, v3489);
                    const v3491 = [];
                    const v3492 = [];
                    const v3493 = {
                        stderr,
                        path,
                        is_infected,
                        good_files: v3491,
                        bad_files: v3492,
                        viruses
                    };
                    const v3494 = resolve(v3493);
                    let v3495;
                    if (has_cb) {
                        v3495 = v3490;
                    } else {
                        v3495 = v3494;
                    }
                    return v3495;
                }
                let good_files;
                const v3496 = [];
                const v3497 = [path];
                if (is_infected) {
                    good_files = v3496;
                } else {
                    good_files = v3497;
                }
                let bad_files;
                const v3498 = [path];
                const v3499 = [];
                if (is_infected) {
                    bad_files = v3498;
                } else {
                    bad_files = v3499;
                }
                const v3500 = end_cb(null, good_files, bad_files, viruses);
                const v3501 = {
                    path,
                    is_infected,
                    good_files,
                    bad_files,
                    viruses
                };
                const v3502 = resolve(v3501);
                let v3503;
                if (has_cb) {
                    v3503 = v3500;
                } else {
                    v3503 = v3502;
                }
                return v3503;
            };
            const v3505 = execFile(v3460, v3461, v3504);
            v3505;
        };
        const v3506 = this.settings;
        const v3507 = v3506.scan_recursively;
        const v3508 = v3507 === true;
        const v3509 = typeof file_cb;
        const v3510 = v3509 === 'function';
        const v3511 = !has_cb;
        const v3512 = v3510 || v3511;
        const v3513 = v3508 && v3512;
        if (v3513) {
            try {
                const v3515 = [path];
                const v3514 = await cp_execfile('find', v3515);
                const stdout = v3514.stdout;
                const stderr = v3514.stderr;
                if (stderr) {
                    const v3516 = this.settings;
                    const v3517 = v3516.debug_mode;
                    if (v3517) {
                        const v3518 = this.debug_label;
                        const v3519 = `${ v3518 }: `;
                        const v3520 = console.log(v3519, stderr);
                        v3520;
                    }
                    const v3521 = [];
                    const v3522 = [];
                    const v3523 = end_cb(null, v3521, v3522);
                    const v3524 = [];
                    const v3525 = [];
                    const v3526 = [];
                    const v3527 = {
                        stderr,
                        path,
                        is_infected: null,
                        good_files: v3524,
                        bad_files: v3525,
                        viruses: v3526
                    };
                    const v3528 = resolve(v3527);
                    let v3529;
                    if (has_cb) {
                        v3529 = v3523;
                    } else {
                        v3529 = v3528;
                    }
                    return v3529;
                }
                const v3530 = stdout.trim();
                const v3531 = os.EOL;
                const v3532 = v3530.split(v3531);
                const v3535 = path => {
                    const v3533 = path.replace(/ /g, '\\ ');
                    const v3534 = v3533.trim();
                    return v3534;
                };
                const files = v3532.map(v3535);
                const v3536 = this.scan_files(files, end_cb, file_cb);
                return v3536;
            } catch (e) {
                const v3537 = {
                    path,
                    err: e
                };
                const err = new NodeClamError(v3537, 'There was an issue scanning the path specified!');
                const v3538 = [];
                const v3539 = [];
                const v3540 = end_cb(err, v3538, v3539);
                const v3541 = reject(err);
                let v3542;
                if (has_cb) {
                    v3542 = v3540;
                } else {
                    v3542 = v3541;
                }
                return v3542;
            }
        } else {
            const v3543 = this.settings;
            const v3544 = v3543.scan_recursively;
            const v3545 = v3544 === false;
            const v3546 = this.scanner;
            const v3547 = v3546 === 'clamdscan';
            const v3548 = v3545 && v3547;
            if (v3548) {
                try {
                    const v3550 = async file => {
                        const v3549 = (await fs_stat(file)).isFile();
                        return v3549;
                    };
                    const all_files = (await fs_readdir(path)).filter(v3550);
                    const v3551 = this.scan_files(all_files, end_cb, file_cb);
                    return v3551;
                } catch (e) {
                    const v3552 = {
                        path,
                        err: e
                    };
                    const err = new NodeClamError(v3552, 'Could not read the file listing of the path provided.');
                    const v3553 = [];
                    const v3554 = [];
                    const v3555 = end_cb(err, v3553, v3554);
                    const v3556 = reject(err);
                    let v3557;
                    if (has_cb) {
                        v3557 = v3555;
                    } else {
                        v3557 = v3556;
                    }
                    return v3557;
                }
            } else {
                const v3558 = typeof file_cb;
                const v3559 = v3558 !== 'function';
                const v3560 = !has_cb;
                const v3561 = v3559 || v3560;
                if (v3561) {
                    const v3562 = this.settings;
                    const v3563 = v3562.clamdscan;
                    const v3564 = v3563.socket;
                    const v3565 = this.settings;
                    const v3566 = v3565.clamdscan;
                    const v3567 = v3566.port;
                    const v3568 = this._is_localhost();
                    const v3569 = v3567 && v3568;
                    const v3570 = v3564 || v3569;
                    if (v3570) {
                        try {
                            const client = await this._init_socket();
                            const v3571 = this.settings;
                            const v3572 = v3571.debug_mode;
                            if (v3572) {
                                const v3573 = this.debug_label;
                                const v3574 = `${ v3573 }: scanning path with local domain socket now.`;
                                const v3575 = console.log(v3574);
                                v3575;
                            }
                            const v3576 = this.settings;
                            const v3577 = v3576.clamdscan;
                            const v3578 = v3577.multiscan;
                            const v3579 = v3578 === true;
                            if (v3579) {
                                const v3580 = `MULTISCAN ${ path }`;
                                const v3581 = client.write(v3580);
                                v3581;
                            } else {
                                const v3582 = `SCAN ${ path }`;
                                const v3583 = client.write(v3582);
                                v3583;
                            }
                            const chunks = [];
                            const v3585 = chunk => {
                                const v3584 = chunks.push(chunk);
                                v3584;
                            };
                            const v3586 = client.on('data', v3585);
                            const v3614 = async () => {
                                const v3587 = this.settings;
                                const v3588 = v3587.debug_mode;
                                if (v3588) {
                                    const v3589 = this.debug_label;
                                    const v3590 = `${ v3589 }: Received response from remote clamd service.`;
                                    const v3591 = console.log(v3590);
                                    v3591;
                                }
                                const response = Buffer.concat(chunks);
                                const v3592 = response.toString();
                                const result = this._process_result(v3592, path);
                                const v3593 = result instanceof Error;
                                if (v3593) {
                                    const v3594 = this.settings;
                                    const v3595 = v3594.clamdscan;
                                    const v3596 = v3595.local_fallback;
                                    const v3597 = v3596 === true;
                                    if (v3597) {
                                        const v3598 = local_scan();
                                        return v3598;
                                    }
                                    const v3599 = {
                                        path,
                                        err: result
                                    };
                                    const err = new NodeClamError(v3599, 'There was an issue scanning the path provided.');
                                    const v3600 = [];
                                    const v3601 = [];
                                    const v3602 = end_cb(err, v3600, v3601);
                                    const v3603 = reject(err);
                                    let v3604;
                                    if (has_cb) {
                                        v3604 = v3602;
                                    } else {
                                        v3604 = v3603;
                                    }
                                    return v3604;
                                }
                                const v3605 = result;
                                const is_infected = v3605.is_infected;
                                const viruses = v3605.viruses;
                                let good_files;
                                const v3606 = [];
                                const v3607 = [path];
                                if (is_infected) {
                                    good_files = v3606;
                                } else {
                                    good_files = v3607;
                                }
                                let bad_files;
                                const v3608 = [path];
                                const v3609 = [];
                                if (is_infected) {
                                    bad_files = v3608;
                                } else {
                                    bad_files = v3609;
                                }
                                const v3610 = end_cb(null, good_files, bad_files, viruses);
                                const v3611 = {
                                    path,
                                    is_infected,
                                    good_files,
                                    bad_files,
                                    viruses
                                };
                                const v3612 = resolve(v3611);
                                let v3613;
                                if (has_cb) {
                                    v3613 = v3610;
                                } else {
                                    v3613 = v3612;
                                }
                                return v3613;
                            };
                            const v3615 = v3586.on('end', v3614);
                            v3615;
                        } catch (e) {
                            const v3616 = {
                                path,
                                err: e
                            };
                            const err = new NodeClamError(v3616, 'There was an issue scanning the path provided.');
                            const v3617 = [];
                            const v3618 = [];
                            const v3619 = end_cb(err, v3617, v3618);
                            const v3620 = reject(err);
                            let v3621;
                            if (has_cb) {
                                v3621 = v3619;
                            } else {
                                v3621 = v3620;
                            }
                            return v3621;
                        }
                    } else {
                        const v3622 = this.settings;
                        const v3623 = v3622.clamdscan;
                        const v3624 = v3623.port;
                        const v3625 = this._is_localhost();
                        const v3626 = !v3625;
                        const v3627 = v3624 && v3626;
                        if (v3627) {
                            const results = [];
                            try {
                                const v3629 = [path];
                                const v3628 = await cp_execfile('find', v3629);
                                const stdout = v3628.stdout;
                                const stderr = v3628.stderr;
                                if (stderr) {
                                    const v3630 = this.settings;
                                    const v3631 = v3630.debug_mode;
                                    if (v3631) {
                                        const v3632 = this.debug_label;
                                        const v3633 = `${ v3632 }: `;
                                        const v3634 = console.log(v3633, stderr);
                                        v3634;
                                    }
                                    const v3635 = [];
                                    const v3636 = [];
                                    const v3637 = end_cb(null, v3635, v3636);
                                    const v3638 = [];
                                    const v3639 = [];
                                    const v3640 = [];
                                    const v3641 = {
                                        stderr,
                                        path,
                                        is_infected,
                                        good_files: v3638,
                                        bad_files: v3639,
                                        viruses: v3640
                                    };
                                    const v3642 = resolve(v3641);
                                    let v3643;
                                    if (has_cb) {
                                        v3643 = v3637;
                                    } else {
                                        v3643 = v3642;
                                    }
                                    return v3643;
                                }
                                const v3644 = stdout.split('\n');
                                const v3646 = path => {
                                    const v3645 = path.replace(/ /g, '\\ ');
                                    return v3645;
                                };
                                const files = v3644.map(v3646);
                                const chunk_size = 10;
                                const v3647 = files.length;
                                let v3648 = v3647 > 0;
                                while (v3648) {
                                    let chunk = [];
                                    const v3649 = files.length;
                                    const v3650 = v3649 > chunk_size;
                                    if (v3650) {
                                        chunk = files.splice(0, chunk_size);
                                    } else {
                                        chunk = files.splice(0);
                                    }
                                    const v3653 = file => {
                                        const v3651 = fs.createReadStream(file);
                                        const v3652 = this.scan_stream(v3651);
                                        return v3652;
                                    };
                                    const v3654 = chunk.map(v3653);
                                    const v3655 = results.concat(await Promise.all(v3654));
                                    v3655;
                                    v3648 = v3647 > 0;
                                }
                                const v3657 = v => {
                                    const v3656 = v === false;
                                    return v3656;
                                };
                                const is_infected = results.any(v3657);
                                let good_files;
                                const v3658 = [];
                                const v3659 = [path];
                                if (is_infected) {
                                    good_files = v3658;
                                } else {
                                    good_files = v3659;
                                }
                                let bad_files;
                                const v3660 = [path];
                                const v3661 = [];
                                if (is_infected) {
                                    bad_files = v3660;
                                } else {
                                    bad_files = v3661;
                                }
                                const v3662 = end_cb(null, good_files, bad_files);
                                const v3663 = [];
                                const v3664 = {
                                    path,
                                    is_infected,
                                    good_files,
                                    bad_files,
                                    viruses: v3663
                                };
                                const v3665 = resolve(v3664);
                                let v3666;
                                if (has_cb) {
                                    v3666 = v3662;
                                } else {
                                    v3666 = v3665;
                                }
                                return v3666;
                            } catch (e) {
                                const v3667 = {
                                    path,
                                    err: e
                                };
                                const err = new NodeClamError(v3667, 'Invalid path provided! Path must be a string!');
                                const v3668 = [];
                                const v3669 = [];
                                const v3670 = end_cb(err, v3668, v3669);
                                const v3671 = reject(err);
                                let v3672;
                                if (has_cb) {
                                    v3672 = v3670;
                                } else {
                                    v3672 = v3671;
                                }
                                return v3672;
                            }
                        } else {
                            const v3673 = local_scan();
                            v3673;
                        }
                    }
                }
            }
        }
    };
    const v3675 = new Promise(v3674);
    return v3675;
};
NodeClam.scan_dir = scan_dir;
const scan_stream = function scan_stream(stream, cb) {
    let has_cb = false;
    const v3676 = typeof cb;
    const v3677 = v3676 !== 'function';
    const v3678 = cb && v3677;
    if (v3678) {
        const v3679 = new NodeClamError('Invalid cb provided to scan_stream. Second paramter must be a function!');
        throw v3679;
    }
    const v3680 = typeof cb;
    const v3681 = v3680 === 'function';
    const v3682 = cb && v3681;
    if (v3682) {
        has_cb = true;
    }
    const v3789 = async (resolve, reject) => {
        let finished = false;
        const v3683 = this._is_readable_stream(stream);
        const v3684 = !v3683;
        if (v3684) {
            const v3685 = { stream };
            const err = new NodeClamError(v3685, 'Invalid stream provided to scan.');
            const v3686 = cb(err, null);
            const v3687 = reject(err);
            let v3688;
            if (has_cb) {
                v3688 = v3686;
            } else {
                v3688 = v3687;
            }
            return v3688;
        } else {
            const v3689 = this.settings;
            const v3690 = v3689.debug_mode;
            if (v3690) {
                const v3691 = this.debug_label;
                const v3692 = `${ v3691 }: Provided stream is readable.`;
                const v3693 = console.log(v3692);
                v3693;
            }
        }
        const v3694 = this.settings;
        const v3695 = v3694.clamdscan;
        const v3696 = v3695.socket;
        const v3697 = !v3696;
        const v3698 = this.settings;
        const v3699 = v3698.clamdscan;
        const v3700 = v3699.port;
        const v3701 = !v3700;
        const v3702 = this.settings;
        const v3703 = v3702.clamdscan;
        const v3704 = v3703.host;
        const v3705 = !v3704;
        const v3706 = v3701 || v3705;
        const v3707 = v3697 && v3706;
        if (v3707) {
            const v3708 = this.settings;
            const v3709 = v3708.clamdscan;
            const v3710 = { clamdscan_settings: v3709 };
            const err = new NodeClamError(v3710, 'Invalid information provided to connect to clamav service. A unix socket or port (+ optional host) is required!');
            const v3711 = cb(err, null);
            const v3712 = reject(err);
            let v3713;
            if (has_cb) {
                v3713 = v3711;
            } else {
                v3713 = v3712;
            }
            return v3713;
        }
        try {
            const v3714 = {};
            const v3715 = this.settings;
            const v3716 = v3715.debug_mode;
            const transform = new NodeClamTransform(v3714, v3716);
            const socket = await this._init_socket();
            const v3717 = stream.pipe(transform);
            const v3718 = v3717.pipe(socket);
            v3718;
            const v3725 = () => {
                const v3719 = this.settings;
                const v3720 = v3719.debug_mode;
                if (v3720) {
                    const v3721 = this.debug_label;
                    const v3722 = `${ v3721 }: The input stream has dried up.`;
                    const v3723 = console.log(v3722);
                    v3723;
                }
                finished = true;
                const v3724 = stream.destroy();
                v3724;
            };
            const v3726 = stream.on('end', v3725);
            const v3735 = err => {
                const v3727 = this.settings;
                const v3728 = v3727.debug_mode;
                if (v3728) {
                    const v3729 = this.debug_label;
                    const v3730 = `${ v3729 }: There was an error with the input stream (maybe uploader closed browser?).`;
                    const v3731 = console.log(v3730, err);
                    v3731;
                }
                const v3732 = cb(err, null);
                const v3733 = reject(err);
                let v3734;
                if (has_cb) {
                    v3734 = v3732;
                } else {
                    v3734 = v3733;
                }
                return v3734;
            };
            const v3736 = v3726.on('error', v3735);
            v3736;
            const chunks = [];
            const v3746 = chunk => {
                const v3737 = this.settings;
                const v3738 = v3737.debug_mode;
                if (v3738) {
                    const v3739 = this.debug_label;
                    const v3740 = `${ v3739 }: Received output from ClamAV Socket.`;
                    const v3741 = console.log(v3740);
                    v3741;
                }
                const v3742 = stream.isPaused();
                const v3743 = !v3742;
                if (v3743) {
                    const v3744 = stream.pause();
                    v3744;
                }
                const v3745 = chunks.push(chunk);
                v3745;
            };
            const v3747 = socket.on('data', v3746);
            const v3753 = hadError => {
                const v3748 = this.settings;
                const v3749 = v3748.debug_mode;
                if (v3749) {
                    const v3750 = this.debug_label;
                    const v3751 = `${ v3750 }: ClamAV socket has been closed!`;
                    const v3752 = console.log(v3751, hadError);
                    v3752;
                }
            };
            const v3754 = v3747.on('close', v3753);
            const v3761 = err => {
                const v3755 = this.debug_label;
                const v3756 = `${ v3755 }: Error emitted from ClamAV socket: `;
                const v3757 = console.error(v3756, err);
                v3757;
                const v3758 = cb(err, null);
                const v3759 = reject(err);
                let v3760;
                if (has_cb) {
                    v3760 = v3758;
                } else {
                    v3760 = v3759;
                }
                return v3760;
            };
            const v3762 = v3754.on('error', v3761);
            const v3784 = () => {
                const v3763 = this.settings;
                const v3764 = v3763.debug_mode;
                if (v3764) {
                    const v3765 = this.debug_label;
                    const v3766 = `${ v3765 }: ClamAV is done scanning.`;
                    const v3767 = console.log(v3766);
                    v3767;
                }
                const response = Buffer.concat(chunks);
                const v3768 = !finished;
                if (v3768) {
                    const v3769 = response.toString('utf8');
                    const v3770 = 'Scan aborted. Reply from server: ' + v3769;
                    const err = new NodeClamError(v3770);
                    const v3771 = cb(err, null);
                    const v3772 = reject(err);
                    let v3773;
                    if (has_cb) {
                        v3773 = v3771;
                    } else {
                        v3773 = v3772;
                    }
                    return v3773;
                } else {
                    const v3774 = this.settings;
                    const v3775 = v3774.debug_mode;
                    if (v3775) {
                        const v3776 = this.debug_label;
                        const v3777 = response.toString('utf8');
                        const v3778 = `${ v3776 }: Raw Response:  ${ v3777 }`;
                        const v3779 = console.log(v3778);
                        v3779;
                    }
                    const v3780 = response.toString('utf8');
                    const result = this._process_result(v3780, null);
                    const v3781 = cb(null, result);
                    const v3782 = resolve(result);
                    let v3783;
                    if (has_cb) {
                        v3783 = v3781;
                    } else {
                        v3783 = v3782;
                    }
                    return v3783;
                }
            };
            const v3785 = v3762.on('end', v3784);
            v3785;
        } catch (err) {
            const v3786 = cb(err, null);
            const v3787 = reject(err);
            let v3788;
            if (has_cb) {
                v3788 = v3786;
            } else {
                v3788 = v3787;
            }
            return v3788;
        }
    };
    const v3790 = new Promise(v3789);
    return v3790;
};
NodeClam.scan_stream = scan_stream;
NodeClam['is_class'] = true;
module.exports = NodeClam;