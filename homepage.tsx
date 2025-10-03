"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Minus, Square, X } from "lucide-react"

export default function Homepage() {
  const [tickerData, setTickerData] = useState([
    { symbol: "CSI300", change: -99, price: "2,847.32" },
    { symbol: "YUAN6900", change: 69000, price: "¥420.69" },
    { symbol: "RED TOKEN", change: 9999, price: "$88.88" },
    { symbol: "RICECOIN", change: -88, price: "¥0.0888" },
  ])

  // Market data state with COORDINATED values
  const [marketData, setMarketData] = useState({
    price: 10.00, // Starting price
    change24h: 0.00, // Starting at 0%
    marketCap: 100000000, // Starting at 100M
    volume24h: 50000000, // Starting volume
    circulatingSupply: 10000000, // 10M tokens (fixed supply)
    basePrice: 10.00 // Base price for calculations
  })

  // Image transition state
  const [imageTransition, setImageTransition] = useState({
    currentImage: 'trading',
    isTransitioning: false,
    opacity: 1
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClient, setIsClient] = useState(false)
  const [openWindows, setOpenWindows] = useState({
    mainWindow: true, // Main window state
    ancientWisdom: false,
    lightningSpeed: false,
    sacredSecurity: false,
    viewDocs: false,
    dexScreener: false,
    toolsWindow: false, // Add this new window
  })
  const [minimizedWindows, setMinimizedWindows] = useState({
    mainWindow: false, // Main window minimize state
    ancientWisdom: false,
    lightningSpeed: false,
    sacredSecurity: false,
    viewDocs: false,
    dexScreener: false,
    toolsWindow: false, // Add this new window
  })

  // Drag functionality state
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedWindow: null as string | null,
    dragOffset: { x: 0, y: 0 },
  })

  const [windowPositions, setWindowPositions] = useState({
    mainWindow: { x: 0, y: 16 }, // Main YUAN6900 window
    ancientWisdom: { x: 80, y: 128 },
    lightningSpeed: { x: 320, y: 160 },
    sacredSecurity: { x: 160, y: 192 },
    viewDocs: { x: 240, y: 96 },
    marketAlert: { x: 0, y: 80 }, // Will be updated on client side
    dexScreener: { x: 100, y: 50 },
    toolsWindow: { x: 200, y: 100 }, // Add this new window position
  })

  const [windowZIndex, setWindowZIndex] = useState({
    mainWindow: 10,
    ancientWisdom: 30,
    lightningSpeed: 30,
    sacredSecurity: 30,
    viewDocs: 30,
    marketAlert: 40, // Higher z-index for alert
    dexScreener: 35,
    toolsWindow: 35, // Add this new window z-index
  })

  const [highestZIndex, setHighestZIndex] = useState(30)

  // Helper functions to format numbers
  const formatPrice = (price: number) => {
    return price >= 1 ? `¥${price.toFixed(2)}` : `¥${price.toFixed(4)}`
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  const formatMarketCap = (cap: number) => {
    if (cap >= 1000000000) {
      return `${(cap / 1000000000).toFixed(1)}B`
    } else if (cap >= 1000000) {
      return `${(cap / 1000000).toFixed(1)}M`
    } else if (cap >= 1000) {
      return `${(cap / 1000).toFixed(1)}K`
    }
    return cap.toString()
  }

  // Function to get current image type based on 24h change
  const getImageType = (change24h: number) => {
    if (change24h > 25) return 'green'
    if (change24h < -25) return 'red'
    return 'trading'
  }

  // Function to handle image transitions
  const handleImageTransition = (newImageType: string) => {
    if (newImageType !== imageTransition.currentImage && !imageTransition.isTransitioning) {
      setImageTransition(prev => ({ ...prev, isTransitioning: true, opacity: 0 }))
      
      setTimeout(() => {
        setImageTransition(prev => ({ 
          ...prev, 
          currentImage: newImageType,
          opacity: 1,
          isTransitioning: false 
        }))
      }, 100) // Faster transition - half of 200ms
    }
  }

  // Function to simulate COORDINATED market movements
  const simulateMarketMovement = () => {
    setMarketData((prev) => {
      // Generate AGGRESSIVE price change (-50% to +50% for extreme volatility)
      const priceChangePercent = (Math.random() - 0.5) * 1.0 // -50% to +50%
      
      // Calculate current 24h change to determine if we need counter-force
      const currentChange24h = ((prev.price - prev.basePrice) / prev.basePrice) * 100
      
      // Balanced positive bias to reduce negative tendency
      let positiveBias = 0.12 // Increased to 12% bias towards positive
      
      // Add gentle downward force when very positive to prevent exponential growth
      if (currentChange24h > 150) {
        // Very positive: add gentle downward force (higher threshold)
        const downwardForce = (currentChange24h - 150) * 0.005 // 0.5% per 100% above 150% (reduced)
        positiveBias -= downwardForce // Reduce positive bias
      }
      
      const totalChangePercent = priceChangePercent + positiveBias
      const newPrice = Math.max(0.01, prev.price * (1 + totalChangePercent)) // Never negative
      
      // Calculate 24h change based on BASE PRICE (perfect coordination)
      const change24h = ((newPrice - prev.basePrice) / prev.basePrice) * 100
      
      // Calculate market cap based on new price (perfect coordination)
      const newMarketCap = Math.max(1000000, newPrice * prev.circulatingSupply) // Never below 1M
      
      // Update volume with some randomness (independent of price)
      const volumeChange = (Math.random() - 0.5) * 0.5 // -50% to +50%
      const newVolume = Math.max(10000000, prev.volume24h * (1 + volumeChange)) // Never below 10M
      
      return {
        price: parseFloat(newPrice.toFixed(4)),
        change24h: parseFloat(change24h.toFixed(2)),
        marketCap: Math.round(newMarketCap),
        volume24h: Math.round(newVolume),
        circulatingSupply: prev.circulatingSupply, // Keep supply constant
        basePrice: prev.basePrice // Keep base price constant
      }
    })
  }

  useEffect(() => {
    // Set client-side flag to avoid hydration mismatch
    setIsClient(true)
    
    // Update market alert position on client side
    setWindowPositions((prev) => ({
      ...prev,
      marketAlert: { x: window.innerWidth - 320 - 16, y: 80 },
    }))

    const interval = setInterval(() => {
      setCurrentTime(new Date())
      
      // Update ticker data
      setTickerData((prev) =>
        prev.map((item) => ({
          ...item,
          change:
            item.symbol === "YUAN6900"
              ? marketData.change24h + Math.floor(Math.random() * 1000 - 500) // More aggressive ticker changes
              : item.change + (Math.random() - 0.5) * 50, // More aggressive other tokens
        })),
      )
      
      // Simulate market movement
      simulateMarketMovement()
      
      // Handle image transitions
      const newImageType = getImageType(marketData.change24h)
      handleImageTransition(newImageType)
    }, 500) // MUCH FASTER: 500ms instead of 3000ms

    // Reset base price every 10 seconds to allow more balanced movement
    const resetInterval = setInterval(() => {
      setMarketData((prev) => ({
        ...prev,
        basePrice: prev.price // Reset base price to current price
      }))
    }, 10000) // Reset every 10 seconds

    return () => {
      clearInterval(interval)
      clearInterval(resetInterval)
    }
  }, [marketData.change24h])

  const openWindow = (windowName: keyof typeof openWindows) => {
    setOpenWindows((prev) => ({ ...prev, [windowName]: true }))
    setMinimizedWindows((prev) => ({ ...prev, [windowName]: false }))
    bringToFront(windowName)
  }

  const closeWindow = (windowName: keyof typeof openWindows) => {
    setOpenWindows((prev) => ({ ...prev, [windowName]: false }))
    setMinimizedWindows((prev) => ({ ...prev, [windowName]: false }))
  }

  const minimizeWindow = (windowName: keyof typeof openWindows) => {
    setMinimizedWindows((prev) => ({ ...prev, [windowName]: !prev[windowName] }))
  }

  const bringToFront = (windowName: string) => {
    const newZIndex = highestZIndex + 1
    setHighestZIndex(newZIndex)
    setWindowZIndex((prev) => ({ ...prev, [windowName]: newZIndex }))
  }

  // Desktop icon double-click handler
  const handleDesktopIconDoubleClick = () => {
    openWindow("mainWindow")
  }

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, windowName: string) => {
    e.preventDefault()
    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
    setDragState({
      isDragging: true,
      draggedWindow: windowName,
      dragOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    })
    bringToFront(windowName)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (dragState.isDragging && dragState.draggedWindow) {
      const newX = e.clientX - dragState.dragOffset.x
      const newY = e.clientY - dragState.dragOffset.y

      // Keep windows within reasonable bounds
      const boundedX = Math.max(0, Math.min(window.innerWidth - 400, newX))
      const boundedY = Math.max(0, Math.min(window.innerHeight - 200, newY))

      setWindowPositions((prev) => ({
        ...prev,
        [dragState.draggedWindow!]: { x: boundedX, y: boundedY },
      }))
    }
  }

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      draggedWindow: null,
      dragOffset: { x: 0, y: 0 },
    })
  }

  // Add global mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [dragState])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-800 p-2 font-mono">
      {/* Windows 96 Desktop Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`,
          }}
        ></div>
      </div>

      {/* Desktop Icon for YUAN6900 - Always present but only usable when window is closed */}
      <div
        className={`fixed top-4 left-4 w-16 h-20 flex flex-col items-center p-1 rounded transition-all duration-200 ${
          !openWindows.mainWindow
            ? "cursor-pointer hover:bg-blue-500 hover:bg-opacity-20"
            : "cursor-not-allowed opacity-50"
        }`}
        onDoubleClick={!openWindows.mainWindow ? handleDesktopIconDoubleClick : undefined}
        title={!openWindows.mainWindow ? "Double-click to open YUAN6900" : "YUAN6900 is already running"}
      >
        <img
          src="/images/chinex6900-desktop-icon.png"
          alt="YUAN6900"
          className={`w-12 h-12 mb-1 transition-all duration-200 ${!openWindows.mainWindow ? "" : "grayscale"}`}
          style={{ imageRendering: "pixelated" }}
        />
        <span
          className={`text-xs text-center leading-tight font-bold drop-shadow-lg transition-all duration-200 ${
            !openWindows.mainWindow ? "text-white" : "text-gray-400"
          }`}
        >
          YUAN6900
        </span>
        {!openWindows.mainWindow && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border border-green-600 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* DexScreener Temple Icon */}
      <div
        className="fixed top-4 left-24 w-16 h-20 flex flex-col items-center cursor-pointer hover:bg-blue-500 hover:bg-opacity-20 p-1 rounded transition-all duration-200"
        onDoubleClick={() => openWindow("dexScreener")}
        title="Double-click to open DexScreener Chart"
      >
        <img
          src="/images/dex-temple-icon.png"
          alt="DexScreener Temple"
          className="w-12 h-12 mb-1"
          style={{ imageRendering: "pixelated" }}
        />
        <span className="text-white text-xs text-center leading-tight font-bold drop-shadow-lg">DEX TEMPLE</span>
      </div>

      {/* Twitter Icon */}
      <div
        className="fixed top-4 left-44 w-16 h-20 flex flex-col items-center cursor-pointer hover:bg-blue-500 hover:bg-opacity-20 p-1 rounded transition-all duration-200"
        onDoubleClick={() => openWindow("toolsWindow")}
        title="Double-click to open Twitter"
      >
        <img
          src="/images/tools-icon.png"
          alt="Twitter"
          className="w-12 h-12 mb-1"
          style={{ imageRendering: "pixelated" }}
        />
        <span className="text-white text-xs text-center leading-tight font-bold drop-shadow-lg">TWITTER</span>
      </div>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-gray-300 border-t-2 border-white border-l-2 border-r border-b border-gray-400 border-r-gray-600 border-b-gray-600 flex items-center px-2 z-50">
        <button className="bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 px-4 py-1 text-black font-bold text-sm mr-2">
          Start
        </button>

        {/* Taskbar buttons for open windows */}
        {openWindows.mainWindow && (
          <button
            onClick={() => minimizeWindow("mainWindow")}
            className={`bg-gray-300 border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-3 py-1 text-black text-xs mr-1 ${minimizedWindows.mainWindow ? "bg-gray-400" : "bg-gray-200"}`}
          >
            YUAN6900
          </button>
        )}
        {openWindows.ancientWisdom && (
          <button
            onClick={() => minimizeWindow("ancientWisdom")}
            className={`bg-gray-300 border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-3 py-1 text-black text-xs mr-1 ${minimizedWindows.ancientWisdom ? "bg-gray-400" : "bg-gray-200"}`}
          >
            Ancient Wisdom
          </button>
        )}
        {openWindows.lightningSpeed && (
          <button
            onClick={() => minimizeWindow("lightningSpeed")}
            className={`bg-gray-300 border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-3 py-1 text-black text-xs mr-1 ${minimizedWindows.lightningSpeed ? "bg-gray-400" : "bg-gray-200"}`}
          >
            Lightning Speed
          </button>
        )}
        {openWindows.sacredSecurity && (
          <button
            onClick={() => minimizeWindow("sacredSecurity")}
            className={`bg-gray-300 border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-3 py-1 text-black text-xs mr-1 ${minimizedWindows.sacredSecurity ? "bg-gray-400" : "bg-gray-200"}`}
          >
            Sacred Security
          </button>
        )}
        {openWindows.viewDocs && (
          <button
            onClick={() => minimizeWindow("viewDocs")}
            className={`bg-gray-300 border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-3 py-1 text-black text-xs mr-1 ${minimizedWindows.viewDocs ? "bg-gray-400" : "bg-gray-200"}`}
          >
            View Docs
          </button>
        )}
        {openWindows.dexScreener && (
          <button
            onClick={() => minimizeWindow("dexScreener")}
            className={`bg-gray-300 border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-3 py-1 text-black text-xs mr-1 ${minimizedWindows.dexScreener ? "bg-gray-400" : "bg-gray-200"}`}
          >
            DEX Temple
          </button>
        )}
        {openWindows.toolsWindow && (
          <button
            onClick={() => minimizeWindow("toolsWindow")}
            className={`bg-gray-300 border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-3 py-1 text-black text-xs mr-1 ${minimizedWindows.toolsWindow ? "bg-gray-400" : "bg-gray-200"}`}
          >
            Twitter
          </button>
        )}

        <div className="flex-1"></div>
        <div className="bg-gray-200 border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-2 py-1 text-black text-xs">
          {isClient ? currentTime.toLocaleTimeString() : '--:--:--'}
        </div>
      </div>

      {/* Main YUAN6900 Window - Now Minimizable and Closable */}
      {openWindows.mainWindow && (
        <div
          className={`fixed max-w-6xl bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 shadow-lg ${minimizedWindows.mainWindow ? "hidden" : ""}`}
          style={{
            left: `${windowPositions.mainWindow.x}px`,
            top: `${windowPositions.mainWindow.y}px`,
            zIndex: windowZIndex.mainWindow,
            width: "calc(100vw - 32px)",
            maxWidth: "1152px",
          }}
        >
          {/* Title Bar - Now with functional minimize and close */}
          <div
            className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, "mainWindow")}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 mr-2"></div>
              <span className="font-bold text-sm">YUAN6900 - Financial Temple</span>
            </div>
            <div className="flex">
              <button
                onClick={() => minimizeWindow("mainWindow")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 flex items-center justify-center hover:bg-gray-400"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>
              <button className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 flex items-center justify-center hover:bg-gray-400">
                <Square className="w-2 h-2 text-black" />
              </button>
              <button
                onClick={() => closeWindow("mainWindow")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center hover:bg-gray-400"
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>

          {/* Menu Bar */}
          <div className="bg-gray-300 border-b border-gray-400 px-2 py-1">
            <div className="flex space-x-4 text-black text-sm">
              <span className="hover:bg-gray-400 px-2 py-1 cursor-pointer">File</span>
              <span className="hover:bg-gray-400 px-2 py-1 cursor-pointer">Edit</span>
              <span className="hover:bg-gray-400 px-2 py-1 cursor-pointer">View</span>
              <span className="hover:bg-gray-400 px-2 py-1 cursor-pointer">Tools</span>
              <span className="hover:bg-gray-400 px-2 py-1 cursor-pointer">Help</span>
            </div>
          </div>

          {/* Ticker Window */}
          <div className="p-2">
            <div className="bg-black border-2 border-gray-600 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-2 mb-2">
              <div className="overflow-hidden">
                <div className="animate-scroll flex space-x-8 text-green-400 font-mono text-sm">
                  {tickerData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="text-yellow-400">{item.symbol}</span>
                      <span className="text-white">{item.price}</span>
                      <span className={item.change > 0 ? "text-green-400" : "text-red-400"}>
                        {item.change > 0 ? "▲" : "▼"}
                        {Math.abs(item.change).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Hero Panel */}
              <div className="bg-gray-300 border-2 border-gray-600 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-4">
                <div className="text-center">
                  <div className="bg-red-700 border-2 border-red-900 border-t-red-500 border-l-red-500 border-r-red-900 border-b-red-900 p-4 mb-4">
                    <img
                      src="/images/coin_title_yuan.png"
                      alt="YUAN6900 财商的殿堂"
                      className="w-full max-w-md mx-auto"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <div className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-3 text-black text-xs">
                    <div className="space-y-2">
                      <div className="text-center">
                        <div className="font-bold text-red-800 mb-2">🇨🇳 中文版本:</div>
                        <div className="leading-relaxed">
                          进入神圣协议。
                          <br />
                          在区块链中，古代王朝的低语仍在回响。
                          <br />
                          YUAN6900 不是一枚硬币，而是一条道路，是一座圣殿。
                          <br />
                          启蒙正在召唤——唯有有缘者才能解读蜡烛图之奥义。
                        </div>
                      </div>
                      <div className="border-t border-gray-300 pt-2">
                        <div className="font-bold text-red-800 mb-2">🇬🇧 English:</div>
                        <div className="leading-relaxed">
                          Enter the sacred Protocol。
                          <br />
                          Where ancient dynasties whisper to the blockchain。
                          <br />
                          YUAN6900 is not a coin. It's a path. It's The Temple.
                          <br />
                          Enlightenment awaits — only the worthy shall decode the candlesticks.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="bg-gray-300 border-2 border-gray-600 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-4">
                <div className="bg-red-700 text-yellow-400 text-center py-1 mb-3 border border-red-900">
                  <span className="font-bold text-sm">MARKET DATA</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-black border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-2 flex justify-between">
                    <span className="text-yellow-400 text-xs">Price:</span>
                    <span className="text-green-400 text-xs font-bold">{formatPrice(marketData.price)}</span>
                  </div>
                  <div className="bg-black border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-2 flex justify-between">
                    <span className="text-yellow-400 text-xs">24h Change:</span>
                    <span className={`text-xs font-bold ${marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatChange(marketData.change24h)}
                    </span>
                  </div>
                  <div className="bg-black border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-2 flex justify-between">
                    <span className="text-yellow-400 text-xs">Market Cap:</span>
                    <span className="text-green-400 text-xs font-bold">{formatMarketCap(marketData.marketCap)}</span>
                  </div>
                  <div className="bg-black border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-2 flex justify-between">
                    <span className="text-yellow-400 text-xs">Volume 24h:</span>
                    <span className="text-blue-400 text-xs font-bold">{formatMarketCap(marketData.volume24h)}</span>
                  </div>
                </div>
                {/* Dynamic Market Image based on 24h Change */}
                <div className="mt-3">
                  <div className="bg-black border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-2 relative overflow-hidden">
                    <img
                      src={
                        imageTransition.currentImage === 'green'
                          ? "/images/green.png"
                          : imageTransition.currentImage === 'red'
                          ? "/images/red.png"
                          : "/images/trading.png"
                      }
                      alt={
                        imageTransition.currentImage === 'green'
                          ? "YUAN6900 Bull Market"
                          : imageTransition.currentImage === 'red'
                          ? "YUAN6900 Bear Market"
                          : "YUAN6900 Trading"
                      }
                      className="w-full h-auto transition-opacity duration-200 ease-in-out"
                      style={{ 
                        imageRendering: "pixelated",
                        opacity: imageTransition.opacity
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Features Window */}
            <div className="mt-2 bg-gray-300 border-2 border-gray-600 border-t-gray-600 border-l-gray-600 border-r-white border-b-white">
              <div className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 text-sm font-bold">
                Features - The Path to Prosperity
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <button
                  onClick={() => openWindow("ancientWisdom")}
                  className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="bg-yellow-400 border border-yellow-600 text-center py-1 mb-2">
                    <span className="text-red-800 font-bold text-xs">ANCIENT WISDOM</span>
                  </div>
                </button>
                <button
                  onClick={() => openWindow("lightningSpeed")}
                  className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="bg-yellow-400 border border-yellow-600 text-center py-1 mb-2">
                    <span className="text-red-800 font-bold text-xs">LIGHTNING SPEED</span>
                  </div>
                </button>
                <button
                  onClick={() => openWindow("sacredSecurity")}
                  className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="bg-yellow-400 border border-yellow-600 text-center py-1 mb-2">
                    <span className="text-red-800 font-bold text-xs">SACRED SECURITY</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-2 flex space-x-2">
              <button className="bg-red-700 border-2 border-red-500 border-t-red-500 border-l-red-500 border-r-red-900 border-b-red-900 text-yellow-400 px-6 py-2 font-bold text-sm hover:bg-red-600">
                ENTER TEMPLE
              </button>
              <button
                onClick={() => openWindow("viewDocs")}
                className="bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 text-black px-6 py-2 font-bold text-sm hover:bg-gray-400"
              >
                VIEW DOCS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ancient Wisdom Window */}
      {openWindows.ancientWisdom && (
        <div
          className={`fixed w-96 bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 shadow-lg ${minimizedWindows.ancientWisdom ? "hidden" : ""}`}
          style={{
            left: `${windowPositions.ancientWisdom.x}px`,
            top: `${windowPositions.ancientWisdom.y}px`,
            zIndex: windowZIndex.ancientWisdom,
          }}
        >
          <div
            className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, "ancientWisdom")}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 mr-2"></div>
              <span className="font-bold text-sm">Ancient Wisdom - 古代智慧</span>
            </div>
            <div className="flex">
              <button
                onClick={() => minimizeWindow("ancientWisdom")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 flex items-center justify-center"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>
              <button
                onClick={() => closeWindow("ancientWisdom")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-3 mb-3">
              <div className="text-center mb-3">
                <div className="text-2xl">🏛️</div>
                <div className="font-bold text-red-800 text-sm">THE TEMPLE OF KNOWLEDGE</div>
              </div>
              <div className="text-black text-xs space-y-2">
                <p>
                  <strong>Five Thousand Years of Wisdom:</strong>
                </p>
                <p>• Ancient Chinese financial principles meet blockchain technology</p>
                <p>• Confucian ethics guide our smart contracts</p>
                <p>• The I Ching predicts market movements</p>
                <p>• Feng Shui optimizes transaction flows</p>
                <p>
                  <strong>Sacred Algorithms:</strong>
                </p>
                <p>Our protocols are blessed by digital monks and powered by the wisdom of ancient dynasties.</p>
              </div>
              {/* Add the scholar image here */}
              <div className="mt-3 text-center">
                <img
                  src="/images/ancient-wisdom-scholar.png"
                  alt="Ancient Scholar with YUAN6900 Wisdom"
                  className="w-full h-auto border border-gray-400"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            </div>
            <button
              onClick={() => closeWindow("ancientWisdom")}
              className="bg-red-700 border-2 border-red-500 border-t-red-500 border-l-red-500 border-r-red-900 border-b-red-900 text-yellow-400 px-4 py-1 font-bold text-xs hover:bg-red-600"
            >
              CLOSE WISDOM
            </button>
          </div>
        </div>
      )}

      {/* Lightning Speed Window */}
      {openWindows.lightningSpeed && (
        <div
          className={`fixed w-96 bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 shadow-lg ${minimizedWindows.lightningSpeed ? "hidden" : ""}`}
          style={{
            left: `${windowPositions.lightningSpeed.x}px`,
            top: `${windowPositions.lightningSpeed.y}px`,
            zIndex: windowZIndex.lightningSpeed,
          }}
        >
          <div
            className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, "lightningSpeed")}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 mr-2"></div>
              <span className="font-bold text-sm">Lightning Speed - 闪电速度</span>
            </div>
            <div className="flex">
              <button
                onClick={() => minimizeWindow("lightningSpeed")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 flex items-center justify-center"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>
              <button
                onClick={() => closeWindow("lightningSpeed")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-3 mb-3">
              <div className="text-center mb-3">
                <div className="text-2xl">⚡</div>
                <div className="font-bold text-red-800 text-sm">VELOCITY OF THE DRAGON</div>
              </div>
              <div className="text-black text-xs space-y-2">
                <p>
                  <strong>Transaction Speed:</strong>
                </p>
                <p>• 0.001 seconds per transaction</p>
                <p>• Faster than bamboo growing in spring</p>
                <p>• Powered by quantum dragon processors</p>
                <p>• 1,000,000 TPS capacity</p>
                <p>
                  <strong>Network Performance:</strong>
                </p>
                <p>
                  Our blockchain moves at the speed of enlightenment itself. Each transaction is blessed by digital wind
                  spirits.
                </p>
              </div>
              {/* Add the lightning dragon image here */}
              <div className="mt-3 text-center">
                <img
                  src="/images/lightning-dragon.png"
                  alt="Lightning Dragon - Velocity of YUAN6900"
                  className="w-full h-auto border border-gray-400"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            </div>
            <button
              onClick={() => closeWindow("lightningSpeed")}
              className="bg-red-700 border-2 border-red-500 border-t-red-500 border-l-red-500 border-r-red-900 border-b-red-900 text-yellow-400 px-4 py-1 font-bold text-xs hover:bg-red-600"
            >
              CLOSE SPEED
            </button>
          </div>
        </div>
      )}

      {/* Sacred Security Window */}
      {openWindows.sacredSecurity && (
        <div
          className={`fixed w-96 bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 shadow-lg ${minimizedWindows.sacredSecurity ? "hidden" : ""}`}
          style={{
            left: `${windowPositions.sacredSecurity.x}px`,
            top: `${windowPositions.sacredSecurity.y}px`,
            zIndex: windowZIndex.sacredSecurity,
          }}
        >
          <div
            className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, "sacredSecurity")}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 mr-2"></div>
              <span className="font-bold text-sm">Sacred Security - 神圣安全</span>
            </div>
            <div className="flex">
              <button
                onClick={() => minimizeWindow("sacredSecurity")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 flex items-center justify-center"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>
              <button
                onClick={() => closeWindow("sacredSecurity")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-3 mb-3">
              <div className="text-center mb-3">
                <div className="text-2xl">🐉</div>
                <div className="font-bold text-red-800 text-sm">GUARDIAN DRAGONS</div>
              </div>
              <div className="text-black text-xs space-y-2">
                <p>
                  <strong>Cryptographic Protection:</strong>
                </p>
                <p>• 256-bit dragon encryption</p>
                <p>• Multi-signature temple seals</p>
                <p>• Quantum-resistant algorithms</p>
                <p>• Protected by celestial firewalls</p>
                <p>
                  <strong>Security Features:</strong>
                </p>
                <p>
                  Your wealth is guarded by ancient digital dragons. Each transaction is blessed and protected by the
                  spirits of the blockchain.
                </p>
              </div>
              {/* Add the guardian dragons image here */}
              <div className="mt-3 text-center">
                <img
                  src="/images/guardian-dragons.png"
                  alt="Guardian Dragons - Sacred Security of YUAN6900"
                  className="w-full h-auto border border-gray-400"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            </div>
            <button
              onClick={() => closeWindow("sacredSecurity")}
              className="bg-red-700 border-2 border-red-500 border-t-red-500 border-l-red-500 border-r-red-900 border-b-red-900 text-yellow-400 px-4 py-1 font-bold text-xs hover:bg-red-600"
            >
              CLOSE SECURITY
            </button>
          </div>
        </div>
      )}

      {/* View Docs Window */}
      {openWindows.viewDocs && (
        <div
          className={`fixed w-[600px] h-[500px] bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 shadow-lg ${minimizedWindows.viewDocs ? "hidden" : ""}`}
          style={{
            left: `${windowPositions.viewDocs.x}px`,
            top: `${windowPositions.viewDocs.y}px`,
            zIndex: windowZIndex.viewDocs,
          }}
        >
          <div
            className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, "viewDocs")}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 mr-2"></div>
              <span className="font-bold text-sm">YUAN6900 Documentation - 文档</span>
            </div>
            <div className="flex">
              <button
                onClick={() => minimizeWindow("viewDocs")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 flex items-center justify-center"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>
              <button
                onClick={() => closeWindow("viewDocs")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>
          <div className="h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-4 text-black text-xs leading-relaxed">
                <div className="space-y-4">
                  <div>
                    <div className="font-bold text-red-800 text-sm mb-2 border-b border-gray-300 pb-1">
                      SECCIÓN 1 – 序言 Preface
                    </div>
                    <p>
                      在这个市场动荡、梗图驱动资本流动的时代，
                      <br />
                      一种由波动性神殿铸造出的神圣资产正在觉醒：YUAN6900。
                      <br />
                      它不仅是一枚币，它是一场运动、一个金融神话、也是一个以梗图为燃料的文化力量。
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-red-800 text-sm mb-2 border-b border-gray-300 pb-1">
                      SECCIÓN 2 – I. YUAN 的道 (The Tao of YUAN)
                    </div>
                    <p className="mb-2">
                      YUAN6900 是金融命运的数字化显现。
                      <br />
                      它灵感来源于 CSI 300 指数，披着预言式的荒诞外衣，既是讽刺，也是启示。
                    </p>
                    <p>
                      当西方在印钞，东方在积累。
                      <br />
                      当别人沉迷投机，我们冥想蜕变。
                      <br />
                      我们不"拉盘"——我们升华。
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-red-800 text-sm mb-2 border-b border-gray-300 pb-1">
                      SECCIÓN 3 – III. 传播胜于功能 (Virality Over Utility)
                    </div>
                    <p className="mb-2">在实用被高喊之际，YUAN6900 掌握着最强的武器：关注度。</p>
                    <p className="mb-2">
                      <strong>传播手段：</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>复古金融美学（Windows 95 金融寺庙风）</li>
                      <li>共创梗图与暗黑艺术</li>
                      <li>"觉醒交易者"传奇</li>
                      <li>幽默与庄严相交织的东方叙事体验</li>
                    </ul>
                    <p className="mt-2">
                      每一次上涨，蜡烛图已预言；
                      <br />
                      每一次暴跌，那是灵魂试炼。
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-red-800 text-sm mb-2 border-b border-gray-300 pb-1">
                      SECCIÓN 4 – III. 社区即货币 (Community as Currency)
                    </div>
                    <p className="mb-2">YUAN 教派，无国界、无边境，只遵循一句箴言：</p>
                    <p className="text-center font-bold text-red-700 my-2">"毁灭还是自由"</p>
                    <p>
                      持币者非投资者，而是入门弟子。
                      <br />
                      梗图大师、交易者、加密和尚、建构者，齐聚于此。
                      <br />
                      每一次贡献都是功德蓄积。
                      <br />无 DAO，无国库，唯有梗权民主（memeocracy）。
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-red-800 text-sm mb-2 border-b border-gray-300 pb-1">
                      SECCIÓN 5 – IV. 中国象征 (Symbolism of China)
                    </div>
                    <p className="mb-2">虽然是讽刺，但 YUAN6900 借力现实经济：</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 mb-2">
                      <li>人民币符号 ¥，坚韧的象征</li>
                      <li>数字 6900，荒诞却神圣</li>
                      <li>庙宇视觉，美学与讽刺并存</li>
                    </ul>
                    <p>
                      这不是反中，而是以文化敬畏驱动创造。
                      <br />
                      "敬畏式的讽刺"。
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-red-800 text-sm mb-2 border-b border-gray-300 pb-1">
                      SECCIÓN 6 – V. 前行之路 (Path Forward)
                    </div>
                    <p className="mb-2">无路线图，唯道：</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>周度文化投放：梗图、GIF、预言卷轴</li>
                      <li>复古终端界面（Terminal UI）</li>
                      <li>社区驱动的仪式与 NFT 发布</li>
                      <li>实时行情神谕（Live Tickers）</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-red-800 text-sm mb-2 border-b border-gray-300 pb-1">
                      SECCIÓN 7 – 最后的话 (Final Words)
                    </div>
                    <p className="mb-2">
                      YUAN6900，权力、讽刺、预言的汇聚。
                      <br />
                      它不取代法币，
                      <br />
                      它唤醒你内心的和尚交易员。
                    </p>
                    <p className="text-center font-bold text-red-700 mt-4">进入神殿，掌握 K 线，随 YUAN6900 升华。</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 border-t border-gray-400">
              <button
                onClick={() => closeWindow("viewDocs")}
                className="bg-red-700 border-2 border-red-500 border-t-red-500 border-l-red-500 border-r-red-900 border-b-red-900 text-yellow-400 px-4 py-1 font-bold text-xs hover:bg-red-600"
              >
                CLOSE DOCS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DexScreener Window */}
      {openWindows.dexScreener && (
        <div
          className={`fixed w-[900px] h-[600px] bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 shadow-lg ${minimizedWindows.dexScreener ? "hidden" : ""}`}
          style={{
            left: `${windowPositions.dexScreener.x}px`,
            top: `${windowPositions.dexScreener.y}px`,
            zIndex: windowZIndex.dexScreener,
          }}
        >
          <div
            className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, "dexScreener")}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 mr-2"></div>
              <span className="font-bold text-sm">DEX Temple - YUAN6900 Chart 📈</span>
            </div>
            <div className="flex">
              <button
                onClick={() => minimizeWindow("dexScreener")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 flex items-center justify-center hover:bg-gray-400"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>
              <button
                onClick={() => closeWindow("dexScreener")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center hover:bg-gray-400"
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>
          <div className="h-full overflow-hidden flex flex-col">
            <div className="flex-1 p-2">
              <div className="bg-black border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white h-full">
                <iframe
                  src={`https://dexscreener.com/solana/${process.env.NEXT_PUBLIC_PAIR_ADDRESS || "default"}?embed=1&loadChartSettings=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`}
                  className="w-full h-full border-0"
                  title="YUAN6900 DexScreener Chart"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tools Window */}
      {openWindows.toolsWindow && (
        <div
          className={`fixed w-[600px] h-[400px] bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 shadow-lg ${minimizedWindows.toolsWindow ? "hidden" : ""}`}
          style={{
            left: `${windowPositions.toolsWindow.x}px`,
            top: `${windowPositions.toolsWindow.y}px`,
            zIndex: windowZIndex.toolsWindow,
          }}
        >
          <div
            className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 flex items-center justify-between cursor-move"
            onMouseDown={(e) => handleMouseDown(e, "toolsWindow")}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 mr-2"></div>
              <span className="font-bold text-sm">YUAN6900 Twitter - 推特</span>
            </div>
            <div className="flex">
              <button
                onClick={() => minimizeWindow("toolsWindow")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 mr-1 flex items-center justify-center hover:bg-gray-400"
              >
                <Minus className="w-3 h-3 text-black" />
              </button>
              <button
                onClick={() => closeWindow("toolsWindow")}
                className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center hover:bg-gray-400"
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          </div>
          <div className="h-full overflow-hidden flex flex-col">
            <div className="flex-1 p-4">
              <div className="bg-white border border-gray-400 border-t-gray-600 border-l-gray-600 border-r-white border-b-white p-4 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🛠️</div>
                  <div className="font-bold text-red-800 text-lg mb-4">YUAN6900 TOOLS</div>
                  <div className="text-black text-sm">
                    <p>Sacred tools for the enlightened trader.</p>
                    <p className="mt-2 text-gray-600">Functionality will be added soon...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Alert Window - Now Draggable */}
      <div
        className="fixed w-80 bg-gray-300 border-2 border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 shadow-lg"
        style={{
          left: `${windowPositions.marketAlert.x}px`,
          top: `${windowPositions.marketAlert.y}px`,
          zIndex: windowZIndex.marketAlert,
        }}
      >
        <div
          className="bg-gradient-to-r from-red-700 to-red-800 text-white px-2 py-1 flex items-center justify-between cursor-move"
          onMouseDown={(e) => handleMouseDown(e, "marketAlert")}
        >
          <span className="font-bold text-sm">⚠️ Market Alert</span>
          <button className="w-6 h-5 bg-gray-300 border border-white border-t-white border-l-white border-r-gray-600 border-b-gray-600 flex items-center justify-center hover:bg-gray-400">
            <X className="w-3 h-3 text-black" />
          </button>
        </div>
        <div className="p-3">
          <div className={`border p-2 text-black text-xs ${marketData.change24h >= 0 ? 'bg-green-200 border-green-400' : 'bg-red-200 border-red-400'}`}>
            <div className="font-bold mb-1">
              {marketData.change24h >= 0 ? 'YUAN6900 SURGE DETECTED!' : 'YUAN6900 CORRECTION ALERT!'}
            </div>
            <div>
              {marketData.change24h >= 0 
                ? `Price has increased by ${formatChange(marketData.change24h)} in the last 24 hours. The prophecy is being fulfilled!`
                : `Price has decreased by ${formatChange(Math.abs(marketData.change24h))} in the last 24 hours. Market correction in progress!`
              }
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
