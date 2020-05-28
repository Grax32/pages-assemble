"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function initFrameBuffer() {
    const fb = new frameBuffer();
    fb.initFrameBuffer();
}
if (window === window.parent) {
    // only modify page if root frame
    window.onload = initFrameBuffer;
}
var framebufferCssClass;
(function (framebufferCssClass) {
    framebufferCssClass["active"] = "framebuffer-active";
    framebufferCssClass["passive"] = "framebuffer-passive";
    framebufferCssClass["visible"] = "visible";
})(framebufferCssClass || (framebufferCssClass = {}));
class frameBuffer {
    constructor() {
        this.buffers = [0, 1].map((v) => this.createFrameBufferElement(v));
    }
    createFrameBufferElement(id) {
        const buffer = document.createElement("iframe");
        buffer.className = "frameBuffer";
        buffer.id = "frameBuffer" + id;
        return buffer;
    }
    rewritePageIntoHostPage() {
        const style = document.createElement("style");
        const body = document.createElement("body");
        body.append(...this.buffers);
        this.buffers[0].src = document.URL;
        style.innerHTML = `
      html,
      body,
      .frameBuffer {
        height: 100vh;
        width: 100%;
        margin: 0;
        padding: 0;
        border: 0 none;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        animation-duration: 600ms;
      }

      body {
          height: calc( 100vh + 1px ); // allow nav bar to hide on mobile
      }

      @keyframes blurFadeOut {
        from { filter: blur(0px); opacity: 1; z-index: 10; }
        50% { filter: blur(15px); opacity: .7; z-index: 10; }
        99% { filter: blur(0px); opacity: 0; z-index: 10; }
        to { filter: blur(0px); opacity: 0; z-index: 0; }
      }

      @keyframes blurFadeIn {
        from { filter: blur(0px); opacity: 0; }
        50% { filter: blur(15px); opacity: .7; }
        99% { filter: blur(0px); opacity: 1; }
        to { filter: blur(0px); opacity: 1; }
      }

      .${framebufferCssClass.visible} {
        opacity: 1;
        z-index: 1;
      }

      .${framebufferCssClass.active} {
        animation-name: blurFadeIn;
      }

      .${framebufferCssClass.passive} {
        opacity: 0;
        animation-name: blurFadeOut;
      }
    `;
        // also consider clip-path animations
        document.body = body;
        const scriptElements = [...document.head.getElementsByTagName("script")];
        const frameBufferScriptElement = scriptElements.find((v) => v.src.endsWith("framebuffer.js"));
        if (!frameBufferScriptElement) {
            throw new Error("Expected script to be named framebuffer.js, but unable to find script tag for that name");
        }
        // remove everything except the link to this script
        scriptElements
            .filter((element) => element !== frameBufferScriptElement)
            .forEach((element) => element.remove());
        [...document.head.childNodes]
            .filter((v) => v.nodeName.toLowerCase() !== "script")
            .forEach((v) => v.remove());
        document.head.append(style);
        this.buffers[0].classList.add(framebufferCssClass.visible);
        this.buffers[1].classList.add(framebufferCssClass.passive);
    }
    initFrameBuffer() {
        this.rewritePageIntoHostPage();
        window.onpopstate = (ev) => {
            this.loadNewBufferFromHistory(ev);
        };
        this.buffers.forEach((buffer) => {
            buffer.addEventListener("load", () => this.onBufferLoadComplete(buffer));
        });
    }
    doNewBufferAction(callback) {
        const newBuffer = this.buffers.find((buffer) => buffer.classList.contains(framebufferCssClass.passive)) || this.buffers[0];
        callback(newBuffer);
    }
    loadNewBufferFromHistory(ev) {
        this.doNewBufferAction((buffer) => {
            if (ev.state && ev.state.loadHtmlFromState) {
                buffer.innerHTML = ev.state.html;
                this.transition(buffer);
            }
        });
    }
    transition(bufferToTransitionTo) {
        this.show(bufferToTransitionTo);
        bufferToTransitionTo.classList.add(framebufferCssClass.active);
    }
    show(bufferToTransitionTo) {
        const bufferToTransitionFrom = this.buffers.find((v) => v !== bufferToTransitionTo);
        this.removeClasses(bufferToTransitionTo);
        this.removeClasses(bufferToTransitionFrom);
        bufferToTransitionTo.classList.add(framebufferCssClass.visible);
        bufferToTransitionFrom.classList.add(framebufferCssClass.passive);
    }
    removeClasses(buffer) {
        buffer.classList.remove(framebufferCssClass.active, framebufferCssClass.passive, framebufferCssClass.visible);
    }
    redirectOnError(buffer) {
        try {
            buffer.contentWindow.document;
            return false;
        }
        catch (_a) {
            // failed to retrieve document, redirecting to same document so
            // that error is visible to user
            try {
                location.href = buffer.src;
            }
            catch (error) {
                document.documentElement.innerHTML =
                    "<html><body>An error has occurred navigating to a URL that was already causing an error.  The error is show below <hr/>" +
                        error +
                        "</body></html>";
                return false;
            }
            return true;
        }
    }
    loadNewBufferFromUrl(path) {
        this.doNewBufferAction((buffer) => {
            buffer.src = path;
        });
    }
    onBufferLoadComplete(buffer) {
        if (this.redirectOnError(buffer)) {
            return;
        }
        this.buffers.forEach((buf) => {
            buf.style.removeProperty("animationName");
            buf.style.removeProperty("animationDuration");
        });
        const framedDocument = buffer.contentWindow.document;
        const origin = framedDocument.location.origin;
        document.title = framedDocument.title;
        if (!framedDocument.documentElement.style.backgroundColor) {
            framedDocument.documentElement.style.backgroundColor = "white";
        }
        const loadNewBufferFromUrl = (href) => this.loadNewBufferFromUrl(href);
        Array.from(framedDocument.getElementsByTagName("a")).forEach((element) => {
            const href = element.href;
            if (href && href.startsWith(origin)) {
                element.addEventListener("click", function (e) {
                    return __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        loadNewBufferFromUrl(href);
                        console.log("loading: " + href);
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
            loadHtmlFromState: true,
        }, framedDocument.title, framedDocument.location.href);
        if (buffer.contentWindow.document.URL === document.URL) {
            this.show(buffer);
        }
        else {
            this.transition(buffer);
        }
    }
}
