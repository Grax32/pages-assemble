"use strict";
"strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const transitionTimeMs = 250;
const transitionPauseTimeMs = 10;
const buffers = [];
if (window === window.parent) {
    window.onload = rewritePageIntoHostPage;
}
// only run init if at the root
// otherwise do nothing
function rewritePageIntoHostPage() {
    const style = document.createElement("style");
    const body = document.createElement("body");
    const frameBuffer0Parent = document.createElement("div");
    const frameBuffer1Parent = document.createElement("div");
    const frameBuffer0 = document.createElement("iframe");
    const frameBuffer1 = document.createElement("iframe");
    buffers[0] = frameBuffer0;
    buffers[1] = frameBuffer1;
    frameBuffer0Parent.append(frameBuffer0);
    frameBuffer1Parent.append(frameBuffer1);
    frameBuffer0.className = "frameBuffer otherBuffer";
    frameBuffer1.className = "frameBuffer otherBuffer";
    frameBuffer0.id = "frameBuffer0";
    frameBuffer1.id = "frameBuffer1";
    frameBuffer0Parent.id = "frameBuffer0Parent";
    frameBuffer1Parent.id = "frameBuffer1Parent";
    body.append(frameBuffer0Parent, frameBuffer1Parent);
    style.innerHTML = `
  html,
  body,
  .frameBuffer {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    border: 0 none;
  }

  .frameBuffer {
    position: absolute;
    top: 0;
    left: 0;
    transition-property: opacity;
    transition-duration: ${transitionTimeMs}ms;
    opacity: 0;
    overflow: hidden;
  }

  .activeBuffer {
    opacity: 1;
    z-index: 1;
  }

  .otherBuffer {
    opacity: 0;
    z-index: 0;
  }  
  `;
    document.body = body;
    const currentScriptUrl = [
        ...document.head.getElementsByTagName("script")
    ].filter(v => v.src.endsWith("framebuffer.js"))[0].src;
    if (!currentScriptUrl) {
        throw new Error("Expected script to be named framebuffer.js, but unable to find script tag for that name");
    }
    // remove everything except the link to this script
    [...document.head.getElementsByTagName("script")]
        .filter(v => v.src !== currentScriptUrl)
        .forEach(v => v.remove());
    [...document.head.childNodes]
        .filter(v => v.nodeName.toLowerCase() !== "script")
        .forEach(v => v.remove());
    document.head.append(style);
    init();
}
function init() {
    window.onpopstate = function (ev) {
        loadNewBufferFromHistory(ev);
    };
    buffers.forEach(buffer => buffer.addEventListener("load", () => onBufferLoadComplete(buffer)));
    function onBufferLoadComplete(buffer) {
        const backgroundDocument = window.document;
        const framedDocument = buffer.contentWindow.document;
        const origin = framedDocument.location.origin;
        document.title = framedDocument.title;
        if (framedDocument.documentElement.style.backgroundColor) {
            backgroundDocument.documentElement.style.backgroundColor = framedDocument.documentElement.style.backgroundColor;
        }
        else {
            framedDocument.documentElement.style.backgroundColor = "white";
        }
        Array.from(framedDocument.getElementsByTagName("a")).forEach(element => {
            const href = element.href;
            if (href && href.startsWith(origin)) {
                element.addEventListener("click", function (e) {
                    return __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        loadNewBufferFromUrl(href);
                        return false;
                    });
                });
            }
            else if (!element.target) {
                element.target = "_parent";
            }
        });
        window.history.pushState({
            html: framedDocument.documentElement.outerHTML,
            loadHtmlFromState: true
        }, framedDocument.title, framedDocument.location.href);
        transition(buffer);
    }
    function doNewBufferAction(callback) {
        const newBuffer = buffers.filter(buffer => !buffer.classList.contains("activeBuffer"))[0] || buffers[0];
        callback(newBuffer);
    }
    function loadNewBufferFromUrl(path) {
        doNewBufferAction(v => (v.src = path));
    }
    function loadNewBufferFromHistory(ev) {
        doNewBufferAction(buffer => {
            if (ev.state && ev.state.loadHtmlFromState) {
                buffer.innerHTML = ev.state.html;
                transition(buffer);
            }
        });
    }
    function transition(buffer) {
        const otherBuffer = buffers.filter(v => v !== buffer)[0];
        buffer.style.transitionDelay =
            transitionTimeMs + transitionPauseTimeMs + "ms";
        otherBuffer.style.transitionDelay = "0ms";
        buffer.classList.add("activeBuffer");
        buffer.classList.remove("otherBuffer");
        otherBuffer.classList.add("otherBuffer");
        otherBuffer.classList.remove("activeBuffer");
    }
    loadNewBufferFromUrl(document.URL);
}
