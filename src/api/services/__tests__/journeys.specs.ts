import * as JourneyServices from '../journeys';
import JourneyRecord from '@carpool/api/models/journeyRecord';
import CarsRecords from '@carpool/api/models/carsRecord';
import JourneysPending from '@carpool/api/models/journeysPending';
import { dummyICar, dummyIJourney } from "@carpool/tests/dummyObjects";
import { StatusCodes } from 'http-status-codes';
import { IJourney } from '@carpool/types/journey';
import { ICar } from '@carpool/types/car';
import { ICarJourneys } from '@carpool/types/journeyCar';
import carJourneysRecords from '@carpool/api/models/carJourneysRecords';

describe('SetJourney',()=>{
    it('Should return BAD REQUEST due to an exception',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementation(()=>{
            throw new Error;
        });
        const journey = dummyIJourney();
        const res:StatusCodes = JourneyServices.setJourney(journey);
        expect(res).toBe(StatusCodes.BAD_REQUEST); 
    });
    
    it('Should return BAD REQUEST because the journey id already exits',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            const car = dummyICar();
            const journey = dummyIJourney();
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            result.set(journey.id, {journey, car});
            return result;
        });
        const journey = dummyIJourney();
        const res:StatusCodes = JourneyServices.setJourney(journey);
        expect(res).toBe(StatusCodes.BAD_REQUEST); 
    });

    it('Should return Status Code OK',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            return result;
        });
        jest.spyOn(CarsRecords,"getGlobalAvailableCars").mockImplementationOnce(()=>{
            const car = dummyICar();
            const car2 = {id:2, seats:2};
            const car3 = {id:3, seats:3};
            let result:Map<number, Map<number,ICar>> = new Map<number, Map<number,ICar>>();
            result.set(car.seats,new Map<number,ICar>().set(car.id,car));
            result.set(car2.seats,new Map<number,ICar>().set(car2.id,car2));
            result.set(car3.seats,new Map<number,ICar>().set(car3.id,car3));
            return result;
        });
        const journey = dummyIJourney();
        let result: StatusCodes = JourneyServices.setJourney(journey);
        expect(result).toBe(StatusCodes.OK)
    });

    it('Should return enqueued since there are no available cars',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            return result;
        });
        jest.spyOn(CarsRecords,"getGlobalAvailableCars").mockImplementationOnce(()=>{
            let result:Map<number, Map<number,ICar>> = new Map<number, Map<number,ICar>>();
            return result;
        });
        const journey = {id:1, people:6};
        let result: StatusCodes = JourneyServices.setJourney(journey);
        expect(result).toBe(StatusCodes.ACCEPTED);
    });
});

describe('DropOffJourney',()=>{
    it('Should return bad request because ID is not a number',()=>{
        const wrongID:string="wrongID";
        let result: StatusCodes = JourneyServices.dropOffJourney(wrongID);
        expect(result).toBe(StatusCodes.BAD_REQUEST);
    });

    it('Should return NOT FOUND because journey is neither in journeys nor in pendings',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            return result;
        });
        jest.spyOn(JourneysPending,"getJourneysPendings").mockImplementationOnce(()=>{
            let result:Map<number,IJourney> = new Map<number,IJourney>();
            return result;
        })
        const wrongID:string="1";
        let result: StatusCodes = JourneyServices.dropOffJourney(wrongID);
        expect(result).toBe(StatusCodes.NOT_FOUND);
    });

    it('Should return  because journey is in pendings',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            return result;
        });
        jest.spyOn(JourneysPending,"getJourneysPendings").mockImplementationOnce(()=>{
            let result:Map<number,IJourney> = new Map<number,IJourney>();
            result.set(1,{id:1, people:6});
            result.set(2,{id:2, people:3});
            return result;
        })
        const wrongID:string="1";
        let result: StatusCodes = JourneyServices.dropOffJourney(wrongID);
        expect(result).toBe(StatusCodes.OK);
    });
    
    it('Should return OK because remove journey from journeys',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            result.set(1,{journey:{id:1, people:1}, car:{id:3, seats:3}});
            result.set(2,{journey:{id:2, people:1}, car:{id:3, seats:3}});
            return result;
        });
        jest.spyOn(CarsRecords,"getGlobalAvailableCars").mockImplementationOnce(()=>{
            const car = dummyICar();
            const car2 = {id:2, seats:2};
            const car3 = {id:3, seats:3};
            let result:Map<number, Map<number,ICar>> = new Map<number, Map<number,ICar>>();
            result.set(car.seats,new Map<number,ICar>().set(car.id,car));
            result.set(car2.seats,new Map<number,ICar>().set(car2.id,car2));
            result.set(1,new Map<number,ICar>().set(car3.id,car3));
            return result;
        });
        jest.spyOn(carJourneysRecords,"getCarJourneysRecords").mockImplementationOnce(()=>{
            const cartest = {id:3, seats:3};
            const journeytest = {id:1, people:1};
            const journeytest2 = {id:2, people:1};
            const carJourney= {car:cartest,journeys:[journeytest,journeytest2],freeSeats:1}
            const carJourneysMap:Map<number,ICarJourneys> = new Map<number,ICarJourneys>();
            carJourneysMap.set(cartest.id,carJourney);
            return carJourneysMap;
        });
        let result:StatusCodes = JourneyServices.dropOffJourney("1");
        expect(result).toBe(StatusCodes.OK)
    })
})


describe('LocateJourney',()=>{
    it('Should return BAD REQUEST because ID is not a number',()=>{
        const wrongID:string="wrongID";
        let result: {statusCode:StatusCodes, car:ICar | any} = JourneyServices.locateJourney(wrongID);
        expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(result.car).toBe(null);
    });

    it('Should return OK because the journey is active',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            result.set(1,{journey:{id:1, people:1}, car:{id:3, seats:3}});
            result.set(2,{journey:{id:2, people:1}, car:{id:3, seats:3}});
            return result;
        });

        const rightID:string="1";
        let result: {statusCode:StatusCodes, car:ICar | any} = JourneyServices.locateJourney(rightID);
        expect(result.statusCode).toBe(StatusCodes.OK);
        expect(result.car).toMatchObject({id:3, seats:3});
    });

    it('Should return NO_CONTENT because the journey is pending',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            return result;
        });
        jest.spyOn(JourneysPending,"getJourneysPendings").mockImplementationOnce(()=>{
            let result:Map<number,IJourney> = new Map<number,IJourney>();
            result.set(1,{id:1, people:6});
            result.set(2,{id:2, people:3});
            return result;
        })

        const rightID:string="1";
        let result: {statusCode:StatusCodes, car:ICar | any} = JourneyServices.locateJourney(rightID);
        expect(result.statusCode).toBe(StatusCodes.NO_CONTENT);
        expect(result.car).toBe(null);
    });

    it('Should return NOT_FOUND because the journey is neither pending nor active',()=>{
        jest.spyOn(JourneyRecord,"getJourneyRecords").mockImplementationOnce(()=>{
            let result:Map<number,{journey:IJourney,car:ICar}> = new Map<number,{journey:IJourney,car:ICar}>;
            return result;
        });
        jest.spyOn(JourneysPending,"getJourneysPendings").mockImplementationOnce(()=>{
            let result:Map<number,IJourney> = new Map<number,IJourney>();
            return result;
        })

        const rightID:string="1";
        let result: {statusCode:StatusCodes, car:ICar | any} = JourneyServices.locateJourney(rightID);
        expect(result.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(result.car).toBe(null);
    });
})