'use client'

import { useState, useEffect } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useWallet } from '@/hooks/useWallet'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES } from '@/config/constants'

interface MarketListing {
  listingId: string
  tokenId: number
  seller: string
  price: string
  itemType: 'character' | 'item'
  name: string
  description: string
  imageUrl?: string
  rarity?: string
  level?: number
}

export default function Marketplace() {
  const { user } = useGameState()
  const { address, signer } = useWallet()
  const [listings, setListings] = useState<MarketListing[]>([])
  const [myListings, setMyListings] = useState<MarketListing[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'characters' | 'items' | 'myListings'>('all')
  const [loading, setLoading] = useState(false)

  // List item modal state
  const [showListModal, setShowListModal] = useState(false)
  const [listTokenId, setListTokenId] = useState('')
  const [listPrice, setListPrice] = useState('')
  const [listItemType, setListItemType] = useState<'character' | 'item'>('item')

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    if (address) {
      fetchMyListings()
    }
  }, [address])

  const fetchListings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace/listings`)
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    }
  }

  const fetchMyListings = async () => {
    if (!address) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace/listings?seller=${address}`)
      const data = await response.json()
      setMyListings(data)
    } catch (error) {
      console.error('Failed to fetch my listings:', error)
    }
  }

  const handleListItem = async () => {
    if (!signer || !listTokenId || !listPrice) {
      alert('Please fill all fields and connect wallet')
      return
    }

    setLoading(true)
    try {
      // Create marketplace contract instance
      const marketplaceABI = [
        'function listItem(address nftContract, uint256 tokenId, uint256 price) external',
        'function cancelListing(uint256 listingId) external',
        'function buyItem(uint256 listingId) external payable'
      ]
      
      const marketplace = new ethers.Contract(
        CONTRACT_ADDRESSES.MARKETPLACE,
        marketplaceABI,
        signer
      )

      const nftContract = listItemType === 'character' 
        ? CONTRACT_ADDRESSES.CHARACTER 
        : CONTRACT_ADDRESSES.ITEM

      const priceInWei = ethers.parseEther(listPrice)

      // First approve marketplace to transfer NFT
      const nftABI = ['function approve(address to, uint256 tokenId) external']
      const nft = new ethers.Contract(nftContract, nftABI, signer)
      
      const approveTx = await nft.approve(CONTRACT_ADDRESSES.MARKETPLACE, listTokenId)
      await approveTx.wait()

      // Then list on marketplace
      const listTx = await marketplace.listItem(nftContract, listTokenId, priceInWei)
      await listTx.wait()

      // Save to backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: listTokenId,
          seller: address,
          price: listPrice,
          itemType: listItemType
        })
      })

      alert('Item listed successfully!')
      setShowListModal(false)
      setListTokenId('')
      setListPrice('')
      fetchListings()
      fetchMyListings()
    } catch (error: any) {
      console.error('Failed to list item:', error)
      alert(`Failed to list item: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyItem = async (listing: MarketListing) => {
    if (!signer) {
      alert('Please connect wallet first')
      return
    }

    setLoading(true)
    try {
      const marketplaceABI = [
        'function buyItem(uint256 listingId) external payable'
      ]
      
      const marketplace = new ethers.Contract(
        CONTRACT_ADDRESSES.MARKETPLACE,
        marketplaceABI,
        signer
      )

      const tx = await marketplace.buyItem(listing.listingId, {
        value: ethers.parseEther(listing.price)
      })
      
      await tx.wait()

      // Update backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.listingId,
          buyer: address
        })
      })

      alert('Purchase successful!')
      fetchListings()
    } catch (error: any) {
      console.error('Failed to buy item:', error)
      alert(`Failed to buy item: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelListing = async (listingId: string) => {
    if (!signer) return

    setLoading(true)
    try {
      const marketplaceABI = [
        'function cancelListing(uint256 listingId) external'
      ]
      
      const marketplace = new ethers.Contract(
        CONTRACT_ADDRESSES.MARKETPLACE,
        marketplaceABI,
        signer
      )

      const tx = await marketplace.cancelListing(listingId)
      await tx.wait()

      alert('Listing cancelled successfully!')
      fetchListings()
      fetchMyListings()
    } catch (error: any) {
      console.error('Failed to cancel listing:', error)
      alert(`Failed to cancel listing: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(listing => {
    if (activeTab === 'all') return true
    if (activeTab === 'characters') return listing.itemType === 'character'
    if (activeTab === 'items') return listing.itemType === 'item'
    return false
  })

  const getRarityColor = (rarity?: string) => {
    const colors: Record<string, string> = {
      'Common': 'text-gray-400',
      'Uncommon': 'text-green-400',
      'Rare': 'text-blue-400',
      'Epic': 'text-purple-400',
      'Legendary': 'text-orange-400',
      'Mythic': 'text-red-400'
    }
    return colors[rarity || 'Common'] || 'text-gray-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400">🏪 NFT Marketplace</h1>
          <button
            onClick={() => setShowListModal(true)}
            disabled={!address}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg"
          >
            📋 List Item
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'characters'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            ⚔️ Characters
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'items'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🗡️ Items
          </button>
          <button
            onClick={() => setActiveTab('myListings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'myListings'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📦 My Listings
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activeTab === 'myListings' ? myListings : filteredListings).map((listing) => (
            <div
              key={listing.listingId}
              className="bg-slate-800/50 border-2 border-purple-500/30 rounded-lg p-4 hover:border-purple-400 transition-all hover:scale-105"
            >
              {/* Image Placeholder */}
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg h-48 mb-4 flex items-center justify-center">
                <span className="text-6xl">
                  {listing.itemType === 'character' ? '🧙‍♂️' : '⚔️'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-amber-400 truncate">
                    {listing.name || `Token #${listing.tokenId}`}
                  </h3>
                  {listing.itemType === 'character' && listing.level && (
                    <span className="bg-blue-600 px-2 py-1 rounded text-xs font-semibold">
                      Lv.{listing.level}
                    </span>
                  )}
                </div>

                {listing.rarity && (
                  <p className={`text-sm font-semibold ${getRarityColor(listing.rarity)}`}>
                    ⭐ {listing.rarity}
                  </p>
                )}

                <p className="text-slate-400 text-sm truncate">
                  {listing.description || 'No description'}
                </p>

                <div className="border-t border-slate-600 pt-2 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-400 text-sm">Price:</span>
                    <span className="text-amber-400 font-bold text-lg">
                      {listing.price} RON
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-3">
                    Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                  </div>

                  {address?.toLowerCase() === listing.seller.toLowerCase() ? (
                    <button
                      onClick={() => handleCancelListing(listing.listingId)}
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      Cancel Listing
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyItem(listing)}
                      disabled={!address || loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      {!address ? 'Connect Wallet' : 'Buy Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(activeTab === 'myListings' ? myListings : filteredListings).length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-slate-400 text-lg">
                {activeTab === 'myListings' 
                  ? '📦 You have no active listings'
                  : '🔍 No items available'}
              </p>
            </div>
          )}
        </div>

        {/* List Item Modal */}
        {showListModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-purple-500 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">📋 List NFT for Sale</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2">Item Type</label>
                  <select
                    value={listItemType}
                    onChange={(e) => setListItemType(e.target.value as 'character' | 'item')}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                  >
                    <option value="character">⚔️ Character NFT</option>
                    <option value="item">🗡️ Item NFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Token ID</label>
                  <input
                    type="number"
                    value={listTokenId}
                    onChange={(e) => setListTokenId(e.target.value)}
                    placeholder="Enter your NFT Token ID"
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Price (RON)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2"
                  />
                </div>

                <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ Marketplace fee: 2.5%
                  </p>
                  {listPrice && (
                    <p className="text-yellow-300 text-sm mt-1">
                      You'll receive: {(parseFloat(listPrice) * 0.975).toFixed(4)} RON
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowListModal(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleListItem}
                    disabled={loading || !listTokenId || !listPrice}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 rounded-lg"
                  >
                    {loading ? 'Listing...' : 'List Item'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
