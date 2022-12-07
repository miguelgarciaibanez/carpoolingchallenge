import { IJourney } from '@carpool/types/journey';

/**
 * Class to manage map of pending journey
 */

class JourneysPending{
    private static _instance: JourneysPending;

    private _globalJourneysPending: Map<number,IJourney> = new Map<number,IJourney>();

    constructor(){
        if (JourneysPending._instance) {
            throw new Error("New JourneysPending instance cannot be created");
        }
        JourneysPending._instance = this;   
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public getJourneysPendings():Map<number,IJourney> {
        return this._globalJourneysPending;
    }

    public setJourneysPendings(mapJourneys:Map<number,IJourney>):void{
        this._globalJourneysPending = mapJourneys;
        //console.log("New JourneysPendings");
        //console.log(this._globalJourneysPending);
    }

    public resetJourneysPendings():void{
        this._globalJourneysPending = new Map<number,IJourney>();
    }
}

export default JourneysPending.Instance;