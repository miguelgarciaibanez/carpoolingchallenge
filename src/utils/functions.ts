import CarItems from '@carpool/types/car';
import { IJourney } from '@carpool/types/journey';
import { ICar } from '@carpool/types/car';
import { IJourneyCar, ICarJourneys } from '@carpool/types/journeyCar';

/**
 * Function to set list cars to ObjectMap
 * @param list 
 * @returns 
 */
export const listCarsToObjectMap = (list:Array<ICar>):Map<number, Map<number,ICar>> => {
    let resultObject:Map<number, CarItems> = new Map<number, Map<number,ICar>>;
    list.map(item => {
        const newMapValue = new Map<number,ICar>;
        newMapValue.set(item.id, item);
        if ( resultObject.has(item.seats) ) {
            let currentMap = new Map(resultObject.get(item.seats));
            
            currentMap.set(item.id, item);
            resultObject.set(item.seats,currentMap);
        } else {
            resultObject.set(item.seats, newMapValue);
        }
    });
    return resultObject;
}

/**
 * Function to link a Journey to a car
 * @param journey 
 * @param car 
 * @param journeyCars 
 * @returns 
 */
export const addJourneyCar = (journey: IJourney, car: ICar, journeyCars: Map<number,IJourneyCar>):Map<number,IJourneyCar> =>{
    let newJourneyCarCopy = new Map(journeyCars);
    try {
        let journeyCar = newJourneyCarCopy.get(journey.id);
        if (journeyCar){
            newJourneyCarCopy.delete(journey.id);
            newJourneyCarCopy.set(journey.id,{journey,car});
        } else {
            newJourneyCarCopy.set(journey.id, {journey, car});
        }
    } catch (error) {
        console.log(`Error tryingto set journeyRecords ${error}`);
    }
    return newJourneyCarCopy;
}

/**
 * Function to unlink a journey and a car
 * @param journey 
 * @param car 
 * @param journeyCars 
 * @returns 
 */
export const removeJourneyCar = (journey:IJourney, car:ICar, journeyCars: Map<number,IJourneyCar>):Map<number,IJourneyCar> => {
    let newJourneyCarCopy = new Map(journeyCars);
    try {
        let journeyCar = newJourneyCarCopy.get(journey.id);
        if (journeyCar){
            newJourneyCarCopy.delete(journey.id);
        }
    } catch (error) {
        console.log(`Error on removeJourneyCar:${error}`)
    }
    return newJourneyCarCopy;
}

/**
 * Function to add a Journey to Car Journey array
 * @param journey 
 * @param car 
 * @param carJourneysRecords 
 * @returns 
 */
export const addJourneyToCarArray = (journey:IJourney, car:ICar, carJourneysRecords:Map<number, ICarJourneys>):Map<number, ICarJourneys> =>{
    let newCarJourneysCopy = new Map(carJourneysRecords);
    try {
        let carRecord = carJourneysRecords.get(car.id);
        if (carRecord){
            let newCarJourneyRecords = {} as ICarJourneys;
            let arrayOfJourneys:Array<any> = JSON.parse(JSON.stringify(carRecord.journeys));
            arrayOfJourneys.push(journey);
            let newfreeSeats = carRecord.freeSeats - journey.people;
            newCarJourneyRecords.car = car; 
            newCarJourneyRecords.freeSeats = newfreeSeats;
            newCarJourneyRecords.journeys = arrayOfJourneys;
            newCarJourneysCopy.set(car.id, newCarJourneyRecords);
        } else{
            let newCarJourneyRecords = {} as ICarJourneys;
            newCarJourneyRecords.car = car; 
            newCarJourneyRecords.freeSeats = car.seats - journey.people;
            newCarJourneyRecords.journeys = [journey];
            newCarJourneysCopy.set(car.id, newCarJourneyRecords);
        }
    } catch (error) {
        console.log(`AddJourneyToCarArray error:${error}`);
    }
    return newCarJourneysCopy;
}

/**
 * Function to remove a Journey from a Car Journey Array
 * @param journey 
 * @param car 
 * @param carJourneysRecords 
 * @returns 
 */
export const removeJourneyFromCarArray = (journey:IJourney, car:ICar, carJourneysRecords:Map<number, ICarJourneys>):Map<number, ICarJourneys> =>{
    let newCarJourneysCopy = new Map(carJourneysRecords);
    try {
        let carRecord = carJourneysRecords.get(car.id);
        if (carRecord){
            let newCarJourneyRecords = {} as ICarJourneys;
            let arrayOfJourneys = JSON.parse(JSON.stringify(carRecord.journeys));
            if (arrayOfJourneys.find((journeyItem: IJourney) => journeyItem.id === journey.id)){
                arrayOfJourneys = arrayOfJourneys.filter((journeyItem: IJourney) => journeyItem.id !== journey.id);
                if (arrayOfJourneys.length === 0){
                  newCarJourneysCopy.delete(car.id);
                  return newCarJourneysCopy;  
                }
                let newfreeSeats = carRecord.freeSeats + journey.people;
                newCarJourneyRecords.car = car; 
                newCarJourneyRecords.freeSeats = newfreeSeats;
                newCarJourneyRecords.journeys = arrayOfJourneys;
                newCarJourneysCopy.set(car.id, newCarJourneyRecords);
            }
        }
    } catch (error) {
        console.log(`removeJourneyFromCarArray error:${error}`);
    }
    return newCarJourneysCopy;
}

/**
 * Function to add a car to available car seats
 * @param seats 
 * @param car 
 * @param availableCars 
 * @returns 
 */
export const addCarToAvailableSeats=(seats:number, car:ICar, availableCars:Map<number, CarItems>):Map<number, CarItems> =>{
    let newAvailableCars = new Map(availableCars);
    try {
        let mapOfCarsToUpdate = availableCars.get(seats) ? new Map(availableCars.get(seats)) : new Map<number,ICar>;
        if (seats > 0){
            mapOfCarsToUpdate.set(car.id,car);
            newAvailableCars.set(seats,mapOfCarsToUpdate);
            //return newAvailableCars;
        } else {
            //return availableCars;
        }
    } catch (error) {
        console.log(`Error addCarToAvailableSeats:${error}`);
    }
    return newAvailableCars;
}

/**
 * Function to remove a car from available car seats
 * @param seats 
 * @param car 
 * @param availableCars 
 * @returns 
 */
export const removeCarFromAvailableSeats = (seats:number, car:ICar, availableCars:Map<number, CarItems>):Map<number, CarItems> =>{
    let newAvailableCars = new Map(availableCars);
    try {
        const mapCarsToUpdate = newAvailableCars.get(seats);
        if (mapCarsToUpdate && mapCarsToUpdate.size > 0){
            mapCarsToUpdate.delete(car.id);
            if(mapCarsToUpdate.size > 0){
                newAvailableCars.set(seats,mapCarsToUpdate);
            } else{
                newAvailableCars.delete(seats);
            }
        } 
    } catch (error) {
        console.log(`Error removeCarFromAvailableSeats:${error}`);
    }
    return newAvailableCars;
}



