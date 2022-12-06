export interface IJourney {
    id: number,
    people: number
}

export interface IJourneyItems extends Array<IJourney>{};