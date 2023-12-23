import freeze from "deep-freeze";
import { expectAssignable } from "tsd";

import { field, Result, selectionSet } from "../src";

interface Schema {
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ID: string;

  Query: Query;
  User: User;
}

interface Query {
  __typename: "Query";
  viewer: User;
  friendsByUserId: User[] | null;
}

interface User {
  __typename: "User";
  id: string;
  firstName: string;
  age: number | null;
  friends: User[] | null;
}

type f = User["friends"] extends Array<any> | null ? true : false;
type isNullable = null extends User["friends"] ? true : false;

const selection = selectionSet([
  field("viewer", undefined, selectionSet([field("id")])),
  field(
    "friendsByUserId",
    undefined,
    selectionSet([
      field("id"),
      field("firstName"),
      field("age"),
      field("friends", undefined, selectionSet([field("id")])),
    ]),
  ),
]);

type Test = Result<Schema, Query, typeof selection>;

expectAssignable<Test>(
  freeze({
    viewer: {
      id: "foo",
    },
    friendsByUserId: [
      {
        id: "foo",
        firstName: "Tim",
        age: 69,
        friends: [{ id: "bar" }],
      },
    ],
  }),
);

expectAssignable<Test>(
  freeze({
    viewer: {
      id: "foo",
    },
    friendsByUserId: null,
  }),
);
