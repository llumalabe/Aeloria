// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AeloriaCharacter
 * @dev NFT Contract for Aeloria Game Characters
 */
contract AeloriaCharacter is ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Character Classes
    enum CharacterClass { Warrior, Mage, Archer, Rogue, Cleric, Paladin }

    // Character Stats
    struct CharacterStats {
        uint8 level;
        uint16 exp;
        uint16 hp;
        uint16 maxHp;
        uint8 str;  // Strength
        uint8 agi;  // Agility
        uint8 intelligence;  // Intelligence
        uint8 luk;  // Luck
        uint8 vit;  // Vitality
        CharacterClass class;
        uint256 lastAdventureTime;
    }

    // Passive Skills per class
    struct PassiveSkill {
        string name;
        string description;
        uint8 bonusStr;
        uint8 bonusAgi;
        uint8 bonusIntelligence;
        uint8 bonusLuk;
        uint8 bonusVit;
    }

    // Character data
    mapping(uint256 => CharacterStats) public characters;
    mapping(CharacterClass => PassiveSkill[]) public classPassives;

    // Events
    event CharacterMinted(address indexed owner, uint256 tokenId, CharacterClass class);
    event CharacterLevelUp(uint256 tokenId, uint8 newLevel);
    event CharacterHealed(uint256 tokenId, uint16 newHp);
    event ExpGained(uint256 tokenId, uint16 expGained, uint16 totalExp);

    constructor() ERC721("Aeloria Character", "ACHAR") Ownable(msg.sender) {
        _initializePassiveSkills();
    }

    /**
     * @dev Initialize passive skills for each class
     */
    function _initializePassiveSkills() private {
        // Warrior Passives
        classPassives[CharacterClass.Warrior].push(PassiveSkill({
            name: "Titan's Strength",
            description: "Increases STR and VIT",
            bonusStr: 5,
            bonusAgi: 0,
            bonusIntelligence: 0,
            bonusLuk: 0,
            bonusVit: 3
        }));

        // Mage Passives
        classPassives[CharacterClass.Mage].push(PassiveSkill({
            name: "Arcane Mastery",
            description: "Increases INT and reduces MP cost",
            bonusStr: 0,
            bonusAgi: 0,
            bonusIntelligence: 7,
            bonusLuk: 2,
            bonusVit: 0
        }));

        // Archer Passives
        classPassives[CharacterClass.Archer].push(PassiveSkill({
            name: "Eagle Eye",
            description: "Increases AGI and LUK",
            bonusStr: 0,
            bonusAgi: 5,
            bonusIntelligence: 0,
            bonusLuk: 4,
            bonusVit: 0
        }));

        // Rogue Passives
        classPassives[CharacterClass.Rogue].push(PassiveSkill({
            name: "Shadow Step",
            description: "Increases AGI and LUK dramatically",
            bonusStr: 0,
            bonusAgi: 6,
            bonusIntelligence: 0,
            bonusLuk: 3,
            bonusVit: 0
        }));

        // Cleric Passives
        classPassives[CharacterClass.Cleric].push(PassiveSkill({
            name: "Divine Blessing",
            description: "Increases INT and VIT",
            bonusStr: 0,
            bonusAgi: 0,
            bonusIntelligence: 4,
            bonusLuk: 1,
            bonusVit: 4
        }));

        // Paladin Passives
        classPassives[CharacterClass.Paladin].push(PassiveSkill({
            name: "Holy Guardian",
            description: "Balanced stats increase",
            bonusStr: 3,
            bonusAgi: 2,
            bonusIntelligence: 2,
            bonusLuk: 1,
            bonusVit: 3
        }));
    }

    /**
     * @dev Mint a new character
     */
    function mintCharacter(CharacterClass _class, string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        // Initialize character stats based on class
        CharacterStats memory newChar;
        newChar.level = 1;
        newChar.exp = 0;
        newChar.class = _class;
        newChar.lastAdventureTime = block.timestamp;

        // Set base stats based on class
        if (_class == CharacterClass.Warrior) {
            newChar.str = 15;
            newChar.agi = 8;
            newChar.intelligence = 5;
            newChar.luk = 7;
            newChar.vit = 12;
            newChar.maxHp = 150;
        } else if (_class == CharacterClass.Mage) {
            newChar.str = 5;
            newChar.agi = 7;
            newChar.intelligence = 18;
            newChar.luk = 10;
            newChar.vit = 6;
            newChar.maxHp = 80;
        } else if (_class == CharacterClass.Archer) {
            newChar.str = 8;
            newChar.agi = 16;
            newChar.intelligence = 7;
            newChar.luk = 12;
            newChar.vit = 8;
            newChar.maxHp = 100;
        } else if (_class == CharacterClass.Rogue) {
            newChar.str = 10;
            newChar.agi = 17;
            newChar.intelligence = 6;
            newChar.luk = 15;
            newChar.vit = 7;
            newChar.maxHp = 90;
        } else if (_class == CharacterClass.Cleric) {
            newChar.str = 6;
            newChar.agi = 8;
            newChar.intelligence = 15;
            newChar.luk = 9;
            newChar.vit = 11;
            newChar.maxHp = 110;
        } else if (_class == CharacterClass.Paladin) {
            newChar.str = 12;
            newChar.agi = 9;
            newChar.intelligence = 10;
            newChar.luk = 8;
            newChar.vit = 13;
            newChar.maxHp = 140;
        }

        newChar.hp = newChar.maxHp;
        characters[newTokenId] = newChar;

        emit CharacterMinted(msg.sender, newTokenId, _class);
        return newTokenId;
    }

    /**
     * @dev Add experience to character
     */
    function addExp(uint256 tokenId, uint16 expAmount) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        CharacterStats storage char = characters[tokenId];
        char.exp += expAmount;

        emit ExpGained(tokenId, expAmount, char.exp);

        // Check for level up (100 exp per level)
        uint16 expNeeded = uint16(char.level * 100);
        while (char.exp >= expNeeded && char.level < 100) {
            char.exp -= expNeeded;
            char.level++;
            
            // Increase stats on level up
            char.str += 2;
            char.agi += 2;
            char.intelligence += 2;
            char.luk += 1;
            char.vit += 2;
            char.maxHp += 10;
            char.hp = char.maxHp; // Full heal on level up

            emit CharacterLevelUp(tokenId, char.level);
            expNeeded = uint16(char.level * 100);
        }
    }

    /**
     * @dev Damage character (reduce HP)
     */
    function damageCharacter(uint256 tokenId, uint16 damage) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        CharacterStats storage char = characters[tokenId];
        if (char.hp > damage) {
            char.hp -= damage;
        } else {
            char.hp = 0;
        }
    }

    /**
     * @dev Heal character
     */
    function healCharacter(uint256 tokenId, uint16 healAmount) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        CharacterStats storage char = characters[tokenId];
        char.hp += healAmount;
        if (char.hp > char.maxHp) {
            char.hp = char.maxHp;
        }

        emit CharacterHealed(tokenId, char.hp);
    }

    /**
     * @dev Full heal character (costs in-game currency handled off-chain)
     */
    function fullHeal(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        CharacterStats storage char = characters[tokenId];
        char.hp = char.maxHp;

        emit CharacterHealed(tokenId, char.hp);
    }

    /**
     * @dev Update last adventure time
     */
    function updateAdventureTime(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        characters[tokenId].lastAdventureTime = block.timestamp;
    }

    /**
     * @dev Get character stats
     */
    function getCharacterStats(uint256 tokenId) public view returns (CharacterStats memory) {
        return characters[tokenId];
    }

    /**
     * @dev Get passive skills for a class
     */
    function getClassPassives(CharacterClass _class) public view returns (PassiveSkill[] memory) {
        return classPassives[_class];
    }

    /**
     * @dev Get total stats including passive bonuses
     */
    function getTotalStats(uint256 tokenId) public view returns (
        uint8 totalStr,
        uint8 totalAgi,
        uint8 totalIntelligence,
        uint8 totalLuk,
        uint8 totalVit
    ) {
        CharacterStats memory char = characters[tokenId];
        PassiveSkill[] memory passives = classPassives[char.class];

        totalStr = char.str;
        totalAgi = char.agi;
        totalIntelligence = char.intelligence;
        totalLuk = char.luk;
        totalVit = char.vit;

        for (uint i = 0; i < passives.length; i++) {
            totalStr += passives[i].bonusStr;
            totalAgi += passives[i].bonusAgi;
            totalIntelligence += passives[i].bonusIntelligence;
            totalLuk += passives[i].bonusLuk;
            totalVit += passives[i].bonusVit;
        }

        return (totalStr, totalAgi, totalIntelligence, totalLuk, totalVit);
    }

    // Override required functions
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
