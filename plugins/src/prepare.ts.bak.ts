import ts, { SyntaxKind } from 'typescript';

export default function() {
  const referenceObject = new Map<ts.Node, any>();

  function visitor(ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
      // here we can check each node and potentially return
      // new nodes if we want to leave the node as is, and
      // continue searching through child nodes:

      // if (ts.isInterfaceDeclaration(node)) {
      //   const interfaceName = node.name.getText(sf);
      //   console.log(interfaceName);
      // }

      if (ts.isClassDeclaration(node)) {
        const nodeMeta = {};
        referenceObject.set(node, nodeMeta);

        console.log('----------------------------');
        const className = node.name?.getText(sf) || 'unknown';

        const displayNode: any = Object.assign({}, node);
        displayNode.parent = null;

        /*         const toString = (syntaxKind: SyntaxKind.ExtendsKeyword | SyntaxKind.ImplementsKeyword) => {
          switch (syntaxKind) {
            case SyntaxKind.ExtendsKeyword:
              return 'Extends';
              break;
            case SyntaxKind.ImplementsKeyword:
              return 'Implements';
              break;
            default:
              return 'DUNNO';
              break;
          }
        }; */

        const typeToString = (type: ts.ExpressionWithTypeArguments): string => {
          return type.expression.getText(sf);
        };

        /*         const getAllImplementedInterfaces = (node: ts.ClassLikeDeclarationBase): string[] => {
          const returnValue: string[] = [];
          for (const clause of node.heritageClauses || []) {

            for (const typeNode of clause.types.filter(v => v.kind === SyntaxKind.ImplementsKeyword)) {
            }
          }

          return returnValue;
        }; */

        // const implementedInterfaces;
        // const implementedBases;

        const typeNodes = node.heritageClauses?.map(v => [...v.types]) || [];
        const typesList = ([] as ts.ExpressionWithTypeArguments[]).concat(...typeNodes);
        console.log(node.heritageClauses);
        console.log(className, typesList.map(typeToString));
        console.log('----------------------------');
      }

      return ts.visitEachChild(node, visitor, ctx);
    };

    return visitor;
  }

  return (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sf: ts.SourceFile) => ts.visitNode(sf, visitor(ctx, sf));
  };
}
