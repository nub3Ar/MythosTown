var _AbstractPage_client;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../internal/tslib.mjs";
import { AnthropicError } from "./error.mjs";
import { defaultParseResponse } from "../internal/parse.mjs";
import { APIPromise } from "./api-promise.mjs";
import { startApiCallSpan } from "../internal/tracing.mjs";
import { maybeObj } from "../internal/utils/values.mjs";
export var AbstractPage = /* @__PURE__ */ (() => {
    class AbstractPage {
        constructor(client, response, body, options) {
            _AbstractPage_client.set(this, void 0);
            __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
            this.options = options;
            this.response = response;
            this.body = body;
        }
        hasNextPage() {
            const items = this.getPaginatedItems();
            if (!items.length)
                return false;
            return this.nextPageRequestOptions() != null;
        }
        async getNextPage() {
            const nextOptions = this.nextPageRequestOptions();
            if (!nextOptions) {
                throw new AnthropicError('No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.');
            }
            // Each page is its own API call, with its own call span. `nextOptions` copies the previous
            // page's options, including its `__span`, which has already ended.
            const span = this.options.__span;
            return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, {
                ...nextOptions,
                __span: span &&
                    startApiCallSpan(__classPrivateFieldGet(this, _AbstractPage_client, "f"), span.name, { openTelemetry: this.options.openTelemetry }, {
                        route: span.route,
                        queryParams: span.queryParams,
                        contentQueryParams: span.contentQueryParams,
                        attributes: span.attributes,
                    }),
            });
        }
        async *iterPages() {
            let page = this;
            yield page;
            while (page.hasNextPage()) {
                page = await page.getNextPage();
                yield page;
            }
        }
        async *[(_AbstractPage_client = new WeakMap(), Symbol.asyncIterator)]() {
            for await (const page of this.iterPages()) {
                for (const item of page.getPaginatedItems()) {
                    yield item;
                }
            }
        }
    }
    return AbstractPage;
})();
/**
 * This subclass of Promise will resolve to an instantiated Page once the request completes.
 *
 * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
 *
 *    for await (const item of client.items.list()) {
 *      console.log(item)
 *    }
 */
export var PagePromise = /* @__PURE__ */ (() => {
    /**
     * This subclass of Promise will resolve to an instantiated Page once the request completes.
     *
     * It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
     *
     *    for await (const item of client.items.list()) {
     *      console.log(item)
     *    }
     */
    class PagePromise extends APIPromise {
        constructor(client, request, Page) {
            super(client, request, async (client, props) => new Page(client, props.response, await defaultParseResponse(client, props), props.options));
        }
        /**
         * Allow auto-paginating iteration on an unawaited list call, eg:
         *
         *    for await (const item of client.items.list()) {
         *      console.log(item)
         *    }
         */
        async *[Symbol.asyncIterator]() {
            const page = await this;
            for await (const item of page) {
                yield item;
            }
        }
    }
    return PagePromise;
})();
export class Page extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.has_more = body.has_more || false;
        this.first_id = body.first_id || null;
        this.last_id = body.last_id || null;
    }
    getPaginatedItems() {
        return this.data ?? [];
    }
    hasNextPage() {
        if (this.has_more === false) {
            return false;
        }
        return super.hasNextPage();
    }
    nextPageRequestOptions() {
        if (this.options.query?.['before_id']) {
            // in reverse
            const first_id = this.first_id;
            if (!first_id) {
                return null;
            }
            return {
                ...this.options,
                query: {
                    ...maybeObj(this.options.query),
                    before_id: first_id,
                },
            };
        }
        const cursor = this.last_id;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            query: {
                ...maybeObj(this.options.query),
                after_id: cursor,
            },
        };
    }
}
export class TokenPage extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.has_more = body.has_more || false;
        this.next_page = body.next_page || null;
    }
    getPaginatedItems() {
        return this.data ?? [];
    }
    hasNextPage() {
        if (this.has_more === false) {
            return false;
        }
        return super.hasNextPage();
    }
    nextPageRequestOptions() {
        const cursor = this.next_page;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            query: {
                ...maybeObj(this.options.query),
                page_token: cursor,
            },
        };
    }
}
export class PageCursor extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.next_page = body.next_page || null;
    }
    getPaginatedItems() {
        return this.data ?? [];
    }
    hasNextPage() {
        return this.nextPageRequestOptions() != null;
    }
    nextPageRequestOptions() {
        const cursor = this.next_page;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            query: {
                ...maybeObj(this.options.query),
                page: cursor,
            },
        };
    }
}
export class BidirectionalPageCursor extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.next_page = body.next_page || null;
        this.prev_page = body.prev_page || null;
    }
    getPaginatedItems() {
        return this.data ?? [];
    }
    hasNextPage() {
        return this.nextPageRequestOptions() != null;
    }
    nextPageRequestOptions() {
        const cursor = this.next_page;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            query: {
                ...maybeObj(this.options.query),
                page: cursor,
            },
        };
    }
}
export class ReportPageCursor extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.next_page = body.next_page || null;
        this.has_more = body.has_more || false;
        this.data_refreshed_at = body.data_refreshed_at || null;
    }
    getPaginatedItems() {
        return this.data ?? [];
    }
    hasNextPage() {
        if (this.has_more === false) {
            return false;
        }
        return this.nextPageRequestOptions() != null;
    }
    nextPageRequestOptions() {
        const cursor = this.next_page;
        if (!cursor) {
            return null;
        }
        return {
            ...this.options,
            query: {
                ...maybeObj(this.options.query),
                page: cursor,
            },
        };
    }
}
//# sourceMappingURL=pagination.mjs.map