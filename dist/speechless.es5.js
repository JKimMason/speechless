var EventTarget = /** @class */ (function () {
    function EventTarget() {
        this.eventTarget = document.createDocumentFragment();
    }
    EventTarget.prototype.addEventListener = function (type, listener) {
        return this.eventTarget.addEventListener(type, listener);
    };
    EventTarget.prototype.removeEventListener = function (type, listener) {
        return this.eventTarget.removeEventListener(type, listener);
    };
    EventTarget.prototype.dispatchEvent = function (event) {
        return this.eventTarget.dispatchEvent(event);
    };
    return EventTarget;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AbstractRecognition = /** @class */ (function (_super) {
    __extends$1(AbstractRecognition, _super);
    function AbstractRecognition(lang) {
        if (lang === void 0) { lang = 'en'; }
        var _this = _super.call(this) || this;
        _this.lang = lang;
        return _this;
    }
    AbstractRecognition.prototype.addEventListener = function (type, listener) {
        return _super.prototype.addEventListener.call(this, type, listener);
    };
    AbstractRecognition.prototype.removeEventListener = function (type, listener) {
        return _super.prototype.removeEventListener.call(this, type, listener);
    };
    AbstractRecognition.prototype.dispatchEvent = function (event) {
        return _super.prototype.dispatchEvent.call(this, event);
    };
    AbstractRecognition.prototype.setLang = function (lang) {
        this.lang = lang;
        return this;
    };
    AbstractRecognition.prototype.getLang = function () {
        return this.lang;
    };
    AbstractRecognition.prototype.setState = function (state) {
        this.state = Object.assign({}, this.state, state);
        return this;
    };
    AbstractRecognition.prototype.getState = function () {
        return this.state;
    };
    return AbstractRecognition;
}(EventTarget));

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NativeRecognition = /** @class */ (function (_super) {
    __extends(NativeRecognition, _super);
    function NativeRecognition(lang) {
        var _this = _super.call(this, lang) /* istanbul ignore next */ || this;
        _this.setState({
            listening: false,
            force: false,
            value: ''
        });
        _this.onSpeechRecognitionResult = _this.onSpeechRecognitionResult.bind(_this);
        _this.onSpeechRecognitionEnd = _this.onSpeechRecognitionEnd.bind(_this);
        _this.onSpeechRecognitionStart = _this.onSpeechRecognitionStart.bind(_this);
        _this.setup();
        return _this;
    }
    NativeRecognition.getSpeechRecognition = function () {
        var SpeechRecognition = window.webkitSpeechRecognition;
        return SpeechRecognition;
    };
    NativeRecognition.isSupported = function () {
        return 'webkitSpeechRecognition' in window;
    };
    NativeRecognition.prototype.setup = function () {
        var SpeechRecognition = NativeRecognition.getSpeechRecognition();
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = this.getLang();
        this.speechRecognition.onresult = this.onSpeechRecognitionResult;
        this.speechRecognition.onend = this.onSpeechRecognitionEnd;
        this.speechRecognition.onstart = this.onSpeechRecognitionStart;
        return this;
    };
    NativeRecognition.prototype.listen = function () {
        var listening = this.getState().listening;
        if (!listening) {
            this.setState({
                value: ''
            });
            this.speechRecognition.start();
        }
        return this;
    };
    NativeRecognition.prototype.stop = function () {
        var listening = this.getState().listening;
        if (listening) {
            this.setState({
                force: true
            });
            this.speechRecognition.stop();
        }
        return this;
    };
    NativeRecognition.prototype.onChange = function (interimTranscript) {
        var value = this.getState().value;
        this.setState({
            value: interimTranscript
        });
        this.dispatchEvent(new CustomEvent('data', { detail: interimTranscript }));
    };
    NativeRecognition.prototype.onFinal = function (finalTranscript) {
        this.setState({
            value: finalTranscript
        });
        this.speechRecognition.stop();
    };
    NativeRecognition.prototype.onSpeechRecognitionStart = function () {
        this.dispatchEvent(new CustomEvent('start'));
        this.setState({
            listening: true
        });
    };
    NativeRecognition.prototype.onSpeechRecognitionEnd = function () {
        var _a = this.getState(), force = _a.force, value = _a.value;
        this.setState({
            listening: false
        });
        if (force) {
            this.setState({
                force: false
            });
            this.dispatchEvent(new CustomEvent('stop'));
        }
        else {
            this.dispatchEvent(new CustomEvent('data', { detail: value }));
            this.dispatchEvent(new CustomEvent('end'));
        }
    };
    NativeRecognition.prototype.onSpeechRecognitionResult = function (event) {
        var interimTranscript = '';
        var finalTranscript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
                this.onFinal(finalTranscript);
            }
            else {
                interimTranscript += event.results[i][0].transcript;
                this.onChange(interimTranscript);
            }
        }
    };
    return NativeRecognition;
}(AbstractRecognition));

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var webRecorder_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t), o.l=!0, o.exports}var n={};return t.m=e, t.c=n, t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r});}, t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n), n}, t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}, t.p="", t(t.s=0)}([function(e,t,n){e.exports=n(1);},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){this.eventTarget=document.createDocumentFragment();}return e.prototype.addEventListener=function(e,t){return this.eventTarget.addEventListener(e,t)}, e.prototype.removeEventListener=function(e,t){return this.eventTarget.removeEventListener(e,t)}, e.prototype.dispatchEvent=function(e){return this.eventTarget.dispatchEvent(e)}, e}(),o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);};return function(t,n){function r(){this.constructor=t;}e(t,n), t.prototype=null===n?Object.create(n):(r.prototype=n.prototype, new r);}}(),s=n(2),i=new AudioContext,a=function(e){function t(t,n){var r=e.call(this)||this;return r.stream=t, r.recording=!1, r.ready=!1, r.bufferLen=4096, r.options={mono:n.mono||!0,quietThresholdTime:n.quietThresholdTime||5,volumeThreshold:n.volumeThreshold||-60}, r.onAudioProcess=r.onAudioProcess.bind(r), r.onWorkerMessage=r.onWorkerMessage.bind(r), r}return o(t,e), t.prototype.start=function(){this.ready||this.setup(), this.dispatchEvent(new CustomEvent("start")), this.recording=!0;}, t.prototype.stop=function(){this.recording=!1, this.exportWAV();}, t.prototype.reset=function(){this.recording=!1, this.worker.postMessage({command:"clear"}), this.dispatchEvent(new CustomEvent("reset"));}, t.prototype.abort=function(){this.dispatchEvent(new CustomEvent("stop")), this.kill();}, t.prototype.getBuffer=function(){this.worker.postMessage({command:"getBuffer"});}, t.prototype.setup=function(){this.worker=this.worker||s(), this.worker.addEventListener("message",this.onWorkerMessage), this.scriptProcessorNode=i.createScriptProcessor(this.bufferLen,2,2), this.scriptProcessorNode.connect(i.destination), this.scriptProcessorNode.addEventListener("audioprocess",this.onAudioProcess), this.source=i.createMediaStreamSource(this.stream), this.audioTracks=this.stream.getAudioTracks(), this.analyserNode=i.createAnalyser(), this.analyserNode.fftSize=2048, this.analyserNode.minDecibels=-90, this.analyserNode.maxDecibels=-30, this.analyserNode.connect(this.scriptProcessorNode), this.analyserData=new Float32Array(this.analyserNode.frequencyBinCount), this.gainNode=i.createGain(), this.gainNode.gain.setValueAtTime(0,i.currentTime), this.gainNode.connect(i.destination), this.source.connect(this.gainNode), this.source.connect(this.scriptProcessorNode), this.source.connect(this.analyserNode);var e={sampleRate:i.sampleRate,numChannels:this.options.mono?1:this.stream.getAudioTracks().length};this.worker.postMessage({command:"init",payload:e}), this.ready=!0, this.quietTime=i.currentTime, this.dispatchEvent(new CustomEvent("ready"));}, t.prototype.onWorkerMessage=function(e){var t=e.data,n=t.command,r=t.payload;switch(n){case"exportWAV":this.dispatchEvent(new CustomEvent("data",{detail:r})), this.kill();}}, t.prototype.onAudioProcess=function(e){this.recording&&(this.dispatchEvent(new CustomEvent("audioprocess",{detail:e.inputBuffer})), this.worker.postMessage({command:"record",payload:{buffer:[e.inputBuffer.getChannelData(0),e.inputBuffer.getChannelData(1)]}}), this.analyserNode.getFloatFrequencyData(this.analyserData), this.maxVolume=Math.max.apply(Math,Array.from(this.analyserData)), this.isQuiet());}, t.prototype.isQuiet=function(){var e=i.currentTime-this.quietTime,t=this.maxVolume<this.options.volumeThreshold;e>this.options.quietThresholdTime&&t&&this.stop(), t||(this.quietTime=i.currentTime);}, t.prototype.kill=function(){this.audioTracks.forEach(function(e){e.stop();}), this.source.disconnect(this.scriptProcessorNode), this.scriptProcessorNode.disconnect(i.destination), this.worker.terminate(), this.dispatchEvent(new CustomEvent("end"));}, t.prototype.exportWAV=function(e){void 0===e&&(e="audio/wav"), this.worker.postMessage({command:"exportWAV",payload:{type:e}});}, t}(r);n.d(t,"Recorder",function(){return a});},function(e,t,n){e.exports=function(){return n(3)('!function(t){function e(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e){function n(t){for(var e=[],n=0;n<s;n++)e.push(a(c[n],i));var r,l=function(t){var e=new ArrayBuffer(44+2*t.length),n=new DataView(e);return o(n,0,"RIFF"),n.setUint32(4,36+2*t.length,!0),o(n,8,"WAVE"),o(n,12,"fmt "),n.setUint32(16,16,!0),n.setUint16(20,1,!0),n.setUint16(22,s,!0),n.setUint32(24,f,!0),n.setUint32(28,4*f,!0),n.setUint16(32,2*s,!0),n.setUint16(34,16,!0),o(n,36,"data"),n.setUint32(40,2*t.length,!0),function(t,e,n){for(var r=0;r<n.length;r++,e+=2){var a=Math.max(-1,Math.min(1,n[r]));t.setInt16(e,a<0?32768*a:32767*a,!0)}}(n,44,t),n}(r=2===s?function(t,e){var n=t.length+e.length,r=new Float32Array(n),a=0,o=0;for(;a<n;)r[a++]=t[o],r[a++]=e[o],o++;return r}(e[0],e[1]):e[0]),p=new Blob([l],{type:t});u.postMessage({command:"exportWAV",payload:p})}function r(){for(var t=0;t<s;t++)c[t]=[]}function a(t,e){for(var n=new Float32Array(e),r=0,a=0;a<t.length;a++)n.set(t[a],r),r+=t[a].length;return n}function o(t,e,n){for(var r=0;r<n.length;r++)t.setUint8(e+r,n.charCodeAt(r))}var f,s,u=self,i=0,c=[];u.onmessage=function(t){var e=t.data,o=e.command,l=e.payload;switch(o){case"init":!function(t){f=t.sampleRate,s=1,r()}(l);break;case"record":!function(t){for(var e=0;e<s;e++)c[e].push(t[e]);i+=t[0].length}(l.buffer);break;case"exportWAV":n(l.type);break;case"getBuffer":!function(){for(var t=[],e=0;e<s;e++)t.push(a(c[e],i));u.postMessage({command:"getBuffer",data:t})}();break;case"clear":i=0,c=[],r()}}}]);\n//# sourceMappingURL=406f349166a8a60bef54.worker.js.map',n.p+"406f349166a8a60bef54.worker.js")};},function(e,t,n){var r=window.URL||window.webkitURL;e.exports=function(e,t){try{try{var n;try{(n=new(window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder)).append(e), n=n.getBlob();}catch(t){n=new Blob([e]);}return new Worker(r.createObjectURL(n))}catch(t){return new Worker("data:application/javascript,"+encodeURIComponent(e))}}catch(e){if(!t)throw Error("Inline worker is not supported");return new Worker(t)}};}])});

});

