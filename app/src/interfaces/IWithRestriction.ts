import { IUser } from './IUser';
import { IPosition } from './IPosition';

export interface IWithRestriction {
    user?: IUser;
    positions?: Map<number, IPosition>;
    isAllowed?: boolean; // prop passed from withRestriction decorator
}
