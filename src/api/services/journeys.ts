import { addJourneyCar, removeJourneyCar, addJourneyToCarArray, removeJourneyFromCarArray, removeCarFromAvailableSeats, addCarToAvailableSeats } from '@carpool/utils/functions';
import CarsRecords from '@carpool/api/models/carsRecord';
import JourneyRecord from '@carpool/api/models/journeyRecord';
import CarJourneysRecords from '@carpool/api/models/carJourneysRecords';
import CarRecords from '@carpool/api/models/carsRecord';
import { IJourney } from '@carpool/types/journey';
import { IJourneyCar } from '@carpool/types/journeyCar';
import { ICarJourneys } from '@carpool/types/journeyCar';
import { ICar } from '@carpool/types/car';
import config from '@carpool/config'
import { StatusCodes } from 'http-status-codes';


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
const removeCarFromAvailable = (availableSeats: number, car:ICar):boolean =>{
   let res:boolean = false;
    try {
        const availableCarsCopy = new Map(CarRecords.getGlobalAvailableCars());
        let newAvailableCars = removeCarFromAvailableSeats(availableSeats, car, availableCarsCopy);
        CarRecords.setAvailableCars(newAvailableCars);
        res=true;
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
const addCarToAvailable = (availableSeats: number, car:ICar):boolean =>{
    let res:boolean = false;
    try {
        const availableCarsCopy = new Map(CarRecords.getGlobalAvailableCars());
        let newAvailableCars = addCarToAvailableSeats(availableSeats, car, availableCarsCopy);
        CarRecords.setAvailableCars(newAvailableCars);
        res=true;
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
const addJourneyToCarJourneys = (journey:IJourney, car:ICar):boolean =>{
    let res = false
    try {
        let carJourneysRecordsCopy = new Map(CarJourneysRecords.getCarJourneysRecords());
        let newCarJourneysRecord = addJourneyToCarArray(journey,car,carJourneysRecordsCopy);
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
const removeJourneyFromCarJourneys = (journey:IJourney, car:ICar):boolean =>{
    let res = false
    try {
        let carJourneysRecordsCopy = new Map(CarJourneysRecords.getCarJourneysRecords());
        let newCarJourneysRecord = removeJourneyFromCarArray(journey,car,carJourneysRecordsCopy);
        CarJourneysRecords.setCarJourneysRecords(newCarJourneysRecord);
        res = true;
    } catch (error) {
        console.log(`Error adJourneyToCarArray: ${error}`);
    }
    return res;
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
const linkJourneyCar = (journey: IJourney, car: ICar, journeyCars:Map<number,IJourneyCar>): boolean =>{
    let res = false;
    try {
        let newjourneyCars:Map<number,IJourneyCar>= car ? addJourneyCar(journey, car, journeyCars) : journeyCars;
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
const unlinkJourneyCar = (journey: IJourney, car: ICar, journeyCars:Map<number,IJourneyCar>): boolean =>{
    let res = false;
    try {
        let newjourneyCars:Map<number,IJourneyCar>= removeJourneyCar(journey,car, journeyCars);
        JourneyRecord.setJourneyRecords(newjourneyCars);
        res = true;
    } catch (error) {
        console.log(`Error assignJourneyToCar ${error}`);
        res = false;
    }
    return res;
}
//#endregion

export const setJourney = (journey:IJourney):boolean =>{
    let resSet = false;
    let found = false;
    let querySeats = journey.people;
    try {
        let journeyCarCopy:Map<number,IJourneyCar> = JourneyRecord.getJourneyRecords();
        if (journeyCarCopy.get(journey.id)){
            console.log(`Already exits a journey with the same id: ${journey.id}`);
            return resSet;
        }
        let globalAvailableCars = CarsRecords.getGlobalAvailableCars();
        while (!found && querySeats <= config.allowedSeats) {
            let mapAvailableCars = globalAvailableCars.get(querySeats);
            
            if (mapAvailableCars && mapAvailableCars.size > 0) {
                found=true;
                let availableCarsKeyToDelete = querySeats;
                let availableCarsKeyToSet = querySeats - journey.people;
                //link journey and car
                let availableCarsCopy = new Map<number, ICar>;//JSON.parse(JSON.stringify(arrayAvailableCars));
                const firstCarAvailable = mapAvailableCars.values().next().value;
                resSet = linkJourneyCar(journey, firstCarAvailable, journeyCarCopy);
                //assing journey to car array of journeys and calculate new seats available
                resSet= addJourneyToCarJourneys(journey, firstCarAvailable);
                //key from delete is the found one
                
                resSet = removeCarFromAvailable(availableCarsKeyToDelete, firstCarAvailable);
                
                if (availableCarsKeyToSet > 0){
                    resSet = addCarToAvailable(availableCarsKeyToSet, firstCarAvailable);
                }
                
                //key to assign es found one - people.seats
            }
            querySeats++;
        }
        if (!resSet){
            console.log('We have to enqueue the journey'); //TODO
            console.log(journey);
        }
        return resSet;
    } catch (error) {
        console.log(`Error setting up the car: ${error}`)
    }
    return resSet;
}

export function dropOffJourney(ID:string):StatusCodes{
    try {
        let idNumber = parseInt(ID);
        if (isNaN(idNumber)){
            return StatusCodes.BAD_REQUEST;
        }
        let resSet:boolean = false;
        let journeyCarMap: Map<number, IJourneyCar> = new Map(JourneyRecord.getJourneyRecords());
        let journeyFound = journeyCarMap.get(idNumber);
        if (!journeyFound){
            //CHECK IF EXISTS IN QUEUE
            console.log('Check wheter exists in queue');
            return StatusCodes.NOT_FOUND;
        }
        let journeyPeople = journeyFound.journey.people;
        //from here can be done in a function
        let carsJourneysMap : Map<number, ICarJourneys> = new Map(CarJourneysRecords.getCarJourneysRecords())
        let carJourneyMap = carsJourneysMap.get(journeyFound.car.id);
        if (!carJourneyMap){
            return StatusCodes.NOT_FOUND;
        }
        let carNewAvailableSeats = carJourneyMap.freeSeats + journeyPeople;
        //erase journey from journey car linked map
        resSet = unlinkJourneyCar(journeyFound.journey,journeyFound.car,journeyCarMap)
        //erase journey from car array of journeys map
        resSet = removeJourneyFromCarJourneys(journeyFound.journey, journeyFound.car);
        //erase journey from journey records
        //journeyCarMap.delete(journeyFound.journey.id);
        //erase car from old available seats
        if(carJourneyMap.freeSeats > 0){
            resSet = removeCarFromAvailable(carJourneyMap.freeSeats,journeyFound.car);
        }
        //set car to new available seats
        resSet = addCarToAvailable(carNewAvailableSeats,journeyFound.car);
        if (resSet){
            return StatusCodes.OK;
        }
        return StatusCodes.NOT_FOUND;
    } catch (error) {
        console.log(`Error on dropoff function:${error}`);
        return StatusCodes.BAD_REQUEST;
    }
}

export function locateJourney(ID:string):{statusCode:StatusCodes, car:ICar | any}{
    //lo buscas en el map journeycoche
    //si existe devuelves el coche
    //si no existe no devuelves nada
    try {
        let idNumber = parseInt(ID);
        if (isNaN(idNumber)){
            return ({statusCode:StatusCodes.BAD_REQUEST,car:null});
        }
        let car:ICar| any = JourneyRecord.getJourneyRecords().get(idNumber)?.car;
        if (car){
            return ({statusCode:StatusCodes.OK, car});
        } else {
            console.log('check whether is enqueued');
            return ({statusCode:StatusCodes.NOT_FOUND, car:null});
        }
    } catch (error) {
        console.log(`Error on locate function:${error}`);
        return ({statusCode:StatusCodes.BAD_REQUEST, car:null});
    }
}