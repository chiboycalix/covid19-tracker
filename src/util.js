/** @format */
import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
	cases: {
		hex: '#cc1034',
		multiplier: 100,
	},
	recovered: {
		hex: '#7dd71d',
		multiplier: 200,
	},
	deaths: {
		hex: '#7fb4443',
		multiplier: 800,
	},
};
export const prettyPrintStat = (stat) => (stat ? `+${numeral(stat).format('0.0a')}` : '+0');

export const sortData = (data) => {
	const sortedData = [...data];
	sortedData.sort((a, b) => {
		if (a.cases > b.cases) {
			return -1;
		} else {
			return 1;
		}
	});
	return sortedData;
};

// draw circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType = 'cases') => {
	console.log({ casesType });
	return data.map((country, index) => {
		return (
			<Circle
				key={index}
				center={[country.countryInfo.lat, country.countryInfo.long]}
				fillOpacity={0.4}
				color={casesTypeColors[casesType].hex}
				fillColor={casesTypeColors[casesType].hex}
				radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}>
				<Popup className="info-container">
					<div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
					<div className="info-name">{country.country}</div>
					<div className="info-confirmed">Cases: {numeral(country.cases).format('0,0')}</div>
					<div className="info-recovered">Recovered: {numeral(country.recovered).format('0,0')}</div>
					<div className="info-deaths">Deaths: {numeral(country.deaths).format('0,0')}</div>
				</Popup>
			</Circle>
		);
	});
};
