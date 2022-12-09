export const dummyICar = ():{id:number, seats:number}=>{
    return {
        id:1,
        seats:1
    }
}

export const arraydummyICar = ():Array<{id:number, seats:number}> =>{
    return [{id:1, seats:1},{id:2,seats:1}];
}

export const dummyAvailableCarItemsDummyResponse=():Map<number, Map<number,{id:number,seats:number}>>  =>{
    const carMaps = new Map<number,{id:number, seats:number}>;
    let res = new Map<number, Map<number,{id:number,seats:number}>>;
    carMaps.set(1,{id:1,seats:1});
    carMaps.set(2,{id:2,seats:1})
    res.set(1,carMaps);
    return res;
}

export const dummyICarItems = () =>{
    let dummyICarItems = new Map<number,any>;
    dummyICarItems.set(1,dummyICar())
    return dummyICarItems;
}

export const dummyAvailalbeCarItems = ():Map<number, Map<number,{id:number, seats:number}>>=>{
    let dummyAvailabeCarItemsRes = new Map<number, Map<number,{id:number, seats:number}>>;
    dummyAvailabeCarItemsRes.set(1,dummyICarItems());
    return dummyAvailabeCarItemsRes;
}

export const dummyIJourney = ()=>{
    return {
        id:1,
        people:1
    }
}

export const emptyDummyICarJourneys = ():Map<number, { car:{id:number, seats:number},
                                                 journeys:Array<{id:number, people:number}>,
                                                 freeSeats:number}> => {
    let res:Map<number, any> = new Map<number, any>;
    return res;
}

export const dummyICarJourneys = ():Map<number, { car:{id:number, seats:number},
                                                 journeys:Array<{id:number, people:number}>,
                                                 freeSeats:number}> => {
    let res:Map<number, any> = new Map<number, any>;
    let carRes = dummyICar();
    res.set(carRes.id,{car:carRes, journeys:[dummyIJourney()], freeSeats:0});
    return res;
}


export const noEmptyDummyICarJourneys = ():Map<number, { car:{id:number, seats:number},
                                                 journeys:Array<{id:number, people:number}>,
                                                 freeSeats:number}> => {
    let res:Map<number, any> = new Map<number, any>;
    let carRes = {id:1, seats:2};
    res.set(carRes.id,{car:carRes, journeys:[dummyIJourney()], freeSeats:1});
    return res;
}

export const noEmptyResponseDummyICarJourneys = ():Map<number, { car:{id:number, seats:number},
                                                 journeys:Array<{id:number, people:number}>,
                                                 freeSeats:number}> => {
    let res:Map<number, any> = new Map<number, any>;
    let carRes = {id:1, seats:2};
    let dummyJourney = {id:2, people:1}
    res.set(carRes.id,{car:carRes, journeys:[dummyIJourney(),dummyJourney], freeSeats:0});
    return res;
}

export const emptyAvailabeCars = ():Map<number,Map<number,{id:number,seats:number}>> =>{
    return new Map<number,Map<number,{id:number,seats:number}>>;
}

export const noEmptyAvailableCars = ():Map<number,Map<number,{id:number,seats:number}>> =>{
    let res = new Map<number,Map<number,{id:number,seats:number}>>;
    let car = dummyICar();
    let mapCar = new Map<number,{id:number,seats:number}>;
    mapCar.set(car.id, car);
    res.set(car.seats, mapCar);
    return res;
}

export const severalAvailableCars = ():Map<number,Map<number,{id:number,seats:number}>> =>{
    let res = new Map<number,Map<number,{id:number,seats:number}>>;
    let car = dummyICar();
    let mapCar = new Map<number,{id:number,seats:number}>;
    mapCar.set(car.id, car);
    mapCar.set(2,{id:2, seats:1})
    res.set(car.seats, mapCar);
    return res;
}