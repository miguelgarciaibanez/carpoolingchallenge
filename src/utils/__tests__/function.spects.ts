import { dummyICar, dummyIJourney,
         dummyAvailalbeCarItems, arraydummyICar, 
         emptyDummyICarJourneys, dummyICarJourneys,
         noEmptyDummyICarJourneys,noEmptyResponseDummyICarJourneys,
         dummyAvailableCarItemsDummyResponse,
         emptyAvailabeCars,
         noEmptyAvailableCars } from "@carpool/tests/dummyObjects";
import { ICar, } from "@carpool/types/car";
import { IJourney } from '@carpool/types/journey';
import { IJourneyCar, ICarJourneys } from '@carpool/types/journeyCar';
import exp from "constants";
import { listCarsToObjectMap, addJourneyCar, removeJourneyCar, addJourneyToCarArray, removeJourneyFromCarArray, addCarToAvailableSeats } from '../functions';


describe('ListCarsToObject',()=>{
    it('Should return empty Map',()=>{
        const emptyList: ICar[] = [];
        let res = new Map<number, Map<number,ICar>>;
        res = listCarsToObjectMap(emptyList);
        expect(res.size).toEqual(0);
    });

    it('Should return expected Map empty one',()=>{
        const requestCar:ICar =dummyICar();
        const expectedMap:Map<number, Map<number,ICar>> = dummyAvailalbeCarItems();
        let res = new Map<number, Map<number,ICar>>;
        res = listCarsToObjectMap([requestCar]);
        expect(res.size).toEqual(expectedMap.size);
        expect(res).toMatchObject(expectedMap);
    });

    it('Should return map with repeated seats',()=>{
        const requestCars:Array<ICar> = arraydummyICar();
        const expectedMap: Map<number, Map<number,ICar>> = dummyAvailableCarItemsDummyResponse();
        let res = new Map<number, Map<number,ICar>>;
        res = listCarsToObjectMap(requestCars);
        expect(res.size).toEqual(expectedMap.size);
        expect(res).toMatchObject(expectedMap);
    });
});

describe('AddJourneyCar',()=>{

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return a new JourneyCar',()=>{
        const journeyDummy:IJourney = dummyIJourney();
        const journeyCar:ICar = dummyICar();
        const mapToCall:Map<number,IJourneyCar> = new Map<number,IJourneyCar>;
        let expectedResponse:Map<number,IJourneyCar> = new Map<number,IJourneyCar>;
        let exptectedJourneyCar:IJourneyCar = {journey:journeyDummy, car:journeyCar};
        expectedResponse.set(journeyDummy.id,exptectedJourneyCar);
        let res = addJourneyCar(journeyDummy, journeyCar, mapToCall);
        expect(res.size).toEqual(expectedResponse.size);
        expect(res).toMatchObject(expectedResponse);
    });

    it('should return a JourneyCar from an existing one',()=>{
        const journeyDummy:IJourney = dummyIJourney();
        const journeyCar:ICar = dummyICar();
        let expectedResponse:Map<number,IJourneyCar> = new Map<number,IJourneyCar>;
        let exptectedJourneyCar:IJourneyCar = {journey:journeyDummy, car:journeyCar};
        const mapToCall:Map<number,IJourneyCar> = new Map<number,IJourneyCar>;
        mapToCall.set(journeyDummy.id,exptectedJourneyCar);
        expectedResponse.set(journeyDummy.id,exptectedJourneyCar);
        let res = addJourneyCar(journeyDummy, journeyCar, mapToCall);
        expect(res.size).toEqual(expectedResponse.size);
        expect(res).toMatchObject(expectedResponse);
    });
});