unwrapExports(webRecorder_min);
var webRecorder_min_1 = webRecorder_min.Recorder;
var webRecorder_min_2 = webRecorder_min.WebRecorder;

function getNavigatorUserMedia(constraints, successCallback, errorCallback) {
    var navigator = window.navigator;
    var navigatorAsAny = window.navigator;
    if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, successCallback, errorCallback);
    }
    else if (navigatorAsAny.webkitGetUserMedia) {
        navigatorAsAny.webkitGetUserMedia(constraints, successCallback, errorCallback);
    }
    else if (navigatorAsAny.mozGetUserMedia) {
        navigatorAsAny.mozGetUserMedia(constraints, successCallback, errorCallback);
    }
    else if (navigatorAsAny.mediaDevices &&
        navigatorAsAny.mediaDevices.getUserMedia) {
        navigatorAsAny.mediaDevices.getUserMedia(constraints, successCallback, errorCallback);
    }
    else {
        throw new Error('no userMedia support');
    }
}

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ExternalRecognition = /** @class */ (function (_super) {
    __extends$2(ExternalRecognition, _super);
    function ExternalRecognition(lang, remoteCall) {
        var _this = _super.call(this, lang) /* istanbul ignore next */ || this;
        _this.remoteCall = remoteCall;
        _this.setState({
            listening: false,
            fetching: false,
            value: null
        });
        _this.onRecordingData = _this.onRecordingData.bind(_this);
        _this.onRecordingStart = _this.onRecordingStart.bind(_this);
        _this.onRecordingStop = _this.onRecordingStop.bind(_this);
        _this.onRemoteResult = _this.onRemoteResult.bind(_this);
        _this.onRecordingEnd = _this.onRecordingEnd.bind(_this);
        _this.onGotStream = _this.onGotStream.bind(_this);
        return _this;
    }
    ExternalRecognition.prototype.listen = function () {
        var listening = this.getState().listening;
        if (!listening) {
            this.setState({
                value: null
            });
            this.record();
        }
        return this;
    };
    ExternalRecognition.prototype.kill = function () {
        this.recorder.abort();
    };
    ExternalRecognition.prototype.stop = function () {
        var listening = this.getState().listening;
        if (listening) {
            this.recorder.stop();
        }
        return this;
    };
    ExternalRecognition.prototype.getRecorder = function () {
        return this.recorder;
    };
    ExternalRecognition.prototype.record = function () {
        getNavigatorUserMedia({
            audio: {
                advanced: [
                    {
                        echoCancelation: false
                    }
                ]
            }
        }, this.onGotStream, console.error);
    };
    ExternalRecognition.prototype.onGotStream = function (stream) {
        this.stream = stream;
        this.recorder = new webRecorder_min_1(stream, {});
        this.recorder.addEventListener('start', this.onRecordingStart);
        this.recorder.addEventListener('end', this.onRecordingEnd);
        this.recorder.addEventListener('stop', this.onRecordingStop);
        this.recorder.addEventListener('data', this.onRecordingData);
        this.recorder.start();
    };
    ExternalRecognition.prototype.onRecordingStart = function () {
        this.dispatchEvent(new CustomEvent('start'));
        this.setState({
            listening: true
        });
    };
    ExternalRecognition.prototype.onRecordingEnd = function () {
        var value = this.getState().value;
        this.setState({
            listening: false
        });
        if (this.remoteCall) {
            this.dispatchEvent(new CustomEvent('fetching'));
            this.remoteCall(value).then(this.onRemoteResult);
        }
    };
    ExternalRecognition.prototype.onRecordingStop = function (ev) {
        var listening = this.getState().listening;
        this.dispatchEvent(new CustomEvent('stop'));
        this.setState({
            listening: false
        });
    };
    ExternalRecognition.prototype.onRecordingData = function (ev) {
        this.setState({ fetching: true, value: ev.detail });
    };
    ExternalRecognition.prototype.onRemoteResult = function (res) {
        var listening = this.getState().listening;
        this.setState({ value: res, fetching: false });
        this.dispatchEvent(new CustomEvent('data', { detail: res }));
        this.dispatchEvent(new CustomEvent('end'));
    };
    return ExternalRecognition;
}(AbstractRecognition));

function RecognitionFactory(lang, remoteCall) {
    if (NativeRecognition.isSupported()) {
        return new NativeRecognition(lang);
    }
    return new ExternalRecognition(lang, remoteCall);
}

export { RecognitionFactory, NativeRecognition, ExternalRecognition };
//# sourceMappingURL=speechless.es5.js.map
