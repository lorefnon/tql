import type { GraphQLSchema, OperationTypeNode } from "graphql";
import { Kind, TypeInfo, visit, visitWithTypeInfo } from "graphql";
import type { O, U } from "ts-toolbelt";

import {
  Argument,
  Field,
  InlineFragment,
  NamedType,
  operation,
  Selection,
  SelectionSet,
  Variable,
  variable,
  VariableDefinition,
  variableDefinition,
} from "./AST";

export const $ = <Name extends string>(name: Name): Variable<Name> => variable(name);

export const buildVariableDefinitions = <T extends SelectionSet<any>>(
  schema: GraphQLSchema,
  root: OperationTypeNode,
  selectionSet: T,
): Array<VariableDefinition<any, any>> => {
  const variableDefinitions: VariableDefinition<any, any>[] = [];
  const typeInfo = new TypeInfo(schema);

  // @note need to wrap selectionset in an operation (root) for TypeInfo to track correctly
  const operationDefinition = operation(
    root,
    "",
    selectionSet,
    variableDefinitions,
  );

  const visitor = visitWithTypeInfo(typeInfo, {
    [Kind.ARGUMENT]: (node) => {
      const type = typeInfo.getArgument()?.astNode?.type!;

      if (node.value.kind === "Variable") {
        // define the `VariableDefinition`
        variableDefinitions.push(variableDefinition(node.value, type));
      }
    },
  });

  // @todo return from here
  visit(operationDefinition, visitor);

  return variableDefinitions;
};

// @note Traverse the AST extracting `Argument` nodes w/ values of `Variable`.
// Extract the type the Variable value needs to be against/the Schema.
export type Variables<
  Schema extends Record<string, any>,
  RootType extends Record<string, any>,
  S extends SelectionSet<ReadonlyArray<Selection>> | undefined,
> = U.Merge<
  undefined extends S ? {}
    : S extends SelectionSet<ReadonlyArray<Selection>>
      ? S["selections"][number] extends infer Selection
        ? Selection extends Field<infer FieldName, infer FieldArgs, infer SS, any> ? O.Merge<
          FilterMapArguments<RootType, FieldName, FieldArgs>,
          Variables<Schema, RootType[FieldName], SS>
        >
        : Selection extends InlineFragment<
          NamedType<infer Typename>,
          infer FragSelection
        > ? Variables<Schema, Schema[Typename], FragSelection>
        : {}
      : {}
    : {}
>;

// @note filter on `Argument`'s that have values of `Variable`
// @todo replace with actual `Filter` type
type FilterMapArguments<
  Type extends Record<any, any>,
  FieldName extends string,
  FieldArgs extends Array<Argument<any, any>> | undefined,
> = FieldArgs extends Array<Argument<infer ArgName, infer ArgValue>>
  ? ArgValue extends Variable<infer VName> ? Record<VName, VariableType<Type, FieldName, ArgName>>
  : {}
  : {};

type VariableType<
  Parent extends Record<any, any>,
  Field extends string,
  Arg extends string,
> =
  // see if the field is parameterized
  Parent[Field] extends (variables: any) => any ? Parameters<Parent[Field]>[0] extends infer U // get the `variables`  arg
    ? // ensure the "variables" parameter is a Record
    // @note too-bad JavaScript doesn't support named arguments
    U extends Record<infer VarName, infer VarType> ? // exract the cooresponding type for the argument
    VarName extends Arg ? VarType
    : never
    : never
  : never
    : never;
