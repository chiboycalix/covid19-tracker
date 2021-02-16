/** @format */

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './map.css';
import { showDataOnMap } from './util';

const Map = ({ countries, casesType, center, zoom }) => {
	console.log({ casesType });
	return (
		<div className="map">
			<MapContainer className="markercluster-map" center={center} zoom={zoom}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				{showDataOnMap(countries, casesType)}
			</MapContainer>
		</div>
	);
};
export default Map;
