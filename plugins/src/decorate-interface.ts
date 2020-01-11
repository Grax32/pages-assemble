import ts from 'typescript';

export default function() {
  function visitClasses(ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const visitor: ts.Visitor = node => {
      if (ts.isInterfaceDeclaration(node)) {
        const interfaceName = node.name.getText();

        return [node];
      }
      return ts.visitEachChild(node, visitor, ctx);
    };

    return visitor;
  }

  return (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sf: ts.SourceFile) => {
      return ts.visitNode(sf, visitClasses(ctx, sf));
    };
  };
}
