export default {
    iOS: () => navigator.userAgent.indexOf("iPhone;") > -1 || navigator.userAgent.indexOf("iPod;") > -1 || navigator.userAgent.indexOf("iPad;") > -1
}