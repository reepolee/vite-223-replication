(() => {
  // node_modules/workbox-core/_version.js
  "use strict";
  try {
    self["workbox:core:6.1.5"] && _();
  } catch (e) {
  }

  // node_modules/workbox-core/models/messages/messageGenerator.js
  var fallback = (code, ...args) => {
    let msg = code;
    if (args.length > 0) {
      msg += ` :: ${JSON.stringify(args)}`;
    }
    return msg;
  };
  var messageGenerator = true ? fallback : generatorFunction;

  // node_modules/workbox-core/_private/WorkboxError.js
  var WorkboxError = class extends Error {
    constructor(errorCode, details) {
      const message = messageGenerator(errorCode, details);
      super(message);
      this.name = errorCode;
      this.details = details;
    }
  };

  // node_modules/workbox-core/_private/logger.js
  var logger = true ? null : (() => {
    if (!("__WB_DISABLE_DEV_LOGS" in self)) {
      self.__WB_DISABLE_DEV_LOGS = false;
    }
    let inGroup = false;
    const methodToColorMap = {
      debug: `#7f8c8d`,
      log: `#2ecc71`,
      warn: `#f39c12`,
      error: `#c0392b`,
      groupCollapsed: `#3498db`,
      groupEnd: null
    };
    const print = function(method, args) {
      if (self.__WB_DISABLE_DEV_LOGS) {
        return;
      }
      if (method === "groupCollapsed") {
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          console[method](...args);
          return;
        }
      }
      const styles = [
        `background: ${methodToColorMap[method]}`,
        `border-radius: 0.5em`,
        `color: white`,
        `font-weight: bold`,
        `padding: 2px 0.5em`
      ];
      const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
      console[method](...logPrefix, ...args);
      if (method === "groupCollapsed") {
        inGroup = true;
      }
      if (method === "groupEnd") {
        inGroup = false;
      }
    };
    const api = {};
    const loggerMethods = Object.keys(methodToColorMap);
    for (const key of loggerMethods) {
      const method = key;
      api[method] = (...args) => {
        print(method, args);
      };
    }
    return api;
  })();

  // node_modules/workbox-routing/_version.js
  "use strict";
  try {
    self["workbox:routing:6.1.5"] && _();
  } catch (e) {
  }

  // node_modules/workbox-routing/utils/constants.js
  var defaultMethod = "GET";

  // node_modules/workbox-routing/utils/normalizeHandler.js
  var normalizeHandler = (handler) => {
    if (handler && typeof handler === "object") {
      if (false) {
        finalAssertExports.hasMethod(handler, "handle", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "handler"
        });
      }
      return handler;
    } else {
      if (false) {
        finalAssertExports.isType(handler, "function", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "handler"
        });
      }
      return {handle: handler};
    }
  };

  // node_modules/workbox-routing/Route.js
  var Route = class {
    constructor(match, handler, method = defaultMethod) {
      if (false) {
        finalAssertExports.isType(match, "function", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "match"
        });
        if (method) {
          finalAssertExports.isOneOf(method, validMethods, {paramName: "method"});
        }
      }
      this.handler = normalizeHandler(handler);
      this.match = match;
      this.method = method;
    }
    setCatchHandler(handler) {
      this.catchHandler = normalizeHandler(handler);
    }
  };

  // node_modules/workbox-routing/RegExpRoute.js
  var RegExpRoute = class extends Route {
    constructor(regExp, handler, method) {
      if (false) {
        finalAssertExports.isInstance(regExp, RegExp, {
          moduleName: "workbox-routing",
          className: "RegExpRoute",
          funcName: "constructor",
          paramName: "pattern"
        });
      }
      const match = ({url}) => {
        const result = regExp.exec(url.href);
        if (!result) {
          return;
        }
        if (url.origin !== location.origin && result.index !== 0) {
          if (false) {
            logger.debug(`The regular expression '${regExp}' only partially matched against the cross-origin URL '${url}'. RegExpRoute's will only handle cross-origin requests if they match the entire URL.`);
          }
          return;
        }
        return result.slice(1);
      };
      super(match, handler, method);
    }
  };

  // node_modules/workbox-core/_private/getFriendlyURL.js
  var getFriendlyURL = (url) => {
    const urlObj = new URL(String(url), location.href);
    return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
  };

  // node_modules/workbox-routing/Router.js
  var Router = class {
    constructor() {
      this._routes = new Map();
      this._defaultHandlerMap = new Map();
    }
    get routes() {
      return this._routes;
    }
    addFetchListener() {
      self.addEventListener("fetch", (event) => {
        const {request} = event;
        const responsePromise = this.handleRequest({request, event});
        if (responsePromise) {
          event.respondWith(responsePromise);
        }
      });
    }
    addCacheListener() {
      self.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_URLS") {
          const {payload} = event.data;
          if (false) {
            logger.debug(`Caching URLs from the window`, payload.urlsToCache);
          }
          const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
            if (typeof entry === "string") {
              entry = [entry];
            }
            const request = new Request(...entry);
            return this.handleRequest({request, event});
          }));
          event.waitUntil(requestPromises);
          if (event.ports && event.ports[0]) {
            requestPromises.then(() => event.ports[0].postMessage(true));
          }
        }
      });
    }
    handleRequest({request, event}) {
      if (false) {
        finalAssertExports.isInstance(request, Request, {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "handleRequest",
          paramName: "options.request"
        });
      }
      const url = new URL(request.url, location.href);
      if (!url.protocol.startsWith("http")) {
        if (false) {
          logger.debug(`Workbox Router only supports URLs that start with 'http'.`);
        }
        return;
      }
      const sameOrigin = url.origin === location.origin;
      const {params, route} = this.findMatchingRoute({
        event,
        request,
        sameOrigin,
        url
      });
      let handler = route && route.handler;
      const debugMessages = [];
      if (false) {
        if (handler) {
          debugMessages.push([
            `Found a route to handle this request:`,
            route
          ]);
          if (params) {
            debugMessages.push([
              `Passing the following params to the route's handler:`,
              params
            ]);
          }
        }
      }
      const method = request.method;
      if (!handler && this._defaultHandlerMap.has(method)) {
        if (false) {
          debugMessages.push(`Failed to find a matching route. Falling back to the default handler for ${method}.`);
        }
        handler = this._defaultHandlerMap.get(method);
      }
      if (!handler) {
        if (false) {
          logger.debug(`No route found for: ${getFriendlyURL(url)}`);
        }
        return;
      }
      if (false) {
        logger.groupCollapsed(`Router is responding to: ${getFriendlyURL(url)}`);
        debugMessages.forEach((msg) => {
          if (Array.isArray(msg)) {
            logger.log(...msg);
          } else {
            logger.log(msg);
          }
        });
        logger.groupEnd();
      }
      let responsePromise;
      try {
        responsePromise = handler.handle({url, request, event, params});
      } catch (err) {
        responsePromise = Promise.reject(err);
      }
      const catchHandler = route && route.catchHandler;
      if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) {
        responsePromise = responsePromise.catch(async (err) => {
          if (catchHandler) {
            if (false) {
              logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to route's Catch Handler.`);
              logger.error(`Error thrown by:`, route);
              logger.error(err);
              logger.groupEnd();
            }
            try {
              return await catchHandler.handle({url, request, event, params});
            } catch (catchErr) {
              err = catchErr;
            }
          }
          if (this._catchHandler) {
            if (false) {
              logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to global Catch Handler.`);
              logger.error(`Error thrown by:`, route);
              logger.error(err);
              logger.groupEnd();
            }
            return this._catchHandler.handle({url, request, event});
          }
          throw err;
        });
      }
      return responsePromise;
    }
    findMatchingRoute({url, sameOrigin, request, event}) {
      const routes = this._routes.get(request.method) || [];
      for (const route of routes) {
        let params;
        const matchResult = route.match({url, sameOrigin, request, event});
        if (matchResult) {
          if (false) {
            if (matchResult instanceof Promise) {
              logger.warn(`While routing ${getFriendlyURL(url)}, an async matchCallback function was used. Please convert the following route to use a synchronous matchCallback function:`, route);
            }
          }
          params = matchResult;
          if (Array.isArray(matchResult) && matchResult.length === 0) {
            params = void 0;
          } else if (matchResult.constructor === Object && Object.keys(matchResult).length === 0) {
            params = void 0;
          } else if (typeof matchResult === "boolean") {
            params = void 0;
          }
          return {route, params};
        }
      }
      return {};
    }
    setDefaultHandler(handler, method = defaultMethod) {
      this._defaultHandlerMap.set(method, normalizeHandler(handler));
    }
    setCatchHandler(handler) {
      this._catchHandler = normalizeHandler(handler);
    }
    registerRoute(route) {
      if (false) {
        finalAssertExports.isType(route, "object", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.hasMethod(route, "match", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.isType(route.handler, "object", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.hasMethod(route.handler, "handle", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route.handler"
        });
        finalAssertExports.isType(route.method, "string", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route.method"
        });
      }
      if (!this._routes.has(route.method)) {
        this._routes.set(route.method, []);
      }
      this._routes.get(route.method).push(route);
    }
    unregisterRoute(route) {
      if (!this._routes.has(route.method)) {
        throw new WorkboxError("unregister-route-but-not-found-with-method", {
          method: route.method
        });
      }
      const routeIndex = this._routes.get(route.method).indexOf(route);
      if (routeIndex > -1) {
        this._routes.get(route.method).splice(routeIndex, 1);
      } else {
        throw new WorkboxError("unregister-route-route-not-registered");
      }
    }
  };

  // node_modules/workbox-routing/utils/getOrCreateDefaultRouter.js
  var defaultRouter;
  var getOrCreateDefaultRouter = () => {
    if (!defaultRouter) {
      defaultRouter = new Router();
      defaultRouter.addFetchListener();
      defaultRouter.addCacheListener();
    }
    return defaultRouter;
  };

  // node_modules/workbox-routing/registerRoute.js
  function registerRoute(capture, handler, method) {
    let route;
    if (typeof capture === "string") {
      const captureUrl = new URL(capture, location.href);
      if (false) {
        if (!(capture.startsWith("/") || capture.startsWith("http"))) {
          throw new WorkboxError("invalid-string", {
            moduleName: "workbox-routing",
            funcName: "registerRoute",
            paramName: "capture"
          });
        }
        const valueToCheck = capture.startsWith("http") ? captureUrl.pathname : capture;
        const wildcards = "[*:?+]";
        if (new RegExp(`${wildcards}`).exec(valueToCheck)) {
          logger.debug(`The '$capture' parameter contains an Express-style wildcard character (${wildcards}). Strings are now always interpreted as exact matches; use a RegExp for partial or wildcard matches.`);
        }
      }
      const matchCallback = ({url}) => {
        if (false) {
          if (url.pathname === captureUrl.pathname && url.origin !== captureUrl.origin) {
            logger.debug(`${capture} only partially matches the cross-origin URL ${url}. This route will only handle cross-origin requests if they match the entire URL.`);
          }
        }
        return url.href === captureUrl.href;
      };
      route = new Route(matchCallback, handler, method);
    } else if (capture instanceof RegExp) {
      route = new RegExpRoute(capture, handler, method);
    } else if (typeof capture === "function") {
      route = new Route(capture, handler, method);
    } else if (capture instanceof Route) {
      route = capture;
    } else {
      throw new WorkboxError("unsupported-route-type", {
        moduleName: "workbox-routing",
        funcName: "registerRoute",
        paramName: "capture"
      });
    }
    const defaultRouter2 = getOrCreateDefaultRouter();
    defaultRouter2.registerRoute(route);
    return route;
  }

  // node_modules/workbox-routing/setCatchHandler.js
  function setCatchHandler(handler) {
    const defaultRouter2 = getOrCreateDefaultRouter();
    defaultRouter2.setCatchHandler(handler);
  }

  // node_modules/workbox-routing/setDefaultHandler.js
  function setDefaultHandler(handler) {
    const defaultRouter2 = getOrCreateDefaultRouter();
    defaultRouter2.setDefaultHandler(handler);
  }

  // node_modules/workbox-core/_private/cacheNames.js
  var _cacheNameDetails = {
    googleAnalytics: "googleAnalytics",
    precache: "precache-v2",
    prefix: "workbox",
    runtime: "runtime",
    suffix: typeof registration !== "undefined" ? registration.scope : ""
  };
  var _createCacheName = (cacheName) => {
    return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter((value) => value && value.length > 0).join("-");
  };
  var eachCacheNameDetail = (fn) => {
    for (const key of Object.keys(_cacheNameDetails)) {
      fn(key);
    }
  };
  var cacheNames = {
    updateDetails: (details) => {
      eachCacheNameDetail((key) => {
        if (typeof details[key] === "string") {
          _cacheNameDetails[key] = details[key];
        }
      });
    },
    getGoogleAnalyticsName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
    },
    getPrecacheName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.precache);
    },
    getPrefix: () => {
      return _cacheNameDetails.prefix;
    },
    getRuntimeName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.runtime);
    },
    getSuffix: () => {
      return _cacheNameDetails.suffix;
    }
  };

  // node_modules/workbox-core/_private/cacheMatchIgnoreParams.js
  function stripParams(fullURL, ignoreParams) {
    const strippedURL = new URL(fullURL);
    for (const param of ignoreParams) {
      strippedURL.searchParams.delete(param);
    }
    return strippedURL.href;
  }
  async function cacheMatchIgnoreParams(cache, request, ignoreParams, matchOptions) {
    const strippedRequestURL = stripParams(request.url, ignoreParams);
    if (request.url === strippedRequestURL) {
      return cache.match(request, matchOptions);
    }
    const keysOptions = {...matchOptions, ignoreSearch: true};
    const cacheKeys = await cache.keys(request, keysOptions);
    for (const cacheKey of cacheKeys) {
      const strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
      if (strippedRequestURL === strippedCacheKeyURL) {
        return cache.match(cacheKey, matchOptions);
      }
    }
    return;
  }

  // node_modules/workbox-core/_private/Deferred.js
  var Deferred = class {
    constructor() {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
  };

  // node_modules/workbox-core/models/quotaErrorCallbacks.js
  var quotaErrorCallbacks = new Set();

  // node_modules/workbox-core/_private/executeQuotaErrorCallbacks.js
  async function executeQuotaErrorCallbacks() {
    if (false) {
      logger.log(`About to run ${quotaErrorCallbacks.size} callbacks to clean up caches.`);
    }
    for (const callback of quotaErrorCallbacks) {
      await callback();
      if (false) {
        logger.log(callback, "is complete.");
      }
    }
    if (false) {
      logger.log("Finished running callbacks.");
    }
  }

  // node_modules/workbox-core/_private/timeout.js
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // node_modules/workbox-strategies/_version.js
  "use strict";
  try {
    self["workbox:strategies:6.1.5"] && _();
  } catch (e) {
  }

  // node_modules/workbox-strategies/StrategyHandler.js
  function toRequest(input) {
    return typeof input === "string" ? new Request(input) : input;
  }
  var StrategyHandler = class {
    constructor(strategy, options) {
      this._cacheKeys = {};
      if (false) {
        finalAssertExports.isInstance(options.event, ExtendableEvent, {
          moduleName: "workbox-strategies",
          className: "StrategyHandler",
          funcName: "constructor",
          paramName: "options.event"
        });
      }
      Object.assign(this, options);
      this.event = options.event;
      this._strategy = strategy;
      this._handlerDeferred = new Deferred();
      this._extendLifetimePromises = [];
      this._plugins = [...strategy.plugins];
      this._pluginStateMap = new Map();
      for (const plugin of this._plugins) {
        this._pluginStateMap.set(plugin, {});
      }
      this.event.waitUntil(this._handlerDeferred.promise);
    }
    async fetch(input) {
      const {event} = this;
      let request = toRequest(input);
      if (request.mode === "navigate" && event instanceof FetchEvent && event.preloadResponse) {
        const possiblePreloadResponse = await event.preloadResponse;
        if (possiblePreloadResponse) {
          if (false) {
            logger.log(`Using a preloaded navigation response for '${getFriendlyURL(request.url)}'`);
          }
          return possiblePreloadResponse;
        }
      }
      const originalRequest = this.hasCallback("fetchDidFail") ? request.clone() : null;
      try {
        for (const cb of this.iterateCallbacks("requestWillFetch")) {
          request = await cb({request: request.clone(), event});
        }
      } catch (err) {
        throw new WorkboxError("plugin-error-request-will-fetch", {
          thrownError: err
        });
      }
      const pluginFilteredRequest = request.clone();
      try {
        let fetchResponse;
        fetchResponse = await fetch(request, request.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
        if (false) {
          logger.debug(`Network request for '${getFriendlyURL(request.url)}' returned a response with status '${fetchResponse.status}'.`);
        }
        for (const callback of this.iterateCallbacks("fetchDidSucceed")) {
          fetchResponse = await callback({
            event,
            request: pluginFilteredRequest,
            response: fetchResponse
          });
        }
        return fetchResponse;
      } catch (error) {
        if (false) {
          logger.log(`Network request for '${getFriendlyURL(request.url)}' threw an error.`, error);
        }
        if (originalRequest) {
          await this.runCallbacks("fetchDidFail", {
            error,
            event,
            originalRequest: originalRequest.clone(),
            request: pluginFilteredRequest.clone()
          });
        }
        throw error;
      }
    }
    async fetchAndCachePut(input) {
      const response = await this.fetch(input);
      const responseClone = response.clone();
      this.waitUntil(this.cachePut(input, responseClone));
      return response;
    }
    async cacheMatch(key) {
      const request = toRequest(key);
      let cachedResponse;
      const {cacheName, matchOptions} = this._strategy;
      const effectiveRequest = await this.getCacheKey(request, "read");
      const multiMatchOptions = {...matchOptions, ...{cacheName}};
      cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);
      if (false) {
        if (cachedResponse) {
          logger.debug(`Found a cached response in '${cacheName}'.`);
        } else {
          logger.debug(`No cached response found in '${cacheName}'.`);
        }
      }
      for (const callback of this.iterateCallbacks("cachedResponseWillBeUsed")) {
        cachedResponse = await callback({
          cacheName,
          matchOptions,
          cachedResponse,
          request: effectiveRequest,
          event: this.event
        }) || void 0;
      }
      return cachedResponse;
    }
    async cachePut(key, response) {
      const request = toRequest(key);
      await timeout(0);
      const effectiveRequest = await this.getCacheKey(request, "write");
      if (false) {
        if (effectiveRequest.method && effectiveRequest.method !== "GET") {
          throw new WorkboxError("attempt-to-cache-non-get-request", {
            url: getFriendlyURL(effectiveRequest.url),
            method: effectiveRequest.method
          });
        }
      }
      if (!response) {
        if (false) {
          logger.error(`Cannot cache non-existent response for '${getFriendlyURL(effectiveRequest.url)}'.`);
        }
        throw new WorkboxError("cache-put-with-no-response", {
          url: getFriendlyURL(effectiveRequest.url)
        });
      }
      const responseToCache = await this._ensureResponseSafeToCache(response);
      if (!responseToCache) {
        if (false) {
          logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' will not be cached.`, responseToCache);
        }
        return false;
      }
      const {cacheName, matchOptions} = this._strategy;
      const cache = await self.caches.open(cacheName);
      const hasCacheUpdateCallback = this.hasCallback("cacheDidUpdate");
      const oldResponse = hasCacheUpdateCallback ? await cacheMatchIgnoreParams(cache, effectiveRequest.clone(), ["__WB_REVISION__"], matchOptions) : null;
      if (false) {
        logger.debug(`Updating the '${cacheName}' cache with a new Response for ${getFriendlyURL(effectiveRequest.url)}.`);
      }
      try {
        await cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
      } catch (error) {
        if (error.name === "QuotaExceededError") {
          await executeQuotaErrorCallbacks();
        }
        throw error;
      }
      for (const callback of this.iterateCallbacks("cacheDidUpdate")) {
        await callback({
          cacheName,
          oldResponse,
          newResponse: responseToCache.clone(),
          request: effectiveRequest,
          event: this.event
        });
      }
      return true;
    }
    async getCacheKey(request, mode) {
      if (!this._cacheKeys[mode]) {
        let effectiveRequest = request;
        for (const callback of this.iterateCallbacks("cacheKeyWillBeUsed")) {
          effectiveRequest = toRequest(await callback({
            mode,
            request: effectiveRequest,
            event: this.event,
            params: this.params
          }));
        }
        this._cacheKeys[mode] = effectiveRequest;
      }
      return this._cacheKeys[mode];
    }
    hasCallback(name) {
      for (const plugin of this._strategy.plugins) {
        if (name in plugin) {
          return true;
        }
      }
      return false;
    }
    async runCallbacks(name, param) {
      for (const callback of this.iterateCallbacks(name)) {
        await callback(param);
      }
    }
    *iterateCallbacks(name) {
      for (const plugin of this._strategy.plugins) {
        if (typeof plugin[name] === "function") {
          const state = this._pluginStateMap.get(plugin);
          const statefulCallback = (param) => {
            const statefulParam = {...param, state};
            return plugin[name](statefulParam);
          };
          yield statefulCallback;
        }
      }
    }
    waitUntil(promise) {
      this._extendLifetimePromises.push(promise);
      return promise;
    }
    async doneWaiting() {
      let promise;
      while (promise = this._extendLifetimePromises.shift()) {
        await promise;
      }
    }
    destroy() {
      this._handlerDeferred.resolve();
    }
    async _ensureResponseSafeToCache(response) {
      let responseToCache = response;
      let pluginsUsed = false;
      for (const callback of this.iterateCallbacks("cacheWillUpdate")) {
        responseToCache = await callback({
          request: this.request,
          response: responseToCache,
          event: this.event
        }) || void 0;
        pluginsUsed = true;
        if (!responseToCache) {
          break;
        }
      }
      if (!pluginsUsed) {
        if (responseToCache && responseToCache.status !== 200) {
          responseToCache = void 0;
        }
        if (false) {
          if (responseToCache) {
            if (responseToCache.status !== 200) {
              if (responseToCache.status === 0) {
                logger.warn(`The response for '${this.request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`);
              } else {
                logger.debug(`The response for '${this.request.url}' returned a status code of '${response.status}' and won't be cached as a result.`);
              }
            }
          }
        }
      }
      return responseToCache;
    }
  };

  // node_modules/workbox-strategies/Strategy.js
  var Strategy = class {
    constructor(options = {}) {
      this.cacheName = cacheNames.getRuntimeName(options.cacheName);
      this.plugins = options.plugins || [];
      this.fetchOptions = options.fetchOptions;
      this.matchOptions = options.matchOptions;
    }
    handle(options) {
      const [responseDone] = this.handleAll(options);
      return responseDone;
    }
    handleAll(options) {
      if (options instanceof FetchEvent) {
        options = {
          event: options,
          request: options.request
        };
      }
      const event = options.event;
      const request = typeof options.request === "string" ? new Request(options.request) : options.request;
      const params = "params" in options ? options.params : void 0;
      const handler = new StrategyHandler(this, {event, request, params});
      const responseDone = this._getResponse(handler, request, event);
      const handlerDone = this._awaitComplete(responseDone, handler, request, event);
      return [responseDone, handlerDone];
    }
    async _getResponse(handler, request, event) {
      await handler.runCallbacks("handlerWillStart", {event, request});
      let response = void 0;
      try {
        response = await this._handle(request, handler);
        if (!response || response.type === "error") {
          throw new WorkboxError("no-response", {url: request.url});
        }
      } catch (error) {
        for (const callback of handler.iterateCallbacks("handlerDidError")) {
          response = await callback({error, event, request});
          if (response) {
            break;
          }
        }
        if (!response) {
          throw error;
        } else if (false) {
          logger.log(`While responding to '${getFriendlyURL(request.url)}', an ${error} error occurred. Using a fallback response provided by a handlerDidError plugin.`);
        }
      }
      for (const callback of handler.iterateCallbacks("handlerWillRespond")) {
        response = await callback({event, request, response});
      }
      return response;
    }
    async _awaitComplete(responseDone, handler, request, event) {
      let response;
      let error;
      try {
        response = await responseDone;
      } catch (error2) {
      }
      try {
        await handler.runCallbacks("handlerDidRespond", {
          event,
          request,
          response
        });
        await handler.doneWaiting();
      } catch (waitUntilError) {
        error = waitUntilError;
      }
      await handler.runCallbacks("handlerDidComplete", {
        event,
        request,
        response,
        error
      });
      handler.destroy();
      if (error) {
        throw error;
      }
    }
  };

  // node_modules/workbox-strategies/CacheFirst.js
  var CacheFirst = class extends Strategy {
    async _handle(request, handler) {
      const logs = [];
      if (false) {
        finalAssertExports.isInstance(request, Request, {
          moduleName: "workbox-strategies",
          className: this.constructor.name,
          funcName: "makeRequest",
          paramName: "request"
        });
      }
      let response = await handler.cacheMatch(request);
      let error;
      if (!response) {
        if (false) {
          logs.push(`No response found in the '${this.cacheName}' cache. Will respond with a network request.`);
        }
        try {
          response = await handler.fetchAndCachePut(request);
        } catch (err) {
          error = err;
        }
        if (false) {
          if (response) {
            logs.push(`Got response from network.`);
          } else {
            logs.push(`Unable to get a response from the network.`);
          }
        }
      } else {
        if (false) {
          logs.push(`Found a cached response in the '${this.cacheName}' cache.`);
        }
      }
      if (false) {
        logger.groupCollapsed(messages2.strategyStart(this.constructor.name, request));
        for (const log of logs) {
          logger.log(log);
        }
        messages2.printFinalResponse(response);
        logger.groupEnd();
      }
      if (!response) {
        throw new WorkboxError("no-response", {url: request.url, error});
      }
      return response;
    }
  };

  // node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.js
  var cacheOkAndOpaquePlugin = {
    cacheWillUpdate: async ({response}) => {
      if (response.status === 200 || response.status === 0) {
        return response;
      }
      return null;
    }
  };

  // node_modules/workbox-strategies/NetworkFirst.js
  var NetworkFirst = class extends Strategy {
    constructor(options = {}) {
      super(options);
      if (!this.plugins.some((p) => "cacheWillUpdate" in p)) {
        this.plugins.unshift(cacheOkAndOpaquePlugin);
      }
      this._networkTimeoutSeconds = options.networkTimeoutSeconds || 0;
      if (false) {
        if (this._networkTimeoutSeconds) {
          finalAssertExports.isType(this._networkTimeoutSeconds, "number", {
            moduleName: "workbox-strategies",
            className: this.constructor.name,
            funcName: "constructor",
            paramName: "networkTimeoutSeconds"
          });
        }
      }
    }
    async _handle(request, handler) {
      const logs = [];
      if (false) {
        finalAssertExports.isInstance(request, Request, {
          moduleName: "workbox-strategies",
          className: this.constructor.name,
          funcName: "handle",
          paramName: "makeRequest"
        });
      }
      const promises = [];
      let timeoutId;
      if (this._networkTimeoutSeconds) {
        const {id, promise} = this._getTimeoutPromise({request, logs, handler});
        timeoutId = id;
        promises.push(promise);
      }
      const networkPromise = this._getNetworkPromise({timeoutId, request, logs, handler});
      promises.push(networkPromise);
      const response = await handler.waitUntil((async () => {
        return await handler.waitUntil(Promise.race(promises)) || await networkPromise;
      })());
      if (false) {
        logger.groupCollapsed(messages2.strategyStart(this.constructor.name, request));
        for (const log of logs) {
          logger.log(log);
        }
        messages2.printFinalResponse(response);
        logger.groupEnd();
      }
      if (!response) {
        throw new WorkboxError("no-response", {url: request.url});
      }
      return response;
    }
    _getTimeoutPromise({request, logs, handler}) {
      let timeoutId;
      const timeoutPromise = new Promise((resolve) => {
        const onNetworkTimeout = async () => {
          if (false) {
            logs.push(`Timing out the network response at ${this._networkTimeoutSeconds} seconds.`);
          }
          resolve(await handler.cacheMatch(request));
        };
        timeoutId = setTimeout(onNetworkTimeout, this._networkTimeoutSeconds * 1e3);
      });
      return {
        promise: timeoutPromise,
        id: timeoutId
      };
    }
    async _getNetworkPromise({timeoutId, request, logs, handler}) {
      let error;
      let response;
      try {
        response = await handler.fetchAndCachePut(request);
      } catch (fetchError) {
        error = fetchError;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (false) {
        if (response) {
          logs.push(`Got response from network.`);
        } else {
          logs.push(`Unable to get a response from the network. Will respond with a cached response.`);
        }
      }
      if (error || !response) {
        response = await handler.cacheMatch(request);
        if (false) {
          if (response) {
            logs.push(`Found a cached response in the '${this.cacheName}' cache.`);
          } else {
            logs.push(`No response found in the '${this.cacheName}' cache.`);
          }
        }
      }
      return response;
    }
  };

  // node_modules/workbox-core/registerQuotaErrorCallback.js
  function registerQuotaErrorCallback(callback) {
    if (false) {
      finalAssertExports.isType(callback, "function", {
        moduleName: "workbox-core",
        funcName: "register",
        paramName: "callback"
      });
    }
    quotaErrorCallbacks.add(callback);
    if (false) {
      logger.log("Registered a callback to respond to quota errors.", callback);
    }
  }

  // node_modules/workbox-core/_private/canConstructResponseFromBodyStream.js
  var supportStatus;
  function canConstructResponseFromBodyStream() {
    if (supportStatus === void 0) {
      const testResponse = new Response("");
      if ("body" in testResponse) {
        try {
          new Response(testResponse.body);
          supportStatus = true;
        } catch (error) {
          supportStatus = false;
        }
      }
      supportStatus = false;
    }
    return supportStatus;
  }

  // node_modules/workbox-core/_private/dontWaitFor.js
  function dontWaitFor(promise) {
    promise.then(() => {
    });
  }

  // node_modules/workbox-core/_private/DBWrapper.js
  var DBWrapper = class {
    constructor(name, version, {onupgradeneeded, onversionchange} = {}) {
      this._db = null;
      this._name = name;
      this._version = version;
      this._onupgradeneeded = onupgradeneeded;
      this._onversionchange = onversionchange || (() => this.close());
    }
    get db() {
      return this._db;
    }
    async open() {
      if (this._db)
        return;
      this._db = await new Promise((resolve, reject) => {
        let openRequestTimedOut = false;
        setTimeout(() => {
          openRequestTimedOut = true;
          reject(new Error("The open request was blocked and timed out"));
        }, this.OPEN_TIMEOUT);
        const openRequest = indexedDB.open(this._name, this._version);
        openRequest.onerror = () => reject(openRequest.error);
        openRequest.onupgradeneeded = (evt) => {
          if (openRequestTimedOut) {
            openRequest.transaction.abort();
            openRequest.result.close();
          } else if (typeof this._onupgradeneeded === "function") {
            this._onupgradeneeded(evt);
          }
        };
        openRequest.onsuccess = () => {
          const db = openRequest.result;
          if (openRequestTimedOut) {
            db.close();
          } else {
            db.onversionchange = this._onversionchange.bind(this);
            resolve(db);
          }
        };
      });
      return this;
    }
    async getKey(storeName, query) {
      return (await this.getAllKeys(storeName, query, 1))[0];
    }
    async getAll(storeName, query, count) {
      return await this.getAllMatching(storeName, {query, count});
    }
    async getAllKeys(storeName, query, count) {
      const entries = await this.getAllMatching(storeName, {query, count, includeKeys: true});
      return entries.map((entry) => entry.key);
    }
    async getAllMatching(storeName, {
      index,
      query = null,
      direction = "next",
      count,
      includeKeys = false
    } = {}) {
      return await this.transaction([storeName], "readonly", (txn, done) => {
        const store = txn.objectStore(storeName);
        const target = index ? store.index(index) : store;
        const results = [];
        const request = target.openCursor(query, direction);
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            results.push(includeKeys ? cursor : cursor.value);
            if (count && results.length >= count) {
              done(results);
            } else {
              cursor.continue();
            }
          } else {
            done(results);
          }
        };
      });
    }
    async transaction(storeNames, type, callback) {
      await this.open();
      return await new Promise((resolve, reject) => {
        const txn = this._db.transaction(storeNames, type);
        txn.onabort = () => reject(txn.error);
        txn.oncomplete = () => resolve();
        callback(txn, (value) => resolve(value));
      });
    }
    async _call(method, storeName, type, ...args) {
      const callback = (txn, done) => {
        const objStore = txn.objectStore(storeName);
        const request = objStore[method].apply(objStore, args);
        request.onsuccess = () => done(request.result);
      };
      return await this.transaction([storeName], type, callback);
    }
    close() {
      if (this._db) {
        this._db.close();
        this._db = null;
      }
    }
  };
  DBWrapper.prototype.OPEN_TIMEOUT = 2e3;
  var methodsToWrap = {
    readonly: ["get", "count", "getKey", "getAll", "getAllKeys"],
    readwrite: ["add", "put", "clear", "delete"]
  };
  for (const [mode, methods] of Object.entries(methodsToWrap)) {
    for (const method of methods) {
      if (method in IDBObjectStore.prototype) {
        DBWrapper.prototype[method] = async function(storeName, ...args) {
          return await this._call(method, storeName, mode, ...args);
        };
      }
    }
  }

  // node_modules/workbox-core/_private/deleteDatabase.js
  var deleteDatabase = async (name) => {
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(name);
      request.onerror = () => {
        reject(request.error);
      };
      request.onblocked = () => {
        reject(new Error("Delete blocked"));
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  };

  // node_modules/workbox-core/_private/waitUntil.js
  function waitUntil(event, asyncFn) {
    const returnPromise = asyncFn();
    event.waitUntil(returnPromise);
    return returnPromise;
  }

  // node_modules/workbox-core/copyResponse.js
  async function copyResponse(response, modifier) {
    let origin = null;
    if (response.url) {
      const responseURL = new URL(response.url);
      origin = responseURL.origin;
    }
    if (origin !== self.location.origin) {
      throw new WorkboxError("cross-origin-copy-response", {origin});
    }
    const clonedResponse = response.clone();
    const responseInit = {
      headers: new Headers(clonedResponse.headers),
      status: clonedResponse.status,
      statusText: clonedResponse.statusText
    };
    const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit;
    const body = canConstructResponseFromBodyStream() ? clonedResponse.body : await clonedResponse.blob();
    return new Response(body, modifiedResponseInit);
  }

  // node_modules/workbox-core/clientsClaim.js
  function clientsClaim() {
    self.addEventListener("activate", () => self.clients.claim());
  }

  // node_modules/workbox-core/skipWaiting.js
  function skipWaiting() {
    if (false) {
      logger.warn(`skipWaiting() from workbox-core is no longer recommended and will be removed in Workbox v7. Using self.skipWaiting() instead is equivalent.`);
    }
    self.skipWaiting();
  }

  // node_modules/workbox-precaching/_version.js
  "use strict";
  try {
    self["workbox:precaching:6.1.5"] && _();
  } catch (e) {
  }

  // node_modules/workbox-precaching/utils/createCacheKey.js
  var REVISION_SEARCH_PARAM = "__WB_REVISION__";
  function createCacheKey(entry) {
    if (!entry) {
      throw new WorkboxError("add-to-cache-list-unexpected-type", {entry});
    }
    if (typeof entry === "string") {
      const urlObject = new URL(entry, location.href);
      return {
        cacheKey: urlObject.href,
        url: urlObject.href
      };
    }
    const {revision, url} = entry;
    if (!url) {
      throw new WorkboxError("add-to-cache-list-unexpected-type", {entry});
    }
    if (!revision) {
      const urlObject = new URL(url, location.href);
      return {
        cacheKey: urlObject.href,
        url: urlObject.href
      };
    }
    const cacheKeyURL = new URL(url, location.href);
    const originalURL = new URL(url, location.href);
    cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
    return {
      cacheKey: cacheKeyURL.href,
      url: originalURL.href
    };
  }

  // node_modules/workbox-precaching/utils/PrecacheInstallReportPlugin.js
  var PrecacheInstallReportPlugin = class {
    constructor() {
      this.updatedURLs = [];
      this.notUpdatedURLs = [];
      this.handlerWillStart = async ({request, state}) => {
        if (state) {
          state.originalRequest = request;
        }
      };
      this.cachedResponseWillBeUsed = async ({event, state, cachedResponse}) => {
        if (event.type === "install") {
          const url = state.originalRequest.url;
          if (cachedResponse) {
            this.notUpdatedURLs.push(url);
          } else {
            this.updatedURLs.push(url);
          }
        }
        return cachedResponse;
      };
    }
  };

  // node_modules/workbox-precaching/utils/PrecacheCacheKeyPlugin.js
  var PrecacheCacheKeyPlugin = class {
    constructor({precacheController: precacheController2}) {
      this.cacheKeyWillBeUsed = async ({request, params}) => {
        const cacheKey = params && params.cacheKey || this._precacheController.getCacheKeyForURL(request.url);
        return cacheKey ? new Request(cacheKey) : request;
      };
      this._precacheController = precacheController2;
    }
  };

  // node_modules/workbox-precaching/PrecacheStrategy.js
  var PrecacheStrategy = class extends Strategy {
    constructor(options = {}) {
      options.cacheName = cacheNames.getPrecacheName(options.cacheName);
      super(options);
      this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
      this.plugins.push(PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
    }
    async _handle(request, handler) {
      const response = await handler.cacheMatch(request);
      if (!response) {
        if (handler.event && handler.event.type === "install") {
          return await this._handleInstall(request, handler);
        }
        return await this._handleFetch(request, handler);
      }
      return response;
    }
    async _handleFetch(request, handler) {
      let response;
      if (this._fallbackToNetwork) {
        if (false) {
          logger.warn(`The precached response for ${getFriendlyURL(request.url)} in ${this.cacheName} was not found. Falling back to the network instead.`);
        }
        response = await handler.fetch(request);
      } else {
        throw new WorkboxError("missing-precache-entry", {
          cacheName: this.cacheName,
          url: request.url
        });
      }
      if (false) {
        const cacheKey = handler.params && handler.params.cacheKey || await handler.getCacheKey(request, "read");
        logger.groupCollapsed(`Precaching is responding to: ` + getFriendlyURL(request.url));
        logger.log(`Serving the precached url: ${getFriendlyURL(cacheKey.url)}`);
        logger.groupCollapsed(`View request details here.`);
        logger.log(request);
        logger.groupEnd();
        logger.groupCollapsed(`View response details here.`);
        logger.log(response);
        logger.groupEnd();
        logger.groupEnd();
      }
      return response;
    }
    async _handleInstall(request, handler) {
      this._useDefaultCacheabilityPluginIfNeeded();
      const response = await handler.fetch(request);
      const wasCached = await handler.cachePut(request, response.clone());
      if (!wasCached) {
        throw new WorkboxError("bad-precaching-response", {
          url: request.url,
          status: response.status
        });
      }
      return response;
    }
    _useDefaultCacheabilityPluginIfNeeded() {
      let defaultPluginIndex = null;
      let cacheWillUpdatePluginCount = 0;
      for (const [index, plugin] of this.plugins.entries()) {
        if (plugin === PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) {
          continue;
        }
        if (plugin === PrecacheStrategy.defaultPrecacheCacheabilityPlugin) {
          defaultPluginIndex = index;
        }
        if (plugin.cacheWillUpdate) {
          cacheWillUpdatePluginCount++;
        }
      }
      if (cacheWillUpdatePluginCount === 0) {
        this.plugins.push(PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
      } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
        this.plugins.splice(defaultPluginIndex, 1);
      }
    }
  };
  PrecacheStrategy.defaultPrecacheCacheabilityPlugin = {
    async cacheWillUpdate({response}) {
      if (!response || response.status >= 400) {
        return null;
      }
      return response;
    }
  };
  PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = {
    async cacheWillUpdate({response}) {
      return response.redirected ? await copyResponse(response) : response;
    }
  };

  // node_modules/workbox-precaching/PrecacheController.js
  var PrecacheController = class {
    constructor({cacheName, plugins = [], fallbackToNetwork = true} = {}) {
      this._urlsToCacheKeys = new Map();
      this._urlsToCacheModes = new Map();
      this._cacheKeysToIntegrities = new Map();
      this._strategy = new PrecacheStrategy({
        cacheName: cacheNames.getPrecacheName(cacheName),
        plugins: [
          ...plugins,
          new PrecacheCacheKeyPlugin({precacheController: this})
        ],
        fallbackToNetwork
      });
      this.install = this.install.bind(this);
      this.activate = this.activate.bind(this);
    }
    get strategy() {
      return this._strategy;
    }
    precache(entries) {
      this.addToCacheList(entries);
      if (!this._installAndActiveListenersAdded) {
        self.addEventListener("install", this.install);
        self.addEventListener("activate", this.activate);
        this._installAndActiveListenersAdded = true;
      }
    }
    addToCacheList(entries) {
      if (false) {
        finalAssertExports.isArray(entries, {
          moduleName: "workbox-precaching",
          className: "PrecacheController",
          funcName: "addToCacheList",
          paramName: "entries"
        });
      }
      const urlsToWarnAbout = [];
      for (const entry of entries) {
        if (typeof entry === "string") {
          urlsToWarnAbout.push(entry);
        } else if (entry && entry.revision === void 0) {
          urlsToWarnAbout.push(entry.url);
        }
        const {cacheKey, url} = createCacheKey(entry);
        const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";
        if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
          throw new WorkboxError("add-to-cache-list-conflicting-entries", {
            firstEntry: this._urlsToCacheKeys.get(url),
            secondEntry: cacheKey
          });
        }
        if (typeof entry !== "string" && entry.integrity) {
          if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
            throw new WorkboxError("add-to-cache-list-conflicting-integrities", {
              url
            });
          }
          this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
        }
        this._urlsToCacheKeys.set(url, cacheKey);
        this._urlsToCacheModes.set(url, cacheMode);
        if (urlsToWarnAbout.length > 0) {
          const warningMessage = `Workbox is precaching URLs without revision info: ${urlsToWarnAbout.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
          if (true) {
            console.warn(warningMessage);
          } else {
            logger.warn(warningMessage);
          }
        }
      }
    }
    install(event) {
      return waitUntil(event, async () => {
        const installReportPlugin = new PrecacheInstallReportPlugin();
        this.strategy.plugins.push(installReportPlugin);
        for (const [url, cacheKey] of this._urlsToCacheKeys) {
          const integrity = this._cacheKeysToIntegrities.get(cacheKey);
          const cacheMode = this._urlsToCacheModes.get(url);
          const request = new Request(url, {
            integrity,
            cache: cacheMode,
            credentials: "same-origin"
          });
          await Promise.all(this.strategy.handleAll({
            params: {cacheKey},
            request,
            event
          }));
        }
        const {updatedURLs, notUpdatedURLs} = installReportPlugin;
        if (false) {
          printInstallDetails(updatedURLs, notUpdatedURLs);
        }
        return {updatedURLs, notUpdatedURLs};
      });
    }
    activate(event) {
      return waitUntil(event, async () => {
        const cache = await self.caches.open(this.strategy.cacheName);
        const currentlyCachedRequests = await cache.keys();
        const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
        const deletedURLs = [];
        for (const request of currentlyCachedRequests) {
          if (!expectedCacheKeys.has(request.url)) {
            await cache.delete(request);
            deletedURLs.push(request.url);
          }
        }
        if (false) {
          printCleanupDetails(deletedURLs);
        }
        return {deletedURLs};
      });
    }
    getURLsToCacheKeys() {
      return this._urlsToCacheKeys;
    }
    getCachedURLs() {
      return [...this._urlsToCacheKeys.keys()];
    }
    getCacheKeyForURL(url) {
      const urlObject = new URL(url, location.href);
      return this._urlsToCacheKeys.get(urlObject.href);
    }
    async matchPrecache(request) {
      const url = request instanceof Request ? request.url : request;
      const cacheKey = this.getCacheKeyForURL(url);
      if (cacheKey) {
        const cache = await self.caches.open(this.strategy.cacheName);
        return cache.match(cacheKey);
      }
      return void 0;
    }
    createHandlerBoundToURL(url) {
      const cacheKey = this.getCacheKeyForURL(url);
      if (!cacheKey) {
        throw new WorkboxError("non-precached-url", {url});
      }
      return (options) => {
        options.request = new Request(url);
        options.params = {cacheKey, ...options.params};
        return this.strategy.handle(options);
      };
    }
  };

  // node_modules/workbox-precaching/utils/getOrCreatePrecacheController.js
  var precacheController;
  var getOrCreatePrecacheController = () => {
    if (!precacheController) {
      precacheController = new PrecacheController();
    }
    return precacheController;
  };

  // node_modules/workbox-precaching/utils/removeIgnoredSearchParams.js
  function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
    for (const paramName of [...urlObject.searchParams.keys()]) {
      if (ignoreURLParametersMatching.some((regExp) => regExp.test(paramName))) {
        urlObject.searchParams.delete(paramName);
      }
    }
    return urlObject;
  }

  // node_modules/workbox-precaching/utils/generateURLVariations.js
  function* generateURLVariations(url, {ignoreURLParametersMatching = [/^utm_/, /^fbclid$/], directoryIndex = "index.html", cleanURLs = true, urlManipulation} = {}) {
    const urlObject = new URL(url, location.href);
    urlObject.hash = "";
    yield urlObject.href;
    const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
    yield urlWithoutIgnoredParams.href;
    if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith("/")) {
      const directoryURL = new URL(urlWithoutIgnoredParams.href);
      directoryURL.pathname += directoryIndex;
      yield directoryURL.href;
    }
    if (cleanURLs) {
      const cleanURL = new URL(urlWithoutIgnoredParams.href);
      cleanURL.pathname += ".html";
      yield cleanURL.href;
    }
    if (urlManipulation) {
      const additionalURLs = urlManipulation({url: urlObject});
      for (const urlToAttempt of additionalURLs) {
        yield urlToAttempt.href;
      }
    }
  }

  // node_modules/workbox-precaching/PrecacheRoute.js
  var PrecacheRoute = class extends Route {
    constructor(precacheController2, options) {
      const match = ({request}) => {
        const urlsToCacheKeys = precacheController2.getURLsToCacheKeys();
        for (const possibleURL of generateURLVariations(request.url, options)) {
          const cacheKey = urlsToCacheKeys.get(possibleURL);
          if (cacheKey) {
            return {cacheKey};
          }
        }
        if (false) {
          logger.debug(`Precaching did not find a match for ` + getFriendlyURL(request.url));
        }
        return;
      };
      super(match, precacheController2.strategy);
    }
  };

  // node_modules/workbox-precaching/addRoute.js
  function addRoute(options) {
    const precacheController2 = getOrCreatePrecacheController();
    const precacheRoute = new PrecacheRoute(precacheController2, options);
    registerRoute(precacheRoute);
  }

  // node_modules/workbox-precaching/matchPrecache.js
  function matchPrecache(request) {
    const precacheController2 = getOrCreatePrecacheController();
    return precacheController2.matchPrecache(request);
  }

  // node_modules/workbox-precaching/precache.js
  function precache(entries) {
    const precacheController2 = getOrCreatePrecacheController();
    precacheController2.precache(entries);
  }

  // node_modules/workbox-precaching/precacheAndRoute.js
  function precacheAndRoute(entries, options) {
    precache(entries);
    addRoute(options);
  }

  // node_modules/workbox-expiration/_version.js
  "use strict";
  try {
    self["workbox:expiration:6.1.5"] && _();
  } catch (e) {
  }

  // node_modules/workbox-expiration/models/CacheTimestampsModel.js
  var DB_NAME = "workbox-expiration";
  var OBJECT_STORE_NAME = "cache-entries";
  var normalizeURL = (unNormalizedUrl) => {
    const url = new URL(unNormalizedUrl, location.href);
    url.hash = "";
    return url.href;
  };
  var CacheTimestampsModel = class {
    constructor(cacheName) {
      this._cacheName = cacheName;
      this._db = new DBWrapper(DB_NAME, 1, {
        onupgradeneeded: (event) => this._handleUpgrade(event)
      });
    }
    _handleUpgrade(event) {
      const db = event.target.result;
      const objStore = db.createObjectStore(OBJECT_STORE_NAME, {keyPath: "id"});
      objStore.createIndex("cacheName", "cacheName", {unique: false});
      objStore.createIndex("timestamp", "timestamp", {unique: false});
      deleteDatabase(this._cacheName);
    }
    async setTimestamp(url, timestamp) {
      url = normalizeURL(url);
      const entry = {
        url,
        timestamp,
        cacheName: this._cacheName,
        id: this._getId(url)
      };
      await this._db.put(OBJECT_STORE_NAME, entry);
    }
    async getTimestamp(url) {
      const entry = await this._db.get(OBJECT_STORE_NAME, this._getId(url));
      return entry.timestamp;
    }
    async expireEntries(minTimestamp, maxCount) {
      const entriesToDelete = await this._db.transaction(OBJECT_STORE_NAME, "readwrite", (txn, done) => {
        const store = txn.objectStore(OBJECT_STORE_NAME);
        const request = store.index("timestamp").openCursor(null, "prev");
        const entriesToDelete2 = [];
        let entriesNotDeletedCount = 0;
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            const result = cursor.value;
            if (result.cacheName === this._cacheName) {
              if (minTimestamp && result.timestamp < minTimestamp || maxCount && entriesNotDeletedCount >= maxCount) {
                entriesToDelete2.push(cursor.value);
              } else {
                entriesNotDeletedCount++;
              }
            }
            cursor.continue();
          } else {
            done(entriesToDelete2);
          }
        };
      });
      const urlsDeleted = [];
      for (const entry of entriesToDelete) {
        await this._db.delete(OBJECT_STORE_NAME, entry.id);
        urlsDeleted.push(entry.url);
      }
      return urlsDeleted;
    }
    _getId(url) {
      return this._cacheName + "|" + normalizeURL(url);
    }
  };

  // node_modules/workbox-expiration/CacheExpiration.js
  var CacheExpiration = class {
    constructor(cacheName, config = {}) {
      this._isRunning = false;
      this._rerunRequested = false;
      if (false) {
        finalAssertExports.isType(cacheName, "string", {
          moduleName: "workbox-expiration",
          className: "CacheExpiration",
          funcName: "constructor",
          paramName: "cacheName"
        });
        if (!(config.maxEntries || config.maxAgeSeconds)) {
          throw new WorkboxError("max-entries-or-age-required", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor"
          });
        }
        if (config.maxEntries) {
          finalAssertExports.isType(config.maxEntries, "number", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor",
            paramName: "config.maxEntries"
          });
        }
        if (config.maxAgeSeconds) {
          finalAssertExports.isType(config.maxAgeSeconds, "number", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor",
            paramName: "config.maxAgeSeconds"
          });
        }
      }
      this._maxEntries = config.maxEntries;
      this._maxAgeSeconds = config.maxAgeSeconds;
      this._matchOptions = config.matchOptions;
      this._cacheName = cacheName;
      this._timestampModel = new CacheTimestampsModel(cacheName);
    }
    async expireEntries() {
      if (this._isRunning) {
        this._rerunRequested = true;
        return;
      }
      this._isRunning = true;
      const minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0;
      const urlsExpired = await this._timestampModel.expireEntries(minTimestamp, this._maxEntries);
      const cache = await self.caches.open(this._cacheName);
      for (const url of urlsExpired) {
        await cache.delete(url, this._matchOptions);
      }
      if (false) {
        if (urlsExpired.length > 0) {
          logger.groupCollapsed(`Expired ${urlsExpired.length} ${urlsExpired.length === 1 ? "entry" : "entries"} and removed ${urlsExpired.length === 1 ? "it" : "them"} from the '${this._cacheName}' cache.`);
          logger.log(`Expired the following ${urlsExpired.length === 1 ? "URL" : "URLs"}:`);
          urlsExpired.forEach((url) => logger.log(`    ${url}`));
          logger.groupEnd();
        } else {
          logger.debug(`Cache expiration ran and found no entries to remove.`);
        }
      }
      this._isRunning = false;
      if (this._rerunRequested) {
        this._rerunRequested = false;
        dontWaitFor(this.expireEntries());
      }
    }
    async updateTimestamp(url) {
      if (false) {
        finalAssertExports.isType(url, "string", {
          moduleName: "workbox-expiration",
          className: "CacheExpiration",
          funcName: "updateTimestamp",
          paramName: "url"
        });
      }
      await this._timestampModel.setTimestamp(url, Date.now());
    }
    async isURLExpired(url) {
      if (!this._maxAgeSeconds) {
        if (false) {
          throw new WorkboxError(`expired-test-without-max-age`, {
            methodName: "isURLExpired",
            paramName: "maxAgeSeconds"
          });
        }
        return false;
      } else {
        const timestamp = await this._timestampModel.getTimestamp(url);
        const expireOlderThan = Date.now() - this._maxAgeSeconds * 1e3;
        return timestamp < expireOlderThan;
      }
    }
    async delete() {
      this._rerunRequested = false;
      await this._timestampModel.expireEntries(Infinity);
    }
  };

  // node_modules/workbox-expiration/ExpirationPlugin.js
  var ExpirationPlugin = class {
    constructor(config = {}) {
      this.cachedResponseWillBeUsed = async ({event, request, cacheName, cachedResponse}) => {
        if (!cachedResponse) {
          return null;
        }
        const isFresh = this._isResponseDateFresh(cachedResponse);
        const cacheExpiration = this._getCacheExpiration(cacheName);
        dontWaitFor(cacheExpiration.expireEntries());
        const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
        if (event) {
          try {
            event.waitUntil(updateTimestampDone);
          } catch (error) {
            if (false) {
              if ("request" in event) {
                logger.warn(`Unable to ensure service worker stays alive when updating cache entry for '${getFriendlyURL(event.request.url)}'.`);
              }
            }
          }
        }
        return isFresh ? cachedResponse : null;
      };
      this.cacheDidUpdate = async ({cacheName, request}) => {
        if (false) {
          finalAssertExports.isType(cacheName, "string", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "cacheDidUpdate",
            paramName: "cacheName"
          });
          finalAssertExports.isInstance(request, Request, {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "cacheDidUpdate",
            paramName: "request"
          });
        }
        const cacheExpiration = this._getCacheExpiration(cacheName);
        await cacheExpiration.updateTimestamp(request.url);
        await cacheExpiration.expireEntries();
      };
      if (false) {
        if (!(config.maxEntries || config.maxAgeSeconds)) {
          throw new WorkboxError("max-entries-or-age-required", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor"
          });
        }
        if (config.maxEntries) {
          finalAssertExports.isType(config.maxEntries, "number", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor",
            paramName: "config.maxEntries"
          });
        }
        if (config.maxAgeSeconds) {
          finalAssertExports.isType(config.maxAgeSeconds, "number", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor",
            paramName: "config.maxAgeSeconds"
          });
        }
      }
      this._config = config;
      this._maxAgeSeconds = config.maxAgeSeconds;
      this._cacheExpirations = new Map();
      if (config.purgeOnQuotaError) {
        registerQuotaErrorCallback(() => this.deleteCacheAndMetadata());
      }
    }
    _getCacheExpiration(cacheName) {
      if (cacheName === cacheNames.getRuntimeName()) {
        throw new WorkboxError("expire-custom-caches-only");
      }
      let cacheExpiration = this._cacheExpirations.get(cacheName);
      if (!cacheExpiration) {
        cacheExpiration = new CacheExpiration(cacheName, this._config);
        this._cacheExpirations.set(cacheName, cacheExpiration);
      }
      return cacheExpiration;
    }
    _isResponseDateFresh(cachedResponse) {
      if (!this._maxAgeSeconds) {
        return true;
      }
      const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
      if (dateHeaderTimestamp === null) {
        return true;
      }
      const now = Date.now();
      return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1e3;
    }
    _getDateHeaderTimestamp(cachedResponse) {
      if (!cachedResponse.headers.has("date")) {
        return null;
      }
      const dateHeader = cachedResponse.headers.get("date");
      const parsedDate = new Date(dateHeader);
      const headerTime = parsedDate.getTime();
      if (isNaN(headerTime)) {
        return null;
      }
      return headerTime;
    }
    async deleteCacheAndMetadata() {
      for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
        await self.caches.delete(cacheName);
        await cacheExpiration.delete();
      }
      this._cacheExpirations = new Map();
    }
  };

  // node_modules/@roxi/routify/workbox-plugin.js
  var freshCache = {
    map: new Map(),
    set(req, value) {
      return this.map.set(reqToStr(req), value);
    },
    get(req) {
      const cache = this.map.get(reqToStr(req));
      if (cache)
        cache.validLeft = (new Date(cache.validUntil) - new Date()) / 1e3;
      return cache;
    }
  };
  var RoutifyPlugin = function(defaultOptions) {
    return {
      cachedResponseWillBeUsed({cacheName, request, matchOptions, cachedResponse, event}) {
        if (getHeaderOptions(request).writeHeaders !== true)
          return cachedResponse;
        const headers = new Headers(cachedResponse.headers);
        const fetch2 = freshCache.get(request) || {};
        for (const [key, val] of Object.entries(fetch2))
          headers.set("x-routify-" + kebabify(key), val);
        headers.set("x-routify-use-cache", "true");
        return cachedResponse.arrayBuffer().then((buffer) => new Response(buffer, {...cachedResponse, headers}));
      },
      cacheDidUpdate: async ({cacheName, request, oldResponse, newResponse, event}) => {
        const prefetchOptions = getPrefetchOptions(event.request);
        const headerOptions = getHeaderOptions(event.request);
        const options = {...defaultOptions, ...prefetchOptions, ...headerOptions};
        const date = Date.now();
        freshCache.set(event.request, {
          ...options,
          validUntil: new Date(date + options.validFor * 1e3).toISOString(),
          cachedAt: new Date(date).toISOString()
        });
      }
    };
  };
  function freshCacheData(event) {
    cleanupFreshCache();
    return freshCache.get(event.request);
  }
  function cleanupFreshCache() {
    freshCache.map.forEach((data, key) => {
      if (new Date(data.validUntil) < new Date()) {
        freshCache.map.delete(key);
      }
    });
  }
  function getPrefetchOptions({referrer}) {
    referrer = referrer.replace(/\w+:\/\/[^/]+/, "");
    const [path, _options] = referrer.split("__[[routify_url_options]]__");
    const options = JSON.parse(decodeURIComponent(_options || "") || "{}");
    return options;
  }
  function getHeaderOptions({headers}) {
    const routifyHeaders = [...headers.entries()].filter(([key]) => key.startsWith("x-routify-"));
    const options = {};
    for (const [key, val] of routifyHeaders) {
      const name = camelize(key.replace("x-routify-", ""));
      options[name] = parse(val);
    }
    return options;
  }
  function reqToStr({url, headers, method}) {
    return JSON.stringify({url, method, headers: [...headers.entries()]});
  }
  function kebabify(str) {
    return str.replace(/[A-Z]/g, (x) => "-" + x.toLowerCase());
  }
  function camelize(str) {
    return str.replace(/-./g, (x) => x.toUpperCase()[1]);
  }
  function parse(str) {
    try {
      return JSON.parse(str);
    } catch (err) {
    }
  }

  // src/sw.js
  var entrypointUrl = "/index.html";
  var fallbackImage = "404.svg";
  var files = self.__WB_MANIFEST;
  var externalAssetsConfig = () => ({
    cacheName: "external",
    plugins: [
      RoutifyPlugin({
        validFor: 60
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        purgeOnQuotaError: true
      })
    ]
  });
  precacheAndRoute(files);
  skipWaiting();
  clientsClaim();
  registerRoute(isLocalPage, matchPrecache(entrypointUrl));
  registerRoute(isLocalAsset, new CacheFirst());
  registerRoute(hasFreshCache, new CacheFirst(externalAssetsConfig()));
  setDefaultHandler(new NetworkFirst(externalAssetsConfig()));
  setCatchHandler(async ({event}) => {
    switch (event.request.destination) {
      case "document":
        return await matchPrecache(entrypointUrl);
      case "image":
        return await matchPrecache(fallbackImage);
      default:
        return Response.error();
    }
  });
  function isLocalAsset({url, request}) {
    return url.host === self.location.host && request.destination != "document";
  }
  function isLocalPage({url, request}) {
    return url.host === self.location.host && request.destination === "document";
  }
  function hasFreshCache(event) {
    return !!freshCacheData(event);
  }
})();
