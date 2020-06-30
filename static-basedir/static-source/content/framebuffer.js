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
System.register("models/FramebufferCssClasses", [], function (exports_1, context_1) {
    "use strict";
    var framebufferCssClass;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (framebufferCssClass) {
                framebufferCssClass["active"] = "framebuffer-active";
                framebufferCssClass["passive"] = "framebuffer-passive";
                framebufferCssClass["visible"] = "visible";
            })(framebufferCssClass || (framebufferCssClass = {}));
            exports_1("framebufferCssClass", framebufferCssClass);
        }
    };
});
System.register("models/StateBody", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("models/index", ["models/FramebufferCssClasses"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_3(exports);
    }
    return {
        setters: [
            function (FramebufferCssClasses_1_1) {
                exportStar_1(FramebufferCssClasses_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("rewrite-current-page-into-host-page", ["models/index"], function (exports_4, context_4) {
    "use strict";
    var index_1;
    var __moduleName = context_4 && context_4.id;
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
    exports_4("rewritePageIntoHostPage", rewritePageIntoHostPage);
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("framebuffer", ["models/index", "rewrite-current-page-into-host-page"], function (exports_5, context_5) {
    "use strict";
    var index_2, rewrite_current_page_into_host_page_1, frameBuffer;
    var __moduleName = context_5 && context_5.id;
    function initFrameBuffer() {
        const fb = new frameBuffer();
        fb.initFrameBuffer();
    }
    return {
        setters: [
            function (index_2_1) {
                index_2 = index_2_1;
            },
            function (rewrite_current_page_into_host_page_1_1) {
                rewrite_current_page_into_host_page_1 = rewrite_current_page_into_host_page_1_1;
            }
        ],
        execute: function () {
            if (window === window.parent) {
                // only modify page if root frame
                window.onload = initFrameBuffer;
            }
            frameBuffer = class frameBuffer {
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
                    const newBuffer = this.buffers.find((buffer) => buffer.classList.contains(index_2.framebufferCssClass.passive)) || this.buffers[0];
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
                    bufferToTransitionTo.classList.add(index_2.framebufferCssClass.active);
                }
                show(bufferToTransitionTo) {
                    const bufferToTransitionFrom = this.buffers.find((v) => v !== bufferToTransitionTo);
                    this.removeClasses(bufferToTransitionTo);
                    this.removeClasses(bufferToTransitionFrom);
                    bufferToTransitionTo.classList.add(index_2.framebufferCssClass.visible);
                    bufferToTransitionFrom.classList.add(index_2.framebufferCssClass.passive);
                }
                removeClasses(buffer) {
                    buffer.classList.remove(index_2.framebufferCssClass.active, index_2.framebufferCssClass.passive, index_2.framebufferCssClass.visible);
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
            };
        }
    };
});
console.log('rewriting html');
