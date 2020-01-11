import ts from 'typescript';

export default function() {
  function visitClasses(ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const visitorClassDeclarations: ts.Visitor = node => {
      if (ts.isClassDeclaration(node)) {
        const constructorDependencies: string[] = [];

        const visitHeritageClause: ts.Visitor = node => {
          if (ts.isHeritageClause(node)) {
            constructorDependencies.push(...node.types.map(v => v.getText()));
          }

          return ts.visitEachChild(node, visitHeritageClause, ctx);
        };

        const returnValue = ts.visitEachChild(node, visitHeritageClause, ctx);
        console.log('type: ' + node.name?.getText() + ' -- ' + constructorDependencies.join(','));
        return returnValue;
      }

      const returnValue = ts.visitEachChild(node, visitorClassDeclarations, ctx);
      return [returnValue];
    };

    return visitorClassDeclarations;
  }

  return (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sf: ts.SourceFile) => {
      const result = ts.visitNode(sf, visitClasses(ctx, sf));
      return result;
    };
  };
}
