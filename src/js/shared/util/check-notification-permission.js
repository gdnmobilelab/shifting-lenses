export default function checkNotificationPermission () {
    return new Promise((fulfill, reject) => {
        if (window.Notification.permission === 'granted') {
            return fulfill(true);
        }
        Notification.requestPermission((status) => {
            if (status === 'granted') {
                return fulfill(true);
            }
            reject(new Error(status))
        })
    });
};