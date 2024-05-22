const sleep = ms => new Promise(r => setTimeout(r, ms));
var t;

const shakeBar = async () => {
    console.log(document.documentElement.style.getPropertyValue('--shake'));
    document.getElementById('notification').style.animation = getComputedStyle(document.body).getPropertyValue('--shake');
    await sleep(500);
    document.getElementById('notification').style.animation = '';
}

const displayNotification = (_msg) => {
    const notification = document.getElementById('notification');
    const message = document.getElementById('nmessage');

    console.log(message.innerHTML);
    if (message.innerHTML !== "") {
        shakeBar();
    }

    message.innerHTML = _msg;
    notification.style.top = '1.5em';
}

export const removeNotification = () => {
    document.getElementById('notification').style.top = '-100%';
    document.getElementById('nmessage').innerHTML = '';
}

export const overruled = (_what) => {
    clearTimeout(t); // to prevent timeout from confusion and making the notification vanish after a few miliseconds, we clear the old timeout that was set.

    displayNotification(_what);
    t = setTimeout(() => {
        removeNotification();
        clearTimeout(t);
    }, 3000);
}