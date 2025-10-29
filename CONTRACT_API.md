# 📜 Smart Contract API Reference

## Contract Addresses

### Ronin Testnet (Saigon)
```
AeloriaCharacter:   [Deploy and update here]
AeloriaItem:        [Deploy and update here]
AeloriaToken:       [Deploy and update here]
AeloriaMarketplace: [Deploy and update here]
```

### Ronin Mainnet
```
[To be deployed]
```

---

## 🎭 AeloriaCharacter.sol (ERC-721)

### Contract Info
- **Type**: ERC-721 NFT
- **Purpose**: Character NFTs with stats and progression
- **Max Supply**: Unlimited

### Enums

#### CharacterClass
```solidity
enum CharacterClass {
    Warrior,   // 0
    Mage,      // 1
    Archer,    // 2
    Rogue,     // 3
    Cleric,    // 4
    Paladin    // 5
}
```

### Structs

#### CharacterStats
```solidity
struct CharacterStats {
    uint8 level;              // Character level (1-100)
    uint16 exp;               // Current EXP
    uint16 hp;                // Current HP
    uint16 maxHp;             // Maximum HP
    uint8 str;                // Strength
    uint8 agi;                // Agility
    uint8 int;                // Intelligence
    uint8 luk;                // Luck
    uint8 vit;                // Vitality
    CharacterClass class;     // Character class
    uint256 lastAdventureTime; // Last dungeon timestamp
}
```

#### PassiveSkill
```solidity
struct PassiveSkill {
    string name;
    string description;
    uint8 bonusStr;
    uint8 bonusAgi;
    uint8 bonusInt;
    uint8 bonusLuk;
    uint8 bonusVit;
}
```

### Read Functions

#### `getCharacterStats(uint256 tokenId)`
Get complete stats for a character.

**Parameters:**
- `tokenId`: Token ID of character

**Returns:**
- `CharacterStats`: Full character stats struct

**Example:**
```javascript
const stats = await characterContract.getCharacterStats(1);
console.log(`Level: ${stats.level}, HP: ${stats.hp}/${stats.maxHp}`);
```

---

#### `getTotalStats(uint256 tokenId)`
Get stats including passive skill bonuses.

**Parameters:**
- `tokenId`: Token ID of character

**Returns:**
- `totalStr`: STR including bonuses
- `totalAgi`: AGI including bonuses
- `totalInt`: INT including bonuses
- `totalLuk`: LUK including bonuses
- `totalVit`: VIT including bonuses

**Example:**
```javascript
const [str, agi, int, luk, vit] = await characterContract.getTotalStats(1);
```

---

#### `getClassPassives(CharacterClass _class)`
Get all passive skills for a class.

**Parameters:**
- `_class`: Character class enum (0-5)

**Returns:**
- `PassiveSkill[]`: Array of passive skills

**Example:**
```javascript
const passives = await characterContract.getClassPassives(0); // Warrior
```

---

### Write Functions (Owner Only)

#### `mintCharacter(CharacterClass _class, string memory _tokenURI)`
Mint a new character NFT.

**Parameters:**
- `_class`: Character class (0-5)
- `_tokenURI`: IPFS URI for metadata

**Returns:**
- `uint256`: New token ID

**Example:**
```javascript
const tx = await characterContract.mintCharacter(
    0, // Warrior
    "ipfs://QmXXXXXXXXXXXXXXX"
);
const receipt = await tx.wait();
```

---

#### `addExp(uint256 tokenId, uint16 expAmount)`
Add experience to character (auto level-up).

**Parameters:**
- `tokenId`: Character token ID
- `expAmount`: EXP to add

**Example:**
```javascript
await characterContract.addExp(1, 150);
```

---

#### `healCharacter(uint256 tokenId, uint16 healAmount)`
Heal character HP.

**Parameters:**
- `tokenId`: Character token ID
- `healAmount`: HP to restore

**Example:**
```javascript
await characterContract.healCharacter(1, 50);
```

---

#### `fullHeal(uint256 tokenId)`
Fully restore character HP.

**Parameters:**
- `tokenId`: Character token ID

**Example:**
```javascript
await characterContract.fullHeal(1);
```

---

#### `damageCharacter(uint256 tokenId, uint16 damage)`
Deal damage to character.

**Parameters:**
- `tokenId`: Character token ID
- `damage`: Damage amount

---

#### `updateAdventureTime(uint256 tokenId)`
Update last adventure timestamp.

**Parameters:**
- `tokenId`: Character token ID

---

### Events

