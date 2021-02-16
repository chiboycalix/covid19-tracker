/** @format */
import React from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from './util';
import 'leaflet/dist/leaflet.css';

function App() {
	const [countries, setCountries] = React.useState([]);
	const [country, setCountry] = React.useState('worldwide');
	const [countryInfo, setCountryInfo] = React.useState({});
	const [tableData, setTableData] = React.useState([]);
	const [mapCenter, setMapCenter] = React.useState([34.80746, -40.4796]);
	const [mapZoom, setMapZoom] = React.useState(3);
	const [mapCountries, setMapCountries] = React.useState([]);
	const [casesType, setCasesType] = React.useState('cases');

	React.useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all')
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);
				if (countryCode !== 'worldwide') {
					setMapCenter([data?.countryInfo?.lat, data?.countryInfo?.long]);
				} else {
					setMapCenter([34.80746, -40.4796])
				}
				setMapZoom(4);
			});
	};

	React.useEffect(() => {
		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries')
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => {
						return {
							name: country.country,
							value: country.countryInfo.iso2,
						};
					});
					const sorted = sortData(data);
					setTableData(sorted);
					setCountries(countries);
					setMapCountries(data);
				});
		};

		getCountriesData();
	}, []);

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>
					<FormControl className="app__dropdown">
						<Select variant="outlined" value={country} onChange={onCountryChange}>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country, index) => {
								return (
									<MenuItem key={index} value={country.value}>
										{country.name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
				<div className="app_stats">
					<InfoBox
						active={casesType === 'cases'}
						onClick={(e) => setCasesType('cases')}
						title="Coronavirus Cases"
						total={prettyPrintStat(countryInfo.cases)}
						cases={prettyPrintStat(countryInfo.todayCases)}
						isRed
					/>
					<InfoBox
						onClick={(e) => setCasesType('recovered')}
						title="Recovered"
						total={prettyPrintStat(countryInfo.recovered)}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						active={casesType === 'recovered'}
					/>
					<InfoBox
						onClick={(e) => setCasesType('deaths')}
						title="Deaths"
						total={prettyPrintStat(countryInfo.deaths)}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						active={casesType === 'deaths'}
						isRed
					/>
				</div>

				<Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType} />
			</div>

			<Card className="app__right">
				<CardContent>
					<h3>Live cases by countries</h3>
					<Table countries={tableData} />
					<h3 className="app__graphTitle">Worldwide new {casesType}</h3>
					<LineGraph casesType={casesType} className="app__graph" />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
