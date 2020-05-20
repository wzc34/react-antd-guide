
function isBlank(v) {
    if (!v || v === null || v === 'null' || v === 'undefined' || v === '' || v === undefined) {
        return true
    } else {
        return false
    }
}

let methods = {
    /**
     * 本地数据存储
     *
     * @param {any} key
     * @param {any} value
     * @returns
     */
    setLocalStorage(key, value) {
        return localStorage.setItem(key, value);
    },
    /**
     * 本地数据读取
     *
     * @param {any} key
     * @returns
     */
    getLocalStorage(key) {
        return localStorage.getItem(key) && localStorage.getItem(key) !== 'null' ? localStorage.getItem(key) : null;
    },
    /**
     * 删除本地数据
     *
     * @param {any} key
     * @returns
     */
    removeLocalStorage(key) {
        if (arguments.length === 1) {
            return localStorage.removeItem(key);
        } else {
            return localStorage.clear();
        }
    },
    valpwd (s) {
        const len = s.length
        return len >= 6 && /(?=[A-Za-z0-9]{6,20})(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+/.test(s)
    },
    // 验证手机号
    phoneRegular (phone) {
        const phoneRegular = /^1[3456789]\d{9}$/
        if (phoneRegular.test(this.trim(phone))) {
            return true
        } else {
            return false
        }
    },
    // 判断是移到还是pc
    isWap () {
        var userAgentInfo = navigator.userAgent.toLowerCase()
        var Agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"]
        let i = 0
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) >= 0) {
              i ++
            }
        }
        if (i > 0) {
            return true
        } else {
            return false
        }
    },
    ellipsis(str, len, suffix) {
        if (!str) {
            return ''
        } else {
            if (str.length <= len) {
                return str
            } else {
                return str.substr(0, len) + (suffix || "...")
            }
        }
    },
    isBlank(v) {
        return isBlank(v)
    },
    isBlankDefault(v, defaultVal) {
        if (isBlank(v)) {
            return isBlank(defaultVal) ? '-' : defaultVal
        } else {
            return v
        }
    }
};

export default methods;