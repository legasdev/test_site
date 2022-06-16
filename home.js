"use strict";

;(() => {
    const MAIN_DOM_SELECTOR = 'main';
    const VIDEO_PLAYER_DOM_ID = '#videoPlayer';
    const BUTTON_TAKE_PHOTO_DOM_ID = '#buttonTakePhoto';
    const PHOTO_WRAPPER_DOM_ID = '#photoWrapper';

    const PHOTO_CLASS_CSS = 'photo';

    const $main = document.querySelector(MAIN_DOM_SELECTOR);
    const $videoPlayer = document.querySelector(VIDEO_PLAYER_DOM_ID);
    const $buttonTakePhoto = document.querySelector(BUTTON_TAKE_PHOTO_DOM_ID);
    const $photoWrapper = document.querySelector(PHOTO_WRAPPER_DOM_ID);

    if ( !navigator.mediaDevices ) {
        const message = 'Захват видео не поддерживается браузером.';
        showErrorMessage(message);
        console.warn(message);
        return;
    }

    let streaming = false;

    const videoCanvas = document.createElement('canvas');

    const CONSTRAINTS = {
        video: true,
        audio: false,
    };


    navigator.mediaDevices
        .getUserMedia(CONSTRAINTS)
        .then(( stream ) => {
            $videoPlayer.srcObject = stream;
        })
        .catch(( error ) => {
            showErrorMessage(error.message);
            console.error(error);
        });

    $videoPlayer.addEventListener('canplay', () => {
        if ( streaming ) {
            return;
        }

        const width = 640;
        const height = width / (4/3);

        videoCanvas.width = width;
        videoCanvas.height = height;

        streaming = true;
    });

    $buttonTakePhoto.addEventListener('click', () => {
        if ( !streaming ) {
            return;
        }

        const context = videoCanvas.getContext('2d');
        const width = videoCanvas.width;
        const height = videoCanvas.height;

        context.drawImage($videoPlayer, 0, 0, width, height);

        const data = videoCanvas.toDataURL('image/png');

        const photo = document.createElement('img');
        photo.src = data;
        photo.classList.add(PHOTO_CLASS_CSS);

        $photoWrapper.appendChild(photo);

        context.clearRect(0, 0, width, height);
    });

    function showErrorMessage(message) {
        $videoPlayer.remove();
        $main.textContent = message;
    }
})();