describe('removeJourneyCar',()=>{
    it('Should remove link between car and journey',()=>{
        const journeyDummy:IJourney = dummyIJourney();
        const journeyCar:ICar = dummyICar();
        let expectedResponse:Map<number,IJourneyCar> = new Map<number,IJourneyCar>;
        let exptectedJourneyCar:IJourneyCar = {journey:journeyDummy, car:journeyCar};
        const mapToCall:Map<number,IJourneyCar> = new Map<number,IJourneyCar>;
        mapToCall.set(journeyDummy.id,exptectedJourneyCar);
        let res = removeJourneyCar(journeyDummy, journeyCar, mapToCall);
        expect(res.size).toEqual(expectedResponse.size);
        expect(res).toMatchObject(expectedResponse);
    });
});

describe('AddJourneyToCarArray',()=>{
    it('Should add journey to emptyCarArray',()=>{
        const journey = dummyIJourney();
        const car = dummyICar();
        const emptyMapResult = emptyDummyICarJourneys();
        const expectedResult = dummyICarJourneys();
        let resCall = addJourneyToCarArray(journey,car,emptyMapResult);
        expect(resCall.size).toEqual(expectedResult.size);
        expect(resCall).toMatchObject(expectedResult);
    });

    it('Should add journey to no empty CarArray',()=>{
        const journey = {id:2, people:1};
        const car = {id:1, seats:2};
        const noEmptyMapResult = noEmptyDummyICarJourneys();
        const expectedResult = noEmptyResponseDummyICarJourneys();
        let resCall = addJourneyToCarArray(journey,car,noEmptyMapResult);
        expect(resCall.size).toEqual(expectedResult.size);
        expect(resCall).toMatchObject(expectedResult);
    });

});

describe('RemoveJourneyFromCarrArray',()=>{
    it('should remove journey from carr array',()=>{
        const carrArrayNoEmpty:Map<any,any> = noEmptyResponseDummyICarJourneys();
        const journey = {id:2, people:1};
        const car = {id:1, seats:2};
        const expectedResult:Map<any,any> = noEmptyDummyICarJourneys();
        const resCall = removeJourneyFromCarArray(journey, car, carrArrayNoEmpty);
        expect(resCall.size).toEqual(expectedResult.size);
        expect(resCall).toMatchObject(expectedResult);
    });

    it ('should not remove journey since it does not exists',()=>{
        const carrArrayNoEmpty:Map<any,any> = noEmptyResponseDummyICarJourneys();
        const journey = {id:3, people:1};
        const car = {id:1, seats:2};
        const resCall = removeJourneyFromCarArray(journey, car, carrArrayNoEmpty);
        expect(resCall.size).toEqual(carrArrayNoEmpty.size);
        expect(resCall).toMatchObject(carrArrayNoEmpty);
    })

    it ('should not remove journey since car does not exists',()=>{
        const carrArrayNoEmpty:Map<any,any> = noEmptyResponseDummyICarJourneys();
        const journey = {id:2, people:1};
        const car = {id:2, seats:2};
        const resCall = removeJourneyFromCarArray(journey, car, carrArrayNoEmpty);
        expect(resCall.size).toEqual(carrArrayNoEmpty.size);
        expect(resCall).toMatchObject(carrArrayNoEmpty);
    });

    it('Should delete map entry for empty car',()=>{
        const journey = dummyIJourney();
        const car = dummyICar();
        const noEmptyMapResult = dummyICarJourneys();
        const resCall = removeJourneyFromCarArray(journey, car, noEmptyMapResult);
        expect(resCall.size).toBe(0);
    })
});

describe('Car availableSeats',()=>{
    it('Should add car to empty avalaiblecars',()=>{
        const car = dummyICar();
        const emptyCars = emptyAvailabeCars();
        const resExpected = noEmptyAvailableCars();
        let resCall = addCarToAvailableSeats(1,car,emptyCars);
        expect(resCall.size).toEqual(resExpected.size);
        expect(resCall).toMatchObject(resExpected);
    });

    it('Should return the very same because seats are 0',()=>{
        const car = dummyICar();
        const resExpected = noEmptyAvailableCars();
        let resCall = addCarToAvailableSeats(0,car,resExpected);
        expect(resCall.size).toEqual(resExpected.size);
        expect(resCall).toMatchObject(resExpected);
    })
})