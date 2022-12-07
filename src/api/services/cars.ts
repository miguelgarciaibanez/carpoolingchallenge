import CarsRecords from '@carpool/api/models/carsRecord';
import {ICar} from '@carpool/types/car';
import JourneyRecord from '@carpool/api/models/journeyRecord';
import CarJourneysRecords from '@carpool/api/models/carJourneysRecords';
import JourneysPending from '@carpool/api/models/journeysPending';


export function resetApp(arrayCars:Array<ICar>):boolean{
    try {
        CarsRecords.setGlobalAvailableCars(arrayCars);
        JourneyRecord.resetJourneyRecords();
        CarJourneysRecords.resetCarJourneysRecords();
        JourneysPending.resetJourneysPendings();
        return true;
    } catch (error) {
        console.log(`Error resetting App:${error}` );
        return false;
    }
}

