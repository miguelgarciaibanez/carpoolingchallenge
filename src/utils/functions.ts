import CarItems from '@carpool/types/car';
import { IJourney } from '@carpool/types/journey';
import { ICar } from '@carpool/types/car';
import { IJourneyCar, ICarJourneys } from '../types/journeyCar';

export const  listCarsToObjectMap = (list:CarItems):Map<number, CarItems> => {
    let resultObject:Map<number, CarItems> = new Map<number, CarItems>;
    list.map(item => {
        if ( resultObject.has(item.seats) ) {
            let currentMap = resultObject.get(item.seats);
            if (currentMap && currentMap.length > 0){
                let newMapValue = JSON.parse(JSON.stringify(currentMap))
                newMapValue.push(item);
                resultObject.set(item.seats,newMapValue);
            }
        } else {
            let newMap:Array<any> = [item];
            resultObject.set(item.seats, newMap);
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
            return newJourneyCarCopy;
        } else {
            newJourneyCarCopy.set(journey.id, {journey, car});
            return newJourneyCarCopy
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
    try {
        let arrayOfCarsToUpdate:Array<any> = availableCars.get(seats) ? JSON.parse(JSON.stringify(availableCars.get(seats))) : [];
        if (seats > 0){
            arrayOfCarsToUpdate.push(car);
            let newAvailableCars = new Map(availableCars);
            newAvailableCars.set(seats,arrayOfCarsToUpdate);
            return newAvailableCars;
        } else {
            return availableCars;
        }
    } catch (error) {
        console.log(`Error addCarToAvailableSeats:${error}`);
    }
    return availableCars;
}

/**
 * Function to remove a car from available car seats
 * @param seats 
 * @param car 
 * @param availableCars 
 * @returns 
 */
export const removeCarFromAvailableSeats = (seats:number, car:ICar, availableCars:Map<number, CarItems>):Map<number, CarItems> =>{
    try {
        const arrayOfCarsToUpdate = JSON.parse(JSON.stringify(availableCars.get(seats)));
        if (arrayOfCarsToUpdate && arrayOfCarsToUpdate.length > 0){
            const newArrayOfCars = arrayOfCarsToUpdate.filter((carItem: ICar) => carItem.id !== car.id);
            let newAvailableCars = new Map(availableCars);
            if(newArrayOfCars.length > 0){
                newAvailableCars.set(seats,newArrayOfCars);
            } else{
                newAvailableCars.delete(seats);
            }
            return newAvailableCars;
        } else {
            return availableCars;
        }
    } catch (error) {
        console.log(`Error removeCarFromAvailableSeats:${error}`);
    }
    return availableCars;
}



