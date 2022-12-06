import { ICarJourneys } from '@carpool/types/journeyCar';

/**
 * Class to mange a Car linked to its journeys
 * It will be used to have a list of the journeys linked to a car 
 * //todo may be will be useless
 */
class CarJourneysRecords {
    private static _instance: CarJourneysRecords;

    private _globalCarJourneysRecords: Map<number, ICarJourneys> = new Map<number, ICarJourneys>();

    constructor (){
        if (CarJourneysRecords._instance){
            throw new Error("New CarJourneysRecords instance cannot be created");
        }
        CarJourneysRecords._instance = this;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public getCarJourneysRecords():Map<number, ICarJourneys>{
        return this._globalCarJourneysRecords;
    }

    public setCarJourneysRecords(carJourneysRecords:Map<number, ICarJourneys>):void{
        this._globalCarJourneysRecords = carJourneysRecords;
        //console.log("New carJourneysRecords");
        //console.log(this._globalCarJourneysRecords);
    }

    public resetCarJourneysRecords():void{
        this._globalCarJourneysRecords = new Map<number, ICarJourneys>();
    }
}

export default CarJourneysRecords.Instance;