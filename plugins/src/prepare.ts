import ts, { SyntaxKind } from 'typescript';

/* 
function getParentNodes(node: ts.Node): ts.Node[] {
  const returnvalue: ts.Node[] = [];
  let thisNode = node;
  while (thisNode) {
    returnvalue.push(thisNode);
    thisNode = thisNode.parent;
  }

  return returnvalue;
}
*/

function findMatchingParentNode(node: ts.Node, isMatch: (matchNode: ts.Node) => boolean) {
  let searchNode = <ts.Node>node;
  while (searchNode && !isMatch(searchNode)) {
    searchNode = searchNode.parent;
  }

  return searchNode;
}

function findParentNodeOfKind(node: ts.Node, kind: SyntaxKind, throwIfNotFound: boolean) {
  let classDeclarationNode = <ts.Node>node;
  while (classDeclarationNode && classDeclarationNode.kind !== kind) {
    classDeclarationNode = classDeclarationNode.parent;
  }

  if (!classDeclarationNode && throwIfNotFound) {
    throw new Error('Unable to find node of type');
  }

  return classDeclarationNode;
}

function createStaticStringArray(name: string, values: string[]): ts.PropertyDeclaration {
  return ts.createProperty(
    undefined,
    [ts.createModifier(SyntaxKind.PublicKeyword), ts.createModifier(SyntaxKind.StaticKeyword)],
    ts.createIdentifier(name),
    undefined,
    ts.createTypeReferenceNode('string[]', undefined),
    ts.createArrayLiteral(values.map(v => ts.createLiteral(v))),
  );
}

class NodeContext {
  public nodes: ts.Node[] = [];
  public logging = false;
  public indent = '';
  public nodeStore: { [prop: string]: ts.Node } = {};
}

export default function() {
  const nodeContextCollection = new Map<ts.Node, NodeContext>();

  // const logNode = (node: ts.Node): void => {
  //   const displayNode: any = {};
  //   Object.assign(displayNode, node);
  //   displayNode.parent = null;
  //   console.log(displayNode);
  // };

  const SyntaxKindMap = new Map<SyntaxKind, string>();
  const getSyntaxKindValue = (v: string) => (<any>ts.SyntaxKind)[v];
  Object.keys(ts.SyntaxKind).forEach(v => SyntaxKindMap.set(getSyntaxKindValue(v), v));
  let rootNode: ts.Node | null;

  function visitClasses(ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (!node.parent) {
        console.log('ROOT: ' + SyntaxKindMap.get(node.kind));
        console.log(sf.fileName);
        rootNode = node;
      
      }

      if (node.parent === rootNode) {
        console.log('LVL2: ' + SyntaxKindMap.get(node.kind));
      }

      const thisNodeContext = new NodeContext();
      const parentNodeContext = nodeContextCollection.get(node.parent);
      nodeContextCollection.set(node, thisNodeContext);
      let additionalResult: ts.Node[] = [];

      thisNodeContext.logging = !!parentNodeContext?.logging;
      thisNodeContext.indent = (parentNodeContext?.indent || '') + '  ';

      const colorReset = '\x1b[0m';
      const colorFgRed = '\x1b[31m';
      const colorFgGreen = '\x1b[32m';

      const log = (message: string | undefined, ...args: any[]) => {
        if (thisNodeContext.logging && message) {
          console.log(thisNodeContext.indent + message, ...args);
        }
      };

      const logRed = (message: string | undefined, ...args: any[]) => {
        message = colorFgRed + message + colorReset;
        log(message, ...args);
      };

      const logGreen = (message: string | undefined, ...args: any[]) => {
        message = colorFgGreen + message + colorReset;
        log(message, ...args);
      };

      if (ts.isClassDeclaration(node)) {
        if (node.name?.getText() === 'ConsoleLogger') {
          thisNodeContext.logging = true;
        }
      }

      log('node kind', SyntaxKindMap.get(node.kind));

      if (ts.isClassOrTypeElement(node)) {
        logGreen('name: ' + node.name?.getText());
      }

      const getClassOrInterfaceContext = () => {
        const isMatch = (node: ts.Node) => ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node);
        const classOrTypeNode = findMatchingParentNode(node, isMatch);
        const classOrTypeContext = nodeContextCollection.get(classOrTypeNode)!;
        return classOrTypeContext;
      };

      if (ts.isConstructorDeclaration(node)) {
        log('constructor');
        const parameterTypeStrings = node.parameters.map(v => v.type?.getText() || 'UNKNOWN');
        const newStaticProperty = createStaticStringArray('constructorTypes', parameterTypeStrings);
        additionalResult.push(newStaticProperty);

        const assignableTo = getClassOrInterfaceContext().nodeStore.assignableTo;
        if (assignableTo) {
          additionalResult.push(assignableTo);
        }
      }

      if (ts.isHeritageClause(node)) {
        const assignableTypes = node.types.map(v => v.getText());
        getClassOrInterfaceContext().nodeStore.assignableTo = createStaticStringArray('assignableTo', assignableTypes);
      }

      if (ts.isClassDeclaration(node)) {
        const decorators = [...(node.decorators || [])];
        const injectableDecorators = ['injectable', 'registerAs'];
        const markedInjectable = decorators.some(v => injectableDecorators.includes(v.getText()));
      }

      if (ts.isClassOrTypeElement(node)) {
        // const decorators = [...(node.decorators || [])];
        // const p = ts.createIdentifier('Reflect.metadata');
        // const parm = ts.createLiteral('injector:parameterTypesXX');
        // const value1 = ts.createLiteral('virgin daiquiri');
        // const valueArray = ts.createArrayLiteral([value1]);
        // const call = ts.createCall(p, undefined, [parm, valueArray]);
        // const newDecorator = ts.createDecorator(call);
        // decorators.push(newDecorator);
        // node.decorators = ts.createNodeArray(decorators);
        // return node;
        // const classDec = ts.createClassDeclaration(
        //   decorators,
        //   node.modifiers,
        //   node.name?.getText(),
        //   node.typeParameters,
        //   node.heritageClauses,
        //   node.members,
        // );
        // return classDec;
      }

      const returnValue = ts.visitEachChild(node, visitor, ctx);

      additionalResult.push(...(nodeContextCollection.get(node)?.nodes || []));
      nodeContextCollection.delete(node);
      return [returnValue, ...additionalResult];
    };

    return visitor;
  }

  return (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sf: ts.SourceFile) => {
      let result = sf;
      //result = ts.visitNode(result, visitInterfaces(ctx, sf));
      result = ts.visitNode(result, visitClasses(ctx, sf));
      return result;
    };
  };
}
