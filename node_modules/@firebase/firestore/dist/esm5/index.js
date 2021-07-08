import e from "@firebase/app";

import { q as r, E as t, B as a, D as s, O as i, a as o, Q as n, j as p, G as m, Y as f, Z as c, X as u, e as l, n as b, i as g, r as h, K as v, p as w } from "./prebuilt-038c95ef-26ab9a06.js";

import { Component as I } from "@firebase/component";

import "tslib";

import "@firebase/util";

import "@firebase/logger";

import "@firebase/webchannel-wrapper";

var P = {
    Firestore: r,
    GeoPoint: s,
    Timestamp: i,
    Blob: o,
    Transaction: n,
    WriteBatch: p,
    DocumentReference: m,
    DocumentSnapshot: f,
    Query: c,
    QueryDocumentSnapshot: u,
    QuerySnapshot: l,
    CollectionReference: b,
    FieldPath: g,
    FieldValue: h,
    setLogLevel: v,
    CACHE_SIZE_UNLIMITED: w
};

/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Registers the main Firestore build with the components framework.
 * Persistence can be enabled via `firebase.firestore().enablePersistence()`.
 */
function d(e) {
    !
    /**
 * Configures Firestore as part of the Firebase SDK by calling registerService.
 *
 * @param firebase - The FirebaseNamespace to register Firestore with
 * @param firestoreFactory - A factory function that returns a new Firestore
 *    instance.
 */
    function(e, r) {
        e.INTERNAL.registerComponent(new I("firestore", (function(e) {
            var t = e.getProvider("app").getImmediate();
            return r(t, e.getProvider("auth-internal"));
        }), "PUBLIC" /* PUBLIC */).setServiceProps(Object.assign({}, P)));
    }(e, (function(e, s) {
        return new r(e, new t(e, s), new a);
    })), e.registerVersion("@firebase/firestore", "2.3.8");
}

d(e);

export { d as registerFirestore };
//# sourceMappingURL=index.js.map