```solidity
event CharacterMinted(address indexed owner, uint256 tokenId, CharacterClass class);
event CharacterLevelUp(uint256 tokenId, uint8 newLevel);
event CharacterHealed(uint256 tokenId, uint16 newHp);
event ExpGained(uint256 tokenId, uint16 expGained, uint16 totalExp);
```

---

## 🎒 AeloriaItem.sol (ERC-721)

### Contract Info
- **Type**: ERC-721 NFT
- **Purpose**: Equipment and items
- **Max Supply**: Unlimited

### Enums

#### ItemType
```solidity
enum ItemType {
    Weapon,      // 0
    Armor,       // 1
    Accessory,   // 2
    Consumable,  // 3
    Material     // 4
}
```

#### Rarity
```solidity
enum Rarity {
    Common,      // 0
    Uncommon,    // 1
    Rare,        // 2
    Epic,        // 3
    Legendary,   // 4
    Mythic       // 5
}
```

### Structs

#### ItemStats
```solidity
struct ItemStats {
    ItemType itemType;
    Rarity rarity;
    uint8 bonusStr;
    uint8 bonusAgi;
    uint8 bonusInt;
    uint8 bonusLuk;
    uint8 bonusVit;
    uint8 bonusHp;
    uint8 enchantLevel;  // 0-10
    uint256 dropTime;
    string name;
}
```

### Read Functions

#### `getItemStats(uint256 tokenId)`
Get item stats.

**Parameters:**
- `tokenId`: Item token ID

**Returns:**
- `ItemStats`: Full item stats

---

#### `getItemsByOwner(address owner)`
Get all items owned by address.

**Parameters:**
- `owner`: Wallet address

**Returns:**
- `uint256[]`: Array of token IDs

**Example:**
```javascript
const items = await itemContract.getItemsByOwner(walletAddress);
```

---

### Write Functions

#### `mintItem(address to, ItemType _itemType, Rarity _rarity, string memory _name, string memory _tokenURI)`
Mint new item (only owner).

**Parameters:**
- `to`: Recipient address
- `_itemType`: Type of item (0-4)
- `_rarity`: Rarity tier (0-5)
- `_name`: Item name
- `_tokenURI`: Metadata URI

**Returns:**
- `uint256`: New token ID

---

#### `enchantItem(uint256 tokenId)`
Enchant item (+1 level, max +10).

**Parameters:**
- `tokenId`: Item token ID

**Effects:**
- +2 to all stat bonuses
- +5 HP bonus
- Enchant level +1

---

#### `upgradeRarity(uint256 tokenId)`
Upgrade item rarity (requires materials off-chain).

**Parameters:**
- `tokenId`: Item token ID

**Effects:**
- Rarity +1 tier
- +5 to all stat bonuses
- +10 HP bonus

---

### Events

```solidity
event ItemMinted(address indexed owner, uint256 tokenId, ItemType itemType, Rarity rarity);
event ItemEnchanted(uint256 tokenId, uint8 newEnchantLevel);
event ItemUpgraded(uint256 tokenId, Rarity newRarity);
```

---

## 💰 AeloriaToken.sol (ERC-20)

### Contract Info
- **Type**: ERC-20 Token
- **Symbol**: AETH
- **Decimals**: 18
- **Total Supply**: 1,000,000,000 AETH

### Distribution
- 40% Reward Pool
- 30% Treasury
- 20% Team
- 10% Initial Liquidity

### Anti-Bot Features

- **Transaction Cooldown**: 1 second between transfers
- **Daily Limit**: 100 transactions per address
- **Whitelist**: Bypass restrictions for trusted addresses

### Read Functions

#### `balanceOf(address account)`
Get token balance.

**Parameters:**
- `account`: Wallet address

**Returns:**
- `uint256`: Balance in wei

---

#### `whitelist(address account)`
Check if address is whitelisted.

**Parameters:**
- `account`: Wallet address

**Returns:**
- `bool`: Whitelist status

---

### Write Functions

#### `transfer(address to, uint256 amount)`
Transfer tokens (includes anti-bot checks).

**Parameters:**
- `to`: Recipient address
- `amount`: Amount in wei

---

#### `distributeReward(address to, uint256 amount)`
Distribute rewards from reward pool (only owner).

**Parameters:**
- `to`: Recipient address
- `amount`: Reward amount

---

#### `batchAirdrop(address[] memory recipients, uint256[] memory amounts)`
Batch airdrop to multiple addresses (only owner).

**Parameters:**
- `recipients`: Array of addresses
- `amounts`: Array of amounts

