# TQL

> 🚧 This is fork is intended to be a continuation of [@timkendall/tql](https://github.com/timkendall/tql) which is no longer under development.

**tql** is a TypeScript GraphQL query builder.

- 🔒 **Fully Type-safe** - Operation results and variables are fully type-safe thanks to TypeScript's advanced type-system.
- 🔌 **Backendless**: - Integrate with any GraphQL client to execute queries.
- 🔮 **Automatic Variables**: - Variable definitions are automatically derived based on usage.
- 📝 **Inline Documentation**: JSDoc comments provide descriptions and deprecation warnings for fields directly in your editor.
- ⚡ **Single Dependency**: [`graphql-js`](https://github.com/graphql/graphql-js) is our single runtime (peer) dependency.

## [Try it Out](https://codesandbox.io/s/tql-starwars-wlfg9?file=/src/index.ts&runonclick=1)

Try out our pre-compiled Star Wars GraphQL SDK on [CodeSandbox](https://codesandbox.io/s/tql-starwars-wlfg9?file=/src/index.ts&runonclick=1)!

## Installation

1. `npm install @lorefnon/tql@beta`

   - **TypeScript 4.1+** is required for [Recursive Conditional Type](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#recursive-conditional-types) support

2. Generate an SDK with `npx @lorefnon/tql-gen <schema> -o sdk.ts`

`<schema>` can be a path to local file or an http endpoint url.

## Usage

Import selector functions to start defining queries 🎉

```typescript
import { useQuery } from "@apollo/client";

// SDK generated in previous setup
import { $, character, query } from "./starwars";

// define reusable selections
const CHARACTER = character(t => [
  t.id(),
  t.name(),
  t.appearsIn(),
]);

const QUERY = query((t) => [
  t.reviews({ episode: Episode.EMPIRE }, (t) => [
    t.stars(),
    t.commentary(),
  ]),

  t.human({ id: $("id") }, (t) => [
    t.__typename(),
    t.id(),
    t.name(),
    t.appearsIn(),
    t.homePlanet(),

    // deprecated field should be properly picked-up by your editor
    t.mass(),

    t.friends((t) =>
      [
        t.__typename(),

        ...CHARACTER,
        // or
        CHARACTER.toInlineFragment(),

        t.on("Human", (t) => [t.homePlanet()]),
        t.on("Droid", (t) => [t.primaryFunction()]),
      ] as const
    ),

    t.starships((t) => [t.id(), t.name()]),
  ]),
]).build({ name: "Example" });

// type-safe result and variables 👍
const { data } = useQuery(QUERY, { variables: { id: "1011" } });
```

## Inspiration

I was inspired by the features and DSL's of [graphql-nexus](https://github.com/graphql-nexus/schema), [graphql_ppx](https://github.com/mhallin/graphql_ppx), [gqless](https://github.com/gqless/gqless), and [caliban](https://github.com/ghostdogpr/caliban).

## License

MIT
