import {subscribeToTopic, getSubscribedTopics} from 'pushkin-client';

export function subscribe() {
    return subscribeToTopic({topic: "inauguration_live_video"})
    .then(() => {
        self.registration.showNotification("hello",{
            body: "also hello"
        })
        return true;
    })
}

export function isSubscribed() {
    return getSubscribedTopics()
    .then((topics) => {
        return topics.indexOf("inauguration_live_video") > -1;
    })
}