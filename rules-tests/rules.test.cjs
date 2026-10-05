const { before, after, beforeEach, test } = require('node:test');
const { readFileSync } = require('node:fs');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, collection, setDoc, getDoc, getDocs, updateDoc, deleteDoc } = require('firebase/firestore');
const { ref, set, get } = require('firebase/database');
const { ref: storageRef, uploadBytes, getBytes } = require('firebase/storage');
let env;
before(async () => { env = await initializeTestEnvironment({ projectId: 'demo-syn-todo', firestore: { host: '127.0.0.1', port: 8080, rules: readFileSync('../firestore.rules', 'utf8') }, database: { host: '127.0.0.1', port: 9000, rules: readFileSync('../database.rules.json', 'utf8') }, storage: { host: '127.0.0.1', port: 9199, rules: readFileSync('../storage.rules', 'utf8') } }); });
after(async () => { await env?.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });
const task = { description: 'A task', isComplete: false };
test('owner can create, list, update and delete their tasks', async () => {
  const db = env.authenticatedContext('alice').firestore();
  const ref = doc(db, 'users/alice/todos/one');
  await assertSucceeds(setDoc(ref, task));
  await assertSucceeds(getDocs(collection(db, 'users/alice/todos')));
  await assertSucceeds(updateDoc(ref, { isComplete: true }));
  await assertSucceeds(deleteDoc(ref));
});
test('other users cannot read or write an owner task', async () => {
  await env.withSecurityRulesDisabled(ctx => setDoc(doc(ctx.firestore(), 'users/alice/todos/one'), task));
  const db = env.authenticatedContext('bob').firestore();
  await assertFails(getDoc(doc(db, 'users/alice/todos/one')));
  await assertFails(setDoc(doc(db, 'users/alice/todos/two'), task));
  await assertFails(deleteDoc(doc(db, 'users/alice/todos/one')));
});
test('anonymous clients cannot read or write tasks', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, 'users/alice/todos/one')));
  await assertFails(setDoc(doc(db, 'users/alice/todos/one'), task));
});
test('invalid field types, extra fields, and blank text are rejected', async () => {
  const db = env.authenticatedContext('alice').firestore();
  for (const value of [{ ...task, isComplete: 'yes' }, { ...task, admin: true }, { ...task, description: '   ' }, { ...task, description: 'x'.repeat(501) }]) {
    await assertFails(setDoc(doc(db, 'users/alice/todos/one'), value));
  }
});
test('legacy unowned collection remains inaccessible', async () => {
  const db = env.authenticatedContext('alice').firestore();
  await assertFails(getDocs(collection(db, 'todos')));
  await assertFails(setDoc(doc(db, 'todos/one'), task));
});

test('Realtime Database allows only owner-scoped access', async () => {
  const alice = env.authenticatedContext('alice').database();
  const bob = env.authenticatedContext('bob').database();
  const anonymous = env.unauthenticatedContext().database();
  await assertSucceeds(set(ref(alice, 'users/alice/preferences'), { theme: 'dark' }));
  await assertSucceeds(get(ref(alice, 'users/alice/preferences')));
  await assertFails(get(ref(bob, 'users/alice/preferences')));
  await assertFails(set(ref(anonymous, 'users/alice/preferences'), {}));
  await assertFails(set(ref(alice, 'metadata/alice'), {}));
});
test('Storage allows only owner-scoped access', async () => {
  const alice = env.authenticatedContext('alice').storage();
  const bob = env.authenticatedContext('bob').storage();
  const anonymous = env.unauthenticatedContext().storage();
  const bytes = new Uint8Array([1, 2, 3]);
  await assertSucceeds(uploadBytes(storageRef(alice, 'users/alice/test.txt'), bytes));
  await assertSucceeds(getBytes(storageRef(alice, 'users/alice/test.txt')));
  await assertFails(getBytes(storageRef(bob, 'users/alice/test.txt')));
  await assertFails(uploadBytes(storageRef(anonymous, 'users/alice/test.txt'), bytes));
  await assertFails(uploadBytes(storageRef(alice, 'shared/test.txt'), bytes));
});
