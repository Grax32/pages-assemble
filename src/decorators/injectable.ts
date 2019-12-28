export function injectable<TConcrete, TInterface>() {
    
  return function(ctor: (new (...args: any) => TConcrete) & (new (...args: any) => TInterface)) {
//console.log(TConcrete + 'is injectable');
process.exit();

  };
}
