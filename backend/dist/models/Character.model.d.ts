import mongoose, { Document } from 'mongoose';
export declare enum CharacterClass {
    WARRIOR = 0,
    MAGE = 1,
    ARCHER = 2,
    ROGUE = 3,
    CLERIC = 4,
    PALADIN = 5
}
export interface ICharacter extends Document {
    walletAddress: string;
    characterName: string;
    characterClass: CharacterClass;
    level: number;
    exp: number;
    hp: number;
    maxHp: number;
    str: number;
    agi: number;
    int: number;
    luk: number;
    vit: number;
    tokenId?: number;
    isNFT: boolean;
    isBoundToAccount: boolean;
    equippedWeapon?: number;
    equippedArmor?: number;
    equippedAccessory?: number;
    lastAdventureTime: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICharacter, {}, {}, {}, mongoose.Document<unknown, {}, ICharacter, {}, {}> & ICharacter & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Character.model.d.ts.map