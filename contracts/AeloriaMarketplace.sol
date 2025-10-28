// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AeloriaMarketplace
 * @dev NFT Marketplace for trading characters and items
 */
contract AeloriaMarketplace is Ownable, ReentrancyGuard {
    
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool isActive;
        uint256 listedAt;
    }

    // Listing ID counter
    uint256 private _listingIds;

    // Listings
    mapping(uint256 => Listing) public listings;

    // Marketplace fee (2.5%)
    uint256 public marketplaceFee = 250; // 250 = 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Fee recipient
    address public feeRecipient;

    // Events
    event ItemListed(uint256 indexed listingId, address indexed seller, address nftContract, uint256 tokenId, uint256 price);
    event ItemSold(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed listingId);
    event PriceUpdated(uint256 indexed listingId, uint256 newPrice);

    constructor(address _feeRecipient) Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev List an NFT for sale
     */
    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) || 
            nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        _listingIds++;
        uint256 listingId = _listingIds;

        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            isActive: true,
            listedAt: block.timestamp
        });

        emit ItemListed(listingId, msg.sender, nftContract, tokenId, price);
        return listingId;
    }

    /**
     * @dev Buy a listed NFT
     */
    function buyItem(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        address nftContract = listing.nftContract;
        uint256 tokenId = listing.tokenId;
        uint256 price = listing.price;

        // Mark as inactive before transfer
        listing.isActive = false;

        // Calculate fees
        uint256 fee = (price * marketplaceFee) / FEE_DENOMINATOR;
        uint256 sellerProceeds = price - fee;

        // Transfer NFT to buyer
        IERC721(nftContract).safeTransferFrom(seller, msg.sender, tokenId);

        // Transfer funds
        (bool sellerSuccess, ) = payable(seller).call{value: sellerProceeds}("");
        require(sellerSuccess, "Seller payment failed");

        (bool feeSuccess, ) = payable(feeRecipient).call{value: fee}("");
        require(feeSuccess, "Fee payment failed");

        // Refund excess payment
        if (msg.value > price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(refundSuccess, "Refund failed");
        }

        emit ItemSold(listingId, msg.sender, seller, price);
    }

    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing not active");

        listing.isActive = false;

        emit ListingCancelled(listingId);
    }

    /**
     * @dev Update listing price
     */
    function updatePrice(uint256 listingId, uint256 newPrice) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing not active");
        require(newPrice > 0, "Price must be greater than 0");

        listing.price = newPrice;

        emit PriceUpdated(listingId, newPrice);
    }

    /**
     * @dev Get listing details
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    /**
     * @dev Update marketplace fee
     */
    function setMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        marketplaceFee = newFee;
    }

    /**
     * @dev Update fee recipient
     */
    function setFeeRecipient(address newRecipient) external onlyOwner {
        feeRecipient = newRecipient;
    }

    /**
     * @dev Get total listings count
     */
    function getTotalListings() external view returns (uint256) {
        return _listingIds;
    }
}
