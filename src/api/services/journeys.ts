import {
    addJourneyCar, removeJourneyCar, addJourneyToCarArray, removeJourneyFromCarArray,
    listPendingJourneysToObjectMap,
    removeCarFromAvailableSeats, addCarToAvailableSeats
} from '@carpool/utils/functions';
import CarsRecords from '@carpool/api/models/carsRecord';
import JourneyRecord from '@carpool/api/models/journeyRecord';
import CarJourneysRecords from '@carpool/api/models/carJourneysRecords';
import CarRecords from '@carpool/api/models/carsRecord';
import JourneysPending from '@carpool/api/models/journeysPending'
import { IJourney } from '@carpool/types/journey';
import { IJourneyCar } from '@carpool/types/journeyCar';
import { ICarJourneys } from '@carpool/types/journeyCar';
import { ICar } from '@carpool/types/car';
import config from '@carpool/config'
import { StatusCodes } from 'http-status-codes';
import carJourneysRecords from '@carpool/api/models/carJourneysRecords';


/**
 * JOURNEYCAR MAP(KEY:journey.id, {journey, car})
 * CARJOURNEYS MAP(KEY:car.id, {
 *  car,
 *  asientos disponibles,
 *  array de journeys
 * })
 * 
 * PENDING JOURNEYS MAP(KEY:journey.id, journey)
 */

//#region available seats cars map
/**
 * Function to remove Car from availables cars
 * @param availableSeats 
 * @param car 
 * @returns 
 */
const removeCarFromAvailable = (availableSeats: number, car: ICar): boolean => {
    let res: boolean = false;
    try {
        const availableCarsCopy = new Map(CarRecords.getGlobalAvailableCars());
        let newAvailableCars = removeCarFromAvailableSeats(availableSeats, car, availableCarsCopy);
        CarRecords.setAvailableCars(newAvailableCars);
        res = true;
    } catch (error) {
        console.log(`error setCarFromAvailableCars: ${error}`);
    }
    return res;
}

/**
 * Function to add a car to available seats cars
 * @param availableSeats 
 * @param car 
 * @returns 
 */
const addCarToAvailable = (availableSeats: number, car: ICar): boolean => {
    let res: boolean = false;
    try {
        const availableCarsCopy = new Map(CarRecords.getGlobalAvailableCars());
        let newAvailableCars = addCarToAvailableSeats(availableSeats, car, availableCarsCopy);
        CarRecords.setAvailableCars(newAvailableCars);
        res = true;
    } catch (error) {
        console.log(`error setCarFromAvailableCars: ${error}`);
    }
    return res;
}
//#endregion

//#region car journeys array
/**
 * Function to add a Journey to car Journeys
 * @param journey 
 * @param car 
 * @returns 
 */
const addJourneyToCarJourneys = (journey: IJourney, car: ICar): boolean => {
    let res = false
    try {
        let carJourneysRecordsCopy = new Map(CarJourneysRecords.getCarJourneysRecords());
        let newCarJourneysRecord = addJourneyToCarArray(journey, car, carJourneysRecordsCopy);
        CarJourneysRecords.setCarJourneysRecords(newCarJourneysRecord);
        res = true;
    } catch (error) {
        console.log(`Error adJourneyToCarArray: ${error}`);
    }
    return res;
}

/**
 * Function to remove a car from car Journeys array
 * @param journey 
 * @param car 
 * @returns 
 */
const removeJourneyFromCarJourneys = (journey: IJourney, car: ICar): boolean => {
    let res = false
    try {
        let carJourneysRecordsCopy = new Map(CarJourneysRecords.getCarJourneysRecords());
        let newCarJourneysRecord = removeJourneyFromCarArray(journey, car, carJourneysRecordsCopy);
        CarJourneysRecords.setCarJourneysRecords(newCarJourneysRecord);
        res = true;
    } catch (error) {
        console.log(`Error adJourneyToCarArray: ${error}`);
    }
    return res;
}
//#endregion

//#region Pending Journeys
/**
 * Function to add enqueue journey
 * @param journey 
 * @returns 
 */
const addJourneyToPendings = (journey: IJourney): boolean => {
    let resAdd = false;
    try {
        const pendingJourneysCopy = new Map(JourneysPending.getJourneysPendings());
        if (pendingJourneysCopy.get(journey.people)) {
            let pendingJourneysFromSeat = pendingJourneysCopy.get(journey.people);
            pendingJourneysFromSeat?.set(journey.id, journey);
            if (pendingJourneysFromSeat) {
                pendingJourneysCopy.set(journey.people, pendingJourneysFromSeat);
            } else {
                let newPendingJournestFromSeat = new Map();
                newPendingJournestFromSeat.set(journey.id, journey);
                pendingJourneysCopy.set(journey.people, newPendingJournestFromSeat);
            }
            JourneysPending.setJourneysPendings(pendingJourneysCopy);
        } else {
            let newPendingJournestFromSeat = new Map();
            newPendingJournestFromSeat.set(journey.id, journey);
            pendingJourneysCopy.set(journey.people, newPendingJournestFromSeat);
            JourneysPending.setJourneysPendings(pendingJourneysCopy);
        }
        resAdd = true;
    } catch (error) {
        console.log(`Error addJourneyToPendings ${error}`);
    }
    return resAdd;
}

