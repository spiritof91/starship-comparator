import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import Loader from './Loader'
import Progressbar from './Progressbar'


export default () => {

    const [isLoading, setIsLoading] = useState(true);
    const [shipsList, setshipsList] = useState({});
    const [maxValues, setMaxValues] = useState({
        cost_in_credits: 0,
        length: 0,
        max_atmosphering_speed: 0,
        passengers: 0,
        cargo_capacity: 0,
        consumables_in_hours: 0,
        MGLT: 0,
    })
    const [shipOnLeft, setShipOnLeft] = useState({});
    const [shipOnRight, setShipOnRight] = useState({});

    // getting a number of days in 'consumables' string (e.g., '3 weeks' = 3 * 7 days = 21 days)
    const getConsumablesInHours = (str) => {
        const hourReg = /hours?$/;
        const dayReg = /days?$/;
        const weekReg = /weeks?$/;
        const monthReg = /months?$/;
        const yearReg = /years?$/;
        const multiplier = str.match(/^\d+/);

        if (str === 'unknown' || str === 'n/a') return 'n/a';
        if (hourReg.test(str)) return (1 * parseInt(multiplier[0]));
        if (dayReg.test(str)) return (24 * parseInt(multiplier[0]));
        if (weekReg.test(str)) return (7 * 24 * parseInt(multiplier[0]));
        if (monthReg.test(str)) return (30 * 24 * parseInt(multiplier[0]));
        if (yearReg.test(str)) return (365 * 24 * parseInt(multiplier[0]));
    };

    const baseURL = 'https://swapi.dev/api/starships/'

    // getting starships data from SWAPI
    const getshipsData = (url = baseURL) => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then(data => {
                const ships = data.results.reduce((acc, current) => {
                    const result = { ...acc, [current.name]: { ...current, consumables_in_hours: getConsumablesInHours(current.consumables) } };
                    return result;
                }, {})
                setshipsList(prev => ({ ...prev, ...ships }));
                if (data.next) {
                    const nextURL = data.next;
                    getshipsData(nextURL);
                } else {
                    setIsLoading(false);
                }
            })
            .catch(() => alert('Oops! Something went wrong. Please, try to reload this page!'));
    }

    useEffect(getshipsData, []);

    const progressCn = (currentValue, compareValue) => {
        if (!parseFloat(compareValue) || !parseFloat(currentValue)) return 'progress-bar';
        return cn( 'progress-bar',
            { 'bg-success': (currentValue - compareValue) > 0 },
            { 'bg-warning': (currentValue - compareValue) === 0 },
            { 'bg-danger': (currentValue - compareValue) < 0 },
        );
    };
    const hyperCn = (currentValue, compareValue, side) => {
        if (!parseFloat(compareValue) || !parseFloat(currentValue)) return `${side}-col`;
        return cn( 'hyper', `${side}-col`,
            { 'text-success': (currentValue - compareValue) < 0 },
            { 'text-warning': (currentValue - compareValue) === 0 },
            { 'text-danger': (currentValue - compareValue) > 0 },
        )
    }

    const getMaxValues = () => {
        const shipKeys = Object.keys(shipsList);
        setShipOnLeft(shipsList[shipKeys[Math.floor(Math.random() * shipKeys.length)]]);
        setShipOnRight(shipsList[shipKeys[Math.floor(Math.random() * shipKeys.length)]]);
    };
    useEffect(getMaxValues, [shipsList]);

    const shipsNames = Object.keys(shipsList);

    return (
        <div className='form-container'>
            {isLoading ? <Loader /> :
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th className='left-col'>Starship 1</th>
                        <th className='middle-col'>Specifications</th>
                        <th className='right-col'>Starship 2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='left-col'>
                            <select className='form-control' value={shipOnLeft.name} onChange={(e) => {
                                setShipOnLeft(shipsList[e.target.value])
                            }}>
                                {shipsNames.map((name, i) => (
                                    <option key={i}>{name}</option>
                                ))}
                            </select>
                        </td>
                        <td className='middle-col'>Name</td>
                        <td className='right-col'>
                            <select className='form-control' value={shipOnRight.name} onChange={(e) => {
                                setShipOnRight(shipsList[e.target.value])
                            }}>
                                {shipsNames.map((name, i) => (
                                    <option key={i}>{name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td className='left-col'>{shipOnLeft.model}</td>
                        <td className='middle-col'>Model</td>
                        <td className='right-col'>{shipOnRight.model}</td>
                    </tr>
                    <tr>
                        <td className='left-col'>{shipOnLeft.starship_class}</td>
                        <td className='middle-col'>Starship class</td>
                        <td className='right-col'>{shipOnRight.starship_class}</td>
                    </tr>
                    <tr>
                        <td className='left-col'>{shipOnLeft.manufacturer}</td>
                        <td className='middle-col'>Manufacturer</td>
                        <td className='right-col'>{shipOnRight.manufacturer}</td>
                    </tr>
                    <tr>
                        <td className={hyperCn(shipOnLeft.hyperdrive_rating, shipOnRight.hyperdrive_rating, 'left')}>{shipOnLeft.hyperdrive_rating}</td>
                        <td className='middle-col'>Hyperdrive rating</td>
                        <td className={hyperCn(shipOnRight.hyperdrive_rating, shipOnLeft.hyperdrive_rating, 'right')}>{shipOnRight.hyperdrive_rating}</td>
                    </tr>
                    <tr>
                        <td className='left-col'>{shipOnLeft.crew}</td>
                        <td className='middle-col'>Crew</td>
                        <td className='right-col'>{shipOnRight.crew}</td>
                    </tr>
                    <tr>
                        <td className='left-col'><Progressbar cn={progressCn(shipOnLeft.cost_in_credits, shipOnRight.cost_in_credits)}
                                                              current={shipOnLeft.cost_in_credits}
                                                              compare={shipOnRight.cost_in_credits}
                                                              /></td>
                        <td className='middle-col'>Cost in credits</td>
                        <td className='right-col'><Progressbar cn={progressCn(shipOnRight.cost_in_credits, shipOnLeft.cost_in_credits)}
                                                              current={shipOnRight.cost_in_credits}
                                                              compare={shipOnLeft.cost_in_credits}
                                                              /></td>
                    </tr>
                    <tr>
                        <td className='left-col'><Progressbar cn={progressCn(shipOnLeft.length, shipOnRight.length)}
                                                              current={shipOnLeft.length}
                                                              compare={shipOnRight.length}
                                                              /></td>
                        <td className='middle-col'>Length</td>
                        <td className='right-col'><Progressbar cn={progressCn(shipOnRight.length, shipOnLeft.length)}
                                                              current={shipOnRight.length}
                                                              compare={shipOnLeft.length}
                                                              /></td>
                    </tr>
                    <tr>
                        <td className='left-col'><Progressbar cn={progressCn(shipOnLeft.max_atmosphering_speed, shipOnRight.max_atmosphering_speed)}
                                                              current={shipOnLeft.max_atmosphering_speed}
                                                              compare={shipOnRight.max_atmosphering_speed}
                                                              /></td>
                        <td className='middle-col'>Max atmosphering speed</td>
                        <td className='right-col'><Progressbar cn={progressCn(shipOnRight.max_atmosphering_speed, shipOnLeft.max_atmosphering_speed)}
                                                              current={shipOnRight.max_atmosphering_speed}
                                                              compare={shipOnLeft.max_atmosphering_speed}
                                                              /></td>
                    </tr>
                    <tr>
                        <td className='left-col'><Progressbar cn={progressCn(shipOnLeft.passengers, shipOnRight.passengers)}
                                                              current={shipOnLeft.passengers}
                                                              compare={shipOnRight.passengers}
                                                              /></td>
                        <td className='middle-col'>Passengers</td>
                        <td className='right-col'><Progressbar cn={progressCn(shipOnRight.passengers, shipOnLeft.passengers)}
                                                              current={shipOnRight.passengers}
                                                              compare={shipOnLeft.passengers}
                                                              /></td>
                    </tr>
                    <tr>
                        <td className='left-col'><Progressbar cn={progressCn(shipOnLeft.cargo_capacity, shipOnRight.cargo_capacity)}
                                                              current={shipOnLeft.cargo_capacity}
                                                              compare={shipOnRight.cargo_capacity}
                                                              /></td>
                        <td className='middle-col'>Cargo capacity</td>
                        <td className='right-col'><Progressbar cn={progressCn(shipOnRight.cargo_capacity, shipOnLeft.cargo_capacity)}
                                                              current={shipOnRight.cargo_capacity}
                                                              compare={shipOnLeft.cargo_capacity}
                                                              /></td>
                    </tr>
                    <tr>
                        <td className='left-col'><Progressbar cn={progressCn(shipOnLeft.consumables_in_hours, shipOnRight.consumables_in_hours)}
                                                              current={shipOnLeft.consumables_in_hours}
                                                              compare={shipOnRight.consumables_in_hours}
                                                              value={shipOnLeft.consumables}
                                                              /></td>
                        <td className='middle-col'>Consumables</td>
                        <td className='right-col'><Progressbar cn={progressCn(shipOnRight.consumables_in_hours, shipOnLeft.consumables_in_hours)}
                                                              current={shipOnRight.consumables_in_hours}
                                                              compare={shipOnLeft.consumables_in_hours}
                                                              value={shipOnRight.consumables}
                                                              /></td>
                    </tr>
                    <tr>
                        <td className='left-col'><Progressbar cn={progressCn(shipOnLeft.MGLT, shipOnRight.MGLT)}
                                                              current={shipOnLeft.MGLT}
                                                              compare={shipOnRight.MGLT}
                                                              /></td>
                        <td className='middle-col'>MGLT</td>
                        <td className='right-col'><Progressbar cn={progressCn(shipOnRight.MGLT, shipOnLeft.MGLT)}
                                                              current={shipOnRight.MGLT}
                                                              compare={shipOnLeft.MGLT}
                                                              /></td>
                    </tr>
                </tbody>
            </table>
            }
        </div>
    )
}