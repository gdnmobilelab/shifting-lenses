export default function() {
    if (typeof navigator === "undefined") {
        return false;
    }
    return {
        iOS: navigator.userAgent.indexOf("iPhone;") > -1 || navigator.userAgent.indexOf("iPod;") > -1 || navigator.userAgent.indexOf("iPad;") > -1,
        hybridApp: navigator.userAgent.indexOf("hybridwebview") > -1
    }
}