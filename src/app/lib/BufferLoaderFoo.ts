export class BufferLoaderFoo {
    context: any;
    urlList: any;
    onload: any;
    bufferList: any;
    loadCount: any;

    constructor(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = [];
        this.loadCount = 0;
    }

    loadBuffer(url, index) {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        const loader = this;

        request.onload = function () {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function (buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount === loader.urlList.length) {
                        loader.onload(loader.bufferList);
                    }

                },
                function (error) {
                    console.error('decodeAudioData error', error);
                }
            );
        };

        request.onerror = function () {
            alert('BufferLoader: XHR error');
        };

        request.send();
    }

    load() {
        for (let i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    }
}