---

#### `updateWhitelist(address account, bool status)`
Update whitelist status (only owner).

**Parameters:**
- `account`: Address to update
- `status`: New whitelist status

---

### Events

```solidity
event RewardDistributed(address indexed to, uint256 amount);
event AirdropSent(address indexed to, uint256 amount);
event WhitelistUpdated(address indexed account, bool status);
```

---

## 🏪 AeloriaMarketplace.sol

### Contract Info
- **Purpose**: NFT trading platform
- **Fee**: 2.5% on sales
- **Supported**: ERC-721 NFTs

### Structs

#### Listing
```solidity
struct Listing {
    address seller;
    address nftContract;
    uint256 tokenId;
    uint256 price;         // in wei (RON)
    bool isActive;
    uint256 listedAt;
}
```

### Read Functions

#### `getListing(uint256 listingId)`
Get listing details.

**Parameters:**
- `listingId`: Listing ID

**Returns:**
- `Listing`: Full listing data

---

#### `getTotalListings()`
Get total number of listings created.

**Returns:**
- `uint256`: Total listings count

---

### Write Functions

#### `listItem(address nftContract, uint256 tokenId, uint256 price)`
List NFT for sale.

**Parameters:**
- `nftContract`: NFT contract address
- `tokenId`: Token ID to sell
- `price`: Sale price in RON (wei)

**Returns:**
- `uint256`: New listing ID

**Requirements:**
- Must own the NFT
- Must approve marketplace

**Example:**
```javascript
// Approve marketplace first
await nftContract.approve(marketplaceAddress, tokenId);

// List item
const price = ethers.parseEther("1.0"); // 1 RON
const tx = await marketplace.listItem(nftContract, tokenId, price);
```

---

#### `buyItem(uint256 listingId)`
Purchase listed NFT.

**Parameters:**
- `listingId`: Listing ID to buy

**Value:**
- Must send exact listing price in RON

**Example:**
```javascript
const listing = await marketplace.getListing(listingId);
const tx = await marketplace.buyItem(listingId, {
    value: listing.price
});
```

---

#### `cancelListing(uint256 listingId)`
Cancel your listing.

**Parameters:**
- `listingId`: Listing ID to cancel

**Requirements:**
- Must be the seller

---

#### `updatePrice(uint256 listingId, uint256 newPrice)`
Update listing price.

**Parameters:**
- `listingId`: Listing ID
- `newPrice`: New price in RON (wei)

**Requirements:**
- Must be the seller
- Listing must be active

---

### Events

```solidity
event ItemListed(uint256 indexed listingId, address indexed seller, address nftContract, uint256 tokenId, uint256 price);
event ItemSold(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price);
event ListingCancelled(uint256 indexed listingId);
event PriceUpdated(uint256 indexed listingId, uint256 newPrice);
```

---

## 🔧 Integration Examples

### Mint Character & Enter Dungeon

```javascript
import { ethers } from "ethers";

// Connect wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Contract instances
const characterContract = new ethers.Contract(
    CHARACTER_ADDRESS,
    CHARACTER_ABI,
    signer
);

// Mint Warrior
const tx = await characterContract.mintCharacter(
    0, // Warrior
    "ipfs://metadata-uri"
);
await tx.wait();

// Get character stats
const tokenId = 1; // Assume this is the new token ID
const stats = await characterContract.getCharacterStats(tokenId);

console.log(`Character created!`);
console.log(`Class: Warrior`);
console.log(`HP: ${stats.hp}/${stats.maxHp}`);
console.log(`STR: ${stats.str}`);
```

### List & Buy Item on Marketplace

```javascript
// Seller: List item
const itemContract = new ethers.Contract(ITEM_ADDRESS, ITEM_ABI, signer);
const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

// Approve marketplace
await itemContract.approve(MARKETPLACE_ADDRESS, tokenId);

// List for 5 RON
const price = ethers.parseEther("5.0");
const listTx = await marketplace.listItem(ITEM_ADDRESS, tokenId, price);
await listTx.wait();

// Buyer: Purchase item
const listingId = 1;
const buyTx = await marketplace.buyItem(listingId, { value: price });
await buyTx.wait();
```

---

## 📝 Notes

- All amounts in Wei (1 RON = 10^18 Wei)
- Gas fees apply to all transactions
- Approve NFTs before listing on marketplace
- Keep private keys secure
- Test on Saigon testnet before mainnet

---

**For more details, see the smart contract source code in `/contracts` directory.**
