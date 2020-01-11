import { Container } from 'inversify';
import * as interfaces from './interfaces/index';

var container = new Container();
//container.bind<interfaces.IBuildModule>( interfaces.IBuildModuleSymbol ).to(Ninja);
// container.bind<Weapon>(TYPES.Weapon).to(Katana);
// container.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

export default container;
