import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { 
  BarChart3, 
  Clock, 
  Globe, 
  ArrowDownToLine, 
  Settings, 
  RefreshCw,
  Menu,
  Network,
  Info,
  Github,
  Linkedin,
  X,
  MapPin
} from 'lucide-react';
import { NetworkGlobe } from './components/NetworkGlobe';
import { ConnectionScreen } from './components/ConnectionScreen';
import { NetworkMap } from './components/NetworkMap';

interface NetworkEntry {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  startTime: number;
}

interface Network {
  ssid: string;
  security: string;
  strength: number;
  lat?: number;
  lng?: number;
}

function App() {
  const [entries, setEntries] = useState<NetworkEntry[]>([]);
  const [totalBytes, setTotalBytes] = useState(0);
  const [avgLoadTime, setAvgLoadTime] = useState(0);
  const [isCapturing, setIsCapturing] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('analyzer');
  const [showMap, setShowMap] = useState(false);

  // Mock available networks with locations
  const availableNetworks: Network[] = [
    { ssid: 'Home Network', security: 'WPA2', strength: 4, lat: 40.7128, lng: -74.006 },
    { ssid: 'Office WiFi', security: 'WPA3', strength: 3, lat: 40.7148, lng: -74.008 },
    { ssid: 'Guest Network', security: 'Open', strength: 2, lat: 40.7138, lng: -74.007 },
    { ssid: 'IoT Network', security: 'WPA2', strength: 4, lat: 40.7118, lng: -74.005 },
  ];

  // Mock 3D visualization data
  const points = [
    { position: [0, 1, 0] as [number, number, number], color: '#60a5fa' },
    { position: [1, 0, 0] as [number, number, number], color: '#34d399' },
    { position: [0, 0, 1] as [number, number, number], color: '#f87171' },
  ];

  const connections = points.map((point, i) => [
    point,
    points[(i + 1) % points.length],
  ]) as [typeof points[0], typeof points[0]][];

  useEffect(() => {
    if (!isConnected) return;

    const updateMetrics = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const newEntries = resources.map(entry => ({
        name: entry.name,
        initiatorType: entry.initiatorType,
        duration: Math.round(entry.duration),
        transferSize: entry.transferSize,
        startTime: entry.startTime
      }));

      setEntries(newEntries);
      setTotalBytes(newEntries.reduce((acc, curr) => acc + curr.transferSize, 0));
      setAvgLoadTime(newEntries.reduce((acc, curr) => acc + curr.duration, 0) / newEntries.length || 0);
    };

    const observer = new PerformanceObserver(() => {
      updateMetrics();
    });

    observer.observe({ entryTypes: ['resource'] });
    updateMetrics();

    return () => observer.disconnect();
  }, [isConnected]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleCapture = () => {
    setIsCapturing(!isCapturing);
    if (!isCapturing) {
      performance.clearResourceTimings();
    }
  };

  const handleConnect = (network: Network) => {
    setSelectedNetwork(network);
    setIsConnected(true);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              <span className="text-blue-500">net_an</span>
            </h1>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              {showMap ? <Network className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
              {showMap ? 'Show List' : 'Show Map'}
            </button>
          </div>
          {showMap ? (
            <NetworkMap networks={availableNetworks} onConnect={handleConnect} />
          ) : (
            <ConnectionScreen networks={availableNetworks} onConnect={handleConnect} />
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'networks':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Available Networks</h2>
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                {showMap ? <Network className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                {showMap ? 'Show List' : 'Show Map'}
              </button>
            </div>
            {showMap ? (
              <NetworkMap networks={availableNetworks} onConnect={handleConnect} />
            ) : (
              <ConnectionScreen networks={availableNetworks} onConnect={handleConnect} />
            )}
          </div>
        );
      case 'about':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">About Us</h2>
            <div className="bg-white/5 backdrop-blur rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Creator</h3>
              <p className="text-lg text-white mb-2">NEHAL MR</p>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://github.com/nehalmr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <Github className="h-5 w-5" />
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/nehalmr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 h-[400px]">
                <Canvas camera={{ position: [0, 0, 3] }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <NetworkGlobe points={points} connections={connections} />
                  <OrbitControls enableZoom={false} />
                </Canvas>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 backdrop-blur rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Total Requests</h2>
                    <Globe className="h-6 w-6 text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{entries.length}</p>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Total Data Transferred</h2>
                    <ArrowDownToLine className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{formatBytes(totalBytes)}</p>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Average Load Time</h2>
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{avgLoadTime.toFixed(2)} ms</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Request Details</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Resource</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {entries.map((entry, index) => (
                      <tr key={index} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 max-w-md truncate">
                          {entry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {entry.initiatorType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatBytes(entry.transferSize)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {entry.duration.toFixed(2)} ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-gray-800 transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveSection('networks');
                setIsDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeSection === 'networks'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <Network className="h-5 w-5" />
              Networks
            </button>
            <button
              onClick={() => {
                setActiveSection('analyzer');
                setIsDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeSection === 'analyzer'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Analyzer
            </button>
            <button
              onClick={() => {
                setActiveSection('about');
                setIsDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeSection === 'about'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <Info className="h-5 w-5" />
              About Us
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-500">net_an</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Globe className="h-5 w-5" />
              {selectedNetwork?.ssid}
            </div>
            <button
              onClick={toggleCapture}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                isCapturing
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
              }`}
            >
              <RefreshCw className={`h-5 w-5 ${isCapturing ? 'animate-spin' : ''}`} />
              {isCapturing ? 'Stop Capturing' : 'Start Capturing'}
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default App;