/**
 * Function to remove journeyfrompendings
 * @param journey 
 * @returns 
 */
const removeJourneyFromPendings = (journey: IJourney): boolean => {
    let resRemove = false;
    try {
        const pendingJourneysCopy = new Map(JourneysPending.getJourneysPendings());
        if (pendingJourneysCopy.has(journey.people)) {
            let pendingJourneysFromSeat = pendingJourneysCopy.get(journey.people);
            if (pendingJourneysFromSeat) {
                if(pendingJourneysFromSeat.has(journey.id)){
                    pendingJourneysFromSeat.delete(journey.id);
                    pendingJourneysCopy.set(journey.people, pendingJourneysFromSeat)
                    JourneysPending.setJourneysPendings(pendingJourneysCopy);
                } 
            }
            resRemove = true;
        }
    } catch (error) {
        console.log(`Error addJourneyToPendings ${error}`);
    }
    return resRemove;
}

//#endregion

//#region journeyCar link
/**
 * Function to link a journey and a car
 * @param journey 
 * @param firstCarAvailable 
 * @param journeyCars 
 * @param availableCars 
 * @returns 
 */
const linkJourneyCar = (journey: IJourney, car: ICar, journeyCars: Map<number, IJourneyCar>): boolean => {
    let res = false;
    try {
        let newjourneyCars: Map<number, IJourneyCar> = car ? addJourneyCar(journey, car, journeyCars) : journeyCars;
        JourneyRecord.setJourneyRecords(newjourneyCars);
        res = true;
    } catch (error) {
        console.log(`Error assignJourneyToCar ${error}`);
        res = false;
    }
    return res;
}
/**
 * Function to unlink a car from the journeys
 * @param journey 
 * @param car 
 * @param journeyCars 
 * @returns 
 */
const unlinkJourneyCar = (journey: IJourney, car: ICar, journeyCars: Map<number, IJourneyCar>): boolean => {
    let res = false;
    try {
        let newjourneyCars: Map<number, IJourneyCar> = removeJourneyCar(journey, car, journeyCars);
        JourneyRecord.setJourneyRecords(newjourneyCars);
        res = true;
    } catch (error) {
        console.log(`Error assignJourneyToCar ${error}`);
        res = false;
    }
    return res;
}
//#endregion
/**
 * Function to set journeys
 * @param journey 
 * @returns 
 */
export const setJourney = (journey: IJourney): StatusCodes => {
    let resSet = false;
    let found = false;
    let querySeats = journey.people;
    try {
        let journeyCarCopy: Map<number, IJourneyCar> = JourneyRecord.getJourneyRecords();
        if (journeyCarCopy.get(journey.id)) {
            console.log(`Already exits a journey with the same id: ${journey.id}`);
            return StatusCodes.BAD_REQUEST;
        }
        let globalAvailableCars = CarsRecords.getGlobalAvailableCars();

        while (!found && querySeats <= config.allowedSeats) {
            let mapAvailableCars = globalAvailableCars.get(querySeats);

            if (mapAvailableCars && mapAvailableCars.size > 0) {
                found = true;
                let availableCarsKeyToDelete = querySeats;
                let availableCarsKeyToSet = querySeats - journey.people;
                //link journey and car
                const firstCarAvailable = mapAvailableCars.values().next().value;
                resSet = linkJourneyCar(journey, firstCarAvailable, journeyCarCopy);
                //assing journey to car array of journeys and calculate new seats available
                resSet = resSet && addJourneyToCarJourneys(journey, firstCarAvailable);
                //key from delete is the found one
                resSet = resSet && removeCarFromAvailable(availableCarsKeyToDelete, firstCarAvailable);

                if (availableCarsKeyToSet > 0) {
                    resSet = resSet && addCarToAvailable(availableCarsKeyToSet, firstCarAvailable);
                }

                //key to assign es found one - people.seats
            }
            querySeats++;
        }
        if (!resSet) {
            resSet = addJourneyToPendings(journey);
            return StatusCodes.ACCEPTED;
        }
        return resSet ? StatusCodes.OK : StatusCodes.BAD_REQUEST;
    } catch (error) {
        console.log(`Error setting up the car: ${error}`)
    }
    return StatusCodes.BAD_REQUEST;
}

const findJourneyInSeats = (seats: number, ID: number): IJourney | undefined => {
    let result = undefined;
    const pendingJourneysCopy = new Map(JourneysPending.getJourneysPendings());

    if (pendingJourneysCopy.get(seats)) {
        let pendingJourneysFromSeat = pendingJourneysCopy.get(seats);
        result = pendingJourneysFromSeat?.get(ID);
        if (pendingJourneysFromSeat && result) {
            return result;
        }
    }
    return result;
}

