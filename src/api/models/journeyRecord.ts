import { IJourneyCar } from '@carpool/types/journeyCar';
import { IJourney } from '@carpool/types/journey';
import { ICar } from '@carpool/types/car';

/**
 * Class to manage a Journey to linked car
 * It will be used to locate the car linked to a journey
 */
class JourneyRecord {
    private static _instance: JourneyRecord;

    private _globalJourneyRecord: Map<number,IJourneyCar> = new Map<number,IJourneyCar>();

    constructor(){
        if (JourneyRecord._instance) {
            throw new Error("New JourneyRecord instance cannot be created");
        }
        JourneyRecord._instance = this;   
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public setJourneyCar(journey:IJourney, car:ICar):number{
        return journey.id;
    }

    public getJourneyRecords():Map<number,IJourneyCar> {
        return this._globalJourneyRecord;
    }

    public setJourneyRecords(mapJourneys:Map<number,IJourneyCar>):void{
        this._globalJourneyRecord = mapJourneys;
        /*
        console.log("New JourneyRecords");
        console.log(this._globalJourneyRecord);
        */
    }

    public resetJourneyRecords():void{
        this._globalJourneyRecord = new Map<number,IJourneyCar>();
    }
}

export default JourneyRecord.Instance;