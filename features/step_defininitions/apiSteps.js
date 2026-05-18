import { When, Then, Before, After } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { ApiContext } from '../pages/ApiContext.js';

// ─── API hooks — separate from UI hooks ───────────────────────────────────────

Before({ tags: '@api' }, async function () {
  this.api = new ApiContext();
  await this.api.init();
});

After({ tags: '@api' }, async function () {
  if (this.api) await this.api.dispose();
});

// ─── Request steps ────────────────────────────────────────────────────────────

When('I send a GET request to {string}', async function (endpoint) {
  await this.api.get(endpoint);
});

When('I send a POST request to {string} with body:', async function (endpoint, body) {
  const payload = JSON.parse(body);
  await this.api.post(endpoint, payload);
});

When('I send a PUT request to {string} with body:', async function (endpoint, body) {
  const payload = JSON.parse(body);
  await this.api.put(endpoint, payload);
});

When('I send a PATCH request to {string} with body:', async function (endpoint, body) {
  const payload = JSON.parse(body);
  await this.api.patch(endpoint, payload);
});

When('I send a DELETE request to {string}', async function (endpoint) {
  await this.api.delete(endpoint);
});

// ─── Response status assertions ───────────────────────────────────────────────

Then('the response status should be {int}', async function (expectedStatus) {
  const actualStatus = this.api.getStatus();
  assert.equal(actualStatus, expectedStatus);
});

// ─── Response body assertions ─────────────────────────────────────────────────

Then('the response should contain user id {int}', async function (expectedId) {
  const body = this.api.getBody();
  assert.equal(body.data.id, expectedId);
});

Then('the response should contain email {string}', async function (expectedEmail) {
  const body = this.api.getBody();
  assert.equal(body.data.email, expectedEmail);
});

Then('the response should have {int} users in the list', async function (expectedCount) {
  const body = this.api.getBody();
  assert.equal(body.data.length, expectedCount);
});

Then('the response total should be {int}', async function (expectedTotal) {
  const body = this.api.getBody();
  assert.equal(body.total, expectedTotal);
});

Then('the response should contain name {string}', async function (expectedName) {
  const body = this.api.getBody();
  assert.equal(body.name, expectedName);
});

Then('the response should contain job {string}', async function (expectedJob) {
  const body = this.api.getBody();
  assert.equal(body.job, expectedJob);
});

Then('the response should have an id', async function () {
  const body = this.api.getBody();
  assert.notEqual(body.id, undefined);
  assert.notEqual(body.id, null);
});

Then('the response should have an updatedAt field', async function () {
  const body = this.api.getBody();
  assert.notEqual(body.updatedAt, undefined);
});

Then('the response should have a token', async function () {
  const body = this.api.getBody();
  assert.notEqual(body.token, undefined);
  assert.ok(body.token.length > 0);
});

Then('the response error should be {string}', async function (expectedError) {
  const body = this.api.getBody();
  assert.equal(body.error, expectedError);
});
