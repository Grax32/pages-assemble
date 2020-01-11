import ts from 'typescript';
import Utility from './utility';

export default function() {
  const interfaceList: string[] = [];

  function visitClasses(ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const visitorClassDeclarations: ts.Visitor = node => {
      if (ts.isClassDeclaration(node)) {
        const lastNode = node.members[node.members.length - 1];
        const constructorDependencies: string[] = [];

        const visitConstructorDeclaration: ts.Visitor = node => {
          if (ts.isConstructorDeclaration(node)) {
            constructorDependencies.push(...node.parameters.map(v => v.type?.getText() ?? 'UNKNOWN'));
          }

          const result = ts.visitEachChild(node, visitConstructorDeclaration, ctx);

          if (node === lastNode) {
            const insertProp = Utility.createStaticStringArray('constructorDependencies', constructorDependencies);
            return [result, insertProp];
          }

          return result;
        };

        return ts.visitEachChild(node, visitConstructorDeclaration, ctx);
      }

      const returnValue = ts.visitEachChild(node, visitorClassDeclarations, ctx);
      return returnValue;
    };

    return visitorClassDeclarations;
  }

  function visitInterfaces(ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const visitor: ts.Visitor = node => {
      if (ts.isInterfaceDeclaration(node)) {
        const name = node.name.getText();
        interfaceList.push(name);
      }
      const returnValue = ts.visitEachChild(node, visitor, ctx);
      return returnValue;
    };

    return visitor;
  }

  function injectCollections(ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const visitor: ts.Visitor = node => {
      const returnValue = ts.visitEachChild(node, visitor, ctx);
      return returnValue;
    };

    return visitor;
  }	

  return (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sf: ts.SourceFile) => {
      let result = ts.visitNode(sf, visitClasses(ctx, sf));
      result = ts.visitNode(sf, visitInterfaces(ctx,sf));
      result = ts.visitNode(sf, injectCollections(ctx, sf));
      return result;
    };
  };
}
