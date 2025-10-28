// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AeloriaItem
 * @dev NFT Contract for Aeloria Game Items (Weapons, Armor, Accessories)
 */
contract AeloriaItem is ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Item Types
    enum ItemType { Weapon, Armor, Accessory, Consumable, Material }
    enum Rarity { Common, Uncommon, Rare, Epic, Legendary, Mythic }

    // Equipment Stats
    struct ItemStats {
        ItemType itemType;
        Rarity rarity;
        uint8 bonusStr;
        uint8 bonusAgi;
        uint8 bonusInt;
        uint8 bonusLuk;
        uint8 bonusVit;
        uint8 bonusHp;
        uint8 enchantLevel;
        uint256 dropTime;
        string name;
    }

    // Item data
    mapping(uint256 => ItemStats) public items;
    
    // Max enchant level
    uint8 public constant MAX_ENCHANT_LEVEL = 10;

    // Events
    event ItemMinted(address indexed owner, uint256 tokenId, ItemType itemType, Rarity rarity);
    event ItemEnchanted(uint256 tokenId, uint8 newEnchantLevel);
    event ItemUpgraded(uint256 tokenId, Rarity newRarity);

    constructor() ERC721("Aeloria Item", "AITEM") Ownable(msg.sender) {}

    /**
     * @dev Mint a new item (boss drops, rewards, etc.)
     */
    function mintItem(
        address to,
        ItemType _itemType,
        Rarity _rarity,
        string memory _name,
        string memory _tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        // Generate stats based on rarity
        ItemStats memory newItem;
        newItem.itemType = _itemType;
        newItem.rarity = _rarity;
        newItem.enchantLevel = 0;
        newItem.dropTime = block.timestamp;
        newItem.name = _name;

        // Base stats multiplied by rarity
        uint8 rarityMultiplier = uint8(_rarity) + 1;

        if (_itemType == ItemType.Weapon) {
            newItem.bonusStr = 5 * rarityMultiplier;
            newItem.bonusAgi = 3 * rarityMultiplier;
        } else if (_itemType == ItemType.Armor) {
            newItem.bonusVit = 5 * rarityMultiplier;
            newItem.bonusHp = 10 * rarityMultiplier;
        } else if (_itemType == ItemType.Accessory) {
            newItem.bonusLuk = 4 * rarityMultiplier;
            newItem.bonusInt = 3 * rarityMultiplier;
        }

        items[newTokenId] = newItem;

        emit ItemMinted(to, newTokenId, _itemType, _rarity);
        return newTokenId;
    }

    /**
     * @dev Enchant item to increase stats
     */
    function enchantItem(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        ItemStats storage item = items[tokenId];
        require(item.enchantLevel < MAX_ENCHANT_LEVEL, "Max enchant level reached");

        item.enchantLevel++;

        // Each enchant level adds 2 to all bonus stats
        item.bonusStr += 2;
        item.bonusAgi += 2;
        item.bonusInt += 2;
        item.bonusLuk += 2;
        item.bonusVit += 2;
        item.bonusHp += 5;

        emit ItemEnchanted(tokenId, item.enchantLevel);
    }

    /**
     * @dev Upgrade item rarity (requires materials)
     */
    function upgradeRarity(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        ItemStats storage item = items[tokenId];
        require(item.rarity != Rarity.Mythic, "Already max rarity");

        // Increase rarity
        item.rarity = Rarity(uint8(item.rarity) + 1);

        // Boost stats on upgrade
        item.bonusStr += 5;
        item.bonusAgi += 5;
        item.bonusInt += 5;
        item.bonusLuk += 5;
        item.bonusVit += 5;
        item.bonusHp += 10;

        emit ItemUpgraded(tokenId, item.rarity);
    }

    /**
     * @dev Get item stats
     */
    function getItemStats(uint256 tokenId) public view returns (ItemStats memory) {
        return items[tokenId];
    }

    /**
     * @dev Get all items owned by an address
     */
    function getItemsByOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
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
