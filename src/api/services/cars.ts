import CarsRecords from '@carpool/api/models/carsRecord';
import CarItems from '@carpool/types/car';
import JourneyRecord from '@carpool/api/models/journeyRecord';
import CarJourneysRecords from '@carpool/api/models/carJourneysRecords';


export function resetApp(arrayCars:CarItems):boolean{
    try {
        CarsRecords.setGlobalAvailableCars(arrayCars);
        JourneyRecord.resetJourneyRecords();
        CarJourneysRecords.resetCarJourneysRecords();
        //TODO CLEAN carJourneys singleton
        //TODO CLEAN pending journeys singleton queue
        return true;
    } catch (error) {
        console.log(`Error resetting App:${error}` );
        return false;
    }
}

