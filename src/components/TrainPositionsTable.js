import {
  TrainCarPassengerIcon,
  TrainCarContainerIcon,
  TrainCarCenterbeamIcon,
} from './icons';

import { getLineColor, getAliases } from '../utils/helpers';

const renderTrainCars = (train) => {
  const cars = [];
  for (let i = 1; i <= train.CarCount; i++) {
    switch (train.ServiceType) {
      case 'Normal':
        cars.push(<TrainCarPassengerIcon key={i} title={i} />);
        break;
      case 'NoPassengers':
        cars.push(<TrainCarContainerIcon key={i} title={i} />);
        break;
      default:
        cars.push(<TrainCarCenterbeamIcon key={i} title={i} />);
    }
  }
  return cars;
};

const TrainPositionsTable = ({ filtered }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Train Number</th>
          <th>Direction</th>
          <th>Circuit ID</th>
          <th>Destination</th>
          <th>Line Color</th>
          <th>Seconds at Location</th>
          <th>Service Type</th>
          <th>Car Count</th>
          <th>Cars</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((train) => (
          <tr
            key={train.TrainId}
            style={{
              backgroundColor: getLineColor(train.LineCode),
            }}
          >
            <td>{train.TrainNumber}</td>
            <td>{getAliases('DirectionNum', train.DirectionNum)}</td>
            <td>{train.CircuitId}</td>
            <td>{train.DestinationStationCode}</td>
            <td>{getAliases('LineCode', train.LineCode)}</td>
            <td>{train.SecondsAtLocation}</td>
            <td>{getAliases('ServiceType', train.ServiceType)}</td>
            <td>{train.CarCount}</td>
            <td>{renderTrainCars(train)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TrainPositionsTable;
