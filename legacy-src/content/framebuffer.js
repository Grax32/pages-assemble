(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    Object.defineProperty(exports, "__esModule", { value: true });
    const index_1 = require("./models/index");
    const rewrite_current_page_into_host_page_1 = require("./rewrite-current-page-into-host-page");
    function initFrameBuffer() {
        const fb = new frameBuffer();
        fb.initFrameBuffer();
    }
    if (window === window.parent) {
        // only modify page if root frame
        window.onload = initFrameBuffer;
    }
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
        doNewBufferAction(callback) {
            const newBuffer = this.buffers.find((buffer) => buffer.classList.contains(index_1.framebufferCssClass.passive)) || this.buffers[0];
            callback(newBuffer);
        }
        initFrameBuffer() {
            rewrite_current_page_into_host_page_1.rewritePageIntoHostPage(this.buffers);
            window.onpopstate = (ev) => {
                this.loadNewBufferFromHistory(ev);
            };
            this.buffers.forEach((buffer) => {
                buffer.addEventListener("load", () => this.onBufferLoadComplete(buffer));
            });
        }
        loadNewBufferFromHistory(ev) {
            const state = ev.state;
            this.doNewBufferAction((buffer) => {
                if (state && state.loadHtmlFromState && state.html) {
                    buffer.innerHTML = state.html;
                    this.transition(buffer);
                }
                else {
                    location.href = state.url;
                }
            });
        }
        transition(bufferToTransitionTo) {
            this.show(bufferToTransitionTo);
            bufferToTransitionTo.classList.add(index_1.framebufferCssClass.active);
        }
        show(bufferToTransitionTo) {
            const bufferToTransitionFrom = this.buffers.find((v) => v !== bufferToTransitionTo);
            this.removeClasses(bufferToTransitionTo);
            this.removeClasses(bufferToTransitionFrom);
            bufferToTransitionTo.classList.add(index_1.framebufferCssClass.visible);
            bufferToTransitionFrom.classList.add(index_1.framebufferCssClass.passive);
        }
        removeClasses(buffer) {
            buffer.classList.remove(index_1.framebufferCssClass.active, index_1.framebufferCssClass.passive, index_1.framebufferCssClass.visible);
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
            const fromStateAttributeName = "data-from-state";
            const isLoadedFromState = !!framedDocument.body.getAttribute(fromStateAttributeName);
            if (!isLoadedFromState) {
                framedDocument.body.setAttribute(fromStateAttributeName, "1");
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
                const state = {
                    html: framedDocument.documentElement.outerHTML,
                    loadHtmlFromState: true,
                    url: framedDocument.location.href,
                    title: framedDocument.title,
                };
                window.history.pushState(state, state.title, state.url);
            }
            if (buffer.contentWindow.document.URL === document.URL) {
                this.show(buffer);
            }
            else {
                this.transition(buffer);
            }
        }
    }
    
    },{"./models/index":4,"./rewrite-current-page-into-host-page":5}],2:[function(require,module,exports){
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.framebufferCssClass = void 0;
    var framebufferCssClass;
    (function (framebufferCssClass) {
        framebufferCssClass["active"] = "framebuffer-active";
        framebufferCssClass["passive"] = "framebuffer-passive";
        framebufferCssClass["visible"] = "visible";
    })(framebufferCssClass = exports.framebufferCssClass || (exports.framebufferCssClass = {}));
    
    },{}],3:[function(require,module,exports){
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    
    },{}],4:[function(require,module,exports){
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __exportStar = (this && this.__exportStar) || function(m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require("./FramebufferCssClasses"), exports);
    __exportStar(require("./StateBody"), exports);
    
    },{"./FramebufferCssClasses":2,"./StateBody":3}],5:[function(require,module,exports){
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rewritePageIntoHostPage = void 0;
    const index_1 = require("./models/index");
    function rewritePageIntoHostPage(buffers) {
        const style = document.createElement("style");
        const body = document.createElement("body");
        body.append(...buffers);
        buffers[0].src = document.URL;
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
    
          .${index_1.framebufferCssClass.visible} {
            opacity: 1;
            z-index: 1;
          }
    
          .${index_1.framebufferCssClass.active} {
            animation-name: blurFadeIn;
          }
    
          .${index_1.framebufferCssClass.passive} {
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
        buffers[0].classList.add(index_1.framebufferCssClass.visible);
        buffers[1].classList.add(index_1.framebufferCssClass.passive);
    }
    exports.rewritePageIntoHostPage = rewritePageIntoHostPage;
    
    },{"./models/index":4}]},{},[1]);
    