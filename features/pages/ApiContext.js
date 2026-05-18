import { request } from 'playwright';

export class ApiContext {
  constructor() {
    this.context  = null;
    this.response = null;
    this.body     = null;
    this.baseUrl  = 'https://reqres.in';
    this.apiKey   = process.env.REQRES_API_KEY;
  }

  // ─── Setup & teardown ─────────────────────────────────────────────────────

  async init() {
    if (!this.apiKey) {
      throw new Error('REQRES_API_KEY is required for @api tests. Create a key at https://app.reqres.in/api-keys and set it before running API tests.');
    }

    this.context = await request.newContext({
      baseURL: this.baseUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept'      : 'application/json',
        'x-api-key'   : this.apiKey,
      },
    });
  }

  async dispose() {
    if (this.context) await this.context.dispose();
  }

  // ─── HTTP methods ─────────────────────────────────────────────────────────

  async get(endpoint) {
    this.response = await this.context.get(this.apiPath(endpoint));
    this.body     = await this.response.json().catch(() => null);
    return this.response;
  }

  async post(endpoint, payload) {
    this.response = await this.context.post(this.apiPath(endpoint), {
      data: payload,
    });
    this.body = await this.response.json().catch(() => null);
    return this.response;
  }

  async put(endpoint, payload) {
    this.response = await this.context.put(this.apiPath(endpoint), {
      data: payload,
    });
    this.body = await this.response.json().catch(() => null);
    return this.response;
  }

  async patch(endpoint, payload) {
    this.response = await this.context.patch(this.apiPath(endpoint), {
      data: payload,
    });
    this.body = await this.response.json().catch(() => null);
    return this.response;
  }

  async delete(endpoint) {
    this.response = await this.context.delete(this.apiPath(endpoint));
    // 204 responses have no body
    this.body = this.response.status() === 204
      ? null
      : await this.response.json().catch(() => null);
    return this.response;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  getStatus() {
    return this.response.status();
  }

  getBody() {
    return this.body;
  }

  apiPath(endpoint) {
    return endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
  }
}
