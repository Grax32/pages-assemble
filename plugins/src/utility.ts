import ts, { SyntaxKind } from 'typescript';

export default class Utility {
  public static createStaticStringArray(name: string, values: string[]): ts.PropertyDeclaration {
    return ts.createProperty(
      undefined,
      [ts.createModifier(SyntaxKind.PublicKeyword), ts.createModifier(SyntaxKind.StaticKeyword)],
      ts.createIdentifier(name),
      undefined,
      ts.createTypeReferenceNode('string[]', undefined),
      ts.createArrayLiteral(values.map(v => ts.createLiteral(v))),
    );
  }
}
