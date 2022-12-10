import CarItems, { ICar } from '@carpool/types/car';
import {listCarsToObjectMap} from '@carpool/utils/functions';

class CarRecords {

    private static _instance: CarRecords;

    private _globalAvailableCars:Map<number,CarItems> = new Map<number,CarItems>();

    constructor(){
        if (CarRecords._instance){
            throw new Error("New instance cannot be created");
        }
        CarRecords._instance = this;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public setGlobalAvailableCars( arrayToSet : Array<ICar>):void{
        this._globalAvailableCars = new Map<number,Map<number,ICar>>(); //reset the map
        this._globalAvailableCars = listCarsToObjectMap(arrayToSet);
        /*
        console.log("Initial global Available cars");
        console.log(this._globalAvailableCars.get(1)?.size);
        console.log(this._globalAvailableCars.size);
        */
    }

    public getGlobalAvailableCars():Map<number,CarItems>{
        return this._globalAvailableCars;
    }

    public setAvailableCars(availableCars:Map<number,CarItems>):void{
        this._globalAvailableCars = availableCars;
        //console.log("available cars map");
        //console.log(this._globalAvailableCars);
    }
}

export default CarRecords.Instance;