import {resetApp} from '../cars';
import CarsRecords from '@carpool/api/models/carsRecord';
import JourneyRecord from '@carpool/api/models/journeyRecord';
import CarJourneysRecords from '@carpool/api/models/carJourneysRecords';
import JourneysPending from '@carpool/api/models/journeysPending';
import {ICar} from '@carpool/types/car';



describe('RESET',()=>{
    
    it('Should reset the app',()=>{
        jest.spyOn(CarsRecords,'setGlobalAvailableCars').mockReturnValueOnce();
        jest.spyOn(JourneyRecord,'resetJourneyRecords').mockReturnValueOnce();
        jest.spyOn(CarJourneysRecords,'resetCarJourneysRecords').mockReturnValueOnce();
        jest.spyOn(CarJourneysRecords,'resetCarJourneysRecords').mockReturnValueOnce();
        jest.spyOn(JourneysPending,'resetJourneysPendings').mockReturnValueOnce();
        const arrayCars:Array<ICar> = [];
        const res =  resetApp(arrayCars);
        expect(res).toBe(true);
    });

    it('Shour return false',()=>{
        jest.spyOn(CarsRecords,'setGlobalAvailableCars').mockImplementation(()=>{
            throw new Error();
        });
        const arrayCars:Array<ICar> = [];
        const res =  resetApp(arrayCars);
        expect(res).toBe(false);
    })
})