/**
 * Function to drop off journey
 * @param ID 
 * @returns 
 */
export function dropOffJourney(ID: string): StatusCodes {
    try {
        let idNumber = parseInt(ID);
        if (isNaN(idNumber)) {
            return StatusCodes.BAD_REQUEST;
        }
        let resSet: boolean = false;
        let journeyCarMap: Map<number, IJourneyCar> = new Map(JourneyRecord.getJourneyRecords());
        let journeyFound = journeyCarMap.get(idNumber);
        if (!journeyFound) {
            //CHECK IF EXISTS IN QUEUE
            let cont = 1;
            let journey = undefined;
            let journeyF = false;
            while (!journeyF && cont <= config.allowedSeats) {
                journey = findJourneyInSeats(cont, idNumber);
                journeyF = journey ? true : false;
                cont++;
            }
            if (journey) {
                resSet = removeJourneyFromPendings(journey);
            }
            return resSet ? StatusCodes.OK : StatusCodes.NOT_FOUND;
        }
        let journeyPeople = journeyFound.journey.people;
        //from here can be done in a function
        let carsJourneysMap: Map<number, ICarJourneys> = new Map(CarJourneysRecords.getCarJourneysRecords())
        let carJourneyMap = carsJourneysMap.get(journeyFound.car.id);
        if (!carJourneyMap) {
            return StatusCodes.NOT_FOUND;
        }
        let carNewAvailableSeats = carJourneyMap.freeSeats + journeyPeople;
        //erase journey from journey car linked map
        resSet = unlinkJourneyCar(journeyFound.journey, journeyFound.car, journeyCarMap)
        //erase journey from car array of journeys map
        resSet = removeJourneyFromCarJourneys(journeyFound.journey, journeyFound.car);
        //erase car from old available seats
        if (carJourneyMap.freeSeats > 0) {
            resSet = removeCarFromAvailable(carJourneyMap.freeSeats, journeyFound.car);
        }
        //set car to new available seats
        resSet = addCarToAvailable(carNewAvailableSeats, journeyFound.car);
        if (resSet) {
            return StatusCodes.OK;
        }
        return StatusCodes.NOT_FOUND;
    } catch (error) {
        console.log(`Error on dropoff function:${error}`);
        return StatusCodes.BAD_REQUEST;
    }
}

/**
 * Function to locate journey
 * @param ID 
 * @returns 
 */
export function locateJourney(ID: string): { statusCode: StatusCodes, car: ICar | any } {
    try {
        let idNumber = parseInt(ID);
        if (isNaN(idNumber)) {
            return ({ statusCode: StatusCodes.BAD_REQUEST, car: null });
        }
        let car: ICar | any = JourneyRecord.getJourneyRecords().get(idNumber)?.car;
        if (car) {
            return ({ statusCode: StatusCodes.OK, car });
        } else {
            let journeyPending: IJourney | undefined;
            let cont: number = 1;
            let journeyFound = false;
            while (!journeyFound && cont <= config.allowedSeats) {
                journeyPending = findJourneyInSeats(cont, idNumber);
                journeyFound = journeyPending ? true : false;
                cont++;
            }
            if (journeyPending) {
                return ({ statusCode: StatusCodes.NO_CONTENT, car: null });
            } else {
                return ({ statusCode: StatusCodes.NOT_FOUND, car: null });
            }
        }
    } catch (error) {
        console.log(`Error on locate function:${error}`);
        return ({ statusCode: StatusCodes.BAD_REQUEST, car: null });
    }
}

/**
 * function to check pending journeys
 */
export const checkPendingJourneys = () => {
    const pendingJourneysCopy = new Map(JourneysPending.getJourneysPendings());
    if (pendingJourneysCopy.size > 0) {
        pendingJourneysCopy.forEach((value, key) => {
            let carJourneysRecordsCopy =  CarRecords.getGlobalAvailableCars();
            let carJourneyRecordForKey = carJourneysRecordsCopy.has(key);
            if (carJourneyRecordForKey) {
                const iterator = value.entries();
                const firstIteration = iterator.next();
                const firstJourneyToSet = firstIteration.value;
                const resSetJourney = setJourney(firstJourneyToSet[1]);
                if (resSetJourney == StatusCodes.OK) {
                    removeJourneyFromPendings(firstJourneyToSet[1]);
                }
            }
        });
    }
}


export const setPendingJourneysToMemory = (journeys: Array<IJourney>): StatusCodes => {
    try {
        let pendingJourneysToSet: Map<number, Map<number, IJourney>> = new Map<number, Map<number, IJourney>>();
        pendingJourneysToSet = listPendingJourneysToObjectMap(journeys);
        JourneysPending.setJourneysPendings(pendingJourneysToSet);
        return StatusCodes.OK;
    } catch (error) {
        console.log("error set PendingJourneys to Memory:", error);
        return StatusCodes.BAD_REQUEST;
    }
}