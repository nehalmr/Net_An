import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { Wifi, Plus, Shield } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Network {
  ssid: string;
  security: string;
  strength: number;
  lat?: number;
  lng?: number;
}

interface NetworkMapProps {
  networks: Network[];
  onConnect: (network: Network) => void;
}

export function NetworkMap({ networks, onConnect }: NetworkMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 14
  });
  const [newNetworkMode, setNewNetworkMode] = useState(false);
  const [newNetwork, setNewNetwork] = useState<Partial<Network>>({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setViewport(prev => ({
          ...prev,
          latitude,
          longitude
        }));
      },
      (error) => {
        console.error('Error getting location:', error);
        // Default to a random location if geolocation fails
        setUserLocation([-74.006, 40.7128]); // NYC coordinates
      }
    );
  }, []);

  const handleAddNetwork = (e: any) => {
    if (!newNetworkMode) return;
    
    const { lngLat } = e;
    setNewNetwork({
      ...newNetwork,
      lat: lngLat.lat,
      lng: lngLat.lng
    });
  };

  const handleSubmitNewNetwork = () => {
    if (!newNetwork.ssid) return;
    
    const network: Network = {
      ssid: newNetwork.ssid || '',
      security: newNetwork.security || 'Open',
      strength: 4,
      lat: newNetwork.lat,
      lng: newNetwork.lng
    };
    
    onConnect(network);
    setNewNetworkMode(false);
    setNewNetwork({});
  };

  return (
    <div className="relative h-[calc(100vh-12rem)] w-full rounded-xl overflow-hidden">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken="pk.eyJ1IjoibmV0YW4iLCJhIjoiY2x0d2k2MHgwMDFrYTJrcGFtN2NqZnV0ZiJ9.Wy_97mM4VxapQUYDyQAJmw"
        onClick={handleAddNetwork}
      >
        <NavigationControl position="top-right" />
        
        {/* User Location */}
        <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
        </Marker>

        {/* Network Markers */}
        {networks.map((network, index) => (
          network.lat && network.lng && (
            <Marker
              key={index}
              longitude={network.lng}
              latitude={network.lat}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedNetwork(network);
              }}
            >
              <div className="relative cursor-pointer">
                <Wifi className="w-6 h-6 text-blue-400" />
                {network.security !== 'Open' && (
                  <Shield className="w-3 h-3 text-green-400 absolute -right-1 -bottom-1" />
                )}
              </div>
            </Marker>
          )
        ))}

        {/* Selected Network Popup */}
        {selectedNetwork && (
          <Popup
            longitude={selectedNetwork.lng!}
            latitude={selectedNetwork.lat!}
            anchor="bottom"
            onClose={() => setSelectedNetwork(null)}
            className="rounded-lg"
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedNetwork.ssid}</h3>
              <p className="text-sm text-gray-600">{selectedNetwork.security}</p>
              <button
                onClick={() => onConnect(selectedNetwork)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              >
                Connect
              </button>
            </div>
          </Popup>
        )}
      </Map>

      {/* Add Network Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setNewNetworkMode(!newNetworkMode)}
          className={`p-3 rounded-full shadow-lg ${
            newNetworkMode
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          <Plus className={`w-6 h-6 ${newNetworkMode ? 'rotate-45' : ''} transition-transform`} />
        </button>
      </div>

      {/* New Network Form */}
      {newNetworkMode && newNetwork.lat && newNetwork.lng && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-3">Add New Network</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">SSID</label>
              <input
                type="text"
                value={newNetwork.ssid || ''}
                onChange={e => setNewNetwork({ ...newNetwork, ssid: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Security</label>
              <select
                value={newNetwork.security || 'Open'}
                onChange={e => setNewNetwork({ ...newNetwork, security: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option>Open</option>
                <option>WPA2</option>
                <option>WPA3</option>
              </select>
            </div>
            <button
              onClick={handleSubmitNewNetwork}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Network
            </button>
          </div>
        </div>
      )}
    </div>
  );
}