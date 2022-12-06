import { IJourney } from '@carpool/types/journey';
import { ICar } from '@carpool/types/car';

export interface IJourneyCar{
    journey:IJourney,
    car: ICar
}

export interface ICarJourneys{
    car:ICar,
    journeys:Array<IJourney>,
    freeSeats:number
}